// src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './layout/Layout';
import Home from './pages/Home';
import Events from './pages/Events';
import Community from './pages/Community';
import Tokens from './pages/Tokens';
import Profile from './pages/Profile';
import './index.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <Layout currentPageName="Home">
              <Home />
            </Layout>
          }
        />
        <Route
          path="/events"
          element={
            <Layout currentPageName="Events">
              <Events />
            </Layout>
          }
        />
        <Route
          path="/community"
          element={
            <Layout currentPageName="Community">
              <Community />
            </Layout>
          }
        />
        <Route
          path="/tokens"
          element={
            <Layout currentPageName="Tokens">
              <Tokens />
            </Layout>
          }
        />
        <Route
          path="/profile"
          element={
            <Layout currentPageName="Profile">
              <Profile />
            </Layout>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

