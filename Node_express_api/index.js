import express from 'express';
import bodyParser from 'body-parser';

const app = express();

app.use(bodyParser.json());

const sayHi = (req, res) => {
  res.send("Hi!");
};

app.get("/", sayHi);

app.post("/transferbitcoin", (req, res) => {
//  "inputs" = req.body;
//  the script or the file with the code
//  res.send("transaction successful/unsuccessful");
});

app.listen(5000, () => {
  console.log(`Server is running on http://localhost:5000/.`);
});