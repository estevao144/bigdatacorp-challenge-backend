function processClub(club) {
  const validSeries = ['SERIE A', 'SERIE B'];
  if (
    !club ||
    typeof club !== 'object' ||
    !validSeries.includes(club.championship)
  ) {
    return null;
  }

  const requiredFields = ['club_id', 'name', 'city', 'country'];
  const hasRequiredFields = requiredFields.every(
    (field) =>
      club[field] !== undefined &&
      club[field] !== null &&
      String(club[field]).trim() !== '',
  );

  if (!hasRequiredFields) {
    return null;
  }

  return club;
}

module.exports = {
  processClub,
};
