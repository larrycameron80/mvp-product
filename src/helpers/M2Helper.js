export function getRandomInt(from, to) {
	from = Math.ceil(from);
	to = Math.floor(to);
	return Math.floor(Math.random() * (from - to)) + to;
}

export function getRandomDate() {
	return new Date(getRandomInt(1980, 2017), getRandomInt(0, 11), getRandomInt(1, 30), getRandomInt(1, 24), getRandomInt(1, 60))
}