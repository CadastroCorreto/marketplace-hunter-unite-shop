
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
      user_id: parsedToken.user_id,
      token_lifetime_minutes: parsedToken.expires_at ? Math.round((parsedToken.expires_at - Date.now()) / (60 * 1000)) : null
    } : null,
    tokenStatus: checkTokenStatus(),
    browser: {
      userAgent: navigator.userAgent,
      language: navigator.language,
      cookiesEnabled: navigator.cookieEnabled
    },
    currentUrl: window.location.href,
    currentTime: currentTime.toLocaleString(),
    timestamp: Date.now(),
    errorDetails: {
      tokenExpired: parsedToken?.expires_at ? parsedToken.expires_at < Date.now() : null,
      timeDifference: parsedToken?.expires_at ? Math.floor((parsedToken.expires_at - Date.now()) / 1000) + ' segundos' : null,
      timeSinceCreation: parsedToken?.expires_at ? Math.floor((Date.now() - (parsedToken.expires_at - (21600 * 1000))) / 1000 / 60) + ' minutos' : null,
      localStorageAvailable: checkLocalStorageAvailable(),
      authHistory: getAuthHistoryFromStorage()
    }
  };
  
  // Create and download JSON file
  const blob = new Blob([JSON.stringify(debugData, null, 2)], { type: 'application/json' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `mercadolivre-debug-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
  
  // Also log to console for browser debugging
  console.log('Dados de debug gerados:', debugData);
  
  // Add this auth attempt to history for future debugging
  addAuthHistoryEntry({
    type: 'debug_export',
    timestamp: Date.now(),
    tokenValid: debugData.tokenStatus.valid
  });
  
  return debugData;
};

// Função para verificar se o localStorage está disponível
const checkLocalStorageAvailable = () => {
  try {
    const testKey = '__test__';
    localStorage.setItem(testKey, testKey);
    localStorage.removeItem(testKey);
    return true;
  } catch (e) {
    return false;
  }
};

// Função para armazenar histórico de autenticação para debug
const addAuthHistoryEntry = (entry: any) => {
  try {
    const history = getAuthHistoryFromStorage();
    history.push(entry);
    
    // Manter apenas os últimos 20 eventos
    while (history.length > 20) {
      history.shift();
    }
    
    localStorage.setItem('ml_auth_history', JSON.stringify(history));
  } catch (e) {
    console.error('Erro ao armazenar histórico de autenticação:', e);
  }
};

// Função para recuperar histórico de autenticação
const getAuthHistoryFromStorage = () => {
  try {
    const history = localStorage.getItem('ml_auth_history');
    return history ? JSON.parse(history) : [];
  } catch (e) {
    console.error('Erro ao recuperar histórico de autenticação:', e);
    return [];
  }
};

// Função útil para verificar o status do token e identificar problemas
export const checkTokenStatus = () => {
  const storedToken = localStorage.getItem('ml_token_data');
  if (!storedToken) {
    return {
      valid: false,
      error: 'TOKEN_MISSING',
      message: 'Nenhum token encontrado. É necessário autenticar.',
      details: 'Os tokens são armazenados no localStorage após a autenticação com o Mercado Livre.'
    };
  }
  
  try {
    const parsedToken = JSON.parse(storedToken);
    const now = Date.now();
    
    if (!parsedToken.access_token) {
      return {
        valid: false,
        error: 'TOKEN_INVALID',
        message: 'Token de acesso ausente ou inválido.',
        details: 'O token armazenado não contém um access_token válido.'
      };
    }
    
    if (!parsedToken.expires_at) {
      return {
        valid: false,
        error: 'EXPIRY_MISSING',
        message: 'Data de expiração não definida no token.',
        details: 'O token armazenado não contém informação sobre a data de expiração.'
      };
    }
    
    if (parsedToken.expires_at < now) {
      // Add this auth attempt to history for future debugging
      addAuthHistoryEntry({
        type: 'token_check',
        timestamp: now,
        result: 'expired',
        expires_at: parsedToken.expires_at,
        diff_minutes: Math.floor((now - parsedToken.expires_at) / 1000 / 60)
      });
      
      return {
        valid: false,
        error: 'TOKEN_EXPIRED',
        message: 'Token expirado. Última validade: ' + new Date(parsedToken.expires_at).toLocaleString(),
        details: 'O token de acesso expirou e precisa ser renovado.',
        expired: true,
        canRefresh: !!parsedToken.refresh_token,
        expiredAgo: Math.floor((now - parsedToken.expires_at) / 1000 / 60) + ' minutos atrás'
      };
    }
    
    const minutesRemaining = Math.floor((parsedToken.expires_at - now) / 1000 / 60);
    
    // Add this successful auth check to history
    addAuthHistoryEntry({
      type: 'token_check',
      timestamp: now,
      result: 'valid',
      minutesRemaining,
      expires_at: parsedToken.expires_at
    });
    
    return {
      valid: true,
      message: `Token válido por mais ${minutesRemaining} minutos.`,
      minutesRemaining,
      expiresAt: new Date(parsedToken.expires_at).toLocaleString(),
      secondsRemaining: Math.floor((parsedToken.expires_at - now) / 1000)
    };
  } catch (error) {
    // Add this failed auth check to history
    addAuthHistoryEntry({
      type: 'token_check',
      timestamp: Date.now(),
      result: 'error',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
    
    return {
      valid: false,
      error: 'TOKEN_PARSE_ERROR',
      message: 'Erro ao analisar token armazenado: ' + (error instanceof Error ? error.message : 'Erro desconhecido'),
      details: 'Ocorreu um erro ao tentar analisar o JSON do token armazenado no localStorage.'
    };
  }
};
