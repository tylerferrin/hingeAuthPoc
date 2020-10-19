const { context } = require('./context');
const { ApolloServer, gql } = require('apollo-server-express');
const express = require('express');
const cors = require('cors');
const { login, logout, refreshTokenSilently } = require('./Apollo/mutations');

const app = express();

const typeDefs = gql`
  type JwtToken {
    token: String
    expiry: Int
  },
  type Query {
    jwtToken: JwtToken
  }
  type Mutation {
    login(tokenString: String): String
    logout(email: String): JwtToken
    refreshTokenSilently(googleEmail: String): JwtToken
  }
`;

const resolvers = {
  Mutation: {
    login,
    logout,
    refreshTokenSilently
  }
}

const corsOptions = {
  origin: 'http://localhost:3000',
  credentials: true
}
app.use(cors(corsOptions));

const server = new ApolloServer({ typeDefs, resolvers, context });
server.applyMiddleware({ app, path: "/" });


// The `listen` method launches a web server.
app.listen({ port: 4000 }, () => {
  console.log(`🚀  Server ready at http://localhost:4000${server.graphqlPath}`);
});