import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import api from "../api";
import {
  MapPin,
  Bed,
  Bath,
  ArrowLeft,
  Download,
  ShieldCheck,
  CheckCircle2,
  UserCircle2,
  X,
} from "lucide-react";

export default function PublicPropertyDetails() {
  const { propertyId } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState<any>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState("USER");
  const [showPhone, setShowPhone] = useState(false);
  const [showLightbox, setShowLightbox] = useState(false);

  useEffect(() => {
    // Check if the user is authenticated
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
      try {
        const decoded: any = jwtDecode(token);
        setUserRole(decoded.role || "USER");
      } catch (e) {}
    }

    // Temporarily remove auth header for public fetch
    const temp = api.defaults.headers.common["Authorization"];
    delete api.defaults.headers.common["Authorization"];
    api
      .get(`/properties/${propertyId}`)
      .then((res) => setProperty(res.data))
      .finally(() => {
        if (temp) api.defaults.headers.common["Authorization"] = temp;
      });
  }, [propertyId]);

  if (!property)
    return (
      <div className="p-20 text-center animate-pulse text-gray-500">
        Loading Property...
      </div>
    );

  const hash = parseInt(propertyId!.substring(0, 8), 16);
  const price = hash % 2 === 0 ? `₹1.55 Cr` : `₹65 Lac`;
  const sqft = 1194 + (hash % 500);
  const ownerName = property.organization?.name || "Enclave Verified Owner";

  const handleContactClick = () => {
    if (!isLoggedIn) {
      navigate(`/login?redirect=/p/${propertyId}`);
    } else {
      setShowPhone(true);
    }
  };

  const images = [
    "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80",
    "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1200&q=80",
    "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=1200&q=80",
    "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200&q=80",
    "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&q=80",
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex justify-between items-center">
          <Link
            to="/"
            className="text-2xl font-black text-blue-600 dark:text-blue-500 tracking-tight"
          >
            Enclave
          </Link>
          {!isLoggedIn ? (
            <Link
              to={`/login?redirect=/p/${propertyId}`}
              className="text-sm font-semibold text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
            >
              Login / Register
            </Link>
          ) : (
            <div className="flex gap-4">
              <Link
                to={userRole === "USER" ? "/portal" : "/dashboard"}
                className="text-sm font-semibold text-blue-600 dark:text-blue-400 flex items-center"
              >
                {userRole === "USER" ? "My Portal" : "Dashboard"}
              </Link>
            </div>
          )}
        </div>
      </nav>

      {/* Lightbox Modal */}
      {showLightbox && (
        <div className="fixed inset-0 z-50 bg-black/95 flex flex-col items-center justify-center p-4">
          <button
            onClick={() => setShowLightbox(false)}
            className="absolute top-6 right-6 text-white hover:text-gray-300"
          >
            <X size={32} />
          </button>
          <div className="w-full max-w-5xl h-[80vh] overflow-y-auto flex flex-col gap-4 no-scrollbar pb-10">
            {images.map((img, idx) => (
              <img
                key={idx}
                src={img}
                className="w-full h-auto rounded-xl object-contain bg-black"
                alt={`Gallery ${idx}`}
              />
            ))}
          </div>
          <p className="text-white text-sm absolute bottom-6">
            Scroll to view all {images.length} photos
          </p>
        </div>
      )}

      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6">
        <Link
          to="/"
          className="text-gray-500 hover:text-blue-600 mb-6 inline-flex items-center text-sm font-medium transition-colors"
        >
          <ArrowLeft size={16} className="mr-1" /> Back to Search
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Area */}
          <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden p-6 md:p-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start border-b border-gray-100 dark:border-gray-700 pb-6 mb-6">
              <div>
                <div className="flex items-center gap-4 mb-2">
                  <h1 className="text-3xl font-black text-gray-900 dark:text-white">
                    {price}
                  </h1>
                  <span className="text-sm text-blue-600 bg-blue-50 dark:bg-blue-900/30 px-3 py-1 rounded-full font-medium">
                    EMI available
                  </span>
                </div>
                <h2 className="text-xl text-gray-700 dark:text-gray-200 font-bold mb-1">
                  {property.name} - 3 BHK {sqft} Sqft Flat For Sale
                </h2>
                <p className="text-gray-500 flex items-center text-sm">
                  <MapPin size={16} className="mr-1 text-blue-500" /> Premium
                  Location
                </p>
              </div>
              <div className="mt-4 md:mt-0 flex flex-col items-end">
                <span className="bg-green-50 text-green-700 border border-green-200 px-4 py-1.5 rounded-full text-xs font-black flex items-center shadow-sm">
                  <ShieldCheck size={16} className="mr-1" /> RERA VERIFIED
                </span>
              </div>
            </div>

            {/* Photo Gallery Grid */}
            <div className="grid grid-cols-4 grid-rows-2 gap-2 h-[300px] md:h-[450px] mb-8 relative rounded-xl overflow-hidden">
              <div
                className="col-span-3 row-span-2 relative cursor-pointer"
                onClick={() => setShowLightbox(true)}
                role="button"
                aria-label="View photo gallery"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter") setShowLightbox(true);
                }}
              >
                <img
                  src={property.imageUrl || images[0]}
                  alt={`${property.name} front view`}
                  className="w-full h-full object-cover hover:scale-105 transition duration-700"
                />
              </div>
              <div
                className="col-span-1 row-span-1 overflow-hidden cursor-pointer"
                onClick={() => setShowLightbox(true)}
                aria-hidden="true"
              >
                <img
                  src={images[1]}
                  alt=""
                  className="w-full h-full object-cover hover:scale-110 transition duration-700"
                />
              </div>
              <div
                className="col-span-1 row-span-1 relative overflow-hidden cursor-pointer"
                onClick={() => setShowLightbox(true)}
                aria-hidden="true"
              >
                <img
                  src={images[2]}
                  alt=""
                  className="w-full h-full object-cover opacity-60"
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white font-bold bg-black/40 hover:bg-black/50 transition">
                  <span className="text-xl">+{images.length - 3}</span>
                  <span className="text-xs">Photos</span>
                </div>
              </div>

              {/* Overlay Info Strip */}
              <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-md rounded-lg px-6 py-3 flex gap-6 text-sm font-bold shadow-xl text-gray-800 border border-gray-100">
                <span className="flex items-center">
                  <Bed
                    size={18}
                    className="mr-2 text-blue-600"
                    aria-hidden="true"
                  />{" "}
                  3 Beds
                </span>
                <span className="flex items-center">
                  <Bath
                    size={18}
                    className="mr-2 text-blue-600"
                    aria-hidden="true"
                  />{" "}
                  2 Baths
                </span>
                <span className="flex items-center border-l-2 pl-6 border-gray-200">
                  Semi-Furnished
                </span>
              </div>
            </div>

            {/* Property Description */}
            <section aria-labelledby="property-description">
              <h3
                id="property-description"
                className="text-xl font-bold text-gray-900 dark:text-white mb-4"
              >
                About this Property
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-8 whitespace-pre-wrap">
                {property.description ||
                  `Experience luxury living at its finest in ${property.name}. This stunning ${sqft} sqft property offers panoramic views, state-of-the-art amenities, and unparalleled convenience. Designed with meticulous attention to detail, the spaces are bathed in natural light, featuring premium fittings, modular kitchens, and spacious balconies. Perfect for families looking for an elegant lifestyle upgrade in the heart of the city.`}
              </p>
            </section>

            {/* Features Grid */}
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 border-b border-gray-100 dark:border-gray-700 pb-2">
              Property Details
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-y-8 gap-x-6">
              <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-100 dark:border-gray-700">
                <p className="text-gray-500 dark:text-gray-400 text-xs mb-1 uppercase tracking-wider font-semibold">
                  Carpet Area
                </p>
                <p className="font-bold text-gray-900 dark:text-white text-lg">
                  {sqft} sqft
                </p>
                <p className="text-xs text-blue-600 mt-1">
                  ₹{(15500000 / sqft).toFixed(0)}/sqft
                </p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-100 dark:border-gray-700">
                <p className="text-gray-500 dark:text-gray-400 text-xs mb-1 uppercase tracking-wider font-semibold">
                  Project Name
                </p>
                <p className="font-bold text-gray-900 dark:text-white text-lg underline">
                  {property.name}
                </p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-100 dark:border-gray-700">
                <p className="text-gray-500 dark:text-gray-400 text-xs mb-1 uppercase tracking-wider font-semibold">
                  Status
                </p>
                <p className="font-bold text-green-600 text-lg flex items-center">
                  <CheckCircle2 size={16} className="mr-1" /> {property.status}
                </p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-100 dark:border-gray-700">
                <p className="text-gray-500 dark:text-gray-400 text-xs mb-1 uppercase tracking-wider font-semibold">
                  Transaction
                </p>
                <p className="font-bold text-gray-900 dark:text-white text-lg">
                  Resale
                </p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-100 dark:border-gray-700">
                <p className="text-gray-500 dark:text-gray-400 text-xs mb-1 uppercase tracking-wider font-semibold">
                  Furnishing
                </p>
                <p className="font-bold text-gray-900 dark:text-white text-lg">
                  Semi-Furnished
                </p>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-100 dark:border-gray-700">
                <p className="text-gray-500 dark:text-gray-400 text-xs mb-1 uppercase tracking-wider font-semibold">
                  Age
                </p>
                <p className="font-bold text-gray-900 dark:text-white text-lg">
                  Under 5 Years
                </p>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700 p-8 sticky top-24">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 border-b border-gray-100 dark:border-gray-700 pb-4">
                Contact Property Owner
              </h3>

              <div className="flex items-center mb-6">
                <UserCircle2 size={48} className="text-gray-400 mr-4" />
                <div>
                  <p className="font-bold text-gray-900 dark:text-white text-lg">
                    {ownerName}
                  </p>
                  <p className="text-blue-600 text-xs font-bold uppercase tracking-wider">
                    Verified Owner
                  </p>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-xl mb-6 text-center border border-gray-100 dark:border-gray-700">
                {isLoggedIn && showPhone ? (
                  <p className="text-xl font-black text-gray-900 dark:text-white tracking-wider">
                    +91 98765 43210
                  </p>
                ) : (
                  <p className="text-xl font-black text-gray-400 tracking-wider">
                    +91 987XX XXXXX
                  </p>
                )}
              </div>

              <button
                onClick={handleContactClick}
                className="w-full bg-blue-600 text-white py-3.5 rounded-xl font-bold hover:bg-blue-700 active:scale-95 transition shadow-lg shadow-blue-600/30"
              >
                {isLoggedIn
                  ? showPhone
                    ? "Number Revealed"
                    : "Show Phone Number"
                  : "Login to View Contact"}
              </button>

              {!isLoggedIn && (
                <p className="text-xs text-center text-gray-500 mt-4">
                  For your security, you must be logged into Enclave to view
                  contact information.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
