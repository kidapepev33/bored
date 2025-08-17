const asyncHandler = require('express-async-handler');
const Game = require('../models/Game');

// @desc    Obtener todos los juegos
// @route   GET /api/games
// @access  Public
const getGames = asyncHandler(async (req, res) => {
  const pageSize = 10;
  const page = Number(req.query.pageNumber) || 1;
  const keyword = req.query.keyword ? {
    name: {
      $regex: req.query.keyword,
      $options: 'i'
    }
  } : {};

  const count = await Game.countDocuments({ ...keyword });
  const games = await Game.find({ ...keyword })
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  res.json({
    games,
    page,
    pages: Math.ceil(count / pageSize)
  });
});

// @desc    Obtener un juego por ID
// @route   GET /api/games/:id
// @access  Public
const getGameById = asyncHandler(async (req, res) => {
  const game = await Game.findById(req.params.id);

  if (game) {
    res.json(game);
  } else {
    res.status(404);
    throw new Error('Juego no encontrado');
  }
});

// @desc    Eliminar un juego
// @route   DELETE /api/games/:id
// @access  Private/Admin
const deleteGame = asyncHandler(async (req, res) => {
  const game = await Game.findById(req.params.id);

  if (game) {
    await game.remove();
    res.json({ message: 'Juego eliminado' });
  } else {
    res.status(404);
    throw new Error('Juego no encontrado');
  }
});

// @desc    Crear un juego
// @route   POST /api/games
// @access  Private/Admin
const createGame = asyncHandler(async (req, res) => {
  const game = new Game({
    name: 'Nombre del juego',
    price: 0,
    user: req.user._id,
    image: '/images/sample.jpg',
    brand: 'Marca del juego',
    category: 'Categoría',
    countInStock: 0,
    numReviews: 0,
    description: 'Descripción del juego'
  });

  const createdGame = await game.save();
  res.status(201).json(createdGame);
});

// @desc    Actualizar un juego
// @route   PUT /api/games/:id
// @access  Private/Admin
const updateGame = asyncHandler(async (req, res) => {
  const {
    name,
    price,
    description,
    image,
    brand,
    category,
    countInStock
  } = req.body;

  const game = await Game.findById(req.params.id);

  if (game) {
    game.name = name || game.name;
    game.price = price || game.price;
    game.description = description || game.description;
    game.image = image || game.image;
    game.brand = brand || game.brand;
    game.category = category || game.category;
    game.countInStock = countInStock || game.countInStock;

    const updatedGame = await game.save();
    res.json(updatedGame);
  } else {
    res.status(404);
    throw new Error('Juego no encontrado');
  }
});

// @desc    Crear nueva reseña
// @route   POST /api/games/:id/reviews
// @access  Private
const createGameReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;

  const game = await Game.findById(req.params.id);

  if (game) {
    const alreadyReviewed = game.reviews.find(
      (r) => r.user.toString() === req.user._id.toString()
    );

    if (alreadyReviewed) {
      res.status(400);
      throw new Error('Ya has enviado una reseña para este juego');
    }

    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id
    };

    game.reviews.push(review);
    game.numReviews = game.reviews.length;
    game.rating =
      game.reviews.reduce((acc, item) => item.rating + acc, 0) / game.reviews.length;

    await game.save();
    res.status(201).json({ message: 'Reseña añadida' });
  } else {
    res.status(404);
    throw new Error('Juego no encontrado');
  }
});

// @desc    Obtener los juegos mejor valorados
// @route   GET /api/games/top
// @access  Public
const getTopGames = asyncHandler(async (req, res) => {
  const games = await Game.find({}).sort({ rating: -1 }).limit(5);
  res.json(games);
});

module.exports = {
  getGames,
  getGameById,
  deleteGame,
  createGame,
  updateGame,
  createGameReview,
  getTopGames
};
