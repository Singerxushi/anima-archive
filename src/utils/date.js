export function formatArchiveDate(date = new Date()) {
  return date.toISOString().replace(/-/g, '.').split('T')[0];
}

