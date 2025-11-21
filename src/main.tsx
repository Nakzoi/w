import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { HangoutProvider } from './context/HangoutContext';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <ThemeProvider>
        <HangoutProvider>
          <App />
        </HangoutProvider>
      </ThemeProvider>
    </AuthProvider>
  </StrictMode>,
);
