const Booking = require('../models/Booking')

const getAllBookingByUserId = async userId => {
  const bookings = await Booking.find({ user: userId }, { __v: 0 })
    .sort({
      createdAt: -1
    })
    .populate('user')
    .populate('event')
  return bookings
}

const getAllBookingByEventId = async eventId => {
  const bookings = await Booking.find({ event: eventId }, { __v: 0 })
    .sort({
      createdAt: -1
    })
    .populate('user')
    .populate('event')
  return bookings
}

const getAllBookingByUserIdAndEventId = async (userId, eventId) => {
  const bookings = await Booking.find(
    { user: userId, event: eventId },
    { __v: 0 }
  )
    .sort({
      createdAt: -1
    })
    .populate('user')
    .populate('event')
  return bookings
}

const getBooking = async bookingInput => {
  const { user, event } = bookingInput
  let booking
  if (user && event)
    booking = await getAllBookingByUserIdAndEventId(user, event)
  else if (user && !event) booking = await getAllBookingByUserId(user)
  else if (!user && event) booking = await getAllBookingByEventId(event)
  return booking
}

const createBooking = async booking => {
  const newBooking = await Booking.create(booking)
  const bookingDetails = await Booking.findOne({ _id: newBooking._id })
    .populate('user')
    .populate('event')
  return bookingDetails
}

const cancelBooking = async id => {
  const bookingInDb = await Booking.findOneAndRemove({ _id: id })
  return !!bookingInDb
}

module.exports = {
  getBooking,
  createBooking,
  cancelBooking
}
