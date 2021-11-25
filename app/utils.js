import fs from 'fs';
import * as path from 'path';
import { contentTypes } from './middlewares/bodyParser.js';

export const parseRequestData = (data) => {
  const splittedData = data.split('\r\n');
  const [method, fullPath] = splittedData[0].split(' ');
  const [path, queryString] = fullPath.split('?');

  const headersFinishIndex = splittedData.indexOf('');
  const headers = {};
  for (let i = 1; i < headersFinishIndex; i++) {
    const el = splittedData[i];
    const [key, ...arrayOfValues] = el.split(':');
    const joined = arrayOfValues.join(':');

    headers[key] = joined.trim();
  }

  const [body] = splittedData.slice(headersFinishIndex + 1);

  return {
    headers, body, method, path, queryString,
  };
};

export const sendResponse = (payload, connection, respContentType, statusCode) => {
  connection.write(
    `HTTP/1.1 ${statusCode}\n`
    + `Content-Type: ${respContentType}\n`
    + '\n'
    + `${respContentType === contentTypes.json ? JSON.stringify({ payload }) : payload}`
    + '\n',
    () => connection.end(),
  );
};

export const sendFileHandler = (fileName, cb, c, statusCode) => {
  const baseDir = path.join(process.cwd());
  const readStream = fs.createReadStream(`${baseDir}${fileName}`);
  readStream.on('error', (error) => {
    cb(error);
  });

  const response = `HTTP/1.1 ${statusCode}\n`
      + `Content-Type: ${contentTypes.jpg}\n`
      + '\n';

  readStream.once('readable', () => {
    c.on('close', () => cb());
    c.write(response);
    readStream.pipe(c);
  });
};

export function httpMethodsHandler(routePath, handlerMw, method) {
  return (req, res, next) => {
    if (req.path === routePath && req.method === method) {
      try {
        handlerMw(req, res, next);
      } catch (e) {
        res.status(500)
          .send(`Server error: ${e}`);
      }
    } else {
      next();
    }
  };
}


