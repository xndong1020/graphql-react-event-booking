const { buildSchema } = require('graphql')

const Schema = buildSchema(`
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

type RootQuery {
    events: [Event!]!
    event(id: ID!): Event!
    users: [User!]!
}

type RootMutation {
    createEvent(eventInput: EventInput!): Event!
    updateEvent(id: ID!, event: EventInput!): Boolean
    deleteEvent(id: ID!): Boolean
    createUser(userInput: UserInput!): User!
}

schema {
    query: RootQuery
    mutation: RootMutation
}
`)

module.exports = Schema
