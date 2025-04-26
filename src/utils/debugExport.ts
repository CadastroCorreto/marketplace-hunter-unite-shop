
export const generateDebugJson = () => {
  const storedToken = localStorage.getItem('ml_token_data');
  const parsedToken = storedToken ? JSON.parse(storedToken) : null;
  
  const debugData = {
    credentials: {
      client_id: '652659079305130',
      client_secret: 'bcHDdHFAijKYPA7s3C73oHmr2U9tSIlP',
      redirect_uri: 'https://marketplace-hunter-unite-shop.lovable.app/callback/mercadolivre'
    },
    storedToken: parsedToken,
    tokenStatus: {
      hasToken: !!parsedToken,
      isExpired: parsedToken?.expires_at ? parsedToken.expires_at < Date.now() : null,
      expiresAt: parsedToken?.expires_at ? new Date(parsedToken.expires_at).toLocaleString() : null
    },
    browser: {
      userAgent: navigator.userAgent,
      language: navigator.language,
      cookiesEnabled: navigator.cookieEnabled
    },
    currentUrl: window.location.href
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
