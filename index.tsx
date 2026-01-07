
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

function mountApp() {
  const container = document.getElementById('root');
  if (container) {
    try {
      const root = createRoot(container);
      root.render(
        <React.StrictMode>
          <App />
        </React.StrictMode>
      );
    } catch (error) {
      console.error("React Rendering Error:", error);
      container.innerHTML = `<div style="padding: 20px; color: red;">앱 로딩 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.</div>`;
    }
  } else {
    console.error("Root element not found");
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', mountApp);
} else {
  mountApp();
}