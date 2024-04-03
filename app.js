const express = require("express");

const swaggerUI = require("swagger-ui-express");

const swaggerSpec = require("./swagger");
const { getCollection, closeConnection } = require("./mongoDB");

const app = express();

app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerSpec));

// getCollection(async (collection) => {
//   // Get all documents in the collection
app.get("/products", async (req, res) => {
  try {
    const collection = await getCollection("users");
    const docs = await collection.find({}).toArray();
    res.status(200).send(docs);
  } catch (e) {
    console.log(e);
    res.status(400).send("Error getting products.");
  }
});

// Add a new product to the database
app.post("/product", async (req, res) => {
  const collection = await getCollection("users");

  const doc = req.body;
  if (!doc || !doc.name || !doc.price) {
    return res.status(400).send("Missing name and/or price fields.");
  }
  let result = await collection.insertOne(doc);
  res.status(201).send(result.ops[0]);
});

// GET a single product by its ID
app.get("/product/:id", async (req, res) => {
  const id = req.params.id;
  const collection = await getCollection("users");

  const item = await collection.findOne({ _id: id });
  if (!item) {
    return res.status(404).send("The specified product does not exist.");
  }
  res.status(200).send(item);
});

// UPDATE an existing product
app.put("/product/:id", async (req, res) => {
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
    return res.status(404).send("The specified product was not found.");
  } else {
    res.status(200).send(updatedItem.value);
  }
});

// DELETE a product from the database
app.delete("/product/:id", async (req, res) => {
  const collection = await getCollection("users");

  const id = req.params.id;
  const item = await collection.findOne({ _id: id });
  if (!item) {
    return res.status(404).send("No product with that ID exists.");
  }
  await collection.deleteOne({ _id: id });
  res.status(200).send(`Deleted the product: ${item.name}`);
});
// });

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(3000, () => console.log("Example app listening on port 3000!"));
