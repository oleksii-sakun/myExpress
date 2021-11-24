import * as net from 'net';
import * as fs from 'fs';
import * as path from 'path';
import { makeResponse, parseRequestData } from './helperFunctions.js';
import { contentTypes } from './bodyParser.js';

const methods = {
  GET: 'GET',
  POST: 'POST',
};

class MyExpress {
  constructor() {
    this.stack = [];
    this.server = net.createServer((c) => {
      console.log('client connected', c.remoteAddress);
      c.setEncoding('utf-8');

      c.on('data', (data) => {
        const parsedData = parseRequestData(data);
        const req = {
          body: parsedData.body,
          path: parsedData.path,
          headers: parsedData.headers,
          method: parsedData.method,
        };

        const res = {
          send: (payload) => {
            makeResponse(payload, c, contentTypes.html);
          },

          sendFile: (fileName, cb) => {
            const baseDir = path.join(process.cwd());
            const readStream = fs.createReadStream(`${baseDir}${fileName}`);
            readStream.on('error', (error) => {
              cb(error);
            });

            setTimeout(() => readStream.on('close', () => cb()), 0);

            const response = 'HTTP/1.1 200 OK\n'
                + `Content-Type: ${contentTypes.jpg}\n`
                + '\n';

            setTimeout(() => {
              try {
                c.write(
                  response,
                );
                readStream.pipe(c);
              } catch (e) {
                console.log('sendFileError', e);
              }
            }, 0);
          },

          json: (payload) => {
            makeResponse(payload, c, contentTypes.json);
          },
        };
        this.middleware(req, res);
      });
    });
  }

  get(path, handlerMw) {
    const getHandlerMiddleware = (req, res, next) => {
      if (req.path === path && req.method === methods.GET) {
        handlerMw(req, res, next);
      }
      next();
    };

    this.stack.push(getHandlerMiddleware);
  }

  post(path, handlerMw) {
    const postHandlerMiddleware = (req, res, next) => {
      if (req.path === path && req.method === methods.POST) {
        handlerMw(req, res, next);
      }
      next();
    };

    this.stack.push(postHandlerMiddleware);
  }

  use(middleware) {
    this.stack.push(middleware);
  }

  listen(port, callback) {
    return this.server.listen(port, callback);
  }

  middleware(request, response, callback) {
    let stackMiddlewareIndex = 0;

    const nextStackMiddleware = () => {
      if (stackMiddlewareIndex >= this.stack.length) {
        return () => callback();
      }
      // eslint-disable-next-line no-plusplus
      const currentStackMiddleware = this.stack[stackMiddlewareIndex++];
      currentStackMiddleware(request, response, nextStackMiddleware);
    };

    nextStackMiddleware();
  }
}

export default MyExpress;

