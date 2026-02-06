import React from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Layout from "./layout/Layout";
import Home from "./pages/Home";
import Events from "./pages/Events";
import Community from "./pages/Community";
import Tokens from "./pages/Tokens";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { useAuth } from "./auth/AuthContext";

function PageWrapper({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const path = location.pathname;

  const currentPageName =
    path === "/"
      ? "Home"
      : path.startsWith("/events")
      ? "Events"
      : path.startsWith("/community")
      ? "Community"
      : path.startsWith("/tokens")
      ? "Tokens"
      : path.startsWith("/profile")
      ? "Profile"
      : "";

  return <Layout currentPageName={currentPageName}>{children}</Layout>;
}

function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <PageWrapper>
              <Home />
            </PageWrapper>
          }
        />
        <Route
          path="/events"
          element={
            <PageWrapper>
              <Events />
            </PageWrapper>
          }
        />
        <Route
          path="/community"
          element={
            <PageWrapper>
              <Community />
            </PageWrapper>
          }
        />
        <Route
          path="/tokens"
          element={
            <PageWrapper>
              <RequireAuth>
                <Tokens />
              </RequireAuth>
            </PageWrapper>
          }
        />
        <Route
          path="/profile"
          element={
            <PageWrapper>
              <RequireAuth>
                <Profile />
              </RequireAuth>
            </PageWrapper>
          }
        />

        <Route
          path="/login"
          element={
            <PageWrapper>
              <Login />
            </PageWrapper>
          }
        />
        <Route
          path="/register"
          element={
            <PageWrapper>
              <Register />
            </PageWrapper>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

