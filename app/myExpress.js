import * as net from 'net';
import { parseRequestData } from './helperFunctions.js';

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
        };

        const res = {
          send: (payload) => {
            c.write('HTTP/1.1 200 OK\n'
              + 'Content-Type: text/html\n'
              + '\n'
              + `<html lang="us"><head><title>Test title</title></head><h1>${payload}</h1><p>Random description</p></html>`, () => c.end());
          },
        };
        this.middleware(req, res);
      });
      c.pipe(c);
    });
  }

  use(middleware) {
    this.stack.push(middleware);
  }

  listen(port, callback) {
    return this.server.listen(port, callback);
  }

  middleware(request, response, callback) {
    let stackMiddlewareIndex = 0;

    const next = () => {
      if (stackMiddlewareIndex >= this.stack.length) {
        return () => callback();
      }
      // eslint-disable-next-line no-plusplus
      const layer = this.stack[stackMiddlewareIndex++];
      layer(request, response, next);
    };

    next();
  }
}

export default MyExpress;

