require("dotenv").config();
const { ApolloServer, UserInputError, gql } = require("apollo-server");
// const { v1: uuid } = require("uuid");
const mongoose = require("mongoose");
const Author = require("./models/author");
const Book = require("./models/book");

// console.log(process.env.MONGODB_URI);
const MONGODB_URI = process.env.MONGODB_URI;
console.log("Connecting to ", MONGODB_URI);

mongoose
  .connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
  })
  .then(() => {
    console.log("Connected to MongoDB!");
  })
  .catch((error) => {
    console.log("Error connecting to MongoDB: ", error.message);
  });

let books = [
  {
    title: "Clean Code",
    published: 2008,
    author: "Robert Martin",
    id: "afa5b6f4-344d-11e9-a414-719c6709cf3e",
    genres: ["refactoring"],
  },
  {
    title: "Agile software development",
    published: 2002,
    author: "Robert Martin",
    id: "afa5b6f5-344d-11e9-a414-719c6709cf3e",
    genres: ["agile", "patterns", "design"],
  },
  {
    title: "Refactoring, edition 2",
    published: 2018,
    author: "Martin Fowler",
    id: "afa5de00-344d-11e9-a414-719c6709cf3e",
    genres: ["refactoring"],
  },
  {
    title: "Refactoring to patterns",
    published: 2008,
    author: "Joshua Kerievsky",
    id: "afa5de01-344d-11e9-a414-719c6709cf3e",
    genres: ["refactoring", "patterns"],
  },
  {
    title: "Practical Object-Oriented Design, An Agile Primer Using Ruby",
    published: 2012,
    author: "Sandi Metz",
    id: "afa5de02-344d-11e9-a414-719c6709cf3e",
    genres: ["refactoring", "design"],
  },
  {
    title: "Crime and punishment",
    published: 1866,
    author: "Fyodor Dostoevsky",
    id: "afa5de03-344d-11e9-a414-719c6709cf3e",
    genres: ["classic", "crime"],
  },
  {
    title: "The Demon ",
    published: 1872,
    author: "Fyodor Dostoevsky",
    id: "afa5de04-344d-11e9-a414-719c6709cf3e",
    genres: ["classic", "revolution"],
  },
];

// GraphQL schema
// The schema describes what queries the client can send to the server, what kind of parameters the queries can have, and what kind of data the queries return.
const typeDefs = gql`
  type Book {
    title: String!
    author: Author!
    published: Int!
    genres: [String!]!
    id: ID!
  }

  type Author {
    name: String!
    born: Int
    bookCount: Int!
    id: ID!
  }

  type Query {
    bookCount: Int!
    authorCount: Int!
    allBooks(author: String, genre: String): [Book!]!
    allAuthors: [Author!]!
  }

  type Mutation {
    addBook(
      title: String!
      author: String!
      published: Int!
      genres: [String!]!
    ): Book
    editAuthor(name: String!, setBornTo: Int!): Author
  }
`;

// Define how should graphQL respond to queries (what data to return) with resolvers
const resolvers = {
  // Query resolvers define how GraphQL queries are responded to
  Query: {
    bookCount: () => Book.collection.countDocuments(),
    authorCount: () => Author.collection.countDocuments(),
    // Skip part with the parameters included
    allBooks: (root, args) => {
      if (args.author) {
        if (args.genre) {
          return books.filter(
            (book) =>
              book.author === args.author && book.genres.includes(args.genre)
          );
          // .filter((book) => book.genres.includes(args.genre));
        }
        return books.filter((book) => book.author === args.author);
      }

      if (args.genre) {
        return books.filter((book) => book.genres.includes(args.genre));
      }

      return Book.find({});
    },
    // allAuthors: () =>
    //   authors.map((author) => {
    //     return {
    //       name: author.name,
    //       bookCount: books.filter((item) => item.author === author.name).length,
    //     };
    //   }),
    allAuthors: () => Author.find({}),
  },
  // Change the default resolver of the bookCount field for the Author type
  // https://docs.mongodb.com/v4.2/reference/method/db.collection.countDocuments/#definition
  Author: {
    bookCount: (root) => Book.countDocuments({ author: root._id }),
  },
  // Mutations are operations that cause a change
  Mutation: {
    addBook: async (root, args) => {
      const bookExists = await Book.findOne({ title: args.title });
      const authorExists = await Author.findOne({ name: args.author });

      if (bookExists) {
        throw new UserInputError("Book already in database", {
          invalidArgs: args.title,
        });
      }

      if (authorExists === null) {
        const author = new Author({ name: args.author });
        try {
          await author.save();
        } catch (error) {
          throw new UserInputError(error.message, {
            invalidArgs: args,
          });
        }
      }

      const foundAuthor = await Author.findOne({ name: args.author });
      const book = new Book({ ...args, author: foundAuthor });

      try {
        const response = await book.save();
        return response;
      } catch (error) {
        throw new UserInputError(error.message, {
          invalidArgs: args,
        });
      }
    },
    editAuthor: async (root, args) => {
      const author = await Author.findOne({ name: args.name });

      if (!author) {
        return null;
      }

      author.born = args.setBornTo;

      await Author.findByIdAndUpdate(author._id, author, { new: true });
      return author;
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`);
});
