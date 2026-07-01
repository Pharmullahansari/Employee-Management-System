import React, { createContext, useContext, useState, useEffect } from 'react';

const DataContext = createContext();

const initialDepartments = [
  { id: 'D1', name: 'Creative & Writing', code: 'CW', manager: 'Farhan Ansari', employeesCount: 4 },
  { id: 'D2', name: 'Editing & Post-Production', code: 'EPP', manager: 'Siddharth Roy', employeesCount: 3 },
  { id: 'D3', name: 'VFX & Animation', code: 'VFX', manager: 'Zara Sheikh', employeesCount: 3 },
  { id: 'D4', name: 'Camera & Production', code: 'CP', manager: 'Kabir Mehta', employeesCount: 3 },
  { id: 'D5', name: 'Human Resources', code: 'HR', manager: 'Priya Sharma', employeesCount: 2 }
];

const initialEmployees = [
  {
    id: 'EMP001',
    name: 'Farhan Ansari',
    email: 'farhan@ansariproduction.com',
    phone: '+91 98765 43210',
    department: 'Creative & Writing',
    designation: 'Director & Founder',
    joiningDate: '2020-01-15',
    status: 'Active',
    salary: 180000,
    gender: 'Male',
    dob: '1988-08-24',
    emergencyContact: { name: 'Yasmin Ansari', relation: 'Spouse', phone: '+91 98765 43211' },
    photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', // female model/male model placeholder
    attendanceStats: { present: 22, absent: 0, halfDay: 0, late: 1 },
    leaveBalance: { casual: 8, sick: 10, paid: 15 },
    role: 'Admin'
  },
  {
    id: 'EMP002',
    name: 'Priya Sharma',
    email: 'priya@ansariproduction.com',
    phone: '+91 98123 45678',
    department: 'Human Resources',
    designation: 'HR Lead',
    joiningDate: '2021-06-01',
    status: 'Active',
    salary: 95000,
    gender: 'Female',
    dob: '1992-11-12',
    emergencyContact: { name: 'Ravi Sharma', relation: 'Father', phone: '+91 98123 45670' },
    photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
    attendanceStats: { present: 20, absent: 1, halfDay: 1, late: 0 },
    leaveBalance: { casual: 6, sick: 8, paid: 12 },
    role: 'HR'
  },
  {
    id: 'EMP003',
    name: 'Siddharth Roy',
    email: 'siddharth@ansariproduction.com',
    phone: '+91 97654 32109',
    department: 'Editing & Post-Production',
    designation: 'Chief Editor',
    joiningDate: '2021-02-10',
    status: 'Active',
    salary: 110000,
    gender: 'Male',
    dob: '1990-05-18',
    emergencyContact: { name: 'Ananya Roy', relation: 'Mother', phone: '+91 97654 32100' },
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    attendanceStats: { present: 21, absent: 1, halfDay: 0, late: 2 },
    leaveBalance: { casual: 7, sick: 9, paid: 14 },
    role: 'Employee'
  },
  {
    id: 'EMP004',
    name: 'Zara Sheikh',
    email: 'zara@ansariproduction.com',
    phone: '+91 99887 76655',
    department: 'VFX & Animation',
    designation: 'Lead VFX Artist',
    joiningDate: '2022-03-20',
    status: 'Active',
    salary: 125000,
    gender: 'Female',
    dob: '1994-09-05',
    emergencyContact: { name: 'Ahmad Sheikh', relation: 'Brother', phone: '+91 99887 76650' },
    photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    attendanceStats: { present: 19, absent: 2, halfDay: 1, late: 1 },
    leaveBalance: { casual: 5, sick: 7, paid: 11 },
    role: 'Employee'
  },
  {
    id: 'EMP005',
    name: 'Kabir Mehta',
    email: 'kabir@ansariproduction.com',
    phone: '+91 98989 89898',
    department: 'Camera & Production',
    designation: 'Director of Photography',
    joiningDate: '2021-10-05',
    status: 'Active',
    salary: 140000,
    gender: 'Male',
    dob: '1989-12-30',
    emergencyContact: { name: 'Rita Mehta', relation: 'Spouse', phone: '+91 98989 89890' },
    photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    attendanceStats: { present: 22, absent: 0, halfDay: 0, late: 0 },
    leaveBalance: { casual: 9, sick: 10, paid: 15 },
    role: 'Employee'
  }
];

