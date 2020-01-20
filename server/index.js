import express from 'express';
import compression from 'compression';
import router from './routes';

const app = express();

app.use(compression());

app.use(express.static('dist'));
app.use('/', router);

const port = process.env.PORT || 4000;
app.listen(port, function listenHandler() {
  console.info(`Running on ${port}...`);
});
