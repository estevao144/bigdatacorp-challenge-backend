const fs = require('fs');
const readline = require('readline');
const { writePlayers, writeClub } = require('./convertCsv');

async function readJsonl(filePath, onRecord) {
  const fileStream = fs.createReadStream(filePath, {
    encoding: 'utf8',
  });

  fileStream.on('error', (error) => {
    console.error(`Erro ao ler o arquivo: ${error.message}`);
    process.exit(1);
  });

  const readInterface = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });

  let lineNumber = 0;

  for await (const line of readInterface) {
    lineNumber++;

    if (!line.trim()) {
      continue;
    }

    try {
      const item = JSON.parse(line);

      await onRecord(item);
    } catch (error) {
      console.error(`Erro na linha ${lineNumber}: ${error.message}`);
    }
  }
}

module.exports = {
  readJsonl,
  writePlayers,
  writeClub,
};
