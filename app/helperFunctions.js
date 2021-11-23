import { contentTypes } from './bodyParser.js';

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

export const makeResponse = (payload, connection, respContentType) => {
  connection.write(
    'HTTP/1.1 200 OK\n'
    + `Content-Type: ${contentTypes[respContentType]}\n`
    + '\n'
    + ''
    + '\n'
    + `${respContentType === contentTypes.json ? JSON.stringify({ payload }) : payload}`,
    () => connection.end(),
  );
};
