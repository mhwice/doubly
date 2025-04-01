import fs from "fs";
import cities from 'cities.json' with { type: 'json' };
import { continents, getCountryData } from 'countries-list';

async function makeLocationFile() {
  if (fs.existsSync('./db-utils/location.json')) {
    console.log('Location file already exists - skipping file creation');
    return;
  }

  console.log("Creating location file...")
  const n = cities.length;

  const stream = fs.createWriteStream('./db-utils/location.json');
  stream.write('[\n'); // Start JSON array

  for (let i = 0; i < n; i += 1) {
    const { name: city, lat, lng, country: countryCode } = cities[i];
    const { name: country, continent: continentCode } = getCountryData(countryCode);
    const continent = continents[continentCode];
    const record = {
      countryCode,
      country,
      lat,
      lng,
      city,
      continentCode,
      continent
    };

    if (!stream.write(JSON.stringify(record) + (i < n - 1 ? ',\n' : '\n'))) {
      // Wait until the stream drains before writing more
      await new Promise(resolve => stream.once('drain', resolve));
    }
  }

  stream.write(']'); // End JSON array
  stream.end(() => console.log('File written successfully'));
}

makeLocationFile();
