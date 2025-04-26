
import { supabase } from '@/integrations/supabase/client';

// Use environment variables or fallback to hard-coded values for local development
const CLIENT_ID = '652659079305130';
const CLIENT_SECRET = 'bcHDdHFAijKYPA7s3C73oHmr2U9tSIlP';
const REDIRECT_URI = 'https://marketplace-hunter-unite-shop.lovable.app/callback/mercadolivre';

export interface AuthTokenData {
  access_token: string;
  refresh_token: string;
  expires_at: number;
  user_id?: number;
}

export const getStoredToken = (): AuthTokenData | null => {
  const tokenData = localStorage.getItem('ml_token_data');
  console.log('📦 Recuperando token armazenado:', !!tokenData);
  
  if (!tokenData) return null;
  
  try {
    const parsed: AuthTokenData = JSON.parse(tokenData);
    console.log('🕰️ Token expiração:', new Date(parsed.expires_at).toLocaleString());
    
    if (parsed.expires_at && parsed.expires_at < Date.now()) {
      console.warn('🚨 Token expirado, precisa renovar');
      return null;
    }
    
    return parsed;
  } catch (error) {
    console.error('❌ Erro ao recuperar token armazenado:', error);
    return null;
  }
};

export const storeToken = (data: AuthTokenData) => {
  console.log('💾 Armazenando novo token...');
  
  // Ensure we convert expires_in (seconds) to an absolute timestamp
  const tokenData = {
    access_token: data.access_token,
    refresh_token: data.refresh_token,
    expires_at: Date.now() + ((data.expires_at || 21600) * 1000), // Default to 6 hours if not provided
    user_id: data.user_id
  };
  
  console.log('⏰ Token válido até:', new Date(tokenData.expires_at).toLocaleString());
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
  console.log('🔗 URL de autorização gerada:', authUrl);
  return authUrl;
};

export const exchangeCodeForToken = async (code: string): Promise<AuthTokenData> => {
  console.log('Trocando código por token...');
  
  try {
    console.log('Enviando requisição para obter token com código:', code);
    console.log('Redirect URI usado:', REDIRECT_URI);
    
    // Use a more robust approach with proper error handling
    const response = await fetch('https://api.mercadolibre.com/oauth/token', {
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

    console.log('Resposta da API - Status:', response.status);
    
    // More detailed error logging
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Falha na troca do código. Status:', response.status);
      console.error('Detalhes do erro:', errorText);
      throw new Error(`Falha ao obter token de acesso: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('Token obtido com sucesso. Tipo de resposta:', typeof data, 'Contém access_token:', !!data.access_token);
    
    // Enhanced token storage
    return storeToken({
      access_token: data.access_token,
      refresh_token: data.refresh_token,
      expires_at: data.expires_in || 21600, // Default to 6 hours if not provided
      user_id: data.user_id
    });
  } catch (error) {
    console.error('Erro detalhado ao trocar código por token:', error);
    throw error;
  }
};

// Add a function to refresh the token
export const refreshAccessToken = async (refreshToken: string): Promise<AuthTokenData> => {
  console.log('Renovando token de acesso...');
  
  try {
    const response = await fetch('https://api.mercadolibre.com/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        refresh_token: refreshToken
      })
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Falha ao renovar token:', response.status, errorText);
      throw new Error(`Falha ao renovar token de acesso: ${response.status} - ${errorText}`);
    }
    
    const data = await response.json();
    return storeToken({
      access_token: data.access_token,
      refresh_token: data.refresh_token || refreshToken,
      expires_at: data.expires_in || 21600,
      user_id: data.user_id
    });
  } catch (error) {
    console.error('Erro ao renovar token:', error);
    throw error;
  }
};
