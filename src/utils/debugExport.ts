
export const generateDebugJson = () => {
  const storedToken = localStorage.getItem('ml_token_data');
  const parsedToken = storedToken ? JSON.parse(storedToken) : null;
  
  // Capturar data e hora atuais para referência
  const currentTime = new Date();
  
  const debugData = {
    credentials: {
      client_id: '652659079305130',
      client_secret: '**redacted**', // Reduzido por segurança no arquivo de debug
      redirect_uri: 'https://marketplace-hunter-unite-shop.lovable.app/callback/mercadolivre'
    },
    storedToken: parsedToken ? {
      access_token: `${parsedToken.access_token?.substring(0, 10)}...`, // Mostra apenas parte inicial do token por segurança
      refresh_token: `${parsedToken.refresh_token?.substring(0, 10)}...`,
      expires_at: parsedToken.expires_at,
      expires_at_formatted: parsedToken.expires_at ? new Date(parsedToken.expires_at).toLocaleString() : null,
      user_id: parsedToken.user_id
    } : null,
    tokenStatus: {
      hasToken: !!parsedToken,
      isExpired: parsedToken?.expires_at ? parsedToken.expires_at < Date.now() : null,
      expiresAt: parsedToken?.expires_at ? new Date(parsedToken.expires_at).toLocaleString() : null,
      timeUntilExpiry: parsedToken?.expires_at ? Math.floor((parsedToken.expires_at - Date.now()) / 1000 / 60) + ' minutos' : null,
    },
    browser: {
      userAgent: navigator.userAgent,
      language: navigator.language,
      cookiesEnabled: navigator.cookieEnabled
    },
    currentUrl: window.location.href,
    currentTime: currentTime.toLocaleString(),
    timestamp: Date.now()
  };
  
  // Create and download JSON file
  const blob = new Blob([JSON.stringify(debugData, null, 2)], { type: 'application/json' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'mercadolivre-debug.json';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
  
  return debugData;
};

// Função útil para verificar o status do token e identificar problemas
export const checkTokenStatus = () => {
  const storedToken = localStorage.getItem('ml_token_data');
  if (!storedToken) {
    return {
      valid: false,
      error: 'TOKEN_MISSING',
      message: 'Nenhum token encontrado. É necessário autenticar.'
    };
  }
  
  try {
    const parsedToken = JSON.parse(storedToken);
    const now = Date.now();
    
    if (!parsedToken.access_token) {
      return {
        valid: false,
        error: 'TOKEN_INVALID',
        message: 'Token de acesso ausente ou inválido.'
      };
    }
    
    if (!parsedToken.expires_at) {
      return {
        valid: false,
        error: 'EXPIRY_MISSING',
        message: 'Data de expiração não definida no token.'
      };
    }
    
    if (parsedToken.expires_at < now) {
      return {
        valid: false,
        error: 'TOKEN_EXPIRED',
        message: 'Token expirado. Última validade: ' + new Date(parsedToken.expires_at).toLocaleString(),
        expired: true,
        canRefresh: !!parsedToken.refresh_token
      };
    }
    
    const minutesRemaining = Math.floor((parsedToken.expires_at - now) / 1000 / 60);
    return {
      valid: true,
      message: `Token válido por mais ${minutesRemaining} minutos.`,
      minutesRemaining,
      expiresAt: new Date(parsedToken.expires_at).toLocaleString()
    };
  } catch (error) {
    return {
      valid: false,
      error: 'TOKEN_PARSE_ERROR',
      message: 'Erro ao analisar token armazenado: ' + (error instanceof Error ? error.message : 'Erro desconhecido')
    };
  }
};
