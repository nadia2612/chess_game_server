const express = require("express");
const app = express();
const port = process.env.PORT || 4000;

const userRouter = require("./user/router");
const loginRouter = require("./auth/router");
const gameRouter=require("./game/router")
const playerRouter=require("./player/router")
const figureRouter = require("./figure/router");


const bodyParser = require("body-parser");
const jsonParser = bodyParser.json();

const cors = require("cors");
const corsMiddleware = cors();
app.use(jsonParser);
app.use(corsMiddleware)
app.use(userRouter);
app.use(loginRouter);
app.use(gameRouter);
app.use(playerRouter)
app.use(figureRouter)

app.listen(port, () => console.log(`Listening on ${port}`));
