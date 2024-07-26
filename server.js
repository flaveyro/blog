const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');  // Importa el paquete path
const app = express();

// Middleware
app.use(bodyParser.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // Servir archivos estáticos

// Conexión a MongoDB (sin opciones deprecadas)
mongoose.connect('mongodb://localhost/blog')
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

// Rutas
const postsRoute = require('./routes/posts');
app.use('/posts', postsRoute);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));