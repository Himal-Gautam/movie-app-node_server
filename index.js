import express from "express";
import dotenv from "dotenv";
import { MongoClient, ObjectId } from "mongodb";
import cors from "cors";

dotenv.config();

const app = express();
const PORT = process.env.PORT;
const MONGO_URI = process.env.MONGO_URI;
const client = new MongoClient(MONGO_URI);

async function createConnection() {
  await client.connect();
  console.log("Mongo is connected");
  return client;
}

createConnection();

app.use(cors());
app.use(express.json());

app.get("/", function (request, response) {
  response.send("Hello World");
});

// Get all the movies route
app.get("/movies", async function (request, response) {
  try {
    const movies = await client
      .db("database1")
      .collection("movies")
      .find({})
      .toArray();

    response.send(movies);
  } catch (error) {
    response.status(404).send(error);
  }
});

// Get specific movie using MongoDb ObjectId route
app.get("/movies/:id", async function (request, response) {
  try {
    // Getting the ObjectID from request parameters
    const { id } = request.params;
    // Executing the querry
    const movie = await client
      .db("database1")
      .collection("movies")
      .findOne({ _id: ObjectId(id) });
    // sending the response
    movie
      ? response.send(movie)
      : response.status(404).send({ message: "No such movie found 😅" });
  } catch (error) {
    response.status(404).send(error);
  }
});

// Delete specific movie using MongoDb ObjectId route
app.delete("/movies/:id", async function (request, response) {
  try {
    // Getting the ObjectID from request parameters
    const { id } = request.params;
    // Executing the querry
    const result = await client
      .db("database1")
      .collection("movies")
      .deleteOne({ _id: ObjectId(id) });
    // sending the response
    response.send(result);
  } catch (error) {
    response.status(404).send(error);
  }
});

// Update specific movie using MongoDb ObjectId route
app.put("/movies/:id", async function (request, response) {
  try {
    // Getting the ObjectID from request parameters
    const { id } = request.params;
    // storing the data to update
    const updateData = request.body;
    // Executing the querry
    const result = await client
      .db("database1")
      .collection("movies")
      .updateOne({ _id: ObjectId(id) }, { $set: updateData });
    // sending the response
    response.send(result);
  } catch (error) {
    response.status(404).send(error);
  }
});

// Add a new movie in the collection
app.post("/movies", async function (request, response) {
  try {
  } catch (error) {
    response.status(404).send(error);
  }
  // storing the data of new movie
  const newMovie = request.body;
  // Executing the querry

  const result = await client
    .db("database1")
    .collection("movies")
    .insertOne(newMovie);

  // sending the response
  response.send(result);
});

// App  server listens on the PORT
app.listen(PORT, () => console.log(`Server is started in ${PORT}`));
