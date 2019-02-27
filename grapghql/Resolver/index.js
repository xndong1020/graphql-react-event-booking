const {
  getAllEvents,
  getEvent,
  createEvent,
  updateEvent,
  deleteEvent
} = require('../../repo/eventRepo')
const { getAllUsers, userExists, createUser } = require('../../repo/userRepo')
const {
  getBooking,
  createBooking,
  cancelBooking
} = require('../../repo/bookingRepo')
const { login } = require('../../services/authService')

const resolver = {
  events: async () => {
    const events = await getAllEvents()
    return events
  },
  event: async args => {
    const { id } = args
    const event = await getEvent(id)
    return event
  },
  users: async () => {
    const users = await getAllUsers()
    return users
  },
  bookings: async args => {
    const booking = await getBooking(args.bookingInput)
    return booking
  },
  createEvent: async args => {
    const event = {
      ...args.event
    }
    const newEvent = await createEvent(event)
    return newEvent.toObject()
  },
  updateEvent: async args => {
    const { id } = args
    const updatedEvent = {
      ...args.event
    }
    const result = await updateEvent(id, updatedEvent)
    return result
  },
  deleteEvent: async args => {
    const { id } = args
    const result = await deleteEvent(id)
    return result
  },
  createUser: async args => {
    const { email } = args.userInput
    const isUserExists = await userExists(email)
    if (isUserExists) throw new Error('User already exists!')
    const newUser = await createUser({ ...args.userInput })
    return newUser
  },
  createBooking: async (args, req) => {
    if (!req.isAuthenticated) throw new Error('UnAuthorized request')
    const newBooking = await createBooking(args.bookingInput)
    return newBooking
  },
  login: async args => {
    const token = await login(args.userInput)
    return token
  }
}

module.exports = resolver
