import * as net from 'net';
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

