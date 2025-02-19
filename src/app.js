const express = require("express");
const { auth } = require("./middlewares/auth");

const app = express();

app.get("/admin", auth, (req, res) => {
  console.log(req.params);
  throw new Error("Something went wrong");
});

app.use("/", (err, req, res, next) => {
  if (err) {
    res.status(500).send("Something went wrong");
  }
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