const initialLeaves = [
  { id: 'LV001', employeeId: 'EMP003', employeeName: 'Siddharth Roy', type: 'Sick Leave', startDate: '2026-06-10', endDate: '2026-06-11', days: 2, status: 'Approved', reason: 'Flu symptoms' },
  { id: 'LV002', employeeId: 'EMP004', employeeName: 'Zara Sheikh', type: 'Casual Leave', startDate: '2026-06-28', endDate: '2026-06-30', days: 3, status: 'Pending', reason: 'Family function' },
  { id: 'LV003', employeeId: 'EMP002', employeeName: 'Priya Sharma', type: 'Paid Leave', startDate: '2026-07-04', endDate: '2026-07-08', days: 5, status: 'Pending', reason: 'Personal holiday travel' }
];

const initialAttendance = {
  '2026-06-27': {
    'EMP001': 'Present',
    'EMP002': 'Present',
    'EMP003': 'Present',
    'EMP004': 'Half-Day',
    'EMP005': 'Present'
  },
  '2026-06-26': {
    'EMP001': 'Present',
    'EMP002': 'Present',
    'EMP003': 'Absent',
    'EMP004': 'Present',
    'EMP005': 'Present'
  }
};

const initialActivities = [
  { id: 1, text: 'Zara Sheikh requested 3 days of Casual Leave', time: '2 hours ago', type: 'leave' },
  { id: 2, text: 'Siddharth Roy checked in late today (09:45 AM)', time: '4 hours ago', type: 'attendance' },
  { id: 3, text: 'Priya Sharma added New Department "VFX & Animation"', time: '1 day ago', type: 'department' },
  { id: 4, text: 'Payroll generated for the month of June 2026', time: '2 days ago', type: 'payroll' }
];

