const { getCollection, closeConnection } = require("../../mongoDB");
const express = require("express");

const app = express();

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/users", async (req, res) => {
  try {
    const collection = await getCollection("users");
    const docs = await collection.find({}).toArray();
    res.status(200).send(docs);
  } catch (e) {
    console.log(e);
    res.status(400).send("Error getting users.");
  }
});

// Add a new user to the database
app.post("/user", async (req, res) => {
  const collection = await getCollection("users");

  const doc = req.body;
  if (!doc || !doc.name || !doc.price) {
    return res.status(400).send("Missing name and/or price fields.");
  }
  let result = await collection.insertOne(doc);
  res.status(201).send(result.ops[0]);
});

// GET a single user by its ID
app.get("/user/:id", async (req, res) => {
  const id = req.params.id;
  const collection = await getCollection("users");
  const item = await collection.findOne({ _id: id });
  console.log(item, "item", id);
  if (!item) {
    return res.status(404).send("The specified user does not exist.");
  }
  res.status(200).send(item);
});

// UPDATE an existing user
app.put("/user/:id", async (req, res) => {
  const collection = await getCollection("users");

  const updateDoc = req.body;
  const id = req.params.id;
  if (!updateDoc || !updateDoc.name || !updateDoc.price) {
    return res.status(400).send("Missing name and/or price fields.");
  }
  const query = { _id: id };
  const options = { returnOriginal: false };
  let updatedItem = await collection.findOneAndUpdate(query, { $set: updateDoc }, options);
  if (!updatedItem.value) {
    return res.status(404).send("The specified user was not found.");
  } else {
    res.status(200).send(updatedItem.value);
  }
});

// DELETE a user from the database
app.delete("/user/:id", async (req, res) => {
  const collection = await getCollection("users");

  const id = req.params.id;
  const item = await collection.findOne({ _id: id });
  if (!item) {
    return res.status(404).send("No user with that ID exists.");
  }
  await collection.deleteOne({ _id: id });
  res.status(200).send(`Deleted the user: ${item.name}`);
});
