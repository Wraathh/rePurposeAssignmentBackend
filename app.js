const express = require('express');
const bodyParser = require('body-parser');
const { graphqlHTTP } = require('express-graphql');
const { SubscriptionServer } = require('subscriptions-transport-ws');
const { execute, subscribe } = require('graphql');
const { createServer } = require('http');
const mongoose = require('mongoose');
const graphqlSchema = require('./graphql/schema/index');
const graphqlResolvers = require('./graphql/resolvers/index');
const isAuth = require('./middleware/auth');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

app.use(isAuth);

app.use('/graphql', graphqlHTTP({
  schema: graphqlSchema,
  rootValue: graphqlResolvers,
  graphiql: true
}));

const server = createServer(app);

mongoose.connect(`mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@cluster0.58fa8u8.mongodb.net/${process.env.MONGO_DATABASE}?retryWrites=true&w=majority`)
  .then(() => {
    server.listen(3000, () => {
      console.log('Server is running at http://localhost:3000/graphql');
    });

    // Create the SubscriptionServer for WebSocket support
    new SubscriptionServer(
      {
        execute,
        subscribe,
        schema: graphqlSchema, // Use the same schema for subscriptions
        onConnect: (connectionParams, webSocket) => {
          console.log('WebSocket connected:', connectionParams);
        },
        onDisconnect: (webSocket, context) => {
          console.log('WebSocket disconnected');
        },
      },
      {
        server: server,
        path: '/subscriptions', // Use a different path for subscriptions
      }
    );
  })
  .catch((error) => {
    console.log(error);
  });
