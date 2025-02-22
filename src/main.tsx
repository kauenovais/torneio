import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import './styles/components.css';
import { registerSW } from 'virtual:pwa-register';

// Registra o service worker com atualização automática
const updateSW = registerSW({
  immediate: true,
  onNeedRefresh() {
    if (confirm('Nova versão disponível. Deseja atualizar?')) {
      updateSW(true);
    }
  },
  onOfflineReady() {
    const offlineReady = document.createElement('div');
    offlineReady.className = 'pwa-offline-ready';
    offlineReady.innerHTML = `
      <div class="pwa-offline-message">
        Aplicativo pronto para uso offline!
        <button onclick="this.parentElement.remove()">OK</button>
      </div>
    `;
    document.body.appendChild(offlineReady);
    setTimeout(() => offlineReady.remove(), 3000);
  },
  onRegistered(swRegistration) {
    if (swRegistration) {
      console.log('Service Worker registrado com sucesso');

      // Verifica se o app já está instalado
      if (window.matchMedia('(display-mode: standalone)').matches) {
        console.log('Aplicativo já está instalado');
      }

      // Monitora mudanças no estado de instalação
      window.addEventListener('appinstalled', event => {
        console.log('Aplicativo instalado com sucesso');
      });
    }
  },
  onRegisterError(error) {
    console.error('Erro ao registrar Service Worker:', error);
  },
});

// Adiciona listener para o evento beforeinstallprompt
window.addEventListener('beforeinstallprompt', e => {
  // Previne o comportamento padrão
  e.preventDefault();
  // Armazena o evento para usar depois
  window.deferredPrompt = e;
  console.log('Prompt de instalação disponível');
});

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
