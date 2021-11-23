// eslint-disable-next-line import/extensions
import MyExpress from './app/myExpress.js';
import bodyParser from './app/bodyParser.js';

const app = new MyExpress();
const port = 8000;

app.use(bodyParser.json());

app.get('/users', (req, res) => {
  res.json({ message: 'JSON resp from users' });
});

app.post('/users', (req, res) => {
  res.send('<html lang="us"><head><title>Test title</title></head><h1>HTML resp from users</h1><p>Random description</p></html>');
});


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});


