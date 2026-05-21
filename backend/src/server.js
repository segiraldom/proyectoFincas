const app = require('./app');
const sequelize = require('./config/database');
require('./models');

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {

    await sequelize.authenticate();
    await sequelize.sync({ alter: false });

    console.log('Base de datos conectada');

    app.listen(PORT, () => {
      console.log(`Servidor ejecutándose en puerto ${PORT}`);
    });

  } catch (error) {

    console.error('Error conectando BD:', error);

  }
}

startServer();