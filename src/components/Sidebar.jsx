import React from 'react';
import { NavLink } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { 
  HiChevronLeft,
  HiChevronRight,
  HiOutlineViewGrid, 
  HiOutlineUsers, 
  HiOutlineUserAdd,
  HiOutlineCalendar, 
  HiOutlineClipboardList, 
  HiOutlineCreditCard, 
  HiOutlineOfficeBuilding, 
  HiOutlineChartBar, 
  HiOutlineCog,
  HiOutlineLogout
} from 'react-icons/hi';

const Sidebar = ({ isOpen, setIsOpen }) => {
  const { currentUser, logout } = useData();

  const menuItems = [
    { name: 'Dashboard', path: '/', icon: HiOutlineViewGrid, roles: ['Admin', 'HR', 'Employee'] },
    { name: 'Employees', path: '/employees', icon: HiOutlineUsers, roles: ['Admin', 'HR'] },
    { name: 'Add Employee', path: '/add-employee', icon: HiOutlineUserAdd, roles: ['Admin', 'HR'] },
    { name: 'Attendance', path: '/attendance', icon: HiOutlineCalendar, roles: ['Admin', 'HR', 'Employee'] },
    { name: 'Leaves', path: '/leaves', icon: HiOutlineClipboardList, roles: ['Admin', 'HR', 'Employee'] },
    { name: 'Payroll', path: '/payroll', icon: HiOutlineCreditCard, roles: ['Admin', 'HR', 'Employee'] },
    { name: 'Departments', path: '/departments', icon: HiOutlineOfficeBuilding, roles: ['Admin', 'HR'] },
    { name: 'Reports & Analytics', path: '/reports', icon: HiOutlineChartBar, roles: ['Admin', 'HR'] },
    { name: 'Settings', path: '/settings', icon: HiOutlineCog, roles: ['Admin', 'HR', 'Employee'] },
  ];

  const filteredMenuItems = menuItems.filter(item => 
    !currentUser || item.roles.includes(currentUser.role)
  );

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-sm lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside 
        className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col w-64 border-r transition-transform duration-300 ease-in-out lg:static lg:translate-x-0
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          bg-white border-slate-200 dark:bg-slate-900 dark:border-slate-800 text-slate-800 dark:text-slate-100`}
      >
        {/* Company Branding */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-violet-600 text-white font-black tracking-wider text-lg shadow-sm shadow-indigo-500/30">
              A
            </div>
            <div>
              <h1 className="font-extrabold text-sm tracking-tight leading-none bg-gradient-to-r from-indigo-600 to-violet-500 bg-clip-text text-transparent dark:from-indigo-400 dark:to-violet-300">
                Ansari Production
              </h1>
              <span className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold tracking-widest uppercase">
                Studio Suite
              </span>
            </div>
          </div>
          <button 
            onClick={() => setIsOpen(false)}
            className="p-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 lg:hidden"
          >
            <HiChevronLeft className="w-5 h-5" />
          </button>
        </div>

        {/* Sidebar Links */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          {filteredMenuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => 
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group duration-200
                ${isActive 
                  ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-md shadow-indigo-500/20 dark:shadow-indigo-500/10 font-semibold' 
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-indigo-600 dark:hover:text-indigo-400'
                }`
              }
              onClick={() => {
                if (window.innerWidth < 1024) setIsOpen(false);
              }}
            >
              {({ isActive }) => (
                <>
                  <item.icon className={`w-5 h-5 transition-transform duration-200 group-hover:scale-110 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400'}`} />
                  <span>{item.name}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* User Info & Logout footer */}
        {currentUser && (
          <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
            <div className="flex items-center gap-3 mb-4">
              <img 
                src={currentUser.photo || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'} 
                alt={currentUser.name} 
                className="w-10 h-10 rounded-xl object-cover ring-2 ring-indigo-500/10"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate text-slate-800 dark:text-slate-200">{currentUser.name}</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className={`px-1.5 py-0.5 text-[9px] font-bold uppercase rounded-md tracking-wider
                    ${currentUser.role === 'Admin' ? 'bg-rose-50 text-rose-600 dark:bg-rose-950/30 dark:text-rose-400' :
                      currentUser.role === 'HR' ? 'bg-amber-50 text-amber-600 dark:bg-amber-950/30 dark:text-amber-400' :
                      'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/30 dark:text-indigo-400'}`}
                  >
                    {currentUser.role}
                  </span>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 truncate">{currentUser.department || 'Management'}</span>
                </div>
              </div>
            </div>
            <button 
              onClick={logout}
              className="flex items-center justify-center w-full gap-2 px-3 py-2 text-xs font-semibold rounded-xl text-rose-600 hover:text-white hover:bg-rose-600 border border-rose-200 hover:border-rose-600 dark:border-rose-900/30 dark:text-rose-450 dark:hover:bg-rose-600 transition-all duration-200"
            >
              <HiOutlineLogout className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        )}
      </aside>
    </>
  );
};

export default Sidebar;
