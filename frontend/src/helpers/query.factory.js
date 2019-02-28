const makeLoginQuery = (email, password) => {
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

export { makeLoginQuery }
