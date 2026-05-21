const app = require('./app');
const sequelize = require('./config/database');

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {

    await sequelize.authenticate();

    console.log('Base de datos conectada');

    app.listen(PORT, () => {
      console.log(`Servidor ejecutándose en puerto ${PORT}`);
    });

  } catch (error) {

    console.error('Error conectando BD:', error);

  }
}

startServer();