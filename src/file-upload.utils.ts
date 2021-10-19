//middleware functions
export const imageFileFilter = (req, file, callback) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
    return callback(new Error('Only image files are allowed!'), false);
  }
  callback(null, true);
};

const MIME_TYPES = {
  //allows to translate a MIME TYPE into an extension
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/gif': 'gif',
};

export const editFilename = (req, file, callback) => {
  // give the full file name: name + extension
  const name = file.originalname.split(' ').join('_');
  //to deal with the white space and to be replace by _
  const extension = MIME_TYPES[file.mimetype];
  callback(null, name, +Date.now() + '.' + extension);
  //we add the date to avoid overwritten files
};
