import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { DataProvider, useData } from './context/DataContext';

// Components
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import EmployeeList from './pages/EmployeeList';
import AddEmployee from './pages/AddEmployee';
import EmployeeProfile from './pages/EmployeeProfile';
import Attendance from './pages/Attendance';
import Leave from './pages/Leave';
import Payroll from './pages/Payroll';
import Department from './pages/Department';
import Settings from './pages/Settings';

// Route Guards
const ProtectedRoute = () => {
  const { currentUser } = useData();
  return currentUser ? <Outlet /> : <Navigate to="/login" replace />;
};

const PublicRoute = () => {
  const { currentUser } = useData();
  return !currentUser ? <Outlet /> : <Navigate to="/" replace />;
};

// Main Layout Wrapper
const AppLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      {/* Collapsible Sidebar */}
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />
      
      {/* Content wrapper */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Navigation Header */}
        <Navbar onMenuClick={() => setSidebarOpen(true)} />
        
        {/* Scrolling content viewport */}
        <main className="flex-1 overflow-y-auto px-6 py-6 md:px-8">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

function App() {
  return (
    <ThemeProvider>
      <DataProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Auth Routes */}
            <Route element={<PublicRoute />}>
              <Route path="/login" element={<Login />} />
            </Route>

            {/* Protected Workspace Routes */}
            <Route element={<ProtectedRoute />}>
              <Route element={<AppLayout />}>
                <Route path="/" element={<Dashboard />} />
                <Route path="/employees" element={<EmployeeList />} />
                <Route path="/add-employee" element={<AddEmployee />} />
                <Route path="/profile/:id" element={<EmployeeProfile />} />
                <Route path="/attendance" element={<Attendance />} />
                <Route path="/leaves" element={<Leave />} />
                <Route path="/payroll" element={<Payroll />} />
                <Route path="/departments" element={<Department />} />
                <Route path="/settings" element={<Settings />} />
              </Route>
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </DataProvider>
    </ThemeProvider>
  );
}

export default App;
