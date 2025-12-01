import React from "react";
import DashboardLayout from './components/layout/DashboardLayout';
import { Routes, Route } from "react-router-dom";
import LightRays from "./components/ui/LightRays";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import AuthLayout from './components/layout/AuthLayout';
import ProtectedRoute from './components/auth/ProtectedRoute'; // Add this import
import Profile from "./pages/Profile";
import "./App.css";

// Import pages
import Home from "./pages/Home";
import Auth from "./pages/Auth/Auth"; // Change from Login/Signup to Auth
import RoleSelection from "./pages/RoleSelection";
import GroupCode from "./pages/GroupCode";
import JoinGroup from "./pages/JoinGroup";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";

const App = () => {
  return (
    <div className="app-container">
      <Routes>
        {/* Home page WITH LightRays and Footer */}
        <Route path="/" element={
          <>
            <LightRays
              className="light-rays-bg"
              raysOrigin="top-center"
              raysColor="#f3eeeaff"
              raysSpeed={3.0}
              lightSpread={5.8}
              rayLength={5.2}
              pulsating={true}
              fadeDistance={2.0}
              saturation={2.0}
              followMouse={true}
              mouseInfluence={1.0}
              noiseAmount={0.11}
              distortion={0.1}
            />
            <div className="content-wrapper">
              <Navbar />
              <main>
                <Home />
              </main>
          
            </div>
          </>
        } />
        
        {/* Auth pages WITHOUT LightRays but WITH Footer */}
       <Route path="/auth" element={<Auth />} />

        {/* Protected routes - REQUIRE AUTHENTICATION */}
        <Route path="/role-selection" element={
          <ProtectedRoute>
            <AuthLayout>
              <RoleSelection />
            </AuthLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/group-code" element={
          <ProtectedRoute>
            <AuthLayout>
              <GroupCode />
            </AuthLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/join-group" element={
          <ProtectedRoute>
            <AuthLayout>
              <JoinGroup />
            </AuthLayout>
          </ProtectedRoute>
        } />
        
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        
<Route path="/profile" element={
  <ProtectedRoute>
    <Profile />
  </ProtectedRoute>
} />

        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
};

export default App;