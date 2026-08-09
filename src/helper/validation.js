function validateFilePath(filePath) {
  if (!filePath || typeof filePath !== 'string') {
    throw {
      statusCode: 400,
      message:
        'Invalid file path. Please provide a valid file path as a string.',
    };
  }
}

module.exports = {
  validateFilePath,
};
