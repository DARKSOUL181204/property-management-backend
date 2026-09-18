import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import StatCard from './ui/StatCard';
import { TrendingUp, Users, Wrench, Activity, Trash2 } from 'lucide-react';

const COLORS = ['#10b981', '#ef4444', '#3b82f6', '#f59e0b'];

export default function Dashboard() {
  const { propertyId } = useParams();
  const [analytics, setAnalytics] = useState<any>(null);
  const [properties, setProperties] = useState<any[]>([]);
  const [activePropertyId, setActivePropertyId] = useState(propertyId);
  const [newExpenseData, setNewExpenseData] = useState({ amount: '', category: 'MARKETING', expenseDate: new Date().toISOString().split('T')[0], type: 'INCREASE' });
  const [isLogging, setIsLogging] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    api.get('/properties').then(res => {
      setProperties(res.data);
      if (!activePropertyId && res.data.length > 0) setActivePropertyId(res.data[0].propertyId);
    });
  }, []);

  useEffect(() => {
    if (activePropertyId) {
      api.get(`/analytics/properties/${activePropertyId}/performance`)
         .then(res => setAnalytics(res.data))
         .catch(console.error);
    }
  }, [activePropertyId]);



  const handleResetExpenses = async () => {
    if (window.confirm("WARNING: Are you sure you want to completely reset ALL expenses for this property to zero? This action cannot be undone.")) {
      try {
        await api.delete(`/expenses/property/${activePropertyId}`);
        const res = await api.get(`/analytics/properties/${activePropertyId}/performance`);
        setAnalytics(res.data);
        setNotification(`All expenses for this property have been completely reset to ₹0.`);
        setTimeout(() => setNotification(null), 5000);
      } catch (err) {
        console.error("Failed to reset expenses", err);
      }
    }
  };

const handleQuickLog = async (e: any) => {
    e.preventDefault();
    if (!activePropertyId) return;
    
    const adjustmentAmount = Math.abs(parseFloat(newExpenseData.amount));
    
    if (newExpenseData.type === 'DECREASE') {
       const currentCategoryTotal = analytics.expenses.expensesByCategory[newExpenseData.category] || 0;
       if (currentCategoryTotal - adjustmentAmount < 0) {
          alert(`Error: You cannot decrease ${newExpenseData.category} expenses below ₹0. The current total is only ₹${currentCategoryTotal}.`);
          return;
       }
    }
    
    setIsLogging(true);
    try {
      const activeProp = properties.find((p: any) => p.propertyId === activePropertyId);
      await api.post('/expenses', {
         propertyPropertyId: activePropertyId,
         organizationOrganizationId: activeProp?.organizationOrganizationId,
         amount: newExpenseData.type === 'DECREASE' ? -Math.abs(parseFloat(newExpenseData.amount)) : Math.abs(parseFloat(newExpenseData.amount)),
         category: newExpenseData.category,
         expenseDate: newExpenseData.expenseDate
      });
            // Refetch analytics
      const res = await api.get(`/analytics/properties/${activePropertyId}/performance`);
      setAnalytics(res.data);
      setNewExpenseData({ amount: '', category: 'MARKETING', expenseDate: new Date().toISOString().split('T')[0], type: 'INCREASE' });
      
      const newProfit = res.data.profitability.netProfit;
      const newHealth = res.data.overallHealthScore;
      setNotification(`Budget Adjusted! New Net Profit: ₹${newProfit.toLocaleString()}. Property condition is now ${newHealth}.`);
      setTimeout(() => setNotification(null), 5000);
    } catch(err) {
      console.error(err);
    } finally {
      setIsLogging(false);
    }
  };

  if (!analytics) return <div className="text-center py-20 text-gray-500 animate-pulse">Loading Graphs...</div>;

