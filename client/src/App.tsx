import { BrowserRouter } from 'react-router-dom';
import './styles/App.css';
import { Router } from './routes';
import { Header } from './components';

function App() 
{
  return (
    <BrowserRouter>
      <Router />
    </BrowserRouter>
  )
}

export default App;
