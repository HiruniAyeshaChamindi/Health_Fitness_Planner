// const Coach = require('../models/Coach');
// const Appointment = require('../models/Appointment');
// const { body, validationResult } = require('express-validator');

// // Get all coaches
// exports.getCoaches = async (req, res) => {
//   try {
//     const coaches = await Coach.find().select('name specialty bio availability');
//     res.status(200).json({ success: true, data: coaches });
//   } catch (error) {
//     console.error('Error fetching coaches:', error);
//     res.status(500).json({ success: false, message: 'Server error' });
//   }
// };

// // Create a coach (admin-only, for seeding or admin panel)
// exports.createCoach = [
//   body('name').trim().isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters'),
//   body('specialty').isIn(['weight_loss', 'muscle_gain', 'endurance', 'flexibility', 'general_fitness']).withMessage('Invalid specialty'),
//   body('bio').optional().trim().isLength({ max: 500 }).withMessage('Bio must be less than 500 characters'),
//   body('availability').isArray().withMessage('Availability must be an array'),
//   async (req, res) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({ success: false, message: 'Validation errors', errors: errors.array() });
//     }

//     try {
//       const coach = new Coach(req.body);
//       await coach.save();
//       res.status(201).json({ success: true, message: 'Coach created', data: coach });
//     } catch (error) {
//       console.error('Error creating coach:', error);
//       res.status(500).json({ success: false, message: 'Server error' });
//     }
//   }
// ];

// // Book an appointment
// exports.bookAppointment = [
//   body('coachId').isMongoId().withMessage('Invalid coach ID'),
//   body('date').isISO8601().toDate().withMessage('Invalid date'),
//   body('time').notEmpty().withMessage('Time is required'),
//   async (req, res) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({ success: false, message: 'Validation errors', errors: errors.array() });
//     }

//     try {
//       const { coachId, date, time } = req.body;
//       const coach = await Coach.findById(coachId);
//       if (!coach) {
//         return res.status(404).json({ success: false, message: 'Coach not found' });
//       }

//       // Check if time slot is available
//       const availability = coach.availability.find(slot => 
//         slot.date.toISOString().split('T')[0] === new Date(date).toISOString().split('T')[0] && slot.timeSlots.includes(time)
//       );
//       if (!availability) {
//         return res.status(400).json({ success: false, message: 'Time slot not available' });
//       }

//       const appointment = new Appointment({
//         user: req.user.id, // From JWT middleware
//         coach: coachId,
//         date,
//         time
//       });
//       await appointment.save();

//       // Update user's appointments
//       await User.findByIdAndUpdate(req.user.id, { $push: { appointments: appointment._id } });

//       // Remove booked time slot
//       await Coach.findByIdAndUpdate(coachId, {
//         $pull: { 'availability.$[day].timeSlots': time },
//       }, {
//         arrayFilters: [{ 'day.date': new Date(date) }]
//       });

//       res.status(201).json({ success: true, message: 'Appointment booked', data: appointment });
//     } catch (error) {
//       console.error('Error booking appointment:', error);
//       res.status(500).json({ success: false, message: 'Server error' });
//     }
//   }
// ];

// // Get user's appointments
// exports.getUserAppointments = async (req, res) => {
//   try {
//     const appointments = await Appointment.find({ user: req.user.id })
//       .populate('coach', 'name specialty')
//       .sort({ date: 1 });
//     res.status(200).json({ success: true, data: appointments });
//   } catch (error) {
//     console.error('Error fetching appointments:', error);
//     res.status(500).json({ success: false, message: 'Server error' });
//   }
// };