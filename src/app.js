const express = require('express');
const path = require('path');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');

const authorsRoutes = require('./routes/authors.routes');
const postsRoutes = require('./routes/posts.routes');
const notFound = require('./middlewares/notFound');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

const swaggerDocument = YAML.load(path.join(__dirname, '..', 'openapi.yaml'));

app.use(express.json());

app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'MiniBlog API funcionando correctamente',
    docs: '/docs'
  });
});

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/api/authors', authorsRoutes);
app.use('/authors', authorsRoutes); // opcional
app.use('/api/posts', postsRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;