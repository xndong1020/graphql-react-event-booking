## Step 01. Dependencies

```javascript
npm i express body-parser express-graphql graphql jsonwebtoken
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

## Step 05. Add login with jsonwebtoken
1. grapghql schema
```javascript
type AuthInfo {
    sub: ID!
    email: String!
    token: String!
}

...

type RootQuery {
    ...
    login(userInput: UserInput): AuthInfo!
}
```

2. resolver
```javascript
...
login: async args => {
    const token = await login(args.userInput)
    return token
  }
```

3. services/authService.js
```javascript
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { userExists } = require('../repo/userRepo')
require('dotenv').config()

const login = async loginInput => {
  const { email, password } = loginInput
  if (!email || !password) throw new Error(`Invalid credentials`)

  const userInDb = await userExists(email)
  if (!userInDb) throw new Error(`User does not exist`)

  const isPasswordMatch = await bcrypt.compare(password, userInDb.password)
  if (!isPasswordMatch) throw new Error(`Wrong password`)

  // if all good
  const token = jwt.sign(
    { sub: userInDb._id, email },
    process.env.AUTH_SECRET,
    {
      expiresIn: '1h'
    }
  )

  return {
    sub: userInDb._id,
    email,
    token
  }
}

module.exports = {
  login
}
```

4. create a auth middleware to valid authorization header. If the authorization passed, add 'isAuthenticated' and 'userId' to req
```javascript
const jwt = require('jsonwebtoken')
require('dotenv').config()

const auth = (req, res, next) => {
  const authHeader = req.get('Authorization')
  if (!authHeader) {
    req.isAuthenticated = false
    return next(new Error('No Auth header provided'))
  }
  const token = authHeader.split(' ')[1]
  if (!token) {
    req.isAuthenticated = false
    return next(new Error('token missing'))
  }

  let decodedToken
  try {
    decodedToken = jwt.verify(token, process.env.AUTH_SECRET)
  } catch (err) {
    req.isAuthenticated = false
    return next(err)
  }

  req.isAuthenticated = true
  req.userId = decodedToken.sub
  next()
}

module.exports = auth

```

5. Guard your path, by checking req.isAuthenticated and/or req.userId
```javascript
createBooking: async (args, req) => {
    if (!req.isAuthenticated) throw new Error('UnAuthorized request')
    const newBooking = await createBooking(args.bookingInput)
    return newBooking
  }
```
