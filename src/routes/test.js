const { getCollection, closeConnection } = require("../../mongoDB");
const express = require("express");

const router = express.Router();

router.get("/", (req, res) => {
  res.status(200).json({ message: "Hello World!" });
});

router.get("/users", async (req, res) => {
  try {
    const collection = await getCollection("users");
    const docs = await collection.find({}).toArray();
    res.status(200).json(docs);
  } catch (e) {
    console.log(e);
    res.status(400).json({ message: "Error getting users." });
  }
});

// Add a new user to the database
router.post("/user", async (req, res) => {
  const collection = await getCollection("users");

  const doc = req.body;
  if (!doc || !doc.name) {
    return res.status(400).json("Missing name and/or price fields.");
  }
  let result = await collection.insertOne(doc);
  res.status(201).json(result.ops[0]);
});

// GET a single user by its ID
router.get("/user/:id", async (req, res) => {
  const id = req.params.id;
  const collection = await getCollection("users");
  const item = await collection.findOne({ _id: id });
  console.log(item, "item", id);
  if (!item) {
    return res.status(404).json("The specified user does not exist.");
  }
  res.status(200).json(item);
});

// UPDATE an existing user
router.put("/user/:id", async (req, res) => {
  const collection = await getCollection("users");

  const updateDoc = req.body;
  const id = req.params.id;
  if (!updateDoc || !updateDoc.name || !updateDoc.price) {
    return res.status(400).json("Missing name and/or price fields.");
  }
  const query = { _id: id };
  const options = { returnOriginal: false };
  let updatedItem = await collection.findOneAndUpdate(query, { $set: updateDoc }, options);
  if (!updatedItem.value) {
    return res.status(404).json("The specified user was not found.");
  } else {
    res.status(200).json(updatedItem.value);
  }
});

// DELETE a user from the database
router.delete("/user/:id", async (req, res) => {
  const collection = await getCollection("users");

  const id = req.params.id;
  const item = await collection.findOne({ _id: id });
  if (!item) {
    return res.status(404).json("No user with that ID exists.");
  }
  await collection.deleteOne({ _id: id });
  res.status(200).json(`Deleted the user: ${item.name}`);
});

module.exports = router;
