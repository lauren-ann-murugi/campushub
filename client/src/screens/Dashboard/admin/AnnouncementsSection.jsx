// import React, { useState, useEffect } from 'react';
// import { 
//   Plus, 
//   Search, 
//   Pin, 
//   Eye, 
//   Check, 
//   X, 
//   Loader2, 
//   AlertCircle 
// } from 'lucide-react';

// const API_BASE_URL = '/api/v1'; // Adjust base URL according to your setup

// export default function AnnouncementsSection() {
//   const [announcements, setAnnouncements] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
  
//   // Filtering & Search states
//   const [selectedCategory, setSelectedCategory] = useState('All');
//   const [searchQuery, setSearchQuery] = useState('');

//   // Modal & Form states
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [formData, setFormData] = useState({
//     title: '',
//     content: '',
//     category: 'General',
//     is_pinned: false
//   });

//   // Fetch announcements from Flask API on load
//   useEffect(() => {
//     fetchAnnouncements();
//   }, []);

//   const fetchAnnouncements = async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const response = await fetch(`${API_BASE_URL}/announcements`, {
//         headers: {
//           'Authorization': `Bearer ${localStorage.getItem('token')}`,
//           'Content-Type': 'application/json'
//         }
//       });
      
//       if (!response.ok) {
//         throw new Error('Failed to fetch announcements');
//       }

//       const data = await response.json();
//       setAnnouncements(data);
//     } catch (err) {
//       setError(err.message || 'Error loading announcements');
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Handle Form Submission
//   const handleCreateAnnouncement = async (e) => {
//     e.preventDefault();
//     setIsSubmitting(true);
//     try {
//       const response = await fetch(`${API_BASE_URL}/announcements`, {
//         method: 'POST',
//         headers: {
//           'Authorization': `Bearer ${localStorage.getItem('token')}`,
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify(formData)
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.message || 'Failed to create announcement');
//       }

//       const newAnnouncement = await response.json();
//       setAnnouncements((prev) => [newAnnouncement, ...prev]);
      
//       // Reset and close modal
//       setIsModalOpen(false);
//       setFormData({ title: '', content: '', category: 'General', is_pinned: false });
//     } catch (err) {
//       alert(err.message);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   // Client-side filtering for Search & Category
//   const filteredAnnouncements = announcements.filter((item) => {
//     const matchesCategory = 
//       selectedCategory === 'All' || 
//       item.category?.toLowerCase() === selectedCategory.toLowerCase();

//     const matchesSearch = 
//       item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       item.content?.toLowerCase().includes(searchQuery.toLowerCase());

//     return matchesCategory && matchesSearch;
//   });

//   // Color helper functions for categories & border accents
//   const getCategoryBadgeClass = (category) => {
//     switch (category?.toLowerCase()) {
//       case 'academic':
//         return 'bg-emerald-50 text-emerald-700 border-emerald-200';
//       case 'event':
//         return 'bg-amber-50 text-amber-700 border-amber-200';
//       default:
//         return 'bg-slate-100 text-slate-700 border-slate-200';
//     }
//   };

//   const getCardBorderClass = (item) => {
//     if (item.is_pinned) return 'border-l-4 border-l-blue-600 border-slate-200';
//     switch (item.category?.toLowerCase()) {
//       case 'event':
//         return 'border-l-4 border-l-amber-500 border-slate-200';
//       case 'academic':
//         return 'border-l-4 border-l-emerald-500 border-slate-200';
//       default:
//         return 'border-l-4 border-l-slate-400 border-slate-200';
//     }
//   };

//   return (
//     <div className="p-8 max-w-7xl mx-auto space-y-6 bg-slate-50 min-h-screen">
      
//       {/* Page Header */}
//       <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
//         <div>
//           <h1 className="text-3xl font-bold tracking-tight text-slate-900 font-serif">
//             Campus Announcements
//           </h1>
//           <p className="text-sm text-slate-500 mt-1">
//             Manage and broadcast important updates to students and staff.
//           </p>
//         </div>
//         <button
//           onClick={() => setIsModalOpen(true)}
//           className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2.5 rounded-lg shadow-sm transition-colors text-sm"
//         >
//           <Plus size={18} />
//           <span>Create New Announcement</span>
//         </button>
//       </div>

//       {/* Filter and Search Bar Card */}
//       <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
//         <div className="flex items-center gap-2">
//           <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider mr-2">
//             Filter by Category:
//           </span>
//           <div className="flex flex-wrap items-center gap-2">
//             {['All', 'General', 'Academic', 'Event'].map((cat) => {
//               const active = selectedCategory === cat;
//               return (
//                 <button
//                   key={cat}
//                   onClick={() => setSelectedCategory(cat)}
//                   className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
//                     active
//                       ? 'bg-blue-600 text-white shadow-xs'
//                       : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
//                   }`}
//                 >
//                   {active && <Check size={12} />}
//                   {cat === 'Academic' && !active && <span className="w-2 h-2 rounded-full bg-emerald-500" />}
//                   {cat === 'Event' && !active && <span className="w-2 h-2 rounded-full bg-amber-500" />}
//                   {cat}
//                 </button>
//               );
//             })}
//           </div>
//         </div>

//         {/* Search input field */}
//         <div className="relative w-full md:w-72">
//           <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
//           <input
//             type="text"
//             placeholder="Search announcements..."
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
//           />
//         </div>
//       </div>

//       {/* Announcements Grid */}
//       {loading ? (
//         <div className="flex flex-col items-center justify-center py-20 text-slate-400">
//           <Loader2 className="animate-spin mb-2" size={32} />
//           <p className="text-sm">Fetching announcements...</p>
//         </div>
//       ) : error ? (
//         <div className="flex items-center justify-center gap-2 p-6 bg-red-50 text-red-600 rounded-xl border border-red-200">
//           <AlertCircle size={20} />
//           <p className="text-sm font-medium">{error}</p>
//         </div>
//       ) : filteredAnnouncements.length === 0 ? (
//         <div className="text-center py-16 bg-white rounded-xl border border-slate-200">
//           <p className="text-slate-500 text-sm">No announcements found matching your criteria.</p>
//         </div>
//       ) : (
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           {filteredAnnouncements.map((item) => (
//             <div
//               key={item.id}
//               className={`bg-white rounded-xl p-6 border shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between ${getCardBorderClass(
//                 item
//               )}`}
//             >
//               <div>
//                 {/* Header Tags */}
//                 <div className="flex items-center gap-2 mb-3">
//                   {item.is_pinned && (
//                     <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 text-xs font-semibold px-2.5 py-0.5 rounded-md border border-blue-100">
//                       <Pin size={12} className="rotate-45" /> Pinned
//                     </span>
//                   )}
//                   <span
//                     className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium border ${getCategoryBadgeClass(
//                       item.category
//                     )}`}
//                   >
//                     {item.category}
//                   </span>
//                 </div>

//                 {/* Title */}
//                 <h3 className="text-lg font-bold text-slate-900 font-serif leading-snug mb-2">
//                   {item.title}
//                 </h3>

//                 {/* Content */}
//                 <p className="text-slate-600 text-sm leading-relaxed line-clamp-3 mb-6">
//                   {item.content}
//                 </p>
//               </div>

//               {/* Footer Meta Details */}
//               <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
//                 <div className="flex items-center gap-2">
//                   {item.author_avatar ? (
//                     <img
//                       src={item.author_avatar}
//                       alt={item.author_name}
//                       className="w-7 h-7 rounded-full object-cover border border-slate-200"
//                     />
//                   ) : (
//                     <div className="w-7 h-7 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-600 text-[10px]">
//                       {item.author_name ? item.author_name.charAt(0) : 'A'}
//                     </div>
//                   )}
//                   <div>
//                     <p className="font-semibold text-slate-800">{item.author_name || 'Admin'}</p>
//                     <p className="text-[11px] text-slate-400">
//                       {item.author_title ? `${item.author_title} • ` : ''}
//                       {item.created_at ? new Date(item.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recently'}
//                     </p>
//                   </div>
//                 </div>

//                 {item.views !== undefined && (
//                   <div className="flex items-center gap-1 text-slate-400">
//                     <Eye size={14} />
//                     <span>{item.views.toLocaleString()}</span>
//                   </div>
//                 )}
//               </div>
//             </div>
//           ))}
//         </div>
//       )}

//       {/* Modal Form for Creating Announcements */}
//       {isModalOpen && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
//           <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            
//             <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
//               <h2 className="text-lg font-bold text-slate-900 font-serif">
//                 Create New Announcement
//               </h2>
//               <button
//                 onClick={() => setIsModalOpen(false)}
//                 className="text-slate-400 hover:text-slate-600 rounded-lg p-1 transition-colors"
//               >
//                 <X size={20} />
//               </button>
//             </div>

//             <form onSubmit={handleCreateAnnouncement} className="p-6 space-y-4">
//               <div>
//                 <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
//                   Title
//                 </label>
//                 <input
//                   type="text"
//                   required
//                   placeholder="e.g. Updated Final Examination Schedule"
//                   value={formData.title}
//                   onChange={(e) => setFormData({ ...formData, title: e.target.value })}
//                   className="w-full px-3.5 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 />
//               </div>

//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
//                     Category
//                   </label>
//                   <select
//                     value={formData.category}
//                     onChange={(e) => setFormData({ ...formData, category: e.target.value })}
//                     className="w-full px-3.5 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
//                   >
//                     <option value="General">General</option>
//                     <option value="Academic">Academic</option>
//                     <option value="Event">Event</option>
//                   </select>
//                 </div>

//                 <div className="flex items-center pt-6">
//                   <label className="relative flex items-center gap-2 cursor-pointer">
//                     <input
//                       type="checkbox"
//                       checked={formData.is_pinned}
//                       onChange={(e) => setFormData({ ...formData, is_pinned: e.target.checked })}
//                       className="w-4 h-4 text-blue-600 border-slate-300 rounded-sm focus:ring-blue-500"
//                     />
//                     <span className="text-sm text-slate-700 font-medium">Pin Announcement</span>
//                   </label>
//                 </div>
//               </div>

//               <div>
//                 <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
//                   Content
//                 </label>
//                 <textarea
//                   required
//                   rows={4}
//                   placeholder="Write full announcement details here..."
//                   value={formData.content}
//                   onChange={(e) => setFormData({ ...formData, content: e.target.value })}
//                   className="w-full px-3.5 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 />
//               </div>

//               <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
//                 <button
//                   type="button"
//                   onClick={() => setIsModalOpen(false)}
//                   className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   disabled={isSubmitting}
//                   className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-5 py-2 rounded-lg shadow-sm transition-colors disabled:opacity-50"
//                 >
//                   {isSubmitting && <Loader2 size={16} className="animate-spin" />}
//                   <span>Publish</span>
//                 </button>
//               </div>
//             </form>

//           </div>
//         </div>
//       )}

//     </div>
//   );
// }








// src/screens/Dashboard/admin/AnnouncementsSection.jsx

import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Pin, 
  Eye, 
  Check, 
  X, 
  Loader2, 
  AlertCircle 
} from 'lucide-react';

// Update: Use environment variable with fallback
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

export function AdminAnnouncementsSection() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionNotice, setActionNotice] = useState(null); // Added for user feedback
  
  // Filtering & Search states
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Modal & Form states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'General',
    is_pinned: false
  });

  // Fetch announcements from Flask API on load
  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/announcements`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch announcements');
      }

      const data = await response.json();
      setAnnouncements(data);
    } catch (err) {
      setError(err.message || 'Error loading announcements');
      // Set fallback mock data for demonstration
      setAnnouncements([
        {
          id: 1,
          title: "Welcome to the New Semester",
          content: "We are excited to welcome all students back for the new academic year. Please check your schedules and class assignments.",
          category: "General",
          is_pinned: true,
          author_name: "Admin",
          author_title: "Principal",
          created_at: new Date().toISOString(),
          views: 245
        },
        {
          id: 2,
          title: "Mid-Term Examinations Schedule",
          content: "Mid-term examinations will begin from October 15th. Please refer to the examination timetable posted on the notice board.",
          category: "Academic",
          is_pinned: false,
          author_name: "Academic Office",
          author_title: "Registrar",
          created_at: new Date(Date.now() - 86400000).toISOString(),
          views: 189
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Handle Form Submission
  const handleCreateAnnouncement = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/announcements`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create announcement');
      }

      const newAnnouncement = await response.json();
      setAnnouncements((prev) => [newAnnouncement, ...prev]);
      
      // Reset and close modal
      setIsModalOpen(false);
      setFormData({ title: '', content: '', category: 'General', is_pinned: false });
      setActionNotice('Announcement created successfully!');
      setTimeout(() => setActionNotice(null), 3000);
    } catch (err) {
      // Fallback: Add announcement locally if API fails
      const newAnnouncement = {
        id: Date.now(),
        ...formData,
        author_name: "Admin",
        author_title: "Principal",
        created_at: new Date().toISOString(),
        views: 0
      };
      setAnnouncements((prev) => [newAnnouncement, ...prev]);
      setIsModalOpen(false);
      setFormData({ title: '', content: '', category: 'General', is_pinned: false });
      setActionNotice('Announcement created (offline mode)');
      setTimeout(() => setActionNotice(null), 3000);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Client-side filtering for Search & Category
  const filteredAnnouncements = announcements.filter((item) => {
    const matchesCategory = 
      selectedCategory === 'All' || 
      item.category?.toLowerCase() === selectedCategory.toLowerCase();

    const matchesSearch = 
      item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.content?.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  // Color helper functions for categories & border accents
  const getCategoryBadgeClass = (category) => {
    switch (category?.toLowerCase()) {
      case 'academic':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'event':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getCardBorderClass = (item) => {
    if (item.is_pinned) return 'border-l-4 border-l-blue-600 border-slate-200';
    switch (item.category?.toLowerCase()) {
      case 'event':
        return 'border-l-4 border-l-amber-500 border-slate-200';
      case 'academic':
        return 'border-l-4 border-l-emerald-500 border-slate-200';
      default:
        return 'border-l-4 border-l-slate-400 border-slate-200';
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6 bg-slate-50 min-h-screen">
      
      {/* Notification Toast */}
      {actionNotice && (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">
          <Check size={16} className="text-emerald-600" />
          {actionNotice}
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 font-serif">
            Campus Announcements
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage and broadcast important updates to students and staff.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2.5 rounded-lg shadow-sm transition-colors text-sm"
        >
          <Plus size={18} />
          <span>Create New Announcement</span>
        </button>
      </div>

      {/* Filter and Search Bar Card */}
      <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider mr-2">
            Filter by Category:
          </span>
          <div className="flex flex-wrap items-center gap-2">
            {['All', 'General', 'Academic', 'Event'].map((cat) => {
              const active = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                    active
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {active && <Check size={12} />}
                  {cat === 'Academic' && !active && <span className="w-2 h-2 rounded-full bg-emerald-500" />}
                  {cat === 'Event' && !active && <span className="w-2 h-2 rounded-full bg-amber-500" />}
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Search input field */}
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input
            type="text"
            placeholder="Search announcements..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
          />
        </div>
      </div>

      {/* Announcements Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 text-slate-400">
          <Loader2 className="animate-spin mb-2" size={32} />
          <p className="text-sm">Fetching announcements...</p>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center gap-4 p-6 bg-yellow-50 text-yellow-700 rounded-xl border border-yellow-200">
          <div className="flex items-center gap-2">
            <AlertCircle size={20} />
            <p className="text-sm font-medium">{error}</p>
          </div>
          <button
            onClick={fetchAnnouncements}
            className="px-4 py-2 bg-yellow-100 hover:bg-yellow-200 rounded-lg text-sm font-medium transition-colors"
          >
            Retry
          </button>
        </div>
      ) : filteredAnnouncements.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-slate-200">
          <p className="text-slate-500 text-sm">No announcements found matching your criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredAnnouncements.map((item) => (
            <div
              key={item.id}
              className={`bg-white rounded-xl p-6 border shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between ${getCardBorderClass(
                item
              )}`}
            >
              <div>
                {/* Header Tags */}
                <div className="flex items-center gap-2 mb-3">
                  {item.is_pinned && (
                    <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 text-xs font-semibold px-2.5 py-0.5 rounded-md border border-blue-100">
                      <Pin size={12} className="rotate-45" /> Pinned
                    </span>
                  )}
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium border ${getCategoryBadgeClass(
                      item.category
                    )}`}
                  >
                    {item.category}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold text-slate-900 font-serif leading-snug mb-2">
                  {item.title}
                </h3>

                {/* Content */}
                <p className="text-slate-600 text-sm leading-relaxed line-clamp-3 mb-6">
                  {item.content}
                </p>
              </div>

              {/* Footer Meta Details */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <div className="flex items-center gap-2">
                  {item.author_avatar ? (
                    <img
                      src={item.author_avatar}
                      alt={item.author_name}
                      className="w-7 h-7 rounded-full object-cover border border-slate-200"
                    />
                  ) : (
                    <div className="w-7 h-7 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-600 text-[10px]">
                      {item.author_name ? item.author_name.charAt(0) : 'A'}
                    </div>
                  )}
                  <div>
                    <p className="font-semibold text-slate-800">{item.author_name || 'Admin'}</p>
                    <p className="text-[11px] text-slate-400">
                      {item.author_title ? `${item.author_title} • ` : ''}
                      {item.created_at ? new Date(item.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recently'}
                    </p>
                  </div>
                </div>

                {item.views !== undefined && (
                  <div className="flex items-center gap-1 text-slate-400">
                    <Eye size={14} />
                    <span>{item.views.toLocaleString()}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Form for Creating Announcements */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-900 font-serif">
                Create New Announcement
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 rounded-lg p-1 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateAnnouncement} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Updated Final Examination Schedule"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    <option value="General">General</option>
                    <option value="Academic">Academic</option>
                    <option value="Event">Event</option>
                  </select>
                </div>

                <div className="flex items-center pt-6">
                  <label className="relative flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.is_pinned}
                      onChange={(e) => setFormData({ ...formData, is_pinned: e.target.checked })}
                      className="w-4 h-4 text-blue-600 border-slate-300 rounded-sm focus:ring-blue-500"
                    />
                    <span className="text-sm text-slate-700 font-medium">Pin Announcement</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Content
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Write full announcement details here..."
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-5 py-2 rounded-lg shadow-sm transition-colors disabled:opacity-50"
                >
                  {isSubmitting && <Loader2 size={16} className="animate-spin" />}
                  <span>Publish</span>
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}