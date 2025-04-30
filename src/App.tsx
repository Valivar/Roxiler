
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";

import { AuthProvider } from "@/context/AuthContext";
import { StoreProvider } from "@/context/StoreContext";
import Layout from "@/components/Layout";

// Auth Pages
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";

// Admin Pages
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminStores from "@/pages/admin/AdminStores";
import AdminUsers from "@/pages/admin/AdminUsers";

// Store Owner Pages
import StoreOwnerDashboard from "@/pages/store-owner/StoreOwnerDashboard";
import StoreOwnerSettings from "@/pages/store-owner/StoreOwnerSettings";

// Normal User Pages
import StoresPage from "@/pages/normal-user/StoresPage";
import ProfilePage from "@/pages/normal-user/ProfilePage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Router>
        <AuthProvider>
          <StoreProvider>
            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              
              {/* Admin Routes */}
              <Route path="/admin" element={<Layout><AdminDashboard /></Layout>} />
              <Route path="/admin/stores" element={<Layout><AdminStores /></Layout>} />
              <Route path="/admin/users" element={<Layout><AdminUsers /></Layout>} />
              
              {/* Store Owner Routes */}
              <Route path="/store-owner" element={<Layout><StoreOwnerDashboard /></Layout>} />
              <Route path="/store-owner/settings" element={<Layout><StoreOwnerSettings /></Layout>} />
              
              {/* Normal User Routes */}
              <Route path="/stores" element={<Layout><StoresPage /></Layout>} />
              <Route path="/profile" element={<Layout><ProfilePage /></Layout>} />
              
              {/* Default Redirects */}
              <Route path="/" element={<Navigate to="/login" replace />} />
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
            <Toaster />
            <Sonner />
          </StoreProvider>
        </AuthProvider>
      </Router>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
