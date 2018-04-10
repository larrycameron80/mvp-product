/*инициализация подключения к mongodb*/
const Mongoose = require('mongoose');
const Libs = __dirname + '/../';
const Logs = require(Libs + 'connectors/logs')(module);
const Config = require(Libs + 'connectors/config');

Mongoose.connect(Config.get('mongo:uri'),{
	useMongoClient: true
});

const DB = Mongoose.connection;

DB.on('error', function(error) {
	Logs.error("Connection error: ", error.message);
});

DB.once('open', function callback() {
	Logs.info('Connection successfull open');
});


module.exports = Mongoose;