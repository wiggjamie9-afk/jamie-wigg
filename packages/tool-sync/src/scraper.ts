import fetch from 'node-fetch';
import { RawAPI } from './types.js';

const PUBLIC_APIS_README_URL =
  'https://raw.githubusercontent.com/public-apis/public-apis/master/README.md';

export async function scrapPublicAPIs(verbose = false): Promise<RawAPI[]> {
  if (verbose) console.log('📥 Fetching public-apis README...');

  const response = await fetch(PUBLIC_APIS_README_URL);
  if (!response.ok) {
    throw new Error(`Failed to fetch public-apis README: ${response.status}`);
  }

  const text = await response.text();
  const apis: RawAPI[] = [];

  // Split by ## Category
  const sections = text.split(/^## /m);

  for (const section of sections) {
    const lines = section.split('\n');
    const categoryName = lines[0]?.trim();

    if (!categoryName) continue;

    let inTable = false;
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i];

      // Detect table header separator
      if (line.includes('---|') || line.includes('| --- |')) {
        inTable = true;
        continue;
      }

      // Stop if we leave the table
      if (inTable && !line.startsWith('|')) {
        break;
      }

      if (!inTable || !line.startsWith('|')) continue;

      // Parse: | API | Description | Auth | HTTPS | CORS |
      const cells = line
        .split('|')
        .slice(1, -1) // Remove empty cells from split
        .map(c => c.trim())
        .filter(c => c.length > 0);

      if (cells.length < 4) continue;

      // Skip header
      if (cells[0] === 'API' || cells[0] === 'Name') continue;

      const api: RawAPI = {
        name: cells[0],
        description: cells[1] || 'No description',
        auth: cells[2] || 'no',
        https: cells[3]?.toLowerCase() === 'yes',
        cors: cells[4] || 'Unknown',
        category: categoryName,
      };

      // Validate
      if (api.name && api.description) {
        apis.push(api);
      }
    }
  }

  if (verbose) console.log(`✓ Parsed ${apis.length} APIs from public-apis`);
  return apis;
}
