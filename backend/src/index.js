const express = require("express");
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

const v01Router = require("./v0.1/routes");

app.use(cors({ origin: '*' }));
app.use(express.json());
// app.use(express.urlencoded({extended: false}));
app.use("/api/v0.1", v01Router);

app.listen(PORT, () => {
  console.log(`API is listening on port ${PORT}`);
});