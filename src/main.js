const fs = require('fs');
const readline = require('readline');
const { clubs, players } = require('./rules');
const { convertCsv } = require('./file/convertCsv');
const { validateFilePath } = require('./helper/validation');

const filePath = process.argv[2];

validateFilePath(filePath);

const readInterface = readline.createInterface({
  input: fs.createReadStream(filePath, { encoding: 'utf8' }),
  crlfDelay: Infinity,
});

readInterface.on('line', (line) => {
  if (!line.trim()) return;

  try {
    const item = JSON.parse(line);
  } catch (error) {
    console.error('Linha inválida no JSONL:', line);
    console.error(error.message);
  }
});

readInterface.on('close', () => {
  console.log('Leitura finalizada do arquivo JSONL.');
});

readInterface.on('error', (error) => {
  console.error('Erro ao ler o arquivo:', error.message);
  process.exit(1);
});
