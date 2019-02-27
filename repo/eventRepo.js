const Event = require('../models/Event')

const getAllEvents = async () => {
  const events = await Event.find({}, { __v: 0 }).populate('creator')
  return events
}

const getEvent = async id => {
  const event = await Event.findOne({ _id: id }, { __v: 0 }).populate('creator')
  return event
}

const createEvent = async event => {
  try {
    const newEvent = await Event.create(event)
    return newEvent
  } catch (e) {
    console.error('createEvent', e)
  }
}

const updateEvent = async (id, event) => {
  try {
    const eventInDb = await Event.findOneAndUpdate({ _id: id }, event)
    return !!eventInDb
  } catch (e) {
    console.error('updateEvent', e)
    return false
  }
}

const deleteEvent = async id => {
  try {
    const eventInDb = await Event.findOneAndRemove({ _id: id })
    return !!eventInDb
  } catch (e) {
    console.error('deleteEvent', e)
    return false
  }
}

module.exports = {
  getAllEvents,
  getEvent,
  createEvent,
  updateEvent,
  deleteEvent
}
