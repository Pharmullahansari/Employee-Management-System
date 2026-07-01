import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useData } from '../context/DataContext';
import { useLocation } from 'react-router-dom';
import { 
  HiOutlineMenuAlt2, 
  HiOutlineSun, 
  HiOutlineMoon, 
  HiOutlineBell,
  HiOutlineSearch,
  HiChevronDown,
  HiBadgeCheck
} from 'react-icons/hi';

const Navbar = ({ onMenuClick }) => {
  const { darkMode, toggleDarkMode } = useTheme();
  const { currentUser, setCurrentUser, employees } = useData();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showRoleSwitcher, setShowRoleSwitcher] = useState(false);
  const location = useLocation();

  // Get current page title
  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/') return 'Dashboard Overview';
    if (path === '/employees') return 'Employee Directory';
    if (path === '/add-employee') return 'Onboard Employee';
    if (path === '/attendance') return 'Attendance Ledger';
    if (path === '/leaves') return 'Leave Dashboard';
    if (path === '/payroll') return 'Payroll & Payslips';
    if (path === '/departments') return 'Departments';
    if (path === '/reports') return 'Reports & Analytics';
    if (path === '/settings') return 'Control Panel Settings';
    if (path.startsWith('/profile/')) return 'Employee Profile';
    return 'Ansari Production';
  };

  const handleRoleChange = (role) => {
    // Find first employee of this role, or fallback
    let match = employees.find(e => e.role === role);
    if (!match) {
      match = {
        id: role === 'Admin' ? 'EMP001' : role === 'HR' ? 'EMP002' : 'EMP003',
        name: role === 'Admin' ? 'Farhan Ansari' : role === 'HR' ? 'Priya Sharma' : 'Siddharth Roy',
        role: role,
        photo: role === 'Admin' 
          ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150' 
          : role === 'HR' 
          ? 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150' 
          : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
        department: role === 'Admin' ? 'Creative & Writing' : role === 'HR' ? 'Human Resources' : 'Editing & Post-Production'
      };
    }
    const session = {
      id: match.id,
      name: match.name,
      email: match.email,
      role: role,
      photo: match.photo,
      department: match.department
    };
    setCurrentUser(session);
    localStorage.setItem('currentUser', JSON.stringify(session));
    setShowRoleSwitcher(false);
  };

  const dummyNotifications = [
    { id: 1, title: 'New Leave Request', desc: 'Zara Sheikh has requested 3 days of sick leave.', unread: true },
    { id: 2, title: 'Attendance Alert', desc: 'Siddharth Roy has checked in late today.', unread: true },
    { id: 3, title: 'System Notification', desc: 'Backup generated successfully.', unread: false }
  ];

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-6 border-b bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-100">
      
      {/* Page Title & Hamburger */}
      <div className="flex items-center gap-3">
        <button 
          onClick={onMenuClick}
          className="p-2 rounded-xl text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-300 lg:hidden"
        >
          <HiOutlineMenuAlt2 className="w-5.5 h-5.5" />
        </button>
        <div>
          <h2 className="text-base lg:text-lg font-bold tracking-tight text-slate-800 dark:text-slate-100">
            {getPageTitle()}
          </h2>
          <p className="hidden md:block text-[11px] text-slate-400 font-medium">
            Ansari Production Studio Management Panel
          </p>
        </div>
      </div>

      {/* Right Navbar Tools */}
      <div className="flex items-center gap-2 lg:gap-4">
        
        {/* Role Quick Switcher */}
        {currentUser && (
          <div className="relative">
            <button 
              onClick={() => setShowRoleSwitcher(!showRoleSwitcher)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-indigo-50 text-indigo-650 hover:bg-indigo-100 dark:bg-indigo-950/40 dark:text-indigo-400 border border-indigo-150 dark:border-indigo-900/30 transition-all duration-200 cursor-pointer"
            >
              <span className="hidden sm:inline">Role:</span> {currentUser.role}
              <HiChevronDown className="w-3.5 h-3.5" />
            </button>
            
            {showRoleSwitcher && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl py-1.5 z-50">
                <p className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-b border-slate-100 dark:border-slate-800 pb-1.5 mb-1.5">
                  Choose Role Persona
                </p>
                {['Admin', 'HR', 'Employee'].map((role) => (
                  <button
                    key={role}
                    onClick={() => handleRoleChange(role)}
                    className={`flex items-center justify-between w-full text-left px-3 py-2 text-xs font-medium transition-colors hover:bg-slate-50 dark:hover:bg-slate-800
                      ${currentUser.role === role ? 'text-indigo-600 dark:text-indigo-400 font-bold' : 'text-slate-650 dark:text-slate-400'}`}
                  >
                    <span>{role} View</span>
                    {currentUser.role === role && <HiBadgeCheck className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Search Bar (Desktop only) */}
        <div className="hidden lg:flex items-center relative w-48 xl:w-60">
          <HiOutlineSearch className="absolute left-3 text-slate-400 w-4.5 h-4.5" />
          <input 
            type="text" 
            placeholder="Quick lookup..."
            className="w-full pl-9 pr-4 py-1.5 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-slate-950 dark:border-slate-800 dark:focus:ring-indigo-500 text-slate-800 dark:text-slate-200"
          />
        </div>

        {/* Theme Toggle Button */}
        <button 
          onClick={toggleDarkMode}
          className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all duration-200 cursor-pointer"
          title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {darkMode ? <HiOutlineSun className="w-4.5 h-4.5" /> : <HiOutlineMoon className="w-4.5 h-4.5" />}
        </button>

        {/* Notification Bell */}
        <div className="relative">
          <button 
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all duration-200 relative cursor-pointer"
          >
            <HiOutlineBell className="w-4.5 h-4.5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-slate-900" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl py-2 z-50">
              <div className="flex items-center justify-between px-4 py-1.5 border-b border-slate-100 dark:border-slate-800">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-350">Notifications</span>
                <button className="text-[10px] text-indigo-600 dark:text-indigo-400 hover:underline">Mark all read</button>
              </div>
              <div className="max-h-60 overflow-y-auto mt-1">
                {dummyNotifications.map((notif) => (
                  <div 
                    key={notif.id} 
                    className={`px-4 py-2.5 hover:bg-slate-50 dark:hover:bg-slate-800 border-b border-slate-100/50 dark:border-slate-800/50 cursor-pointer
                      ${notif.unread ? 'bg-slate-50/70 dark:bg-slate-800/20' : ''}`}
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-semibold text-slate-800 dark:text-slate-200">{notif.title}</h4>
                      {notif.unread && <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 dark:bg-indigo-400" />}
                    </div>
                    <p className="text-[10px] text-slate-500 dark:text-slate-450 mt-0.5 leading-relaxed">{notif.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

      </div>
    </header>
  );
};

export default Navbar;
