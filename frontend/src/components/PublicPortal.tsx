import { useState, useEffect } from 'react';
import { Search, MapPin, Building2, ChevronDown, IndianRupee, Map, ShieldCheck, UserCircle2, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api';
import PropertyCard from './property/PropertyCard';
import { useNavigate } from 'react-router-dom';

const CITIES = ['Bangalore', 'Mumbai', 'Hyderabad', 'Pune', 'Chennai', 'New Delhi'];
const BUDGETS = ['ALL', 'Under 50 Lac', '50 Lac - 1 Cr', '1 Cr - 2 Cr', 'Above 2 Cr'];
const TABS = ['Buy', 'Rent', 'Commercial', 'PG / Co-living'];

export default function PublicPortal() {
  const [activeTab, setActiveTab] = useState('Buy');
  const [activeCityTab, setActiveCityTab] = useState('Bangalore');
  const [search, setSearch] = useState('');
  const [budget, setBudget] = useState('ALL');
  const [properties, setProperties] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch real properties from the backend
    const temp = api.defaults.headers.common['Authorization'];
    delete api.defaults.headers.common['Authorization'];
    api.get('/properties').then(res => setProperties(res.data)).finally(() => {
        if(temp) api.defaults.headers.common['Authorization'] = temp;
    });
  }, []);

  const isSearching = search.trim() !== '' || budget !== 'ALL' || activeTab !== 'Buy';

  const filteredProperties = properties.filter((p: any) => {
    // Basic text search on name or description
    const matchesSearch = search.trim() === '' || 
      (p.name?.toLowerCase().includes(search.toLowerCase()) || 
       p.description?.toLowerCase().includes(search.toLowerCase()));

    // Tab filtering
    let matchesTab = true;
    if (activeTab === 'Rent') matchesTab = p.transactionType === 'RENT';
    else if (activeTab === 'Buy') matchesTab = p.transactionType === 'BUY' || !p.transactionType;
    else if (activeTab === 'Commercial') matchesTab = p.propertyType === 'COMMERCIAL';
    else if (activeTab === 'PG / Co-living') matchesTab = p.transactionType === 'PG';

    // (In a real app, Budget filtering would go here based on a numeric price)
    // We mock budget filtering as simply 'true' for UI demonstration since prices are hashed in UI currently

    return matchesSearch && matchesTab;
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      
      {/* Navigation */}
      <nav className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-100 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex justify-between items-center h-20">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => {setSearch(''); setActiveTab('Buy');}}>
            <Building2 className="text-blue-600 dark:text-blue-500 h-8 w-8" />
            <span className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Enclave</span>
          </div>
          <div className="hidden md:flex items-center gap-8 font-semibold text-sm">
            {TABS.map(tab => (
              <a key={tab} href="#" onClick={(e) => {e.preventDefault(); setActiveTab(tab);}} className={`${activeTab === tab ? 'text-blue-600' : 'text-gray-600 hover:text-blue-600 dark:text-gray-300'}`}>{tab}</a>
            ))}
          </div>
          <div className="flex items-center gap-4">
             <button onClick={() => navigate('/login')} className="text-sm font-bold text-gray-700 dark:text-gray-200 hover:text-blue-600">Login</button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative pt-20 pb-32 flex items-center justify-center min-h-[60vh] overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=2000&q=80" className="w-full h-full object-cover" alt="Hero background" />
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900/90 to-gray-900/40"></div>
        </div>

        <div className="relative z-10 w-full max-w-5xl px-4 flex flex-col items-center text-center">
          <h1 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight leading-tight">
            Find your next <span className="text-blue-400">perfect</span> home
          </h1>
          <p className="text-lg md:text-xl text-gray-300 mb-12 max-w-2xl font-medium">
            Discover thousands of premium properties for sale and rent across India's top cities.
          </p>

          {/* Search Box */}
          <div className="w-full bg-white dark:bg-gray-800 rounded-3xl p-4 shadow-2xl">
            {/* Tabs */}
            <div className="flex gap-2 mb-4 border-b border-gray-100 dark:border-gray-700 pb-3 px-2 overflow-x-auto whitespace-nowrap">
              {TABS.map(tab => (
                <button 
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-5 py-2 rounded-full text-sm font-bold transition-all ${activeTab === tab ? 'bg-blue-600 text-white shadow-md' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Inputs */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <div className="col-span-1 relative flex items-center bg-gray-50 dark:bg-gray-900 rounded-2xl px-4 py-3 border border-gray-200 dark:border-gray-700">
                <MapPin className="text-blue-500 mr-3 shrink-0" size={20}/>
                <select value={activeCityTab} onChange={(e) => setActiveCityTab(e.target.value)} className="bg-transparent outline-none w-full cursor-pointer text-gray-900 dark:text-white font-semibold appearance-none">
                  {CITIES.map(c => <option key={c} value={c} className="text-black">{c}</option>)}
                </select>
                <ChevronDown size={16} className="text-gray-400 pointer-events-none"/>
              </div>

              <div className="col-span-1 relative flex items-center bg-gray-50 dark:bg-gray-900 rounded-2xl px-4 py-3 border border-gray-200 dark:border-gray-700">
                <IndianRupee className="text-blue-500 mr-3 shrink-0" size={20}/>
                <select value={budget} onChange={(e) => setBudget(e.target.value)} className="bg-transparent outline-none w-full cursor-pointer text-gray-900 dark:text-white font-semibold appearance-none">
                  {BUDGETS.map(b => <option key={b} value={b} className="text-black">{b}</option>)}
                </select>
                <ChevronDown size={16} className="text-gray-400 pointer-events-none"/>
              </div>

              <div className="col-span-1 md:col-span-2 relative flex flex-col md:flex-row items-center gap-3">
                <div className="w-full relative flex items-center bg-gray-50 dark:bg-gray-900 rounded-2xl px-4 py-3 border border-gray-200 dark:border-gray-700">
                  <Search className="text-blue-500 mr-3 shrink-0" size={20}/>
                  <input 
                    type="text" 
                    placeholder="Search localities or projects..." 
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="bg-transparent outline-none w-full text-gray-900 dark:text-white placeholder-gray-400 font-medium"
                  />
                </div>
                
                <button className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-black transition-all shadow-lg shadow-blue-600/30">
                  Search
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        
        {isSearching && (
           <div className="mb-8 flex justify-between items-end">
             <div>
               <h2 className="text-2xl font-black text-gray-900 dark:text-white">Search Results</h2>
               <p className="text-gray-500 mt-2 font-medium">Found {filteredProperties.length} properties matching your criteria.</p>
             </div>
             <button onClick={() => { setSearch(''); setActiveTab('Buy'); setBudget('ALL'); }} className="text-blue-600 font-bold hover:bg-blue-50 px-4 py-2 rounded-lg transition text-sm">
               Clear Filters
             </button>
           </div>
        )}

        {!isSearching && (
          <div className="mb-10 flex justify-between items-end">
            <div>
              <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Featured Collections</h2>
              <p className="text-gray-500 mt-2 font-medium">Handpicked properties just for you in {activeCityTab}</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <AnimatePresence>
             {filteredProperties.map((p: any) => (
                <PropertyCard key={p.propertyId} property={p} isPublic={true} selectedCity={activeCityTab} />
             ))}
          </AnimatePresence>
        </div>

        {filteredProperties.length === 0 && (
           <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm mt-8">
             <Search size={48} className="mx-auto text-gray-300 mb-4" />
             <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No properties found</h3>
             <p className="text-gray-500 font-medium">Try adjusting your filters or search terms to find what you're looking for.</p>
             <button onClick={() => { setSearch(''); setActiveTab('Buy'); setBudget('ALL'); }} className="mt-6 bg-blue-50 text-blue-600 px-6 py-2.5 rounded-xl font-bold hover:bg-blue-100 transition">
               Reset Search
             </button>
           </div>
        )}
      </div>

    </div>
  );
}
