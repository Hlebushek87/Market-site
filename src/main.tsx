import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { AdvertsProvider } from '../context/AdvertsContext';
import { AuthProvider } from '../context/AuthContext';
import './styles/global.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <AdvertsProvider>
          <App />
        </AdvertsProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);