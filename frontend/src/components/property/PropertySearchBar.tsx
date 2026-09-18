import { Search, Filter } from 'lucide-react';
export default function PropertySearchBar({ search, setSearch, filter, setFilter }: any) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-8">
      <div className="relative flex-1">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20}/>
        <input 
          type="text" 
          placeholder="Search properties by name or address..." 
          className="w-full pl-12 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>
      <div className="relative w-full sm:w-48">
        <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20}/>
        <select 
          className="w-full pl-12 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none cursor-pointer"
          value={filter}
          onChange={e => setFilter(e.target.value)}
        >
          <option value="ALL">All Types</option>
          <option value="RESIDENTIAL">Residential</option>
          <option value="COMMERCIAL">Commercial</option>
        </select>
      </div>
    </div>
  );
}
