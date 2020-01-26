const express = require("express");
const app = express();
const port = process.env.PORT || 4000;

const userRouter = require("./user/router");
const loginRouter = require("./auth/router");

const bodyParser = require("body-parser");
const jsonParser = bodyParser.json();

app.use(jsonParser);
app.use(userRouter);
app.use(loginRouter);

app.listen(port, () => console.log(`Listening on ${port}`));
