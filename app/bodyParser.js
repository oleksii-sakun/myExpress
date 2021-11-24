export const contentTypes = {
  json: 'application/json',
  html: 'text/html',
  txt: 'text/plain',
  css: 'text/css',
  gif: 'image/gif',
  jpg: 'image/jpeg',
  png: 'image/png',
  svg: 'image/svg+xml',
  js: 'application/javascript',
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
