// "use client"

// import { useState, useEffect } from "react"
// import { Search, Filter, Users, ChevronDown } from "lucide-react"
// import CoachCard from "../components/CoachCard"
// import CoachFilters from "../components/CoachFilters"
// import { coachService } from "../services/coachService"

// const CoachDiscovery = () => {
//   const [coaches, setCoaches] = useState([])
//   const [loading, setLoading] = useState(true)
//   const [filters, setFilters] = useState({
//     specialty: "",
//     minRating: "",
//     language: "",
//     verified: false,
//     search: "",
//   })
//   const [showFilters, setShowFilters] = useState(false)
//   const [pagination, setPagination] = useState({
//     currentPage: 1,
//     totalPages: 1,
//     total: 0,
//   })

//   useEffect(() => {
//     fetchCoaches()
//   }, [filters, pagination.currentPage])

//   const fetchCoaches = async () => {
//     try {
//       setLoading(true)
//       const response = await coachService.getCoaches({
//         ...filters,
//         page: pagination.currentPage,
//       })

//       setCoaches(response.coaches)
//       setPagination({
//         currentPage: response.currentPage,
//         totalPages: response.totalPages,
//         total: response.total,
//       })
//     } catch (error) {
//       console.error("Error fetching coaches:", error)
//     } finally {
//       setLoading(false)
//     }
//   }

//   const handleFilterChange = (newFilters) => {
//     setFilters(newFilters)
//     setPagination((prev) => ({ ...prev, currentPage: 1 }))
//   }

//   const handleSearch = (searchTerm) => {
//     setFilters((prev) => ({ ...prev, search: searchTerm }))
//     setPagination((prev) => ({ ...prev, currentPage: 1 }))
//   }

//   return (
//     <div className="min-h-screen bg-gray-50">
//       {/* Header */}
//       <div className="bg-white border-b border-gray-200">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//           <div className="text-center">
//             <h1 className="text-3xl font-bold text-gray-900 mb-4">Find Your Perfect Fitness Coach</h1>
//             <p className="text-lg text-gray-600 mb-8">
//               Connect with certified professionals to achieve your health and fitness goals
//             </p>

//             {/* Search Bar */}
//             <div className="max-w-2xl mx-auto relative">
//               <div className="relative">
//                 <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
//                 <input
//                   type="text"
//                   placeholder="Search coaches by name, specialty, or location..."
//                   value={filters.search}
//                   onChange={(e) => handleSearch(e.target.value)}
//                   className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
//                 />
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         <div className="flex flex-col lg:flex-row gap-8">
//           {/* Filters Sidebar */}
//           <div className="lg:w-1/4">
//             <div className="lg:hidden mb-4">
//               <button
//                 onClick={() => setShowFilters(!showFilters)}
//                 className="w-full flex items-center justify-between px-4 py-3 bg-white border border-gray-300 rounded-lg"
//               >
//                 <span className="flex items-center">
//                   <Filter className="h-5 w-5 mr-2" />
//                   Filters
//                 </span>
//                 <ChevronDown className={`h-5 w-5 transform transition-transform ${showFilters ? "rotate-180" : ""}`} />
//               </button>
//             </div>

//             <div className={`${showFilters ? "block" : "hidden"} lg:block`}>
//               <CoachFilters filters={filters} onFilterChange={handleFilterChange} />
//             </div>
//           </div>

//           {/* Results */}
//           <div className="lg:w-3/4">
//             {/* Results Header */}
//             <div className="flex items-center justify-between mb-6">
//               <div>
//                 <h2 className="text-xl font-semibold text-gray-900">{pagination.total} Coaches Found</h2>
//                 <p className="text-gray-600">
//                   Page {pagination.currentPage} of {pagination.totalPages}
//                 </p>
//               </div>
//             </div>

