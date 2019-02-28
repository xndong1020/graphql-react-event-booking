const makeLoginQuery = ({ email, password }) => {
  return {
    query: `
          query {
            login(userInput:{
              email: "${email}",
              password:"${password}"
          }) {
            token,
            sub,
            email
          }
        }`
  }
}

const makeCreateUserQuery = ({ email, password }) => {
  return {
    query: `
          mutation {
            createUser(userInput:{
              email: "${email}",
              password:"${password}"
          }) {
            email
          }
        }`
  }
}

export { makeLoginQuery, makeCreateUserQuery }
