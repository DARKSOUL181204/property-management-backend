import { motion } from 'framer-motion';
export default function StatCard({ title, value, subtitle, icon: Icon, colorClass }: any) {
  return (
    <motion.div whileHover={{ scale: 1.02 }} className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-md p-6 border border-gray-100 dark:border-gray-700 transition-all">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-gray-500 dark:text-gray-400 font-medium">{title}</h3>
        <div className={`p-2 rounded-xl ${colorClass}`}>
          <Icon size={20} />
        </div>
      </div>
      <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{value}</p>
      {subtitle && <p className="text-sm text-gray-500 dark:text-gray-400">{subtitle}</p>}
    </motion.div>
  );
}
