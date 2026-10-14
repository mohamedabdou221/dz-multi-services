const https = require('https');

const SUPABASE_URL = 'https://sfpiifgzyzgdolldixum.supabase.co';
const ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

if (!ANON_KEY) {
  console.error('Erreur: NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY non trouvé dans .env.local');
  process.exit(1);
}

const options = {
  hostname: 'sfpiifgzyzgdolldixum.supabase.co',
  path: '/rest/v1/',
  method: 'GET',
  headers: {
    'apikey': ANON_KEY,
    'Authorization': `Bearer ${ANON_KEY}`,
  }
};

const req = https.request(options, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    console.log('Tables détectées:', data);
  });
});

req.on('error', (error) => {
  console.error('Erreur:', error);
});

req.end();
