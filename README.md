Features
CRUD operations for posts
User authentication using JSON Web Tokens (JWT)
Real-time updates with GraphQL subscriptions
Technologies Used
Node.js: Backend JavaScript runtime
Express.js: Web application framework for Node.js
GraphQL: Query language for APIs
Mongoose: MongoDB object modeling for Node.js
MongoDB: NoSQL database
Apollo Server: GraphQL server for Node.js
JSON Web Tokens (JWT): User authentication
Setup
Clone the repository.
Install the dependencies: npm install.
Set up environment variables for MongoDB and JWT secret.
Run the development server: npm start.
Usage
The GraphQL API is available at http://localhost:3000/graphql.
You can use a GraphQL client like GraphiQL or Apollo Playground to interact with the API and test queries, mutations, and subscriptions.
Endpoints
POST /graphql: GraphQL endpoint for queries and mutations.
GET /graphql: GraphQL endpoint for subscriptions over WebSocket.
