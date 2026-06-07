const express = require('express');

const router = express.Router();

const {
addGame,
getGames,
deleteGame,
updateGame
}
= require('../controllers/gameController');

router.post('/add',addGame);

router.get('/all',getGames);

router.delete('/:id',deleteGame);

router.put('/:id',updateGame);

module.exports = router;