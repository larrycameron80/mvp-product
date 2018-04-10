/*инициализация редиса*/
const Libs = __dirname + '/../';
const Config = require(Libs + 'connectors/config');
const Logs = require(Libs + 'connectors/logs')(module);
const Redis = require('redis');
const RedisClient = Redis.createClient();

RedisClient.on('error', function(error) {
	Logs.error('Error in redis', error);
});

RedisClient.on('connect', function() {
	Logs.info('start redis connection');
});

module.exports = RedisClient;