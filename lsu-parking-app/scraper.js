require('dotenv').config();
const axios = require('axios');
const cheerio = require('cheerio');
const mongoose = require('mongoose');
const ParkingLot = require('./models/ParkingLot');

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected successfully'))
    .catch(err => console.error('MongoDB connection error:', err));

const scrapeData = async () => {
    try {
        const response = await axios.get('https://www.lsu.edu/parking/availability.php');
        const $ = cheerio.load(response.data);

        const promises = [];

        $('table tbody tr').each((index, element) => {
            const name = $(element).find('td').eq(0).text().trim();           // Lot Name
            const lotNumber = $(element).find('td').eq(1).text().trim();      // Lot Number
            const totalSpaces = parseInt($(element).find('td').eq(2).text(), 10); // Total Spaces

            const availability7am = parseInt($(element).find('td').eq(3).text().replace('% Full', ''), 10);
            const availability11am = parseInt($(element).find('td').eq(4).text().replace('% Full', ''), 10);
            const availability2pm = parseInt($(element).find('td').eq(5).text().replace('% Full', ''), 10);
            const availability4pm = parseInt($(element).find('td').eq(6).text().replace('% Full', ''), 10);

            console.log(`Found: Name = "${name}", Lot Number = "${lotNumber}", Total Spaces = "${totalSpaces}", Availability = { 7am: ${availability7am}, 11am: ${availability11am}, 2pm: ${availability2pm}, 4pm: ${availability4pm} }`);

            if (name && !isNaN(totalSpaces) && !isNaN(availability7am) && !isNaN(availability11am) && !isNaN(availability2pm) && !isNaN(availability4pm)) {
                promises.push(ParkingLot.create({
                    name,
                    lotNumber,
                    totalSpaces,
                    availability: {
                        '7am': availability7am,
                        '11am': availability11am,
                        '2pm': availability2pm,
                        '4pm': availability4pm
                    }
                }));
            } else {
                console.log('Invalid data found, skipping entry.');
            }
        });

        await Promise.all(promises);
        console.log('Data Scraped and Saved!');
    } catch (error) {
        console.error('Error scraping data:', error);
    } finally {
        mongoose.connection.close();
    }
};

scrapeData();




