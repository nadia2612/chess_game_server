const express = require("express");
const app = express();

const Player = require("./player/model")
const Figure = require('./figure/model')
const Game = require('./game/model')
const User = require('./user/model')
const Sse = require("json-sse");
const playerRouterFactory = require("./player/router");
const stream = new Sse();
const playerRouter = playerRouterFactory(stream);



const userRouter = require("./user/router");
const bodyParser = require("body-parser");
const jsonParser = bodyParser.json();
const cors = require("cors");
const corsMiddleware = cors();
const loginRouter = require("./auth/router");
const gameRouterFactory = require("./game/router");
const gameRouter = gameRouterFactory(stream);
const figureFactory = require("./figure/router");
const figureRouter = figureFactory(stream);

app.use(corsMiddleware);
app.use(jsonParser);
const port = process.env.PORT || 4000;
app.use(userRouter);
app.use(loginRouter);
app.use(gameRouter);
app.use(playerRouter);
app.use(figureRouter);

app.get("/", (req, res) => {
  stream.send("Lala")
  res.send("Blabla");
});

app.get("/stream", async (req, res, next) => {

  try {
    const games = await Game.findAll({ include: [{ model: User, attributes: ['id', 'name'] }, Figure] });
    const action = {
      type: "ALL_GAMES",
      payload: games
    }
    const string = JSON.stringify(action);
    stream.updateInit(string);
    stream.init(req, res);
  } catch (error) {
    next(error);
  }
});


app.listen(port, () => console.log(`Listening on ${port}`));