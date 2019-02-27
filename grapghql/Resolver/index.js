const {
  getAllEvents,
  getEvent,
  createEvent,
  updateEvent,
  deleteEvent
} = require('../../repo/eventRepo')
const { getAllUsers, userExists, createUser } = require('../../repo/userRepo')

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
  }
}

module.exports = resolver
