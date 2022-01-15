# Part4

In this part, we will continue our work on the backend. Our first major theme will be writing unit and integration tests for the backend. After we have covered testing, we will take a look at implementing user authentication and authorization.

## Applications

To start the blog list application locally:

```console
# Install dependencies
npm install

# Create an .env file with enviroment variables for connecting to the database
MONGODB_URI="<Enter URI here>"
PORT=3003
TEST_MONGODB_URI="<Enter test DB URI here>"

# Set a SECRET variable in .env file, which is used for digital signatures to generate and decode valid tokens
SECRET="<Your secret here>"

# Start the application in production enviroment
npm start

# Start the application in development enviroment
npm run dev

# Start the application in test enviroment and then run tests
npm run start:test
npm test
```

The app allows the following operations:
- Create, read, update and delete Blogs for an authenticated user (POST, GET, PUT, DELETE)
- Create and read all Users (POST, GET)
- Login into the app with an username and password (POST)

```console
# Create an user
POST /api/users
{
    "username": "root",
    "name": "root",
    "password": "root"
}

# Login with the created user
POST /api/login
{
    "username": "root",
    "password": "root"
}

# Create a new Blog (jwt token is sent back to the user when a new user is successfully logged in)
POST /api/blogs - {"Authorization": "Bearer JWT-TOKEN"}
{
    "title": "My title",
    "author": "My author",
    "url": "www.example.com",
    "likes": 5 (likes can be omitted from the request)
}
```