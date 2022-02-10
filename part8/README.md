# Part8

This part of the course is about GraphQL, Facebook's alternative to REST for communication between browser and server.

## Applications

To start the library-backend application locally:

```console
# Install dependencies
npm install

# Create an .env file with enviroment variables for connecting to the database
MONGODB_URI="<Enter URI here>"

# Set a JWT_SECRET variable in .env file, which is used for digital signatures to generate and decode valid tokens
JWT_SECRET="<Your secret here>"

# Start the application
npm run dev
```

To start the library-frontend application locally:

```console
# Install dependencies
npm install

# Start the application
npm start
```

You can use user `root` with the password `secret` to login into the application and get access to its full functionality.