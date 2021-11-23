export const contentTypes = {
  text: 'text/plain',
  html: 'text/html',
  json: 'application/json',
  image: ['image/gif', 'image/jpeg', 'image/pjpeg', 'image/png', 'image/svg+xml', 'image/tiff', 'image/vnd',
    'image/vnd.wap.wbmp', 'image/webp'],
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
