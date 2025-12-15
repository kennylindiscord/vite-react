// src/App.tsx
import { Routes, Route, useLocation } from 'react-router-dom';
import Layout from './layout/Layout';
import Home from './pages/Home';
import Events from './pages/Events';
import Community from './pages/Community';
import Tokens from './pages/Tokens';
import Profile from './pages/Profile';

function App() {
  const location = useLocation();

  const pathToPageName: Record<string, string> = {
    '/': 'Home',
    '/events': 'Events',
    '/community': 'Community',
    '/tokens': 'Tokens',
    '/profile': 'Profile',
  };

  const currentPageName = pathToPageName[location.pathname] || 'Home';

  return (
    <Layout currentPageName={currentPageName}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/events" element={<Events />} />
        <Route path="/community" element={<Community />} />
        <Route path="/tokens" element={<Tokens />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </Layout>
  );
}

export default App;

