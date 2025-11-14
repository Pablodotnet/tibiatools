import { StrictMode } from 'react';
import { BrowserRouter } from 'react-router-dom';
import * as ReactDOM from 'react-dom/client';
import App from './app/app';
import '@radix-ui/themes/styles.css';
import { ThemeProvider } from 'next-themes';
import { Theme } from '@radix-ui/themes';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <Theme>
          <App />
        </Theme>
      </ThemeProvider>
    </BrowserRouter>
  </StrictMode>
);
