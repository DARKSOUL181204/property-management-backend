import { useState, useEffect } from "react";
import {
  Search,
  MapPin,
  Building2,
  ChevronDown,
  IndianRupee,
  Map,
  ShieldCheck,
  UserCircle2,
  ArrowRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../api";
import PropertyCard from "./property/PropertyCard";
import HorizontalSlider from "./ui/HorizontalSlider";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { Moon, Sun, Laptop } from "lucide-react";

const CITIES = [
  "All Cities",
  "Bangalore",
  "Mumbai",
  "Hyderabad",
  "Pune",
  "Chennai",
  "New Delhi",
  "Thane",
];
const BUDGETS = [
  "ALL",
  "Under 50 Lac",
  "50 Lac - 1 Cr",
  "1 Cr - 2 Cr",
  "Above 2 Cr",
];
const TABS = ["Buy", "Rent", "Commercial", "PG / Co-living"];

export const LOCATION_MAP: any = {
  Bangalore: [
    "Whitefield",
    "Sarjapur Road",
    "Electronic City",
    "HSR Layout",
    "JP Nagar",
  ],
  Mumbai: ["Bandra West", "Andheri East", "Powai", "Juhu"],
  Hyderabad: ["Banjara Hills", "Jubilee Hills", "HITEC City", "Kondapur"],
  Thane: ["Majiwada", "Kolshet Road", "Vartak Nagar", "Ghodbunder Road"],
  Chennai: ["Kovur", "Kelambakkam", "Egmore", "Grand Southern Trunk Road"],
  Pune: ["Koregaon Park", "Hinjewadi", "Viman Nagar", "Wakad"],
  "New Delhi": ["Vasant Kunj", "Hauz Khas", "Dwarka", "Rohini"],
};

export default function PublicPortal() {
  const [activeTab, setActiveTab] = useState("Buy");
  const [activeCityTab, setActiveCityTab] = useState("All Cities");
  const [search, setSearch] = useState("");
  const [budget, setBudget] = useState("ALL");
  const [properties, setProperties] = useState<any[]>([]);
  const [isScrolled, setIsScrolled] = useState(false);

  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState("");
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "system");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        setIsLoggedIn(true);
        setUserRole(decoded.role || "USER");
      } catch (e) {}
    }
  }, []);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";
      root.classList.add(systemTheme);
    } else {
      root.classList.add(theme);
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 350);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const temp = api.defaults.headers.common["Authorization"];
    delete api.defaults.headers.common["Authorization"];
    api
      .get("/properties")
      .then((res) => setProperties(res.data))
      .finally(() => {
        if (temp) api.defaults.headers.common["Authorization"] = temp;
      });
  }, []);

  const isSearching =
    search.trim() !== "" || budget !== "ALL" || activeCityTab !== "All Cities";

  const filteredProperties = properties.filter((p: any) => {
    const matchesSearch =
      search.trim() === "" ||
      p.name?.toLowerCase().includes(search.toLowerCase()) ||
      p.description?.toLowerCase().includes(search.toLowerCase());

    const matchesCity =
      activeCityTab === "All Cities" ||
      (p.description && p.description.includes(activeCityTab));

    let matchesTab = true;
    if (activeTab === "Rent") matchesTab = p.transactionType === "RENT";
    else if (activeTab === "Buy")
      matchesTab = p.transactionType === "BUY" || !p.transactionType;
    else if (activeTab === "Commercial")
      matchesTab = p.propertyType === "COMMERCIAL";
    else if (activeTab === "PG / Co-living")
      matchesTab = p.transactionType === "PG";

    return matchesSearch && matchesTab && matchesCity;
  });

  const handleFooterLinkClick = (locality: string, tab: string) => {
    setActiveTab(tab);
    setSearch(locality);
    if (activeCityTab === "All Cities") {
      // if clicked from footer but city was All, try to infer city
      const foundCity = Object.keys(LOCATION_MAP).find((city) =>
        LOCATION_MAP[city].includes(locality),
      );
      if (foundCity) setActiveCityTab(foundCity);
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const currentLocalities = LOCATION_MAP[activeCityTab] || [];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
      {/* Sleek Navigation with Integrated Sticky Search */}
      <nav
        className={`bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl sticky top-0 z-50 transition-all duration-300 border-slate-200/50 dark:border-slate-800/50 ${isScrolled ? "border-b shadow-sm py-2" : "border-b py-0"}`}
      >
        <div
          className={`max-w-7xl mx-auto px-4 sm:px-6 flex justify-between items-center transition-all duration-300 ${isScrolled ? "h-14" : "h-16"}`}
        >
          <div
            className="flex items-center gap-2 cursor-pointer shrink-0"
            onClick={() => {
              setSearch("");
              setActiveTab("Buy");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          >
            <Building2 className="text-blue-600 dark:text-blue-500 h-7 w-7" />
            <span className="text-xl font-black text-slate-900 dark:text-white tracking-tight hidden sm:block">
              Enclave
            </span>
          </div>

          {/* Sticky Mini Search Bar - appears only when scrolled */}
          <div
            className={`flex-1 max-w-2xl mx-4 transition-all duration-500 transform ${isScrolled ? "opacity-100 translate-y-0 visible" : "opacity-0 -translate-y-4 invisible absolute"}`}
          >
            <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-full px-4 py-1.5 border border-slate-200 dark:border-slate-700 shadow-inner">
              <Search size={16} className="text-slate-400 mr-2 shrink-0" />
              <input
                type="text"
                placeholder="Search localities..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-transparent outline-none w-full text-sm font-medium text-slate-900 dark:text-white placeholder-slate-400"
              />
              <div className="w-px h-4 bg-slate-300 dark:bg-slate-600 mx-3 hidden md:block"></div>
              <select
                value={activeCityTab}
                onChange={(e) => setActiveCityTab(e.target.value)}
                className="bg-transparent outline-none text-sm font-bold text-slate-700 dark:text-slate-300 cursor-pointer hidden md:block max-w-[100px]"
              >
                {CITIES.map((c) => (
                  <option key={`mini-${c}`} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center gap-4 shrink-0">
            <button
              onClick={() => navigate("/login")}
              className="text-sm font-bold text-slate-700 dark:text-slate-200 hover:text-blue-600 transition-colors"
            >
              Login / Register
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative pt-16 pb-28 flex items-center justify-center min-h-[50vh] overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=2000&q=80"
            className="w-full h-full object-cover"
            alt="Hero background"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/95 via-slate-900/70 to-slate-900/40"></div>
        </div>

        <div className="relative z-10 w-full max-w-4xl px-4 flex flex-col items-center text-center mt-8">
          <h1 className="text-5xl md:text-6xl font-black text-white mb-6 tracking-tight leading-tight">
            Find your{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
              perfect
            </span>{" "}
            home
          </h1>
          <p className="text-lg text-slate-300 mb-10 max-w-2xl font-medium">
            Discover premium properties for sale and rent across India's top
            cities.
          </p>

          {/* Slim & Sleek Search Box */}
          <div
            className={`w-full bg-white/10 dark:bg-slate-800/50 backdrop-blur-xl rounded-2xl p-2 md:p-3 shadow-2xl border border-white/20 dark:border-slate-700/50 transition-opacity duration-300 ${isScrolled ? "opacity-0 pointer-events-none" : "opacity-100"}`}
          >
            {/* Integrated Tabs */}
            <div className="flex gap-1 mb-2 px-1 overflow-x-auto whitespace-nowrap no-scrollbar">
              {TABS.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${activeTab === tab ? "bg-white text-slate-900 shadow-sm" : "text-slate-200 hover:bg-white/10"}`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Inputs - Slimmer heights (py-2 instead of py-3) */}
            <div className="bg-white dark:bg-slate-900 rounded-xl flex flex-col md:flex-row shadow-inner overflow-hidden border border-slate-200 dark:border-slate-800">
              <div className="flex-1 relative flex items-center px-4 py-2 border-b md:border-b-0 md:border-r border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                <MapPin className="text-blue-500 mr-2 shrink-0" size={16} />
                <select
                  value={activeCityTab}
                  onChange={(e) => setActiveCityTab(e.target.value)}
                  className="bg-transparent outline-none w-full cursor-pointer text-slate-900 dark:text-white font-semibold text-sm appearance-none"
                >
                  {CITIES.map((c) => (
                    <option key={c} value={c} className="text-black">
                      {c}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={14}
                  className="text-slate-400 pointer-events-none"
                />
              </div>

              <div className="flex-1 relative flex items-center px-4 py-2 border-b md:border-b-0 md:border-r border-slate-100 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                <IndianRupee
                  className="text-emerald-500 mr-2 shrink-0"
                  size={16}
                />
                <select
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  className="bg-transparent outline-none w-full cursor-pointer text-slate-900 dark:text-white font-semibold text-sm appearance-none"
                >
                  {BUDGETS.map((b) => (
                    <option key={b} value={b} className="text-black">
                      {b}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={14}
                  className="text-slate-400 pointer-events-none"
                />
              </div>

              <div className="flex-[2] relative flex items-center px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                <Search className="text-blue-500 mr-2 shrink-0" size={16} />
                <input
                  type="text"
                  placeholder="Search localities or projects..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="bg-transparent outline-none w-full text-slate-900 dark:text-white placeholder-slate-400 font-medium text-sm"
                />
              </div>

              <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2 font-bold transition-all text-sm m-1 rounded-lg shadow-md hover:shadow-lg shrink-0">
                Search
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        {isSearching ? (
          <>
            <div className="mb-8 flex justify-between items-end">
              <div>
                <h2 className="text-2xl font-black text-slate-900 dark:text-white">
                  Search Results
                </h2>
                <p className="text-slate-500 mt-1 font-medium text-sm">
                  Found {filteredProperties.length} properties matching your
                  criteria.
                </p>
              </div>
              <button
                onClick={() => {
                  setSearch("");
                  setActiveTab("Buy");
                  setBudget("ALL");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="text-blue-600 font-bold hover:bg-blue-50 px-4 py-2 rounded-lg transition text-sm"
              >
                Clear Filters
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              <AnimatePresence>
                {filteredProperties.map((p: any) => (
                  <PropertyCard
                    key={`search-${p.propertyId}`}
                    property={p}
                    isPublic={true}
                    selectedCity={activeCityTab}
                  />
                ))}
              </AnimatePresence>
            </div>

            {filteredProperties.length === 0 && (
              <div className="text-center py-20 bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm mt-8">
                <Search size={48} className="mx-auto text-slate-300 mb-4" />
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                  No properties found
                </h3>
                <p className="text-slate-500 font-medium text-sm">
                  Try adjusting your filters or search terms.
                </p>
                <button
                  onClick={() => {
                    setSearch("");
                    setActiveTab("Buy");
                    setBudget("ALL");
                  }}
                  className="mt-6 bg-blue-50 text-blue-600 px-6 py-2 rounded-lg font-bold hover:bg-blue-100 transition text-sm"
                >
                  Reset Search
                </button>
              </div>
            )}
          </>
        ) : (
          <>
            <HorizontalSlider
              title={`Featured in ${activeCityTab}`}
              actionText="View All"
            >
              {filteredProperties.slice(0, 8).map((p: any) => (
                <div
                  key={`featured-${p.propertyId}`}
                  className="min-w-[300px] max-w-[320px]"
                >
                  <PropertyCard
                    property={p}
                    isPublic={true}
                    selectedCity={activeCityTab}
                  />
                </div>
              ))}
              {filteredProperties.length === 0 && (
                <p className="text-slate-500 italic px-4 py-8 text-sm">
                  No featured properties in {activeCityTab} for this category.
                </p>
              )}
            </HorizontalSlider>

            <HorizontalSlider title="Sponsored Properties" actionText="Explore">
              {[...properties]
                .reverse()
                .slice(0, 8)
                .map((p: any, idx: number) => (
                  <div
                    key={`spon-${p.propertyId}`}
                    className="min-w-[300px] max-w-[320px] relative"
                  >
                    <div className="absolute top-2 right-2 z-10 bg-gradient-to-r from-amber-200 to-yellow-400 text-yellow-900 text-[10px] font-black px-2 py-0.5 rounded shadow-sm uppercase tracking-widest">
                      Sponsored
                    </div>
                    <PropertyCard
                      property={p}
                      isPublic={true}
                      selectedCity={CITIES[idx % CITIES.length]}
                    />
                  </div>
                ))}
            </HorizontalSlider>

            <HorizontalSlider title="Discover Pan India" actionText="View Map">
              {properties.slice(0, 10).map((p: any, idx: number) => (
                <div
                  key={`all-${p.propertyId}`}
                  className="min-w-[300px] max-w-[320px]"
                >
                  <PropertyCard
                    property={p}
                    isPublic={true}
                    selectedCity={CITIES[(idx + 2) % CITIES.length]}
                  />
                </div>
              ))}
            </HorizontalSlider>
          </>
        )}
      </div>

      {/* Dynamic Footer Area */}
      <footer className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 mt-12 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-8">
            Popular Localities in {activeCityTab}
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="flex flex-col gap-3">
              <h4 className="font-bold text-slate-900 dark:text-white mb-2 text-sm uppercase tracking-wider">
                Properties for Sale
              </h4>
              {currentLocalities.map((loc: string) => (
                <button
                  key={`sale-${loc}`}
                  onClick={() => handleFooterLinkClick(loc, "Buy")}
                  className="text-left text-sm font-medium text-slate-500 hover:text-blue-600 transition-colors"
                >
                  Flats for Sale in {loc}
                </button>
              ))}
            </div>
            <div className="flex flex-col gap-3">
              <h4 className="font-bold text-slate-900 dark:text-white mb-2 text-sm uppercase tracking-wider">
                Properties for Rent
              </h4>
              {currentLocalities.map((loc: string) => (
                <button
                  key={`rent-${loc}`}
                  onClick={() => handleFooterLinkClick(loc, "Rent")}
                  className="text-left text-sm font-medium text-slate-500 hover:text-blue-600 transition-colors"
                >
                  Flats for Rent in {loc}
                </button>
              ))}
            </div>
            <div className="flex flex-col gap-3">
              <h4 className="font-bold text-slate-900 dark:text-white mb-2 text-sm uppercase tracking-wider">
                Commercial Spaces
              </h4>
              {currentLocalities.map((loc: string) => (
                <button
                  key={`comm-${loc}`}
                  onClick={() => handleFooterLinkClick(loc, "Commercial")}
                  className="text-left text-sm font-medium text-slate-500 hover:text-blue-600 transition-colors"
                >
                  Commercial space in {loc}
                </button>
              ))}
            </div>
            <div className="flex flex-col gap-3">
              <h4 className="font-bold text-slate-900 dark:text-white mb-2 text-sm uppercase tracking-wider">
                PG / Co-living
              </h4>
              {currentLocalities.map((loc: string) => (
                <button
                  key={`pg-${loc}`}
                  onClick={() => handleFooterLinkClick(loc, "PG / Co-living")}
                  className="text-left text-sm font-medium text-slate-500 hover:text-blue-600 transition-colors"
                >
                  PG in {loc}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center relative overflow-hidden pb-10">
          {/* Crazy glowing text */}
          <div className="relative w-full flex justify-center py-10 my-4">
            <div className="absolute inset-0 bg-blue-500/20 dark:bg-blue-500/30 blur-[100px] rounded-full pointer-events-none transform scale-150"></div>
            <h1 className="text-[14vw] font-black leading-none tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-slate-800 to-slate-400 dark:from-white dark:to-slate-800 drop-shadow-[0_0_30px_rgba(59,130,246,0.3)] z-10 select-none text-center">
              ENCLAVE
            </h1>
          </div>

          <div className="w-full flex flex-col md:flex-row items-center justify-between z-20 px-4 mt-8">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20">
                <Building2 size={18} className="text-white" />
              </div>
              <span className="font-bold text-lg tracking-tight text-slate-700 dark:text-slate-300">
                Property Management
              </span>
            </div>

            <div className="flex items-center gap-2 bg-white/50 dark:bg-slate-800/80 backdrop-blur-md p-1.5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
              <button
                onClick={() => setTheme("light")}
                className={`p-2 rounded-lg transition-all ${theme === "light" ? "bg-white shadow-md dark:bg-slate-700 text-blue-600 dark:text-blue-400" : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"}`}
              >
                <Sun size={18} />
              </button>
              <button
                onClick={() => setTheme("dark")}
                className={`p-2 rounded-lg transition-all ${theme === "dark" ? "bg-white shadow-md dark:bg-slate-700 text-blue-600 dark:text-blue-400" : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"}`}
              >
                <Moon size={18} />
              </button>
              <button
                onClick={() => setTheme("system")}
                className={`p-2 rounded-lg transition-all ${theme === "system" ? "bg-white shadow-md dark:bg-slate-700 text-blue-600 dark:text-blue-400" : "text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"}`}
              >
                <Laptop size={18} />
              </button>
            </div>

            <div className="text-sm text-slate-500 font-medium mt-6 md:mt-0">
              &copy; {new Date().getFullYear()} ENCLAVE. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
