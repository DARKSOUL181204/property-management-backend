import { Image, ChevronRight, ImageIcon } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const IMAGES = [
  "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80",
  "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80",
  "https://images.unsplash.com/photo-1460317442991-0ec209397118?w=800&q=80",
  "https://images.unsplash.com/photo-1574362848149-11496d93a7c7?w=800&q=80",
  "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80",
];

const LOCATION_MAP: any = {
  Bangalore: [
    "Whitefield, Bangalore",
    "Sarjapur Road, Bangalore",
    "Electronic City, Bangalore",
    "HSR Layout, Bangalore",
    "JP Nagar, Bangalore",
  ],
  Mumbai: [
    "Bandra West, Mumbai",
    "Andheri East, Mumbai",
    "Powai, Mumbai",
    "Juhu, Mumbai",
  ],
  Hyderabad: [
    "Banjara Hills, Hyderabad",
    "Jubilee Hills, Hyderabad",
    "HITEC City, Hyderabad",
    "Kondapur, Hyderabad",
  ],
  Thane: [
    "Majiwada, Thane",
    "Kolshet Road, Thane",
    "Vartak Nagar, Thane",
    "Ghodbunder Road, Thane",
  ],
  Chennai: [
    "Kovur, Chennai",
    "Kelambakkam, Chennai",
    "Egmore, Chennai",
    "Grand Southern Trunk Road, Chennai",
  ],
  Pune: [
    "Koregaon Park, Pune",
    "Hinjewadi, Pune",
    "Viman Nagar, Pune",
    "Wakad, Pune",
  ],
  "New Delhi": [
    "Vasant Kunj, New Delhi",
    "Hauz Khas, New Delhi",
    "Dwarka, New Delhi",
    "Rohini, New Delhi",
  ],
};

export default function PropertyCard({
  property,
  isPublic,
  selectedCity = "Bangalore",
}: any) {
  const navigate = useNavigate();
  const hash = property.propertyId
    ? parseInt(property.propertyId.substring(0, 8), 16)
    : 0;
  const imageUrl = property.imageUrl || IMAGES[hash % IMAGES.length];
  const locations = LOCATION_MAP[selectedCity] || LOCATION_MAP["Bangalore"];
  const address = locations[hash % locations.length];

  const isCr = hash % 2 === 0;
  const price = isCr
    ? `₹${(1 + (hash % 5) * 0.2).toFixed(2)} Cr`
    : `₹${50 + (hash % 40)} Lac`;
  const bhk = (hash % 3) + 2;
  const sqft = 800 + (hash % 1000);

  const handleClick = () => {
    if (isPublic) {
      navigate(`/p/${property.propertyId}`);
    }
  };

  return (
    <motion.div
      onClick={isPublic ? handleClick : undefined}
      whileHover={{
        y: -4,
        boxShadow:
          "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
      }}
      className={`bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col min-w-[280px] md:min-w-[320px] w-full snap-start transition-all ${isPublic ? "cursor-pointer" : ""}`}
    >
      <div className="h-48 relative overflow-hidden group">
        <img
          src={imageUrl}
          alt={property.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute bottom-2 left-2 bg-black/70 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-md flex items-center shadow-lg">
          <ImageIcon size={12} className="mr-1" /> {(hash % 20) + 5}
        </div>
      </div>

      <div className="p-5 flex flex-col flex-grow">
        <p className="text-gray-500 dark:text-gray-400 text-sm mb-1 font-medium">
          {bhk} BHK Flat
        </p>

        <div className="flex items-center text-gray-900 dark:text-white mb-2">
          <span className="text-2xl font-black mr-2 tracking-tight text-blue-700 dark:text-blue-400">
            {price}
          </span>
          <span className="text-gray-300 dark:text-gray-600 mx-1">|</span>
          <span className="text-md font-bold ml-1 text-gray-700 dark:text-gray-300">
            {sqft} sqft
          </span>
        </div>

        <p
          className="text-gray-600 dark:text-gray-300 text-sm truncate mb-1 font-medium"
          title={address}
        >
          {address}
        </p>
        <p className="text-gray-400 dark:text-gray-500 text-xs mb-5">
          Ready to Move
        </p>

        <div className="mt-auto">
          {isPublic ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/p/${property.propertyId}`);
              }}
              className="w-full bg-blue-50 text-blue-600 border border-blue-200 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-400 font-bold py-2.5 rounded-xl hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 dark:hover:text-white transition-all text-sm"
            >
              View Details
            </button>
          ) : (
            <div className="flex gap-2">
              <Link
                to={`/dashboard/${property.propertyId}`}
                className="flex-1 text-center bg-gray-50 hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 py-2.5 rounded-xl text-sm font-semibold border border-gray-200 dark:border-gray-600 transition-colors"
              >
                Analytics
              </Link>
              <Link
                to={`/properties/${property.propertyId}`}
                className="flex-1 flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-xl text-sm font-semibold transition-colors"
              >
                Manage
              </Link>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
