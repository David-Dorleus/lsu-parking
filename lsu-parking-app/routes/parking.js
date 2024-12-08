const express = require('express');
const router = express.Router();
const ParkingLot = require('../models/ParkingLot');

router.get('/availability', async (req, res) => {
    try {
        const lots = await ParkingLot.find();
        res.render('availability', { lots });
    } catch (error) {
        res.status(500).send('Error fetching parking lot data');
    }
});

router.get('/admin', (req, res) => {
    res.render('admin');
});

router.post('/add', async (req, res) => {
    const { name, lotNumber, totalSpaces, availability7am, availability11am, availability2pm, availability4pm } = req.body;

    try {
        await ParkingLot.create({
            name,
            lotNumber,
            totalSpaces,
            availability: {
                '7am': parseInt(availability7am),
                '11am': parseInt(availability11am),
                '2pm': parseInt(availability2pm),
                '4pm': parseInt(availability4pm)
            }
        });
        res.redirect('/parking/availability');
    } catch (error) {
        res.status(500).send('Error adding parking lot entry');
    }
});

router.post('/delete/:id', async (req, res) => {
    try {
        await ParkingLot.findByIdAndDelete(req.params.id);
        res.redirect('/parking/availability');
    } catch (error) {
        res.status(500).send('Error deleting parking lot entry');
    }
});

module.exports = router;
