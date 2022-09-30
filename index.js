const express = require("express");
const app = express();
require("dotenv").config();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const cors = require("cors");
app.use(express.json());
app.use(cors());

const uri = `mongodb+srv://admin-crud:UZ9qSrCxMB1KWz5l@cluster0.oq92kda.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    await client.connect();
    const studentsCollection = client.db("crud").collection("students");
    app.get("/students", async (req, res) => {
      const query = req.query;
      const students = studentsCollection.find(query);
      const result = await students.toArray();
      res.send(result);
    });

    app.get("/students/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await studentsCollection.findOne(query);
      res.send(result);
    });

    app.post("/students", async (req, res) => {
      const studentData = req.body;
      console.log(studentData);
      const result = await studentsCollection.insertOne(studentData);
      res.send(result);
    });

    app.delete("/students/:id", async (req, res) => {
      const id = req.params.id;
      console.log(id);
      const filter = { _id: ObjectId(id) };
      const result = await studentsCollection.deleteOne(filter);
      res.send(result);
    });

    app.patch("/students/:id", async (req, res) => {
      const id = req.params.id;
      const updateStudent = req.body;
      console.log("body", updateStudent);
      const filter = { _id: ObjectId(id) };
      console.log("filter", filter);
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          name: updateStudent.name,
          email: updateStudent.email,
          phoneNumber: updateStudent.phoneNumber,
          enrollNumber: updateStudent.enrollNumber,
          dateOfAdmission: updateStudent.formattedDate,
        },
      };
      console.log(updateDoc);
      const result = await studentsCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      console.log(result);
      res.send(result);
    });
  } finally {
    //   await client.close();
  }
}
run().catch(console.dir);

// client.connect((err) => {
//   // perform actions on the collection object
//   //   client.close();
// });

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
