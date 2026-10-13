# Vérification des migrations sur un PostgreSQL local (pip install pgserver psycopg2-binary).
# Imite les schémas auth/storage de Supabase ; à compléter par des tests pgTAP sur un vrai projet.
import pgserver, psycopg2, json, uuid, sys, os, shutil
MIG = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', 'migrations'))
shutil.rmtree('/tmp/pgdz', ignore_errors=True)
srv = pgserver.get_server('/tmp/pgdz', cleanup_mode='delete')
uri = srv.get_uri()
conn = psycopg2.connect(uri); conn.autocommit = True
cur = conn.cursor()
cur.execute("""
create role anon nologin; create role authenticated nologin; create role service_role nologin bypassrls; create role authenticator noinherit login;
grant anon, authenticated, service_role to authenticator;
create schema extensions; create schema auth;
create table auth.users(id uuid primary key default gen_random_uuid(), email text);
create function auth.uid() returns uuid language sql stable as $$ select nullif(current_setting('request.jwt.claim.sub', true),'')::uuid $$;
create function auth.role() returns text language sql stable as $$ select nullif(current_setting('request.jwt.claim.role', true),'') $$;
create schema storage; create table storage.buckets(id text primary key, name text, public boolean);
create table storage.objects(id uuid primary key default gen_random_uuid(), bucket_id text, name text);
alter table storage.objects enable row level security;
grant usage on schema auth, extensions to anon, authenticated, service_role;
create function extensions.gen_random_bytes(n int) returns bytea language sql as $$ select substring(decode(replace(gen_random_uuid()::text||gen_random_uuid()::text,'-',''),'hex') from 1 for n) $$;
grant execute on function extensions.gen_random_bytes(int) to anon, authenticated, service_role;
""")
for f in sorted(os.listdir(MIG)):
    try:
        cur.execute(open(MIG + '/'+f, encoding='utf-8').read().replace('create extension if not exists pgcrypto with schema extensions;','')); print('OK  ', f)
    except Exception as e:
        print('FAIL', f, str(e)[:600]); sys.exit(1)

sup, adm, agt = str(uuid.uuid4()), str(uuid.uuid4()), str(uuid.uuid4())
for u, r, n in [(sup,'SUPER_ADMIN','Super'),(adm,'ADMIN','Admin'),(agt,'AGENT','Agent')]:
    cur.execute("insert into auth.users(id,email) values (%s,%s)", (u, n+'@x.test'))
    cur.execute("insert into public.profiles(id,first_name,last_name,role) values (%s,%s,'Test',%s)", (u, n, r))

def as_(role, uid=None):
    cur.execute("reset role"); cur.execute(f"set role {role}")
    cur.execute("select set_config('request.jwt.claim.sub', %s, false)", (uid or '',))
    cur.execute("select set_config('request.jwt.claim.role', %s, false)", (role,))
def attempt(label, sql, params=None, expect_ok=True):
    try:
        cur.execute(sql, params); rows = cur.fetchall() if cur.description else None
        ok = True; res = rows
    except Exception as e:
        ok = False; res = str(e).split('\n')[0][:110]
    flag = 'PASS' if ok == expect_ok else '*** ECHEC ***'
    print(f'{flag:14} {label} -> {res if not ok or expect_ok is False else (res if res is None or len(str(res))<130 else str(res)[:130])}')
    return res if ok else None

wedding = {'service_slug':'filmage-mariage','consent':True,
 'customer':{'first_name':'Mohamed','last_name':'Test','phone':'+33612345678','email':'m@x.fr','country':'France','customer_type':'DIASPORA'},
 'beneficiary':{'first_name':'Fatima','last_name':'Test','phone':'+2693221122','city':'Thiès','relationship':'Mère'},
 'description':'Test',
 'details':{'requester_role':'MARIE','groom_name':'A','bride_name':'B','boina_harus_name':'C','bibi_harus_name':'D','venue':'Salle','start_date':'2026-11-20','end_date':'2026-11-21',
   'events':[{'ceremony_code':'PAO','event_date':'2026-11-20','start_time':'18:00','end_time':'23:00'},
             {'ceremony_code':'GRAND_MARIAGE','event_date':'2026-11-21','start_time':'10:00','end_time':'02:00','ends_next_day':True},
             {'custom_label':'Soirée libre','event_date':'2026-11-21','start_time':'21:00'}],
   'photo_numbers':[1,5,30]},
 'files':[{'file_name':'carton.pdf','file_path':'incoming/abc/carton.pdf','mime_type':'application/pdf','file_size':12345}]}
