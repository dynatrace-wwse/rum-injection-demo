function updateMatchStatus(pattern) {
  browser.tabs.query({ active: true, currentWindow: true }).then(tabs => {
    const currentUrl = tabs[0].url;
    const match = new RegExp(pattern).test(currentUrl);
    document.getElementById('matchStatus').textContent = '';
  });
}

function renderHistory() {
  browser.storage.local.get('injectorHistory').then(({ injectorHistory }) => {
    const list = document.getElementById('historyList');
    list.innerHTML = '';
    if (injectorHistory) {
      injectorHistory.forEach((item) => {
        const li = document.createElement('li');
        li.textContent = `URL: ${item.urlPattern} || Tag: ${item.jsCode}`;
        li.style.cursor = 'pointer';
        li.style.marginBottom = '6px';
        li.addEventListener('click', () => {
          document.getElementById('urlPattern').value = item.urlPattern;
          document.getElementById('jsCode').value = item.jsCode;
          document.getElementById('injectAt').value = item.injectAt;
          updateMatchStatus(item.urlPattern);
        });
        list.appendChild(li);
      });
    }
  });
}

document.getElementById('saveBtn').addEventListener('click', () => {
  const urlPattern = document.getElementById('urlPattern').value.trim();
  const jsCode = document.getElementById('jsCode').value.trim();
  const injectAt = document.getElementById('injectAt').value;

  let valid = true;
  document.getElementById('urlError').textContent = '';
  document.getElementById('jsError').textContent = '';

  if (!urlPattern) {
    document.getElementById('urlError').textContent = 'URL pattern is required';
    valid = false;
  }
  if (!jsCode || !jsCode.startsWith('http')) {
    document.getElementById('jsError').textContent = 'Valid JS file URL is required';
    valid = false;
  }
  if (!valid) return;

  const setting = { urlPattern, jsCode, injectAt };

  browser.storage.local.set({ injectorSettings: setting, injectorDisabled: false }).then(() => {
    browser.storage.local.get('injectorHistory').then(({ injectorHistory }) => {
      const updated = injectorHistory || [];
      updated.unshift(setting);
      browser.storage.local.set({ injectorHistory: updated.slice(0, 10) }).then(() => {
        renderHistory();
        alert("Settings saved. Please refresh your tab.");
      });
    });
  });
});

document.getElementById('stopBtn').addEventListener('click', () => {
  browser.storage.local.set({ injectorDisabled: true }).then(() => {
    window.dtrum.endSession()
    console.log('🚫 Session ended by user.');
  });
});

document.getElementById('clearBtn').addEventListener('click', () => {
  browser.storage.local.remove(['injectorHistory']).then(() => {
    renderHistory();
  });
});

document.getElementById('clearFieldsBtn').addEventListener('click', () => {
  document.getElementById('urlPattern').value = '';
  document.getElementById('jsCode').value = '';
  document.getElementById('urlError').textContent = '';
  document.getElementById('jsError').textContent = '';
  // Remove stored settings
  browser.storage.local.remove(['injectorSettings', 'injectorDisabled']).then(() => {
    console.log('🧼 Cleared active settings.');
  });
});


document.getElementById('currentUrlBtn').addEventListener('click', () => {
  browser.tabs.query({ active: true, currentWindow: true }).then(tabs => {
    const currentUrl = tabs[0].url;
    const escaped = currentUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    document.getElementById('urlPattern').value = escaped;
  });
});

document.getElementById('domainUrlBtn').addEventListener('click', () => {
  browser.tabs.query({ active: true, currentWindow: true }).then(tabs => {
    try {
      const url = new URL(tabs[0].url);
      const domainPattern = `${url.origin.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}.*`;
      document.getElementById('urlPattern').value = domainPattern;
    } catch (e) {
      console.error('Invalid URL from tab:', e);
    }
  });
});

document.getElementById('urlPattern').addEventListener('input', (e) => {
  updateMatchStatus(e.target.value);
});

window.addEventListener('DOMContentLoaded', () => {
  browser.storage.local.get('injectorSettings').then(({ injectorSettings }) => {
    if (injectorSettings) {
      document.getElementById('urlPattern').value = injectorSettings.urlPattern;
      document.getElementById('jsCode').value = injectorSettings.jsCode;
      document.getElementById('injectAt').value = injectorSettings.injectAt;
      updateMatchStatus(injectorSettings.urlPattern);
    }
  });
  renderHistory();
});
