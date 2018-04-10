/*инициализация ведения логов*/
const Winston = require('winston');

Winston.emitErrs = true;

function WinstonLogger(module) {
	return new Winston.Logger({
		transports: [
			new Winston.transports.File({
				level: 'info',
				filename: __dirname + '/../logs/all.log',
				handleException: true,
				json: true,
				maxSize: 5242880,
				maxFiles: 20,
				colorize: false
			}),
			new Winston.transports.Console({
				level: 'debug',
				label: getFilePath(module),
				handleException: true,
				json: false,
				colorize: true
			})
		],
		exitOnError: false
	});
}

function getFilePath(module) {
	return module.filename.split('/').slice(-2).join('/');
}

module.exports = WinstonLogger;