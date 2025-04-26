
import { supabase } from '@/integrations/supabase/client';

const CLIENT_ID = '652659079305130';
const CLIENT_SECRET = 'bcHDdHFAijKYPA7s3C73oHmr2U9tSIlP';
const REDIRECT_URI = 'https://encontrae.onrender.com/callback/mercadolivre';

export interface AuthTokenData {
  access_token: string;
  refresh_token: string;
  expires_at: number;
  user_id?: number;
}

export const getStoredToken = (): AuthTokenData | null => {
  const tokenData = localStorage.getItem('ml_token_data');
  if (!tokenData) return null;
  
  try {
    const parsed: AuthTokenData = JSON.parse(tokenData);
    if (parsed.expires_at && parsed.expires_at < Date.now()) {
      console.log('Token expirado, precisa renovar');
      return null;
    }
    console.log('Token válido encontrado no localStorage');
    return parsed;
  } catch (error) {
    console.error('Erro ao recuperar token armazenado:', error);
    return null;
  }
};

export const storeToken = (data: AuthTokenData) => {
  const tokenData = {
    access_token: data.access_token,
    refresh_token: data.refresh_token,
    expires_at: Date.now() + (data.expires_at * 1000),
    user_id: data.user_id
  };
  
  console.log('Armazenando novo token, válido até:', new Date(tokenData.expires_at).toLocaleString());
  localStorage.setItem('ml_token_data', JSON.stringify(tokenData));
  return tokenData;
};

export const getAuthorizationUrl = () => {
  const params = new URLSearchParams({
    response_type: 'code',
    client_id: CLIENT_ID,
    redirect_uri: REDIRECT_URI
  });
  
  const authUrl = `https://auth.mercadolivre.com.br/authorization?${params.toString()}`;
  console.log('URL de autorização gerada:', authUrl);
  return authUrl;
};

export const exchangeCodeForToken = async (code: string): Promise<AuthTokenData> => {
  console.log('Trocando código por token...');
  
  try {
    const response = await fetch('https://api.mercadolivre.com/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        code: code,
        redirect_uri: REDIRECT_URI
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Falha na troca do código:', response.status, errorText);
      throw new Error(`Falha ao obter token de acesso: ${response.status} - ${errorText}`);
    }

    const data: AuthTokenData = await response.json();
    console.log('Token obtido com sucesso via código de autorização');
    
    storeToken(data);
    return data;
  } catch (error) {
    console.error('Erro ao trocar código por token:', error);
    throw error;
  }
};