generic = {'service_slug':'recharge-electricite-sts','consent':True,'customer':{'first_name':'Ali','last_name':'T','phone':'+221771234567'},
 'details':{'meter':'12345678901','amount':50000}}
printing = {'service_slug':'imprimerie','consent':True,'customer':{'first_name':'Ali','last_name':'T','phone':'+221771234567'},'details':{'document_type':'Affiche','quantity':100,'duplex':True}}

print('--- Soumissions (service_role)')
as_('service_role')
r1 = attempt('submit_request mariage', "select public.submit_request(%s::jsonb)", (json.dumps(wedding),))
r2 = attempt('submit_request générique', "select public.submit_request(%s::jsonb)", (json.dumps(generic),))
r3 = attempt('submit_request imprimerie (client existant)', "select public.submit_request(%s::jsonb)", (json.dumps(printing),))
bad = dict(wedding); bad['consent'] = False
attempt('refus sans consentement', "select public.submit_request(%s::jsonb)", (json.dumps(bad),), expect_ok=False)
bad2 = json.loads(json.dumps(wedding)); bad2['customer']['phone']='0612345678'
attempt('refus téléphone non E.164', "select public.submit_request(%s::jsonb)", (json.dumps(bad2),), expect_ok=False)
tok = r1[0][0]['public_token']; ref1 = r1[0][0]['reference']; print('    référence:', ref1)
attempt('clients dédoublonnés (attendu 2)', "select count(*) from public.customers")

print('--- Anonyme')
as_('anon')
attempt('anon lit les services', "select count(*) from public.services")
attempt('anon lit requests (refus)', "select * from public.requests", expect_ok=False)
attempt('anon lit site_settings publics seulement', "select count(*) from public.site_settings where not is_public")
attempt('anon appelle submit_request (refus)', "select public.submit_request('{}'::jsonb)", expect_ok=False)
attempt('anon appelle accept_quote (refus)', "select public.accept_quote('x','y')", expect_ok=False)

cur.execute('reset role'); cur.execute('select id from public.expense_categories limit 1'); CAT=cur.fetchone()[0]
print('--- Agent')
as_('authenticated', agt)
req_id = None
res = attempt('agent lit les demandes (3)', "select id, status from public.requests order by created_at")
req_id = res[0][0]
attempt('agent: NEW -> COMPLETED interdit', "update public.requests set status='COMPLETED' where id=%s", (req_id,), expect_ok=False)
attempt('agent: NEW -> IN_REVIEW', "update public.requests set status='IN_REVIEW' where id=%s", (req_id,))
attempt('agent lit les dépenses (0 ligne)', "select count(*) from public.expenses")
attempt('agent insère une dépense (refus)', "insert into public.expenses(category_id,description,amount) values (%s,'x',10)", (CAT,), expect_ok=False)
attempt('agent lit le journal (0 ligne)', "select count(*) from public.audit_logs")
q = attempt('agent crée un devis brouillon', "insert into public.quotes(request_id, valid_until, currency) values (%s, current_date+15, 'XOF') returning id, quote_number", (req_id,))
qid = q[0][0]
attempt('agent ajoute des lignes', "insert into public.quote_items(quote_id, description, quantity, unit_price, is_pass_through) values (%s,'Captation',1,150000,false),(%s,'Montage',1,50000,false),(%s,'Reversement tiers',1,20000,true)", (qid,qid,qid))
attempt('totaux calculés (220000)', "select subtotal,total from public.quotes where id=%s", (qid,))
attempt('agent envoie le devis (refus)', "update public.quotes set status='SENT' where id=%s", (qid,), expect_ok=False)
attempt('agent change son rôle (refus)', "update public.profiles set role='SUPER_ADMIN' where id=%s", (agt,), expect_ok=False)
attempt('agent paiement CONFIRMED direct (refus)', "insert into public.payments(request_id,quote_id,customer_id,amount,payment_method,status) select %s,%s,customer_id,1000,'Wave','CONFIRMED' from public.requests where id=%s", (req_id,qid,req_id), expect_ok=False)
attempt('agent paiement PENDING', "insert into public.payments(request_id,quote_id,customer_id,amount,payment_method) select %s,%s,customer_id,50000,'Wave' from public.requests where id=%s returning id", (req_id,qid,req_id))

