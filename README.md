## Step 01. Dependencies

```javascript
npm i express body-parser express-graphql graphql
```

## Step 02. Step up dev server

```javascript
const express = require('express')
const bodyParser = require('body-parser')

const server = express()

server.use(bodyParser.json())

server.use('/', (req, res, next) => {
  res.send('hello world')
})

server.listen(3000, () => {
  console.log(`Server is listening on port 3000`)
})
```

## Step 03.  Create a simplest graphql endpoint for testing
```javascript
server.use(
  '/graphql',
  graphqlHttp({
    schema: buildSchema(`
        type RootQuery {
            events: [String!]
        }

        type RootMutation {
            createEvent(name: String): String
        }

        schema {
            query: RootQuery
            mutation: RootMutation
        }
    `),
    rootValue: {
      events: () => {
        return ['Romantic', 'Cooking', 'Coding']
      },
      createEvent: args => {
        console.log('args of createEvent', args)
        const { name } = args
        return name
      }
    },
    graphiql: true
  })
)

server.listen(3000, () => {
  console.log(`Server is listening on port 3000`)
})

```

## Step 04. Add a custom type 'Event'

```javascript
const express = require('express')
const bodyParser = require('body-parser')
const graphqlHttp = require('express-graphql')
const { buildSchema } = require('graphql')

const server = express()

server.use(bodyParser.json())

const events = [
  {
    _id: 'sdasdasda',
    title: 'Jeremy Concert',
    description: 'You must see it',
    price: 30.3,
    date: '2017-01-09T17:30:50Z'
  },
  {
    _id: 'sdaghfhdfg',
    title: 'Harper Show',
    description: 'Young Harper',
    price: 100.75,
    date: '2017-02-09T17:30:50Z'
  },
  {
    _id: 'nghjgghjgjyh',
    title: 'Nicole Concert',
    description: `You can't miss it`,
    price: 10.3,
    date: '2017-03-09T17:30:50Z'
  }
]

server.use(
  '/graphql',
  graphqlHttp({
    schema: buildSchema(`
        type Event {
            _id: ID!
            title: String!
            description: String!
            price: Float!
            date: String
        }

        input EventInput {
            title: String!
            description: String!
            price: Float!
            date: String
        }

        type RootQuery {
            events: [Event!]!
        }

        type RootMutation {
            createEvent(event: EventInput!): [Event!]
        }

        schema {
            query: RootQuery
            mutation: RootMutation
        }
    `),
    rootValue: {
      events: () => {
        return events
      },
      createEvent: args => {
        const allEvents = [
          ...events,
          {
            ...args,
            _id: Math.random().toString(),
            date: new Date().toISOString()
          }
        ]
        return allEvents
      }
    },
    graphiql: true
  })
)

server.listen(3000, () => {
  console.log(`Server is listening on port 3000`)
})
```

Basically we use express-graphql to create a simple schema, which contains a query and mutation property, and its matching resolvers


## Step 04. Add another custom type 'User', and establish a one-to-many relationship between User and Events(An User can create many Events, An event is created by one User)
Firstly we modify our models
/models/User.js
```javascript
const mongoose = require('mongoose')
require('dotenv').config()

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    createdEvents: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Event'
      }
    ]
  },
  {
    timestamps: true
  }
)

const User = mongoose.model('User', UserSchema)

module.exports = User
```

/models/Event.js
```javascript
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

```

And we update our repos to reflex the change
/repo/userRepo.js
```javascript
const User = require('../models/User')
const { createHashedPassword } = require('../utils/security.utils')

const getAllUsers = async () => {
  const users = await User.find({}, { __v: 0 }).populate('createdEvents')
  return users
}

const userExists = async email => {
  const user = await User.findOne({ email })
  return !!user
}

const createUser = async user => {
  const hashedPassed = await createHashedPassword(user.password)
  const newUser = await User.create({ ...user, password: hashedPassed })
  return newUser
}

module.exports = {
  getAllUsers,
  userExists,
  createUser
}

```
/repo/eventRepo.js
```javascript
const User = require('../models/User')
const { createHashedPassword } = require('../utils/security.utils')

const getAllUsers = async () => {
  const users = await User.find({}, { __v: 0 }).populate('createdEvents')
  return users
}

const userExists = async email => {
  const user = await User.findOne({ email })
  return !!user
}

const createUser = async user => {
  const hashedPassed = await createHashedPassword(user.password)
  const newUser = await User.create({ ...user, password: hashedPassed })
  return newUser
}

module.exports = {
  getAllUsers,
  userExists,
  createUser
}

```

lastly we fix the graphql query schema
```javascript
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
```

Now you can start testing
```javascript
query {
  users {
    email,
    createdEvents {
      title,
      description
    }
  }
}
```

result 
```javascript
{
  "data": {
    "users": [
      {
        "email": "isdance2004@hotmail.com",
        "createdEvents": [
          {
            "title": "New event",
            "description": "A new event"
          }
        ]
      }
    ]
  }
}
```

