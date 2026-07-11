import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Layout from './components/Layout/Layout';
import Home from './pages/Home';
import Search from './pages/Search';
import Restaurant from './pages/Restaurant';
import Cart from './pages/Cart';
import Favorites from './pages/Favorites';
import Orders from './pages/Orders';
import Profile from './pages/Profile';
import Payment from './pages/Payment';
import { useEffect, useState } from 'react';
import ProtectRoutes from './ProtectRoutes';
import Login from './pages/Login';
import Signup from './pages/Signup';

function App() {
  const [user, setUser] = useState<any | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleAuth = (nextUser: any, token: string) => {
    localStorage.setItem('user', JSON.stringify(nextUser));
    localStorage.setItem('token', token);
    setUser(nextUser);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AppProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="search" element={<Search />} />
            <Route path="restaurant/:id" element={<Restaurant />} />
          
            <Route path="cart" element={
           <ProtectRoutes>
               <Cart />
          </ProtectRoutes>

               } />
            <Route path="favorites" element={<Favorites />} />
            <Route path="orders" element={<Orders />} />
            <Route path="payment" element={
              <ProtectRoutes>
                <Payment />
              </ProtectRoutes>
            } />
            <Route path="profile" element={
              <ProtectRoutes>
                <Profile user={user} onLogout={handleLogout} />
              </ProtectRoutes>
            } />
            <Route path="login" element={<Login onAuth={handleAuth} />} />
            <Route path="signup" element={<Signup onAuth={handleAuth} />} />
          </Route>
        </Routes>
      </Router>
    </AppProvider>
  );
}

export default App;
