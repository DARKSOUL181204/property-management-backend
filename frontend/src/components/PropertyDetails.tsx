import { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api';
import { MapPin, Bed, Bath, ArrowLeft, Download, Phone, ShieldCheck, Edit3, X, Image as ImageIcon } from 'lucide-react';
import { jwtDecode } from 'jwt-decode';

export default function PropertyDetails() {
  const { propertyId } = useParams();
  const [property, setProperty] = useState<any>(null);
  const [userRole, setUserRole] = useState('EMPLOYEE');
  const [canEditPrice, setCanEditPrice] = useState(false);
  
  const [showEditModal, setShowEditModal] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [editData, setEditData] = useState<any>({});
  
  const focusRef = useRef<HTMLInputElement>(null);
  const imgFocusRef = useRef<HTMLInputElement>(null);

  const fetchProperty = () => {
    api.get(`/properties/${propertyId}`).then(res => setProperty(res.data)).catch(console.error);
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if(token) {
        try {
            const decoded: any = jwtDecode(token);
            setUserRole(decoded.role || 'USER');
            setCanEditPrice(decoded.canEditPrice ?? true);
        } catch(e) {}
    }
    fetchProperty();
  }, [propertyId]);

  useEffect(() => {
    if (showEditModal && focusRef.current) focusRef.current.focus();
  }, [showEditModal]);

  useEffect(() => {
    if (showImageModal && imgFocusRef.current) imgFocusRef.current.focus();
  }, [showImageModal]);

  if (!property) return <div className="p-8">Loading Profile...</div>;

  const hash = parseInt(propertyId!.substring(0,8), 16);
  const priceStr = hash % 2 === 0 ? `₹1.55 Cr` : `₹65 Lac`;
  const sqft = 1194;
  const placeholderImg = "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=80";

  const handleEditSubmit = async (e: any) => {
    e.preventDefault();
    try {
      await api.put(`/properties/${propertyId}`, editData);
      setShowEditModal(false);
      setShowImageModal(false);
      fetchProperty();
    } catch(err) {
      console.error(err);
    }
  };

  const openEditModal = () => {
    setEditData({
       name: property.name,
       description: property.description || '',
       imageUrl: property.imageUrl || '',
       status: property.status,
       transactionType: property.transactionType || 'BUY',
       propertyType: property.propertyType,
       totalUnits: property.totalUnits
    });
    setShowEditModal(true);
  };

  const openImageModal = () => {
    setEditData({
       name: property.name,
       description: property.description || '',
       imageUrl: property.imageUrl || '',
       status: property.status,
       transactionType: property.transactionType || 'BUY',
       propertyType: property.propertyType,
       totalUnits: property.totalUnits
    });
    setShowImageModal(true);
  };

  return (
    <main className="max-w-6xl mx-auto">
      
      {/* EDIT DETAILS MODAL */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" role="dialog" aria-modal="true" aria-labelledby="edit-property-title">
           <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-md p-6 shadow-xl relative max-h-[90vh] overflow-y-auto">
             <button onClick={() => setShowEditModal(false)} className="absolute top-4 right-4 text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md">
               <span className="sr-only">Close Modal</span><X/>
             </button>
             <h2 id="edit-property-title" className="text-xl font-bold mb-4 dark:text-white">Edit Property</h2>
             <form onSubmit={handleEditSubmit} className="space-y-4">
                <div>
                   <label htmlFor="edit-name" className="block text-sm font-medium mb-1 dark:text-gray-300">Property Name</label>
                   <input id="edit-name" ref={focusRef} required value={editData.name} onChange={e => setEditData({...editData, name: e.target.value})} className="w-full border rounded-lg p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                </div>
                <div>
                   <label htmlFor="edit-desc" className="block text-sm font-medium mb-1 dark:text-gray-300">Description</label>
                   <textarea id="edit-desc" rows={3} value={editData.description} onChange={e => setEditData({...editData, description: e.target.value})} className="w-full border rounded-lg p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"></textarea>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                     <label htmlFor="edit-status" className="block text-sm font-medium mb-1 dark:text-gray-300">Status</label>
                     <select id="edit-status" value={editData.status} onChange={e => setEditData({...editData, status: e.target.value})} className="w-full border rounded-lg p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500">
                        <option value="ACTIVE">ACTIVE</option>
                        <option value="INACTIVE">INACTIVE</option>
                        <option value="SOLD">SOLD</option>
                     </select>
                  </div>
                  <div>
                     <label htmlFor="edit-tran" className="block text-sm font-medium mb-1 dark:text-gray-300">Transaction</label>
                     <select id="edit-tran" value={editData.transactionType} onChange={e => setEditData({...editData, transactionType: e.target.value})} className="w-full border rounded-lg p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500">
                        <option value="BUY">Sale (Buy)</option>
                        <option value="RENT">Rent</option>
                     </select>
                  </div>
                </div>
                <div>
                   <label htmlFor="edit-price" className="block text-sm font-medium mb-1 dark:text-gray-300">Listed Price</label>
                   <input 
                      id="edit-price" disabled={!canEditPrice} aria-disabled={!canEditPrice}
                      defaultValue={priceStr} 
                      className={`w-full border rounded-lg p-2 dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 ${!canEditPrice ? 'bg-gray-100 dark:bg-gray-600 cursor-not-allowed text-gray-400' : 'bg-white dark:text-white'}`} 
                   />
                   {!canEditPrice && <p className="text-xs text-red-500 mt-1">Administrator disabled price editing for your account.</p>}
                </div>
                <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-lg transition mt-4 focus:outline-none focus:ring-4 focus:ring-emerald-500/50">Save Changes</button>
             </form>
           </div>
        </div>
      )}

      {/* MANAGE IMAGES MODAL */}
      {showImageModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" role="dialog" aria-modal="true" aria-labelledby="manage-image-title">
           <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-md p-6 shadow-xl relative max-h-[90vh] overflow-y-auto">
             <button onClick={() => setShowImageModal(false)} className="absolute top-4 right-4 text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md">
               <span className="sr-only">Close Modal</span><X/>
             </button>
             <h2 id="manage-image-title" className="text-xl font-bold mb-4 dark:text-white flex items-center"><ImageIcon className="mr-2 text-emerald-600" size={20}/> Manage Images</h2>
             <form onSubmit={handleEditSubmit} className="space-y-4">
                <div className="mb-4">
                  <div className="w-full h-40 bg-gray-100 dark:bg-gray-700 rounded-xl overflow-hidden mb-2 border border-gray-200 dark:border-gray-600">
                     <img src={editData.imageUrl || placeholderImg} className="w-full h-full object-cover" alt="Preview" />
                  </div>
                </div>
                <div>
                   <label htmlFor="manage-img-url" className="block text-sm font-medium mb-1 dark:text-gray-300">Cover Image URL</label>
                   <input id="manage-img-url" ref={imgFocusRef} type="url" placeholder="https://..." value={editData.imageUrl} onChange={e => setEditData({...editData, imageUrl: e.target.value})} className="w-full border rounded-lg p-2 dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                   <p className="text-xs text-gray-500 mt-1">Paste a valid image URL to update the property's cover photo.</p>
                </div>
                <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-lg transition mt-4 focus:outline-none focus:ring-4 focus:ring-emerald-500/50">Update Photo</button>
             </form>
           </div>
        </div>
      )}

      <nav aria-label="Breadcrumb">
        <Link to="/properties" className="text-gray-500 hover:text-emerald-600 mb-6 inline-flex items-center text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded px-1">
          <ArrowLeft size={16} className="mr-1" aria-hidden="true"/> Back to Directory
        </Link>
      </nav>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Content Area */}
        <section className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden p-6" aria-label="Property Details">
          
          {/* Header */}
          <header className="flex flex-col sm:flex-row sm:justify-between items-start border-b border-gray-100 dark:border-gray-700 pb-4 mb-4">
            <div className="mb-4 sm:mb-0">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl font-black text-gray-900 dark:text-white">{priceStr}</h1>
                <span className="text-sm text-gray-500 underline cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded px-1">EMI - ₹45k</span>
              </div>
              <h2 className="text-lg text-gray-700 dark:text-gray-200 font-medium">{property.name} - 3 BHK {sqft} Sqft Flat For Sale</h2>
              <p className="text-gray-500 flex items-center text-sm mt-1 underline decoration-gray-300">
                <MapPin size={14} className="mr-1" aria-hidden="true"/> Grand Southern Trunk Road, Chennai
              </p>
            </div>
            <div className="flex flex-row sm:flex-col items-center sm:items-end gap-2 w-full sm:w-auto justify-between sm:justify-start">
              <span className="bg-emerald-50 text-emerald-600 border border-emerald-200 px-3 py-1 rounded-full text-xs font-bold flex items-center">
                 <ShieldCheck size={14} className="mr-1" aria-hidden="true"/> VERIFIED
              </span>
              <div className="flex gap-2 mt-2">
                <button 
                  onClick={openImageModal} 
                  aria-label="Manage Images"
                  className="flex items-center text-sm font-bold text-gray-600 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-100 transition focus:outline-none focus:ring-4 focus:ring-gray-200"
                >
                   <ImageIcon size={14} className="mr-1" aria-hidden="true"/> Images
                </button>
                <button 
                  onClick={openEditModal} 
                  aria-label="Edit Property Details"
                  className="flex items-center text-sm font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-200 hover:bg-blue-100 transition focus:outline-none focus:ring-4 focus:ring-blue-500/50"
                >
                   <Edit3 size={14} className="mr-1" aria-hidden="true"/> Edit Details
                </button>
              </div>
            </div>
          </header>
          
          {/* Media Grid */}
          <div className="grid grid-cols-4 gap-2 mb-6 h-64">
            <div className="col-span-3 h-full overflow-hidden rounded-xl group relative cursor-pointer" onClick={openImageModal}>
               <img src={property.imageUrl || placeholderImg} alt={`${property.name} cover`} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
               <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition flex items-center justify-center">
                 <span className="text-white opacity-0 group-hover:opacity-100 font-bold flex items-center"><Edit3 size={16} className="mr-2"/> Change Photo</span>
               </div>
            </div>
            <div className="col-span-1 flex flex-col gap-2 h-full">
              <img src="https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&q=80" alt="" aria-hidden="true" className="w-full h-1/2 object-cover rounded-xl" />
              <img src="https://images.unsplash.com/photo-1484154218962-a197022b5858?w=400&q=80" alt="" aria-hidden="true" className="w-full h-1/2 object-cover rounded-xl" />
            </div>
          </div>

          <article>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Description</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm whitespace-pre-wrap leading-relaxed">
              {property.description || "No description provided for this property."}
            </p>
          </article>

        </section>
      </div>
    </main>
  );
}
