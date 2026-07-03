import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { HiOutlineUser, HiOutlineMail, HiOutlinePhone, HiOutlineUserGroup, HiOutlineShieldCheck, HiOutlineUpload } from 'react-icons/hi';

const AddEmployee = () => {
  const { addEmployee, departments } = useData();
  const navigate = useNavigate();

  // Form Fields State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    department: 'Creative & Writing',
    designation: '',
    joiningDate: new Date().toISOString().split('T')[0],
    salary: 80050,
    gender: 'Male',
    dob: '1995-01-01',
    role: 'Employee',
    photo: '',
    emergencyName: '',
    emergencyRelation: '',
    emergencyPhone: ''
  });

  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    
    // Quick validation
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Full Name is required';
    if (!formData.email) newErrors.email = 'Email Address is required';
    if (!formData.phone) newErrors.phone = 'Phone Number is required';
    if (!formData.designation) newErrors.designation = 'Designation is required';
    if (!formData.salary || formData.salary <= 0) newErrors.salary = 'Please enter a valid salary amount';
    if (!formData.emergencyName) newErrors.emergencyName = 'Emergency contact name is required';
    if (!formData.emergencyPhone) newErrors.emergencyPhone = 'Emergency contact phone is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      window.scrollTo(0, 0);
      return;
    }

    // Adapt schema for context save
    const employeePayload = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      department: formData.department,
      designation: formData.designation,
      joiningDate: formData.joiningDate,
      salary: Number(formData.salary),
      gender: formData.gender,
      dob: formData.dob,
      role: formData.role,
      photo: formData.photo || undefined,
      emergencyContact: {
        name: formData.emergencyName,
        relation: formData.emergencyRelation || 'Family',
        phone: formData.emergencyPhone
      }
    };

    addEmployee(employeePayload);
    navigate('/employees');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      <div className="flex items-center justify-between text-left">
        <div>
          <div className="text-[11px] text-slate-405 dark:text-slate-400 font-bold uppercase tracking-wider mb-1">
            <span 
              onClick={() => navigate('/employees')} 
              className="hover:text-blue-600 dark:hover:text-blue-450 cursor-pointer transition-colors"
            >
              Employee List
            </span> &rsaquo; <span className="text-blue-500 font-extrabold">Add employee</span>
          </div>
          <h2 className="text-xl font-extrabold text-slate-800 dark:text-white tracking-tight">
            Add New Employee 
          </h2>
          <p className="text-[11px] text-slate-405 dark:text-slate-400 mt-1">Fill in the professional and personal information below to create the employee record.</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        
        {/* Section 1: Personal Details */}
        <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3 mb-4">
            <HiOutlineUser className="w-5 h-5 text-indigo-500" />
            <h3 className="text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider">Personal Information</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2">
              <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">Full Name *</label>
              <input 
                type="text" 
                name="name" 
                value={formData.name} 
                onChange={handleInputChange}
                placeholder="e.g. Farhan Ansari"
                className={`w-full px-3 py-2 text-sm rounded-lg bg-slate-50 border focus:outline-none dark:bg-slate-950 dark:border-slate-800 dark:text-white ${errors.name ? 'border-rose-400' : 'border-slate-200'}`}
              />
              {errors.name && <p className="text-[10px] text-rose-500 mt-1 font-semibold">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">Gender</label>
              <select 
                name="gender" 
                value={formData.gender} 
                onChange={handleInputChange}
                className="w-full px-3 py-2 text-sm rounded-lg bg-slate-50 border border-slate-200 focus:outline-none dark:bg-slate-950 dark:border-slate-800 dark:text-white"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">Date of Birth</label>
              <input 
                type="date" 
                name="dob" 
                value={formData.dob} 
                onChange={handleInputChange}
                className="w-full px-3 py-2 text-sm rounded-lg bg-slate-50 border border-slate-200 focus:outline-none dark:bg-slate-950 dark:border-slate-800 dark:text-white font-mono"
              />
            </div>
            
            <div>
              <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">Avatar / Photo URL</label>
              <div className="relative flex items-center">
                <input 
                  type="text" 
                  name="photo" 
                  value={formData.photo} 
                  onChange={handleInputChange}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3 py-2 text-sm rounded-lg bg-slate-50 border border-slate-200 focus:outline-none dark:bg-slate-950 dark:border-slate-800 dark:text-white"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Contact Details */}
        <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3 mb-4">
            <HiOutlineMail className="w-5 h-5 text-indigo-500" />
            <h3 className="text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider">Contact Details</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">Email Address *</label>
              <input 
                type="email" 
                name="email" 
                value={formData.email} 
                onChange={handleInputChange}
                placeholder="crewmember@ansariproduction.com"
                className={`w-full px-3 py-2 text-sm rounded-lg bg-slate-50 border focus:outline-none dark:bg-slate-950 dark:border-slate-800 dark:text-white ${errors.email ? 'border-rose-400' : 'border-slate-200'}`}
              />
              {errors.email && <p className="text-[10px] text-rose-500 mt-1 font-semibold">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">Phone Number *</label>
              <input 
                type="text" 
                name="phone" 
                value={formData.phone} 
                onChange={handleInputChange}
                placeholder="+91 XXXXX XXXXX"
                className={`w-full px-3 py-2 text-sm rounded-lg bg-slate-50 border focus:outline-none dark:bg-slate-950 dark:border-slate-800 dark:text-white font-mono ${errors.phone ? 'border-rose-400' : 'border-slate-200'}`}
              />
              {errors.phone && <p className="text-[10px] text-rose-500 mt-1 font-semibold">{errors.phone}</p>}
            </div>
          </div>
        </div>

        {/* Section 3: Professional & Salary Information */}
        <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3 mb-4">
            <HiOutlineShieldCheck className="w-5 h-5 text-indigo-500" />
            <h3 className="text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider">Professional & Salary</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">Department</label>
              <select 
                name="department" 
                value={formData.department} 
                onChange={handleInputChange}
                className="w-full px-3 py-2 text-sm rounded-lg bg-slate-50 border border-slate-200 focus:outline-none dark:bg-slate-950 dark:border-slate-800 dark:text-white"
              >
                {departments.map(d => <option key={d.id} value={d.name}>{d.name}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">Designation *</label>
              <input 
                type="text" 
                name="designation" 
                value={formData.designation} 
                onChange={handleInputChange}
                placeholder="e.g. Assistant Director"
                className={`w-full px-3 py-2 text-sm rounded-lg bg-slate-50 border focus:outline-none dark:bg-slate-950 dark:border-slate-800 dark:text-white ${errors.designation ? 'border-rose-400' : 'border-slate-200'}`}
              />
              {errors.designation && <p className="text-[10px] text-rose-500 mt-1 font-semibold">{errors.designation}</p>}
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">Role Permission</label>
              <select 
                name="role" 
                value={formData.role} 
                onChange={handleInputChange}
                className="w-full px-3 py-2 text-sm rounded-lg bg-slate-50 border border-slate-200 focus:outline-none dark:bg-slate-950 dark:border-slate-800 dark:text-white"
              >
                <option value="Employee">Employee (Staff)</option>
                <option value="HR">HR Staff</option>
                <option value="Admin">Administrator</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">Joining Date</label>
              <input 
                type="date" 
                name="joiningDate" 
                value={formData.joiningDate} 
                onChange={handleInputChange}
                className="w-full px-3 py-2 text-sm rounded-lg bg-slate-50 border border-slate-200 focus:outline-none dark:bg-slate-950 dark:border-slate-800 dark:text-white font-mono"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">Monthly Base Salary (₹) *</label>
              <input 
                type="number" 
                name="salary" 
                value={formData.salary} 
                onChange={handleInputChange}
                className={`w-full px-3 py-2 text-sm rounded-lg bg-slate-50 border focus:outline-none dark:bg-slate-950 dark:border-slate-800 dark:text-white font-mono ${errors.salary ? 'border-rose-400' : 'border-slate-200'}`}
              />
              {errors.salary && <p className="text-[10px] text-rose-500 mt-1 font-semibold">{errors.salary}</p>}
            </div>
          </div>
        </div>

        {/* Section 4: Emergency Contact Details */}
        <div className="p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3 mb-4">
            <HiOutlineUserGroup className="w-5 h-5 text-indigo-500" />
            <h3 className="text-xs font-bold text-slate-700 dark:text-slate-200 uppercase tracking-wider">Emergency Contact</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">Contact Name *</label>
              <input 
                type="text" 
                name="emergencyName" 
                value={formData.emergencyName} 
                onChange={handleInputChange}
                placeholder="e.g. Yasmin Ansari"
                className={`w-full px-3 py-2 text-sm rounded-lg bg-slate-50 border focus:outline-none dark:bg-slate-950 dark:border-slate-800 dark:text-white ${errors.emergencyName ? 'border-rose-400' : 'border-slate-200'}`}
              />
              {errors.emergencyName && <p className="text-[10px] text-rose-500 mt-1 font-semibold">{errors.emergencyName}</p>}
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">Relationship</label>
              <input 
                type="text" 
                name="emergencyRelation" 
                value={formData.emergencyRelation} 
                onChange={handleInputChange}
                placeholder="e.g. Spouse / Parent"
                className="w-full px-3 py-2 text-sm rounded-lg bg-slate-50 border border-slate-200 focus:outline-none dark:bg-slate-950 dark:border-slate-800 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">Phone Number *</label>
              <input 
                type="text" 
                name="emergencyPhone" 
                value={formData.emergencyPhone} 
                onChange={handleInputChange}
                placeholder="+91 XXXXX XXXXX"
                className={`w-full px-3 py-2 text-sm rounded-lg bg-slate-50 border focus:outline-none dark:bg-slate-950 dark:border-slate-800 dark:text-white font-mono ${errors.emergencyPhone ? 'border-rose-400' : 'border-slate-202'}`}
              />
              {errors.emergencyPhone && <p className="text-[10px] text-rose-500 mt-1 font-semibold">{errors.emergencyPhone}</p>}
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center justify-end gap-3 pb-8">
          <button 
            type="button" 
            onClick={() => navigate('/employees')}
            className="px-5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-300 cursor-pointer"
          >
            Cancel
          </button>
          <button 
            type="submit"
            className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 shadow-md transition-colors cursor-pointer"
          >
            Save Employee
          </button>
        </div>

      </form>

    </div>
  );
};

export default AddEmployee;
