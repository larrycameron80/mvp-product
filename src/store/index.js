// определяем в какой среде у нас запущен сборщки и подгружаем нужное хранилище
if (process.env.NODE_ENV === 'production') {
	module.exports = require('./store.prod.js');
} else {
	module.exports = require('./store.dev.js');
}