-- Migration pour ajouter la fonction RPC submit_request
-- Ajouté pendant le développement du Lot 5/6

-- Fonction RPC pour soumettre une demande de service
CREATE OR REPLACE FUNCTION submit_request(
  p_client_id UUID,
  p_service_type TEXT,
  p_preferred_date DATE,
  p_description TEXT,
  p_metadata JSONB DEFAULT '{}'::jsonb
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_request_id UUID;
  v_reference TEXT;
BEGIN
  -- Générer une référence unique
  v_reference := 'REQ-' || LPAD(EXTRACT(EPOCH FROM NOW())::BIGINT::TEXT, 6, '0');
  
  -- Insérer la demande
  INSERT INTO requests (
    client_id,
    reference,
    service_type,
    preferred_date,
    description,
    metadata,
    status
  ) VALUES (
    p_client_id,
    v_reference,
    p_service_type,
    p_preferred_date,
    p_description,
    p_metadata,
    'PENDING'
  ) RETURNING id INTO v_request_id;
  
  RETURN v_request_id;
END;
$$;

-- Accorder l'exécution de la fonction aux utilisateurs authentifiés
GRANT EXECUTE ON FUNCTION submit_request TO authenticated;
