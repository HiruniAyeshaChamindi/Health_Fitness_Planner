// import React, { useState, useEffect } from 'react';
// import { useAuth } from '../contexts/AuthContext';
// import { authAPI } from '../services/api';
// import { useNavigate } from 'react-router-dom';
// import toast from 'react-hot-toast';
// import LoadingSpinner from '../components/LoadingSpinner';
// import { Calendar, Clock } from 'lucide-react';

// const GuidedWorkoutExpert = () => {
//   const { isAuthenticated } = useAuth();
//   const navigate = useNavigate();
//   const [coaches, setCoaches] = useState([]);
//   const [selectedCoach, setSelectedCoach] = useState(null);
//   const [selectedDate, setSelectedDate] = useState('');
//   const [selectedTime, setSelectedTime] = useState('');
//   const [isLoading, setIsLoading] = useState(false);

//   useEffect(() => {
//     if (!isAuthenticated) {
//       navigate('/login');
//       return;
//     }

//     const fetchCoaches = async () => {
//       try {
//         const response = await authAPI.getCoaches();
//         setCoaches(response.data.data);
//       } catch (error) {
//         toast.error('Failed to load coaches');
//       }
//     };
//     fetchCoaches();
//   }, [isAuthenticated, navigate]);

//   const handleBookAppointment = async (coachId) => {
//     if (!selectedDate || !selectedTime) {
//       toast.error('Please select a date and time');
//       return;
//     }

//     setIsLoading(true);
//     try {
//       const response = await authAPI.bookAppointment({
//         coachId,
//         date: selectedDate,
//         time: selectedTime
//       });
//       toast.success('Appointment booked successfully!');
//       setSelectedCoach(null);
//       setSelectedDate('');
//       setSelectedTime('');
//     } catch (error) {
//       toast.error(error.response?.data?.message || 'Failed to book appointment');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
//       <div className="max-w-4xl mx-auto">
//         <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-8">
//           Book a Session with Our Expert Coaches
//         </h2>
        
//         {isLoading && <LoadingSpinner size="lg" />}
        
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           {coaches.map(coach => (
//             <div key={coach._id} className="bg-white p-6 rounded-lg shadow-md">
//               <h3 className="text-xl font-semibold text-gray-900">{coach.name}</h3>
//               <p className="text-sm text-gray-600">Specialty: {coach.specialty.replace('_', ' ').toUpperCase()}</p>
//               <p className="text-sm text-gray-600 mt-2">{coach.bio}</p>
              
//               <div className="mt-4">
//                 <label className="block text-sm font-medium text-gray-700">Select Date</label>
//                 <select
//                   className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
//                   value={selectedDate}
//                   onChange={(e) => setSelectedDate(e.target.value)}
//                 >
//                   <option value="">Select a date</option>
//                   {coach.availability.map(slot => (
//                     <option key={slot.date} value={slot.date}>
//                       {new Date(slot.date).toLocaleDateString()}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               {selectedDate && (
//                 <div className="mt-4">
//                   <label className="block text-sm font-medium text-gray-700">Select Time</label>
//                   <select
//                     className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
//                     value={selectedTime}
//                     onChange={(e) => setSelectedTime(e.target.value)}
//                   >
//                     <option value="">Select a time</option>
//                     {coach.availability.find(slot => slot.date === selectedDate)?.timeSlots.map(time => (
//                       <option key={time} value={time}>{time}</option>
//                     ))}
//                   </select>
//                 </div>
//               )}

//               <button
//                 onClick={() => handleBookAppointment(coach._id)}
//                 disabled={isLoading || !selectedDate || !selectedTime}
//                 className="mt-4 w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-50"
//               >
//                 <Calendar className="h-5 w-5 mr-2" />
//                 Book Appointment
//               </button>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default GuidedWorkoutExpert;