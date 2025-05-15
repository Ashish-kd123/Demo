require('dotenv').config();
const bodyParser = require('body-parser');
const express = require('express')
const app = express();
const cors = require("cors");
const { dynamicModuleLoader } = require("./moduleLoader");
const { routes, fields } = require("./routes");



const port = process.env.PORT || 3000;

const apiVersion = process.env.API_VERSION ? process.env.API_VERSION : "v1";

app.use(express.json());

app.get("/", (req, res) => {
  
    res.send("Hello, Node.js is running!");
  }); 

app.use(bodyParser.json());


app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true, 
}));

app.get("/db-migrate", function (req, res) {
    exec("yarn db:migrate", (err) => {
      if (err) {
        console.error(`exec error: ${err}`);
        res.send(`exec error db:migrate: ${err}`);
        return;
      } else {
        res.send("SucessFull");
      }
    });
  });
  

  
  
  dynamicModuleLoader(app);
  app.use(`/api/${apiVersion}`, routes);

  

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
})