print('--- Administrateur')
as_('authenticated', adm)
attempt('admin envoie le devis', "update public.quotes set status='SENT' where id=%s", (qid,))
attempt('demande passée à QUOTE_SENT', "select status from public.requests where id=%s", (req_id,))
attempt('admin modifie les lignes (refus)', "update public.quote_items set unit_price=1 where quote_id=%s", (qid,), expect_ok=False)
attempt('admin modifie le total (refus)', "update public.quotes set total=1 where id=%s", (qid,), expect_ok=False)
qt = attempt('jeton du devis', "select public_token from public.quotes where id=%s", (qid,))[0][0]

print('--- Client (via serveur)')
as_('service_role')
attempt('get_quote_public', "select public.get_quote_public(%s)->>'status'", (qt,))
attempt('accept_quote', "select public.accept_quote(%s, 'Mohamed Test')", (qt,))
attempt('accept_quote deux fois (refus)', "select public.accept_quote(%s, 'Mohamed Test')", (qt,), expect_ok=False)
attempt('get_request_public', "select public.get_request_public(%s)->>'status'", (r1[0][0]['public_token'],))
attempt('get_request_public (jeton faux) -> null', "select public.get_request_public('nope') is null")

print('--- Paiements et finance (admin)')
as_('authenticated', adm)
attempt('état du règlement avant paiement', "select payment_state, status from public.requests where id=%s", (req_id,))
attempt('admin confirme le paiement en attente', "update public.payments set status='CONFIRMED' where request_id=%s", (req_id,))
attempt('payment_state = PARTIAL', "select payment_state from public.requests where id=%s", (req_id,))
attempt('admin modifie le montant confirmé (refus)', "update public.payments set amount=1 where request_id=%s", (req_id,), expect_ok=False)
attempt('v_request_amounts', "select total, pass_through, agency_revenue, paid, remaining from public.v_request_amounts where request_id=%s", (req_id,))
attempt('admin: paiement du solde confirmé', "insert into public.payments(request_id,quote_id,customer_id,amount,payment_method,status) select %s,%s,customer_id,170000,'Espèces','CONFIRMED' from public.requests where id=%s", (req_id,qid,req_id))
attempt('payment_state = PAID', "select payment_state from public.requests where id=%s", (req_id,))
attempt('dépense admin', "insert into public.expenses(category_id,description,amount) values (%s,'Transport',5000)", (CAT,))
attempt('v_monthly_finance', "select cash_in, agency_income, expenses, result from public.v_monthly_finance")
attempt('suppression de paiement (0 ligne supprimée)', "with d as (delete from public.payments returning id) select count(*) from d")

print('--- Super-administrateur')
as_('authenticated', sup)
attempt('journal lisible', "select count(*) > 0 from public.audit_logs")
attempt('journal non modifiable (refus)', "update public.audit_logs set action='x'", expect_ok=False)
as_('service_role')
attempt('expire_quotes', "select public.expire_quotes()")
attempt('numéros générés', "select reference from public.requests order by created_at")
attempt('numéro de devis', "select quote_number from public.quotes")
attempt('événements visibles côté client', "select event_type,to_status from public.request_events where request_id=%s order by created_at", (req_id,))
