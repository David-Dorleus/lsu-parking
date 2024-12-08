const mongoose = require('mongoose');

const parkingLotSchema = new mongoose.Schema({
    name: String,
    lotNumber: String,
    totalSpaces: Number,
    availability: {
        '7am': Number,
        '11am': Number,
        '2pm': Number,
        '4pm': Number
    },
    date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('ParkingLot', parkingLotSchema);
