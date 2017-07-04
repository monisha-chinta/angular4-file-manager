let mongoose = require('mongoose');

const MONGODB_URL = 'mongodb://localhost:27017/angular2-basics-db';

module.exports = () => {
    var dbURI = 'mongodb://localhost:27017/angular2-basics-db';

    mongoose.connect(MONGODB_URL);

    // CONNECTION EVENTS
    mongoose.connection.on('connected', function() {
        console.log('Mongoose connected to ' + dbURI);
    });
    mongoose.connection.on('error', function(err) {
        console.log('Mongoose connection error: ' + err);
    });
    mongoose.connection.on('disconnected', function() {
        console.log('Mongoose disconnected');
    });
};
