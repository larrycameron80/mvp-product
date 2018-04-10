/*ининциализация конфиграции приложения*/
const NConfig = require('nconf');

NConfig.argv().env().file({
	file : __dirname + '/../config.json'
});

module.exports = NConfig;