export const DataProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('currentUser');
    return saved ? JSON.parse(saved) : null;
  });

  const [employees, setEmployees] = useState(() => {
    const saved = localStorage.getItem('employees');
    return saved ? JSON.parse(saved) : initialEmployees;
  });

  const [departments, setDepartments] = useState(() => {
    const saved = localStorage.getItem('departments');
    return saved ? JSON.parse(saved) : initialDepartments;
  });

  const [leaves, setLeaves] = useState(() => {
    const saved = localStorage.getItem('leaves');
    return saved ? JSON.parse(saved) : initialLeaves;
  });

  const [attendance, setAttendance] = useState(() => {
    const saved = localStorage.getItem('attendance');
    return saved ? JSON.parse(saved) : initialAttendance;
  });

  const [activities, setActivities] = useState(() => {
    const saved = localStorage.getItem('activities');
    return saved ? JSON.parse(saved) : initialActivities;
  });

  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('settings');
    return saved ? JSON.parse(saved) : {
      emailNotifications: true,
      pushNotifications: false,
      payrollApprovalReminder: true,
      leaveApprovalAlert: true,
      themePreset: 'modern',
      aiResponseStyle: 'professional',
      aiPersonaName: 'Antigravity Assistant',
      aiTemperature: '0.7'
    };
  });

  useEffect(() => {
    localStorage.setItem('employees', JSON.stringify(employees));
  }, [employees]);

  useEffect(() => {
    localStorage.setItem('departments', JSON.stringify(departments));
  }, [departments]);

  useEffect(() => {
    localStorage.setItem('leaves', JSON.stringify(leaves));
  }, [leaves]);

  useEffect(() => {
    localStorage.setItem('attendance', JSON.stringify(attendance));
  }, [attendance]);

  useEffect(() => {
    localStorage.setItem('activities', JSON.stringify(activities));
  }, [activities]);

  useEffect(() => {
    localStorage.setItem('settings', JSON.stringify(settings));
  }, [settings]);

  const login = (emailOrPhone, password, chosenRole) => {
    // Demo login helper: matches prefix or custom option
    const foundEmp = employees.find(e => e.email.toLowerCase() === emailOrPhone.toLowerCase() || e.phone === emailOrPhone);
    if (foundEmp) {
      const userSession = {
        id: foundEmp.id,
        name: foundEmp.name,
        email: foundEmp.email,
        role: chosenRole || foundEmp.role,
        photo: foundEmp.photo,
        department: foundEmp.department
      };
      setCurrentUser(userSession);
      localStorage.setItem('currentUser', JSON.stringify(userSession));
      return { success: true, user: userSession };
    }
    // Allow fallback for custom user demo
    if (emailOrPhone === 'admin@ansari.com') {
      const userSession = { id: 'ADM001', name: 'Farhan Ansari', email: 'admin@ansari.com', role: 'Admin', photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150' };
      setCurrentUser(userSession);
      localStorage.setItem('currentUser', JSON.stringify(userSession));
      return { success: true, user: userSession };
    }
    return { success: false, message: 'Invalid credentials. Try using one of the quick login buttons!' };
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
  };

  const addEmployee = (empData) => {
    const newId = `EMP${String(employees.length + 1).padStart(3, '0')}`;
    const newEmp = {
      ...empData,
      id: newId,
      status: empData.status || 'Active',
      photo: empData.photo || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
      attendanceStats: { present: 0, absent: 0, halfDay: 0, late: 0 },
      leaveBalance: { casual: 10, sick: 10, paid: 15 }
    };
    setEmployees(prev => [newEmp, ...prev]);
    // update department counts
    setDepartments(prevDepts =>
      prevDepts.map(d =>
        d.name === empData.department ? { ...d, employeesCount: d.employeesCount + 1 } : d
      )
    );
    // add activity
    addActivity(`New employee ${empData.name} was onboarded to ${empData.department}`, 'employee');
    return newEmp;
  };

  const updateEmployee = (id, updatedFields) => {
    setEmployees(prev => prev.map(e => e.id === id ? { ...e, ...updatedFields } : e));
    addActivity(`Employee profile updated for ${updatedFields.name || id}`, 'employee');
  };

  const deleteEmployee = (id) => {
    const emp = employees.find(e => e.id === id);
    if (!emp) return;
    setEmployees(prev => prev.filter(e => e.id !== id));
    setDepartments(prevDepts =>
      prevDepts.map(d =>
        d.name === emp.department ? { ...d, employeesCount: Math.max(0, d.employeesCount - 1) } : d
      )
    );
    addActivity(`Employee ${emp.name} was deleted from database`, 'employee');
  };

  const applyLeave = (leaveData) => {
    const newLeave = {
      id: `LV${String(leaves.length + 1).padStart(3, '0')}`,
      ...leaveData,
      status: 'Pending'
    };
    setLeaves(prev => [newLeave, ...prev]);
    addActivity(`${leaveData.employeeName} requested ${leaveData.days} days of leave`, 'leave');
  };

  const updateLeaveStatus = (leaveId, status) => {
    setLeaves(prev =>
      prev.map(l => {
        if (l.id === leaveId) {
          if (status === 'Approved') {
            // Deduct balance from employee
            setEmployees(prevEmp =>
              prevEmp.map(e => {
                if (e.id === l.employeeId) {
                  const typeKey = l.type.toLowerCase().split(' ')[0] || 'casual'; // sick, casual, paid
                  const currentBal = e.leaveBalance[typeKey] || 10;
                  return {
                    ...e,
                    leaveBalance: {
                      ...e.leaveBalance,
                      [typeKey]: Math.max(0, currentBal - l.days)
                    }
                  };
                }
                return e;
              })
            );
          }
          return { ...l, status };
        }
        return l;
      })
    );
    const lv = leaves.find(l => l.id === leaveId);
    if (lv) {
      addActivity(`Leave request for ${lv.employeeName} was ${status.toLowerCase()}`, 'leave');
    }
  };

  const logAttendance = (date, empId, status) => {
    setAttendance(prev => {
      const dayRecords = prev[date] ? { ...prev[date] } : {};
      dayRecords[empId] = status;
      return {
        ...prev,
        [date]: dayRecords
      };
    });
    // Update individual statistics
    setEmployees(prevEmp =>
      prevEmp.map(e => {
        if (e.id === empId) {
          const stats = { ...e.attendanceStats };
          if (status === 'Present') stats.present = (stats.present || 0) + 1;
          else if (status === 'Absent') stats.absent = (stats.absent || 0) + 1;
          else if (status === 'Half-Day') stats.halfDay = (stats.halfDay || 0) + 1;
          return { ...e, attendanceStats: stats };
        }
        return e;
      })
    );
    const emp = employees.find(e => e.id === empId);
    if (emp) {
      addActivity(`Attendance for ${emp.name} marked as ${status}`, 'attendance');
    }
  };

  const createDepartment = (dept) => {
    const newDept = {
      id: `D${departments.length + 1}`,
      ...dept,
      employeesCount: 0
    };
    setDepartments(prev => [...prev, newDept]);
    addActivity(`Created new department: ${dept.name}`, 'department');
  };

  const addActivity = (text, type = 'general') => {
    const newAct = {
      id: Date.now(),
      text,
      time: 'Just now',
      type
    };
    setActivities(prev => [newAct, ...prev.slice(0, 19)]);
  };

  const updateSettingsState = (newSettings) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  return (
    <DataContext.Provider value={{
      currentUser,
      setCurrentUser,
      login,
      logout,
      employees,
      addEmployee,
      updateEmployee,
      deleteEmployee,
      departments,
      createDepartment,
      leaves,
      applyLeave,
      updateLeaveStatus,
      attendance,
      logAttendance,
      activities,
      settings,
      updateSettingsState
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);
