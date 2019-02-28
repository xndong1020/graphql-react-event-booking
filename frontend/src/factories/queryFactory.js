import { makeLoginQuery, makeCreateUserQuery } from '../helpers/queries.util'

class QueryFactory {
  constructor() {
    this.query = {}
  }

  build = (type, payload) => {
    switch (type) {
      case 'login':
        this.query = makeLoginQuery(payload)
        break
      case 'register':
        this.query = makeCreateUserQuery(payload)
        break

      default:
        break
    }

    return this
  }

  stringify = () => {
    return JSON.stringify(this.query)
  }
}

export default QueryFactory
