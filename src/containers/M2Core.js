//загрузка основного контейнера для приложения
if (process.env.NODE_ENV === 'production') {
	module.exports = require('./M2Core.prod.js');
} else {
	module.exports = require('./M2Core.dev.js');
}