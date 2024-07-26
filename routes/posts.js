const express = require('express');
const router = express.Router();
const Post = require('../models/Post');

// Obtener todas las entradas de blog
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find();
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Crear una nueva entrada de blog
router.post('/', async (req, res) => {
  const post = new Post({
    title: req.body.title,
    body: req.body.body
  });

  try {
    const newPost = await post.save();
    res.status(201).json(newPost);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
