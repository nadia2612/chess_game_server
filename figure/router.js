const { Router } = require("express");
const Figure = require("./model");
const router = new Router();

router.put("/move", async (req, res) => {
  try {
    await Figure.destroy({
      where: {
        coordinate_X: req.body.coordinate_X,
        coordinate_Y: req.body.coordinate_Y
      }
    });
    await Figure.update(
      {
        coordinate_X: req.body.coordinate_X,
        coordinate_Y: req.body.coordinate_Y
      },
      { where: { id: req.body.figureId } }
    );
    const board = await Figure.findAll({ where: { gameId: req.body.gameId } });
    res.send(board);
  } catch (err) {
    next(err);
  }
});
module.exports = router