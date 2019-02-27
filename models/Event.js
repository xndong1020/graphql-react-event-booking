const mongoose = require('mongoose')
const { getLocalNowWithTimezone } = require('../utils/time.utils')
require('dotenv').config()

const EventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  date: {
    type: String,
    required: true,
    default: getLocalNowWithTimezone(process.env.TIME_ZONE)
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
})

const Event = mongoose.model('Event', EventSchema)

module.exports = Event
