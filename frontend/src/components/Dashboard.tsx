import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import StatCard from './ui/StatCard';
import { TrendingUp, Users, Wrench, Activity } from 'lucide-react';

const COLORS = ['#10b981', '#ef4444', '#3b82f6', '#f59e0b'];

export default function Dashboard() {
  const { propertyId } = useParams();
  const [analytics, setAnalytics] = useState<any>(null);
  const [properties, setProperties] = useState<any[]>([]);
  const [activePropertyId, setActivePropertyId] = useState(propertyId);

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

  if (!analytics) return <div className="text-center py-20 text-gray-500 animate-pulse">Loading Graphs...</div>;

  const expenseData = Object.entries(analytics.expenses.expensesByCategory).map(([name, value]) => ({ name, value }));
  const occupancyData = [
    { name: 'Occupied', value: analytics.occupancy.occupiedUnits },
    { name: 'Vacant', value: analytics.occupancy.vacantUnits }
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

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard title="Health" value={analytics.overallHealthScore} icon={Activity} colorClass="bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40" />
        <StatCard title="Occupancy" value={`${analytics.occupancy.occupancyRate.toFixed(1)}%`} icon={Users} colorClass="bg-blue-100 text-blue-600 dark:bg-blue-900/40" />
        <StatCard title="Net Profit" value={`$${analytics.profitability.netProfit.toLocaleString()}`} icon={TrendingUp} colorClass="bg-green-100 text-green-600 dark:bg-green-900/40" />
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
                <YAxis tick={{fill: '#6b7280'}} axisLine={false} tickLine={false} tickFormatter={val => `$${val}`} />
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
    </motion.div>
  );
}
