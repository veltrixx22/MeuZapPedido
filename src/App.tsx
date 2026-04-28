import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { FirebaseProvider, useFirebase } from '@/lib/FirebaseProvider';
import { Toaster } from '@/components/ui/sonner';
import LandingPage from '@/pages/LandingPage';
import Dashboard from '@/pages/Dashboard';
import StoreManagement from '@/pages/StoreManagement';
import ProductManagement from '@/pages/ProductManagement';
import Orders from '@/pages/Orders';
import MenuPage from '@/pages/MenuPage';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useFirebase();

  if (loading) return <div>Carregando...</div>;
  if (!user) return <Navigate to="/" />;

  return <>{children}</>;
};

export default function App() {
  return (
    <Router>
      <FirebaseProvider>
        <div className="min-h-screen bg-background text-foreground">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/store/:id" element={
              <ProtectedRoute>
                <StoreManagement />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/products/:id" element={
              <ProtectedRoute>
                <ProductManagement />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/orders/:storeId" element={
              <ProtectedRoute>
                <Orders />
              </ProtectedRoute>
            } />
            <Route path="/:slug" element={<MenuPage />} />
          </Routes>
          <Toaster />
        </div>
      </FirebaseProvider>
    </Router>
  );
}
