import * as net from 'net';
import {
  sendResponse, parseRequestData, sendFileHandler, httpMethodsHandler,
} from './utils.js';
import { contentTypes } from './middlewares/bodyParser.js';

const methods = {
  GET: 'GET',
  POST: 'POST',
};

class MyExpress {
  constructor() {
    this.stack = [];
    this.server = net.createServer((c) => {
      c.setEncoding('utf-8');

      c.on('data', (data) => {
        const {
          headers, body, method, path,
        } = parseRequestData(data);
        const req = {
          body,
          path,
          headers,
          method,
        };

        const res = {
          status(statusCode) {
            res.statusCode = statusCode;

            return res;
          },

          send: (payload) => {
            sendResponse(payload, c, contentTypes.html, res.statusCode || 200);
          },

          sendFile: (fileName, cb) => {
            sendFileHandler(fileName, cb, c, res.statusCode || 200);
          },

          json: (payload) => {
            sendResponse(payload, c, contentTypes.json, res.statusCode || 200);
          },

        };
        this.middleware(req, res);
      });
    });
  }

  get(routePath, handlerMw) {
    const getHandlerMiddleware = httpMethodsHandler(routePath, handlerMw, methods.GET);

    this.stack.push(getHandlerMiddleware);
  }

  post(routePath, handlerMw) {
    const postHandlerMiddleware = httpMethodsHandler(routePath, handlerMw, methods.POST);

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

