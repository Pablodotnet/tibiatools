import AppRouting from './routes';
import { Provider } from 'react-redux';
import ThemeProvider from './components/ThemeProvider';
import NavBar from './components/NavBar';
import { store } from './store/store';

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <NavBar />
        <div className="flex flex-col items-center justify-center min-h-screen">
          <AppRouting />
        </div>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
