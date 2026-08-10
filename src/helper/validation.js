function validateFilePath(filePath) {
  if (!filePath || typeof filePath !== 'string') {
    console.error('Caminho do arquivo inválido.');
    process.exit(1);
  }
}

module.exports = {
  validateFilePath,
};
