
const contentTypes = {
  text: 'text/plain',
  json: 'application/json',
  image: ['image/gif', 'image/jpeg', 'image/pjpeg', 'image/png', 'image/svg+xml', 'image/tiff', 'image/vnd',
    'image/vnd.wap.wbmp', 'image/webp'],
};


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

  const body = splittedData.slice(headersFinishIndex + 1);

  return {
    headers, body, method, path, queryString,
  };
};
