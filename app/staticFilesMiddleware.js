
const staticFiles = (dirName) => (req, res, next) => {
  const fileName = req.path.split('/')[1];


  res.sendFile(`/${dirName}/${fileName}`, (err) => {
    if (err) {
      console.log('---error');
      next(err);
    } else {
      console.log('Sent:', fileName);
    }
  });
};

export default staticFiles;
