const fs = require('fs');
const path = require('path');

const CLUB_HEADERS = [
  'Id do Clube',
  'Nome',
  'Campeonato',
  'Data de Fundação',
  'Cidade',
  'Estado',
  'País',
  'Estádio',
  'Presidente',
  'Apelido',
  'Cores',
];

const PLAYER_HEADERS = [
  'Id do Clube',
  'Id do Jogador',
  'Nome',
  'Idade',
  'Gols',
  'Data de Estreia',
  'Posição',
  'Número da Camisa',
];

function normalizeDate(value) {
  if (!value || typeof value !== 'string') {
    return '';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return '';
  }

  return date.toISOString().slice(0, 10);
}

function escapeCsv(value) {
  if (value === null || value === undefined) {
    return '';
  }

  const stringValue = Array.isArray(value) ? value.join('|') : String(value);

  if (/[",\n\r]/.test(stringValue)) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }

  return stringValue;
}

function ensureCsvFile(outputPath, headers) {
  const outputDir = path.dirname(outputPath);

  fs.mkdirSync(outputDir, { recursive: true });

  const fileExists = fs.existsSync(outputPath);
  const fileIsEmpty = fileExists ? fs.statSync(outputPath).size === 0 : true;

  if (fileIsEmpty) {
    fs.writeFileSync(outputPath, `${headers.join(',')}\n`, 'utf8');
  }
}

async function writeClub(jsonData) {
  if (!jsonData || typeof jsonData !== 'object') {
    return;
  }

  const outputPath = path.resolve(__dirname, '../../output/clubs.csv');

  ensureCsvFile(outputPath, CLUB_HEADERS);

  const row = [
    jsonData.club_id ?? jsonData.clubId ?? '',
    jsonData.name ?? '',
    jsonData.championship ?? '',
    normalizeDate(jsonData.founding_date),
    jsonData.city ?? '',
    jsonData.state ?? '',
    jsonData.country ?? '',
    jsonData.stadium ?? '',
    jsonData.president ?? '',
    jsonData.nickname ?? '',
    Array.isArray(jsonData.colors) ? jsonData.colors.join('|') : '',
  ]
    .map(escapeCsv)
    .join(',');

  fs.appendFileSync(outputPath, `${row}\n`, 'utf8');
}

async function writePlayers(jsonData, clubId = '') {
  const players = Array.isArray(jsonData)
    ? jsonData
    : (jsonData?.players ?? []);

  if (!players.length) {
    return;
  }

  const outputPath = path.resolve(__dirname, '../../output/players.csv');

  ensureCsvFile(outputPath, PLAYER_HEADERS);

  for (const player of players) {
    if (!player || typeof player !== 'object') {
      continue;
    }

    const row = [
      clubId || player.club_id || player.clubId || '',
      player.player_id ?? player.playerId ?? '',
      player.name ?? '',
      player.age ?? '',
      player.goals ?? '',
      normalizeDate(player.debut_date),
      player.position ?? '',
      player.shirt_number ?? '',
    ]
      .map(escapeCsv)
      .join(',');

    fs.appendFileSync(outputPath, `${row}\n`, 'utf8');
  }
}

module.exports = {
  writeClub,
  writePlayers,
};
