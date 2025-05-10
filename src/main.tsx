import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter as Router } from 'react-router';
import { QueryClient,QueryClientProvider } from '@tanstack/react-query';
import { App } from './App';
import { AuthProvider } from './context/AuthContext';

const client=new QueryClient();
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={client}>
        <AuthProvider>
  
    <Router>
      <App />

    </Router>
        </AuthProvider>

        </QueryClientProvider>

  </StrictMode>,
)
