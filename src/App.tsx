import { ThemeProvider } from "@/components/theme-provider";
import { NavBar } from "@/components/NavBar";
import { BrowserRouter } from "react-router-dom";
import AppRouting from './routes';
import { Provider } from 'react-redux';
import { store } from '@/store';

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider defaultTheme='dark' storageKey='vite-ui-theme'>
        <BrowserRouter>
          <NavBar />
          <div className='flex flex-col items-center justify-center min-h-screen'>
            <AppRouting />
          </div>
        </BrowserRouter>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
