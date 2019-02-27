const express = require('express')
const bodyParser = require('body-parser')
const graphqlHttp = require('express-graphql')
const graghqlSchema = require('./grapghql/Schema')
const graghqlResolver = require('./grapghql/Resolver')

require('./db')

const server = express()

server.use(bodyParser.json())

server.use(
  '/graphql',
  graphqlHttp({
    schema: graghqlSchema,
    rootValue: graghqlResolver,
    graphiql: true
  })
)

server.listen(3000, () => {
  console.log(`Server is listening on port 3000`)
})
