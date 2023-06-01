import { BrowserRouter } from 'react-router-dom';
import './App.css';
import { Router } from './routes';
import { Header } from './components';

function App() 
{
  return (
    <BrowserRouter>
      <Header />
      <Router />
    </BrowserRouter>
  )
}

export default App;
