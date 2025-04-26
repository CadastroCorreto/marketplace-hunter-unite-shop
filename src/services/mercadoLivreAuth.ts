
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
    
    // Verificar se o token está próximo da expiração (5 minutos)
    if (parsed.expires_at && parsed.expires_at < (Date.now() + 5 * 60 * 1000)) {
      console.warn('🚨 Token expirado ou próximo de expirar, precisa renovar');
      return parsed; // Retornamos o token mesmo expirado para que o processo de renovação possa usá-lo
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
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Falha na troca do código. Status:', response.status);
      console.error('Detalhes do erro:', errorText);
      
      let errorMessage = `Falha ao obter token de acesso: ${response.status}`;
      let errorType = 'unknown_error';
      
      try {
        const errorJson = JSON.parse(errorText);
        if (errorJson.error) {
          errorType = errorJson.error;
          
          // Handle specific error types
          if (errorJson.error === 'invalid_grant') {
            errorMessage = 'O código de autorização expirou ou já foi utilizado. Por favor, tente novamente.';
            throw new Error(`invalid_grant: ${errorMessage}`);
          }
          
          errorMessage = `${errorJson.error}: ${errorJson.error_description || errorJson.message || 'Erro na autenticação'}`;
        }
      } catch (parseError) {
        // If failed to parse as JSON, use raw text
      }
      
      throw new Error(errorMessage);
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

// Função melhorada para renovar o token
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
      
      let errorMessage = `Falha ao renovar token de acesso: ${response.status}`;
      
      try {
        const errorJson = JSON.parse(errorText);
        if (errorJson.error) {
          // Verificar se é um erro de token inválido
          if (errorJson.error === 'invalid_grant') {
            throw new Error('invalid_grant: O token de renovação é inválido ou expirou. Necessário reautenticar.');
          }
          
          throw new Error(`${response.status}: ${errorJson.error} - ${errorJson.error_description || errorJson.message || 'Erro na renovação do token'}`);
        }
      } catch (parseError) {
        // Se não conseguiu analisar como JSON, usa o texto bruto
      }
      
      throw new Error(errorMessage);
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

// Função para verificar se um token precisa ser renovado
export const checkTokenNeedsRenewal = (): boolean => {
  const token = getStoredToken();
  
  if (!token) return false; // Sem token, não há nada para renovar
  
  // Verifica se o token expira nos próximos 5 minutos
  const fiveMinutesFromNow = Date.now() + 5 * 60 * 1000;
  return token.expires_at < fiveMinutesFromNow;
};

// Função para limpar o token ao fazer logout
export const clearStoredToken = (): void => {
  localStorage.removeItem('ml_token_data');
  console.log('🗑️ Token removido do armazenamento local');
};
