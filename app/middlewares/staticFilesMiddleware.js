const express = {
  static(dirName) {
    return (req, res, next) => {
      const fileName = req.path.split('/')[1];
      try {
        res.sendFile(`/${dirName}/${fileName}`, (err) => {
          if (err) {
            next(err);
          } else {
            console.log('Sent:', fileName);
          }
        });
      } catch (e) {
        res.status(500)
          .send(`Server error: ${e}`);
      }
    };
  },
};

export default express;


