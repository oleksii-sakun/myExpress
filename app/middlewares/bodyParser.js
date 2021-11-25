export const contentTypes = {
  json: 'application/json',
  html: 'text/html',
  txt: 'text/plain',
  jpg: 'image/jpeg',
};

const bodyParser = {
  json() {
    return (req, res, next) => {
      if (req.headers['Content-Type'] === contentTypes.json) {
        req.body = JSON.parse(req.body);
      }
      next();
    };
  },
};

export default bodyParser;
