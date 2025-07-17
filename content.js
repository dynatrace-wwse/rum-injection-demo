browser.storage.local.get(['injectorSettings', 'injectorDisabled']).then(({ injectorSettings, injectorDisabled }) => {
  if (injectorDisabled) {
    console.log('🚫 Injection disabled – skipping script injection.');
    return;
  }

  if (!injectorSettings || !injectorSettings.jsCode || !injectorSettings.urlPattern) {
    console.log('❌ No injector settings found.');
    return;
  }

  const { jsCode, urlPattern, injectAt } = injectorSettings;
  console.log(`🔍 Checking URL: ${window.location.href} against pattern: ${urlPattern}`);

  if (!new RegExp(urlPattern).test(window.location.href)) {
    console.log('🚫 URL pattern did not match.');
    return;
  }

  const script = document.createElement('script');
  script.type = 'text/javascript';
  script.src = jsCode.trim();
  script.crossOrigin = 'anonymous';

  (injectAt === 'head' ? document.head : document.body).appendChild(script);
  console.log('✅ External script tag injected:', jsCode);
}).catch(err => console.error('❌ Failed to retrieve settings:', err));
