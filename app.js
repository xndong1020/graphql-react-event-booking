const express = require('express')
const bodyParser = require('body-parser')
const graphqlHttp = require('express-graphql')
const cors = require('cors')
const authMiddleware = require('./middlewares/auth')
const graghqlSchema = require('./grapghql/Schema')
const graghqlResolver = require('./grapghql/Resolver')

require('./db')

const server = express()

server.use(bodyParser.json())
server.use(cors())
// server.use(authMiddleware)

server.use(
  '/graphql',
  graphqlHttp({
    schema: graghqlSchema,
    rootValue: graghqlResolver,
    graphiql: true
  })
)

server.listen(4000, () => {
  console.log(`Server is listening on port 4000`)
})
