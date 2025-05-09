import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter as Router } from 'react-router';
import { QueryClient,QueryClientProvider } from '@tanstack/react-query';
import { App } from './App';

const client=new QueryClient();
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={client}>
    <Router>
      <App />

    </Router>
        </QueryClientProvider>

  </StrictMode>,
)
