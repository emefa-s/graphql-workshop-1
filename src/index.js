import { GraphQLServer } from "graphql-yoga";
import gql from "graphql-tag";
import db from "./db";

const typeDefs = gql`
  type Query {
    users: [User!]!
    user(id: ID!): User
    posts: [Post!]!
    comments: [Comment!]!
  }

  type User {
    name: String!
    email: String!
    age: Int
    id: ID!
    posts: [Post!]!
  }

  type Post {
    title: String!
    body: String!
    id: ID!
    published: Boolean!
    author: User!
  }

  type Comment {
    id: ID!
    text: String!
    post: Post!
    author: User!
  }
`;

const resolvers = {
  Query: {
    users() {
      return db.users;
    },

    user(_, args) {
      return db.users.find(user => user.id === args.id)
    },

    posts() {
      return db.posts;
    },

    comments() {
      return db.comments;
    }
  },

  Post: {
    author(post) {
      return db.users.find(user => user.id === post.author);
    },
    comment(post) {
      return db.comments.filter(comment => comment.post === post.id)
    },
  },


  User: {
    posts(user) {
      return db.posts.filter(post => post.author === user.id)
    },
    comment(user) {
      return db.comments.filter(comment => comment.author === user.id)
    },
  },


  Comment: {
    post(comment) {
      return db.posts.find(post => post.id === comment.id)
    },
    author(comment) {
      return db.authors.find(author => author.id === comment.author)
    },
  }
};

const server = new GraphQLServer({
  typeDefs,
  resolvers
});

server.start(() => {
  console.log("The server is up!");
});
