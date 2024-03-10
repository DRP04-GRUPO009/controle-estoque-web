import { Outlet } from 'react-router-dom';
import './App.css';
import { UserProvider } from './context/useAuth';

function App() {
  return (
    <UserProvider>
      <Outlet />
    </UserProvider>
  )
}

export default App;
