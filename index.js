// eslint-disable-next-line import/extensions
import MyExpress from './app/myExpress.js';

const app = new MyExpress();
const port = 8000;

// app.use(bodyParser.json())

app.use((req, res) => {
  res.send(req.body);
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});


