const fs = require('fs');
const path = require('path');
const Post = require('./models/Post'); // Asegúrate de tener el modelo Post disponible aquí

const uploadsDir = path.join(__dirname, 'uploads');

fs.readdir(uploadsDir, async (err, files) => {
  if (err) {
    console.error('Error leyendo la carpeta de uploads:', err);
    return;
  }

  for (const file of files) {
    const filePath = path.join(uploadsDir, file);
    try {
      const post = await Post.findOne({ file: filePath });
      if (!post) {
        fs.unlinkSync(filePath);
        console.log(`Archivo eliminado: ${filePath}`);
      }
    } catch (err) {
      console.error('Error buscando en la base de datos:', err);
    }
  }
});
