import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home/Home';
import Login from './pages/Login/Login';
import Search from './pages/Search/Search';
import Register from './pages/Register/Register';
import { useEffect } from 'react';
import { useAuthStore } from './stores/authStore';
import { getMe } from './services/authService';
import Nav from './components/Nav/Nav';
import FilmDetail from './pages/FilmDetail/FilmDetail';

const App = () => {
  const setUser = useAuthStore((s) => s.setUser);
  const clearUser = useAuthStore((s) => s.clearUser);

  useEffect(() => {
    const hydrate = async () => {
      try {
        const user = await getMe();
        setUser(user);
      } catch {
        clearUser();
      }
    };
    hydrate();
  }, [setUser, clearUser]);

  return (
    <BrowserRouter>
      <Nav />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<Search />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/films/:tmdbId" element={<FilmDetail />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