//             {/* Loading State */}
//             {loading ? (
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 {[...Array(6)].map((_, index) => (
//                   <div key={index} className="bg-white rounded-xl p-6 animate-pulse">
//                     <div className="flex items-start space-x-4">
//                       <div className="w-16 h-16 bg-gray-300 rounded-full"></div>
//                       <div className="flex-1 space-y-2">
//                         <div className="h-4 bg-gray-300 rounded w-3/4"></div>
//                         <div className="h-3 bg-gray-300 rounded w-1/2"></div>
//                         <div className="h-3 bg-gray-300 rounded w-full"></div>
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             ) : coaches.length === 0 ? (
//               <div className="text-center py-12">
//                 <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
//                 <h3 className="text-lg font-medium text-gray-900 mb-2">No coaches found</h3>
//                 <p className="text-gray-600">Try adjusting your filters or search terms</p>
//               </div>
//             ) : (
//               <>
//                 {/* Coach Grid */}
//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
//                   {coaches.map((coach) => (
//                     <CoachCard key={coach._id} coach={coach} />
//                   ))}
//                 </div>

//                 {/* Pagination */}
//                 {pagination.totalPages > 1 && (
//                   <div className="flex justify-center">
//                     <nav className="flex items-center space-x-2">
//                       <button
//                         onClick={() =>
//                           setPagination((prev) => ({
//                             ...prev,
//                             currentPage: Math.max(1, prev.currentPage - 1),
//                           }))
//                         }
//                         disabled={pagination.currentPage === 1}
//                         className="px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
//                       >
//                         Previous
//                       </button>

//                       {[...Array(pagination.totalPages)].map((_, index) => {
//                         const page = index + 1
//                         return (
//                           <button
//                             key={page}
//                             onClick={() => setPagination((prev) => ({ ...prev, currentPage: page }))}
//                             className={`px-4 py-2 text-sm font-medium rounded-lg ${
//                               pagination.currentPage === page
//                                 ? "bg-blue-600 text-white"
//                                 : "text-gray-500 bg-white border border-gray-300 hover:bg-gray-50"
//                             }`}
//                           >
//                             {page}
//                           </button>
//                         )
//                       })}

//                       <button
//                         onClick={() =>
//                           setPagination((prev) => ({
//                             ...prev,
//                             currentPage: Math.min(prev.totalPages, prev.currentPage + 1),
//                           }))
//                         }
//                         disabled={pagination.currentPage === pagination.totalPages}
//                         className="px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
//                       >
//                         Next
//                       </button>
//                     </nav>
//                   </div>
//                 )}
//               </>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default CoachDiscovery



"use client"

import { useState, useEffect } from "react"
import { Search, Filter, Users, ChevronDown } from "lucide-react"
import CoachCard from "../components/CoachCard"
import CoachFilters from "../components/CoachFilters"
import { coachService } from "../services/coachService"

const CoachDiscovery = () => {
  const [coaches, setCoaches] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    specialty: "",
    minRating: "",
    language: "",
    verified: false,
    search: "",
  })
  const [showFilters, setShowFilters] = useState(false)
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    total: 0,
  })

  useEffect(() => {
    fetchCoaches()
  }, [filters, pagination.currentPage])

  const fetchCoaches = async () => {
    try {
      setLoading(true)
      const response = await coachService.getCoaches({
        ...filters,
        page: pagination.currentPage,
      })

      setCoaches(response.coaches)
      setPagination({
        currentPage: response.currentPage,
        totalPages: response.totalPages,
        total: response.total,
      })
    } catch (error) {
      console.error("Error fetching coaches:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters)
    setPagination((prev) => ({ ...prev, currentPage: 1 }))
  }

  const handleSearch = (searchTerm) => {
    setFilters((prev) => ({ ...prev, search: searchTerm }))
    setPagination((prev) => ({ ...prev, currentPage: 1 }))
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Background Image - Increased Height */}
      <div className="relative bg-white border-b border-gray-200 overflow-hidden h-[70vh] md:h-[70vh] min-h-[500px]">
        {/* Background Image Container */}
        <div className="absolute inset-0 w-full h-full">
          <img
            src="https://res.cloudinary.com/dvjfemxbz/image/upload/Klantbetrokkenheid_via_personalisatie_q0fl3c.png"
            alt="Fitness coaching and client engagement"
            className="w-full h-full object-cover"
            loading="eager"
            style={{
              objectFit: 'contain',
              objectPosition: 'center center',
            }}
          />
          {/* Enhanced overlay for better text readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/70"></div>
        </div>
        
        {/* Content - Centered in the expanded space */}
        <div className="relative h-full flex items-center justify-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Find Your Perfect Fitness Coach
            </h1>
            <p className="text-xl md:text-2xl text-gray-100 mb-10 max-w-3xl mx-auto leading-relaxed">
              Connect with certified professionals to achieve your health and fitness goals
            </p>

            {/* Enhanced Search Bar */}
            <div className="max-w-3xl mx-auto relative">
              <div className="relative">
                <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 text-gray-400 h-6 w-6 z-10" />
                <input
                  type="text"
                  placeholder="Search coaches by name, specialty, or location..."
                  value={filters.search}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="w-full pl-16 pr-6 py-5 border-0 rounded-2xl text-lg focus:outline-none focus:ring-4 focus:ring-blue-500/30 focus:border-transparent bg-white/90 backdrop-blur-md shadow-2xl placeholder-gray-500"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-1/4">
            <div className="lg:hidden mb-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="w-full flex items-center justify-between px-4 py-3 bg-white border border-gray-300 rounded-lg shadow-sm hover:shadow-md transition-shadow"
              >
                <span className="flex items-center">
                  <Filter className="h-5 w-5 mr-2" />
                  Filters
                </span>
                <ChevronDown className={`h-5 w-5 transform transition-transform ${showFilters ? "rotate-180" : ""}`} />
              </button>
            </div>

            <div className={`${showFilters ? "block" : "hidden"} lg:block`}>
              <CoachFilters filters={filters} onFilterChange={handleFilterChange} />
            </div>
          </div>

          {/* Results */}
          <div className="lg:w-3/4">
            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">{pagination.total} Coaches Found</h2>
                <p className="text-gray-600">
                  Page {pagination.currentPage} of {pagination.totalPages}
                </p>
              </div>
            </div>

            {/* Loading State */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[...Array(6)].map((_, index) => (
                  <div key={index} className="bg-white rounded-xl p-6 animate-pulse shadow-sm">
                    <div className="flex items-start space-x-4">
                      <div className="w-16 h-16 bg-gray-300 rounded-full flex-shrink-0"></div>
                      <div className="flex-1 space-y-3">
                        <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                        <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                        <div className="h-3 bg-gray-300 rounded w-full"></div>
                        <div className="flex space-x-2">
                          <div className="h-3 bg-gray-300 rounded w-16"></div>
                          <div className="h-3 bg-gray-300 rounded w-20"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : coaches.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Users className="h-12 w-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-medium text-gray-900 mb-2">No coaches found</h3>
                <p className="text-gray-600 mb-4">Try adjusting your filters or search terms</p>
                <button
                  onClick={() => {
                    setFilters({
                      specialty: "",
                      minRating: "",
                      language: "",
                      verified: false,
                      search: "",
                    })
                  }}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <>
                {/* Coach Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  {coaches.map((coach) => (
                    <CoachCard key={coach._id} coach={coach} />
                  ))}
                </div>

                {/* Enhanced Pagination */}
                {pagination.totalPages > 1 && (
                  <div className="flex justify-center">
                    <nav className="flex items-center space-x-2">
                      <button
                        onClick={() =>
                          setPagination((prev) => ({
                            ...prev,
                            currentPage: Math.max(1, prev.currentPage - 1),
                          }))
                        }
                        disabled={pagination.currentPage === 1}
                        className="px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
                      >
                        Previous
                      </button>

                      {[...Array(Math.min(5, pagination.totalPages))].map((_, index) => {
                        let page
                        if (pagination.totalPages <= 5) {
                          page = index + 1
                        } else {
                          const start = Math.max(1, pagination.currentPage - 2)
                          const end = Math.min(pagination.totalPages, start + 4)
                          page = start + index
                          if (page > end) return null
                        }
                        
                        return (
                          <button
                            key={page}
                            onClick={() => setPagination((prev) => ({ ...prev, currentPage: page }))}
                            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors shadow-sm ${
                              pagination.currentPage === page
                                ? "bg-blue-600 text-white"
                                : "text-gray-500 bg-white border border-gray-300 hover:bg-gray-50"
                            }`}
                          >
                            {page}
                          </button>
                        )
                      })}

                      <button
                        onClick={() =>
                          setPagination((prev) => ({
                            ...prev,
                            currentPage: Math.min(prev.totalPages, prev.currentPage + 1),
                          }))
                        }
                        disabled={pagination.currentPage === pagination.totalPages}
                        className="px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
                      >
                        Next
                      </button>
                    </nav>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CoachDiscovery