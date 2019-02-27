const { buildSchema } = require('graphql')

const Schema = buildSchema(`
type Booking {
    _id: ID!
    user: User!
    event: Event!
    createdAt: String
    updatedAt: String
}
type Event {
    _id: ID!
    title: String!
    description: String!
    price: Float!
    date: String
    creator: User!
}

type User {
    _id: ID!,
    email: String!
    password: String
    createdEvents: [Event!]
}

input EventInput {
    title: String!
    description: String!
    price: Float!
    date: String
}

input UserInput {
    email: String!
    password: String!
}

input BookingInput {
    user: ID
    event: ID
}

type RootQuery {
    events: [Event!]!
    event(id: ID!): Event!
    users: [User!]!
    bookings(bookingInput: BookingInput!): [Booking!]
}

type RootMutation {
    createEvent(eventInput: EventInput!): Event!
    updateEvent(id: ID!, event: EventInput!): Boolean
    deleteEvent(id: ID!): Boolean
    createUser(userInput: UserInput!): User!
    createBooking(bookingInput: BookingInput!): Booking!
}

schema {
    query: RootQuery
    mutation: RootMutation
}
`)

module.exports = Schema
