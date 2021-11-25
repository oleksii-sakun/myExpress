// eslint-disable-next-line import/extensions
import MyExpress from './app/myExpress.js';
import bodyParser from './app/middlewares/bodyParser.js';
import express from './app/middlewares/staticFilesMiddleware.js';

const app = new MyExpress();
const port = 8000;

app.use(bodyParser.json());
app.use(express.static('static'));

app.post('/users', (req, res) => {
  res.json({ message: 'JSON resp from users' });
});

app.get('/users', (req, res) => {
  res.send('<html lang="us"><head><title>Test title</title></head><h1>HTML resp</h1><p>Random description</p></html>');
});

app.use((req, res, next) => {
  res.status(404).send('Sorry cant find that!');
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});


