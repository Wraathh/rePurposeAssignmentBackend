const {buildSchema}=require("graphql")


module.exports=buildSchema(`

type Post {
    _id: ID!
    title: String!
    description: String!
    createdAt: String!
    creator: User!
  }

    type User {
        _id:ID!
        email:String!
        name: String!
        password:String
        createdPosts: [Post!]
    }

    type AuthData {
        userId: ID!
        token: String!
        tokenExpiration: Int!
    }

    input UserInput {
        email:String!
        name:String!
        password:String!
    }

    input PostInput {
        title: String!
        description: String!
        content: String!
        createdAt: String!
      }
      

    type RootQuery{
        posts: [Post!]!
        users:[User!]!
        login(email: String!, password: String!): AuthData!
    }

    type RootMutation{
        createPost(postInput: PostInput): Post
        createUser(userInput: UserInput):User
    }

    type RootSubscription {
        newPost: Post
      }

    schema{
        query:RootQuery
        mutation:RootMutation
        subscription: RootSubscription
    }
    `)