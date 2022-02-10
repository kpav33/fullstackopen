require("dotenv").config();
const {
  ApolloServer,
  UserInputError,
  AuthenticationError,
  gql,
} = require("apollo-server");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const { PubSub } = require("apollo-server");
const pubsub = new PubSub();

const Author = require("./models/author");
const Book = require("./models/book");
const User = require("./models/user");

const MONGODB_URI = process.env.MONGODB_URI;
const SECRET = process.env.JWT_SECRET;
console.log("Connecting to ", MONGODB_URI);
console.log("Secret ", SECRET);

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

// mongoose.set("debug", true);

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

  type User {
    username: String!
    favoriteGenre: String!
    id: ID!
  }

  type Token {
    value: String!
  }

  type Query {
    bookCount: Int!
    authorCount: Int!
    allBooks(author: String, genre: String): [Book!]!
    allAuthors: [Author!]!
    me: User
  }

  type Mutation {
    addBook(
      title: String!
      author: String!
      published: Int!
      genres: [String!]!
    ): Book
    editAuthor(name: String!, setBornTo: Int!): Author
    createUser(username: String!, favoriteGenre: String!): User
    login(username: String!, password: String!): Token
  }

  type Subscription {
    bookAdded: Book!
  }
`;

let books;

// Define how should graphQL respond to queries (what data to return) with resolvers
const resolvers = {
  // Query resolvers define how GraphQL queries are responded to
  Query: {
    bookCount: () => Book.collection.countDocuments(),
    authorCount: () => Author.collection.countDocuments(),
    allBooks: async (root, args) => {
      if (args.author) {
        const findAuthor = await Author.findOne({ name: args.author });
        // https://docs.mongodb.com/manual/reference/operator/query/in/
        if (args.genre) {
          return await Book.find({
            author: findAuthor.id,
            genres: { $in: [args.genre] },
          }).populate("author");
        }
        return await Book.find({
          author: findAuthor.id,
        }).populate("author");
      }

      if (args.genre) {
        return await Book.find({
          genres: { $in: [args.genre] },
        }).populate("author");
      }

      return Book.find({}).populate("author");
    },
    allAuthors: async () => {
      // Before n + 1 solution
      // return Author.find({});
      // Solution for the exercise 8.26. from the example solution
      // Refactored my code to this, because the example solution is much cleaner and simpler than the one I originally came up with
      books = await Book.find();
      return Author.find({});
    },
    me: (root, args, context) => context.currentUser,
  },
  // Change the default resolver of the bookCount field for the Author type
  // https://docs.mongodb.com/v4.2/reference/method/db.collection.countDocuments/#definition
  // Before n + 1 solution
  // Author: {
  //   bookCount: (root) => {
  //     console.log("Book.countDocuments");
  //     return Book.countDocuments({ author: root._id });
  //   },
  // },
  // Solution for the exercise 8.26. from the example solution
  // Refactored my code to this, because the example solution is much cleaner and simpler than the one I originally came up with
  Author: {
    bookCount: async (root) =>
      books.filter((b) => String(b.author) === String(root.id)).length,
  },
  // Mutations are operations that cause a change
  Mutation: {
    addBook: async (root, args, context) => {
      const currentUser = context.currentUser;
      // console.log(currentUser);

      if (!currentUser) {
        throw new AuthenticationError("not authenticated");
      }

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
        // const response = await book.save();
        // return response;
        await book.save();
      } catch (error) {
        throw new UserInputError(error.message, {
          invalidArgs: args,
        });
      }

      pubsub.publish("BOOK_ADDED", { bookAdded: book });

      return book;
    },
    editAuthor: async (root, args, context) => {
      const currentUser = context.currentUser;

      if (!currentUser) {
        throw new AuthenticationError("not authenticated");
      }

      books = await Book.find();
      const author = await Author.findOne({ name: args.name });
      // Added to work with n + 1 solution
      // const books = await Book.find({});
      // const bookCount = books.filter(
      //   (book) => book.author === author.id
      // ).length;

      if (!author) {
        return null;
      }

      author.born = args.setBornTo;
      // Added to work with n + 1 solution
      // author.bookCount = bookCount;

      try {
        await Author.findByIdAndUpdate(author._id, author, { new: true });
        return author;
      } catch (error) {
        throw new UserInputError(error.message, {
          invalidArgs: args,
        });
      }
    },
    createUser: async (root, args) => {
      const user = new User({
        username: args.username,
        favoriteGenre: args.favoriteGenre,
      });

      try {
        const response = await user.save();
        return response;
      } catch (error) {
        throw new UserInputError(error.message, { invalidArgs: args });
      }
    },
    login: async (root, args) => {
      const user = await User.findOne({ username: args.username });

      if (!user || args.password !== "secret") {
        throw new UserInputError("wrong credentials");
      }

      const userForToken = {
        username: user.username,
        id: user._id,
      };

      return { value: jwt.sign(userForToken, SECRET) };
    },
  },
  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterator(["BOOK_ADDED"]),
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    const auth = req ? req.headers.authorization : null;
    if (auth && auth.toLowerCase().startsWith("bearer ")) {
      const decodedToken = jwt.verify(auth.substring(7), SECRET);
      const currentUser = await User.findById(decodedToken.id);
      return { currentUser };
    }
  },
});

server.listen().then(({ url, subscriptionsUrl }) => {
  console.log(`Server ready at ${url}`);
  console.log(`Subscriptions ready at ${subscriptionsUrl}`);
});
