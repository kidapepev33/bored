const express = require('express');
const router = express.Router();
const {
  getGames,
  getGameById,
  deleteGame,
  createGame,
  updateGame,
  createGameReview,
  getTopGames,
} = require('../controllers/gameController');
const { protect, admin } = require('../middleware/authMiddleware');

// Rutas públicas
router.route('/').get(getGames);
router.get('/top', getTopGames);
router.route('/:id').get(getGameById);

// Rutas protegidas
router.route('/:id/reviews').post(protect, createGameReview);

// Rutas de administrador
router.route('/')
  .post(protect, admin, createGame);
  
router.route('/:id')
  .delete(protect, admin, deleteGame)
  .put(protect, admin, updateGame);

module.exports = router;
