const fs = require('fs');
const path = require('path');
const { readJsonl, writePlayers, writeClub } = require('./file/index');
const { processClub, processPlayers } = require('./rules');
const { validateFilePath } = require('./helper/validation');

function resetOutputFiles() {
  const outputDir = path.resolve(__dirname, '../output');

  fs.mkdirSync(outputDir, { recursive: true });
  fs.writeFileSync(path.join(outputDir, 'clubs.csv'), '', 'utf8');
  fs.writeFileSync(path.join(outputDir, 'players.csv'), '', 'utf8');
}

async function main() {
  console.time('Tempo de execução');
  const filePath = process.argv[2];

  validateFilePath(filePath);
  resetOutputFiles();

  await readJsonl(filePath, async (club) => {
    const validClub = processClub(club);

    if (!validClub) {
      return;
    }

    const players = processPlayers(validClub.players);

    await writeClub(validClub);
    await writePlayers(players, validClub.club_id);
  });

  console.log('Processamento finalizado.');
  console.timeEnd('Tempo de execução');
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
