export function dateInterval(number, words) {
	var val = number % 100;
	if (val > 10 && val < 20) {
		return words[2];
	} else {
		var val = number % 10;
		if (val == 1) {
			return words[0];
		} else {
			if (val > 1 && val < 5) {
				return words[1];
			} else {
				return words[2];
			}
		}
	}
}


export function numberFormat(value, n, x, s, c) {
	if(typeof value == "string") value = parseFloat(value);
	if (typeof value != 'undefined') {
		var re = '\\d(?=(\\d{' + (x || 3) + '})+' + (n > 0 ? '\\D' : '$') + ')',
			num = value.toFixed(Math.max(0, ~~n));
		return (c ? num.replace('.', c) : num).replace(new RegExp(re, 'g'), '$&' + (s || ','));
	} else {
		return '';
	}
}