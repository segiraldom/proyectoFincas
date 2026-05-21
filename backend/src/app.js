const express = require('express');
const cors = require('cors');

const fincaRoutes = require('./routes/fincaRoutes');
const actividadRoutes = require('./routes/actividadRoutes');
const estadisticaRoutes = require('./routes/estadisticaRoutes');
const propietarioRoutes = require('./routes/propietarioRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/fincas', fincaRoutes);

app.use('/api/propietarios', propietarioRoutes);

app.use('/api/actividades', actividadRoutes);

app.use('/api/estadisticas', estadisticaRoutes);

app.get('/', (req, res) => {

  res.json({
    message: 'API Sistema de Fincas funcionando'
  });

});

module.exports = app;