const expenseData = Object.entries(analytics.expenses.expensesByCategory).map(([name, value]) => ({ name, value }));
  const occupancyData = [
    { name: 'Occupied', value: analytics.occupancy.occupiedUnits },
    { name: 'Vacant', value: analytics.occupancy.vacantUnits }
  ];
  
  const financialData = [
    { name: 'Total Revenue', value: analytics.profitability.totalRevenue, fill: '#10b981' },
    { name: 'Total Expenses', value: analytics.profitability.totalExpenses, fill: '#ef4444' },
    { name: 'Net Profit', value: analytics.profitability.netProfit, fill: '#3b82f6' }
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">Organization Dashboard</h1>
          <p className="text-gray-500 mt-1 text-sm">Real-time analytical graphs</p>
        </div>
        <select 
          className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg px-4 py-2 font-medium shadow-sm focus:ring-2 focus:ring-emerald-500 outline-none"
          value={activePropertyId} 
          onChange={(e) => setActivePropertyId(e.target.value)}
        >
          {properties.map((p: any) => <option key={p.propertyId} value={p.propertyId}>{p.name}</option>)}
        </select>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        <StatCard title="Health" value={analytics.overallHealthScore} icon={Activity} colorClass="bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40" />
        <StatCard title="Occupancy" value={`${analytics.occupancy.occupancyRate.toFixed(1)}%`} icon={Users} colorClass="bg-blue-100 text-blue-600 dark:bg-blue-900/40" />
                <StatCard title="Net Profit" value={`₹${analytics.profitability.netProfit.toLocaleString()}`} icon={TrendingUp} colorClass="bg-green-100 text-green-600 dark:bg-green-900/40" />
        <StatCard title="Build ROI %" value={analytics.profitability.roiPercentage !== undefined ? `${analytics.profitability.roiPercentage.toFixed(1)}%` : 'N/A'} icon={Activity} colorClass="bg-blue-100 text-blue-600 dark:bg-blue-900/40" />
        <StatCard title="Maintenance" value={analytics.maintenance.openRequests} icon={Wrench} colorClass="bg-red-100 text-red-600 dark:bg-red-900/40" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Expenses Breakdown</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={expenseData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" opacity={0.2} />
                <XAxis dataKey="name" tick={{fill: '#6b7280'}} axisLine={false} tickLine={false} />
                <YAxis tick={{fill: '#6b7280'}} axisLine={false} tickLine={false} tickFormatter={val => `₹${val}`} />
                <Tooltip cursor={{fill: 'rgba(0,0,0,0.05)'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)'}} />
                <Bar dataKey="value" fill="#10b981" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Occupancy Status</h3>
          <div className="h-64 flex justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={occupancyData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                  {occupancyData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)'}} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-6 mt-4">
             <div className="flex items-center"><div className="w-3 h-3 rounded-full bg-emerald-500 mr-2"></div><span className="text-sm text-gray-600 dark:text-gray-300">Occupied ({analytics.occupancy.occupiedUnits})</span></div>
             <div className="flex items-center"><div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div><span className="text-sm text-gray-600 dark:text-gray-300">Vacant ({analytics.occupancy.vacantUnits})</span></div>
          </div>

        </div>
      </div>

      <div className="mt-8 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Financial Summary (Revenue vs Expenses vs Profit)</h3>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={financialData} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#374151" opacity={0.2} />
                <XAxis type="number" tick={{fill: '#6b7280'}} axisLine={false} tickLine={false} tickFormatter={val => `₹${val}`} />
                <YAxis dataKey="name" type="category" tick={{fill: '#6b7280', fontWeight: 'bold'}} axisLine={false} tickLine={false} width={100} />
                <Tooltip cursor={{fill: 'rgba(0,0,0,0.05)'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px rgba(0,0,0,0.1)'}} formatter={(val: number) => [`₹${val.toLocaleString()}`, 'Amount']} />
                <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={40}>
                  {financialData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
      </div>

      <div className="mt-8 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
         <div className="flex justify-between items-center mb-4">
           <h3 className="text-lg font-bold text-gray-900 dark:text-white">Adjust Expense Budgets</h3>
           <button onClick={handleResetExpenses} className="flex items-center text-sm font-bold text-red-600 bg-red-50 dark:bg-red-900/30 dark:text-red-400 px-3 py-1.5 rounded-lg border border-red-200 dark:border-red-800 hover:bg-red-100 transition focus:outline-none focus:ring-4 focus:ring-red-500/50">
             <Trash2 size={16} className="mr-1"/> Reset All Expenses
           </button>
         </div>
         <form onSubmit={handleQuickLog} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
            <div>
               <label className="block text-sm font-medium mb-1 dark:text-gray-300">Action</label>
               <select value={newExpenseData.type} onChange={e => setNewExpenseData({...newExpenseData, type: e.target.value})} className="w-full border rounded-lg p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-bold">
                 <option value="INCREASE">Increase (+)</option>
                 <option value="DECREASE">Decrease (-)</option>
               </select>
            </div>
            <div>
               <label className="block text-sm font-medium mb-1 dark:text-gray-300">Category</label>
               <select value={newExpenseData.category} onChange={e => setNewExpenseData({...newExpenseData, category: e.target.value})} className="w-full border rounded-lg p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500">
                 <option value="MARKETING">Marketing</option>
                 <option value="MAINTENANCE">Maintenance</option>
                 <option value="UTILITY">Utility</option>
                 <option value="TAXES">Taxes</option>
                 <option value="LEGAL">Legal</option>
               </select>
            </div>
            <div>
               <label className="block text-sm font-medium mb-1 dark:text-gray-300">Amount (₹)</label>
               <input required type="number" step="0.01" min="0" value={newExpenseData.amount} onChange={e => setNewExpenseData({...newExpenseData, amount: e.target.value})} className="w-full border rounded-lg p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500" placeholder="e.g. 5000" />
            </div>
            <div>
               <label className="block text-sm font-medium mb-1 dark:text-gray-300">Date</label>
               <input required type="date" value={newExpenseData.expenseDate} onChange={e => setNewExpenseData({...newExpenseData, expenseDate: e.target.value})} className="w-full border rounded-lg p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500" />
            </div>
            <button type="submit" disabled={isLogging} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-lg transition focus:outline-none focus:ring-4 focus:ring-emerald-500/50 disabled:opacity-50">
               {isLogging ? 'Applying...' : 'Apply Adjustment'}
            </button>
         </form>
      </div>
      {notification && (
        <div className="fixed bottom-4 right-4 bg-gray-900 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 z-50 animate-bounce">
          <Activity size={20} className="text-emerald-400" />
          <span className="font-medium">{notification}</span>
        </div>
      )}
    </motion.div>

  );
}
