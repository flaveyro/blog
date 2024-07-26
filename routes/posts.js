const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const multer = require('multer');
const fs = require('fs');


const upload = multer({ dest: 'uploads/' }); // Configura la carpeta de subida de archivos

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
router.post('/', upload.single('file'), async (req, res) => {
  const post = new Post({
    title: req.body.title,
    body: req.body.body
  });

  if (req.file) {
    post.file = req.file.path; // Guarda la ruta del archivo
  }

  try {
    const newPost = await post.save();
    res.status(201).json(newPost);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Eliminar una entrada de blog
router.delete('/:id', async (req, res) => {
  try {
    console.log(`Attempting to delete post with ID: ${req.params.id}`);
    const post = await Post.findById(req.params.id);
    if (post == null) {
      console.log('Post not found');
      return res.status(404).json({ message: 'Cannot find post' });
    }

    await Post.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted post' });
  } catch (err) {
    console.error('Error deleting post:', err.message);
    res.status(500).json({ message: err.message });
  }
});

// Editar una entrada de blog
router.put('/:id', upload.single('file'), async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post == null) {
      return res.status(404).json({ message: 'Cannot find post' });
    }

    if (req.body.title != null) {
      post.title = req.body.title;
    }
    if (req.body.body != null) {
      post.body = req.body.body;
    }

    // Eliminar el archivo si se solicita
    if (req.body.removeFile === 'true' && post.file) {
      try {
        fs.unlinkSync(post.file);
        post.file = null;
      } catch (err) {
        console.error('Failed to delete file:', err);
      }
    }

    // Si se sube un nuevo archivo, reemplazar el archivo existente
    if (req.file) {
      // Eliminar el archivo antiguo si existe
      if (post.file) {
        try {
          fs.unlinkSync(post.file);
        } catch (err) {
          console.error('Failed to delete old file:', err);
        }
      }
      post.file = req.file.path;
    }

    const updatedPost = await post.save();
    res.json(updatedPost);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
