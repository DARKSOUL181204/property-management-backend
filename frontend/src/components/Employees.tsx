import { useEffect, useState, useRef } from 'react';
import api from '../api';
import { UserCog, UserPlus, ToggleLeft, ToggleRight, X } from 'lucide-react';

export default function Employees() {
  const [users, setUsers] = useState<any[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newEmp, setNewEmp] = useState({ name: '', email: '', password: '', role: 'MANAGER', status: 'ACTIVE', canEditPrice: true });
  const focusRef = useRef<HTMLInputElement>(null);

  const fetchUsers = () => {
    api.get('/users').then(res => setUsers(res.data)).catch(console.error);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (showAddModal && focusRef.current) {
        focusRef.current.focus();
    }
  }, [showAddModal]);

  const handleToggleBlock = async (user: any) => {
    const newStatus = user.status === 'ACTIVE' ? 'BLOCKED' : 'ACTIVE';
    await api.put(`/users/${user.userId}`, { ...user, status: newStatus });
    fetchUsers();
  };

  const handleToggleEditPrice = async (user: any) => {
    await api.put(`/users/${user.userId}`, { ...user, canEditPrice: !user.canEditPrice });
    fetchUsers();
  };

  const handleAdd = async (e: any) => {
    e.preventDefault();
    try {
      await api.post('/users', newEmp);
      setShowAddModal(false);
      setNewEmp({ name: '', email: '', password: '', role: 'MANAGER', status: 'ACTIVE', canEditPrice: true });
      fetchUsers();
    } catch (err) {
      console.error(err);
    }
  };

  const employees = users.filter(u => u.role === 'MANAGER' || u.role === 'EMPLOYEE');

  return (
    <div className="max-w-6xl mx-auto p-6">
      
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" role="dialog" aria-modal="true">
           <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-md p-6 shadow-xl relative max-h-[90vh] overflow-y-auto">
             <button 
               onClick={() => setShowAddModal(false)} 
               className="absolute top-4 right-4 text-gray-500 hover:text-gray-900 dark:hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md"
             >
               <span className="sr-only">Close Modal</span><X/>
             </button>
             <h2 className="text-xl font-bold mb-4 dark:text-white">Add New Employee</h2>
             <form onSubmit={handleAdd} className="space-y-4">
                <div>
                   <label className="block text-sm font-medium mb-1 dark:text-gray-300">Name</label>
                   <input ref={focusRef} required value={newEmp.name} onChange={e => setNewEmp({...newEmp, name: e.target.value})} className="w-full border rounded-lg p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                <div>
                   <label className="block text-sm font-medium mb-1 dark:text-gray-300">Email</label>
                   <input type="email" required value={newEmp.email} onChange={e => setNewEmp({...newEmp, email: e.target.value})} className="w-full border rounded-lg p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                <div>
                   <label className="block text-sm font-medium mb-1 dark:text-gray-300">Temporary Password</label>
                   <input required value={newEmp.password} onChange={e => setNewEmp({...newEmp, password: e.target.value})} className="w-full border rounded-lg p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                <div>
                   <label className="flex items-center text-sm font-medium dark:text-gray-300">
                     <input type="checkbox" checked={newEmp.canEditPrice} onChange={e => setNewEmp({...newEmp, canEditPrice: e.target.checked})} className="mr-2" />
                     Allow Price Editing
                   </label>
                </div>
                <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 rounded-lg transition focus:outline-none focus:ring-4 focus:ring-blue-500/50 mt-4">
                   Create Employee
                </button>
             </form>
           </div>
        </div>
      )}

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
          <UserCog className="mr-3 text-blue-600" /> Staff Management
        </h1>
        <button 
          onClick={() => setShowAddModal(true)} 
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition flex items-center shadow-sm focus:outline-none focus:ring-4 focus:ring-blue-500/50"
        >
          <UserPlus size={16} className="mr-2"/> Add Employee
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50/50 dark:bg-gray-900 text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider border-b border-gray-200 dark:border-gray-700">
              <th className="p-4 font-medium">Employee Name</th>
              <th className="p-4 font-medium">Email</th>
              <th className="p-4 font-medium text-center">Status</th>
              <th className="p-4 font-medium text-center">Can Edit Price</th>
              <th className="p-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
            {employees.map((emp: any) => (
              <tr key={emp.userId} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                <td className="p-4 font-semibold text-gray-900 dark:text-white">{emp.name}</td>
                <td className="p-4 text-sm text-gray-600 dark:text-gray-300">{emp.email}</td>
                <td className="p-4 text-center">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${emp.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                    {emp.status}
                  </span>
                </td>
                <td className="p-4 text-center">
                  <button onClick={() => handleToggleEditPrice(emp)} className="text-gray-500 hover:text-blue-600 focus:outline-none">
                    {emp.canEditPrice ? <ToggleRight size={28} className="text-blue-600 mx-auto" /> : <ToggleLeft size={28} className="mx-auto text-gray-400" />}
                  </button>
                </td>
                <td className="p-4 text-right">
                  <button 
                    onClick={() => handleToggleBlock(emp)} 
                    className={`text-sm px-4 py-1.5 rounded-lg font-semibold border ${emp.status === 'ACTIVE' ? 'border-red-200 text-red-600 hover:bg-red-50' : 'border-emerald-200 text-emerald-600 hover:bg-emerald-50'} transition-colors`}
                  >
                    {emp.status === 'ACTIVE' ? 'Block Login' : 'Unblock'}
                  </button>
                </td>
              </tr>
            ))}
            {employees.length === 0 && (
               <tr>
                 <td colSpan={5} className="p-8 text-center text-gray-500">No employees found.</td>
               </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
