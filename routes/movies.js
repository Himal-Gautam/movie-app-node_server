import express from "express";
const router = express.Router();

router.get("/movies", async function (request, response) {
  const movies = await client
    .db("database1")
    .collection("movies")
    .find({})
    .toArray();
  await response.send(movies);
});

router.get("/movies/:id", async function (request, response) {
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

router.delete("/movies/:id", async function (request, response) {
  console.log("request.params", request.params);
  const { id } = request.params;
  const result = await client
    .db("database1")
    .collection("movies")
    .deleteOne({ id: id });
  console.log(result);
  response.send(result);
});

router.put("/movies/:id", async function (request, response) {
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

router.post("/movies", async function (request, response) {
  const newMovies = request.body;
  console.log(newMovies);
  // db.movies.insertMany(data)
  const result = await client
    .db("database1")
    .collection("movies")
    .insertMany(newMovies);

  response.send(result);
});

export const moviesRouter = router