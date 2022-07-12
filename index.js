import express from "express";
import dotenv from "dotenv";
import { MongoClient } from "mongodb";
import cors from "cors";
// import {moviesRouter} from "./routes/movies.js";


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
// app.use('/movies', moviesRouter);


app.get("/", function (request, response) {
  response.send("Hello World");
});

app.get("/movies", async function (request, response) {
  console.log('here');
  const movies = await client
    .db("database1")
    .collection("movies")
    .find({})
    .toArray();
  await response.send(movies);
});

app.get("/movies/:id", async function (request, response) {
  console.log(request.params);
  const { id } = request.params;
  const movie = await client
    .db("database1")
    .collection("movies")
    .findOne({ id });
  movie
    ? response.send(movie)
    : response.status(404).send({ message: "No such movie found 😅" });
});

app.delete("/movies/:id", async function (request, response) {
  console.log("request.params", request.params);
  const { id } = request.params;
  const result = await client
    .db("database1")
    .collection("movies")
    .deleteOne({ id: id });
  console.log(result);
  response.send(result);
});

app.put("/movies/:id", async function (request, response) {
  console.log("request.params", request.params);
  const { id } = request.params;
  const updateData = request.body;
  const result = await client
    .db("database1")
    .collection("movies")
    .updateOne({ id: id }, { $set: updateData });
  console.log(result);

  response.send(result);
});

app.post("/movies", async function (request, response) {
  const newMovies = request.body;
  console.log(newMovies);
  // db.movies.insertMany(data)
  const result = await client
    .db("database1")
    .collection("movies")
    .insertOne(newMovies);

  response.send(result);
});

app.listen(PORT, () => console.log(`Server is started in ${PORT}`));
