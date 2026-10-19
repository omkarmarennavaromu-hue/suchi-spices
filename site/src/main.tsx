import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './styles/globals.css';
import App from './App';

const container = document.getElementById('root');
if (!container) throw new Error('Root element not found');

// `grain` lives on the wrapper inside App; the class here keeps the base
// background painted before React mounts, avoiding a white flash.
document.documentElement.classList.add('bg-ink');

createRoot(container).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
