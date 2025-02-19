const express = require("express");
const { auth } = require("./middlewares/auth");

const app = express();

app.get("/admin", auth, (req, res) => {
  console.log(req.params);
  res.send("Hello from server!");
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
