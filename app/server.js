import * as net from 'net';
import { parseRequestData } from './helperFunctions.js';

export const SERVER_HTML_RESPONSE = 'HTTP/1.1 200 OK\n'
    + 'Content-Type: text/html\n'
    + '\n'
    + '<html lang="us"><head><title>Test title</title></head><h1>Random text</h1><p>Random description</p></html>';

const server = net.createServer({ allowHalfOpen: false }, (c) => {
  console.log('client connected', c.remoteAddress);
  c.setEncoding('utf-8');

  c.on('data', (data) => {
    console.log(parseRequestData(data));
  });

  c.on('end', () => {
    console.log('client disconnected');
  });

  c.write(SERVER_HTML_RESPONSE,
    // ()=> {
    //     console.log('client disconnected');
    //     c.end()
    // }
  );
  c.pipe(c);
});

server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.log('Address in use, retrying...');
    setTimeout(() => {
      server.close();
      server.listen(9000, () => {
        console.log(`Socket server restarted at ${JSON.stringify(server.address())}`);
      });
    }, 1000);
  }
});

// connection to net server
// import server from './app/server.js';
//
// server.listen(8000, () => {
//   console.log(`server started on port: ${JSON.stringify(server.address())}`);
// });


export default server;


