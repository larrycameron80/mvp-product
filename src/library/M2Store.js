export default class M2Storage {
	
	constructor() {
		this.is_local = (typeof window.localStorage !== "undefined") ? true : false;
	}
	
	__getCookie(name) {
		var matches = document.cookie.match(new RegExp(
			"(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
		));
		return matches ? decodeURIComponent(matches[1]) : undefined;
	}
	
	__setCookie(name, value, options) {
		options = options || {};
		var expires = options.expires;
		
		if (typeof expires == "number" && expires) {
			var d = new Date();
			d.setTime(d.getTime() + expires * 1000);
			expires = options.expires = d;
		}
		if (expires && expires.toUTCString) {
			options.expires = expires.toUTCString();
		}
		value = encodeURIComponent(value);
		var updatedCookie = name + "=" + value;
		for (var propName in options) {
			updatedCookie += "; " + propName;
			var propValue = options[propName];
			if (propValue !== true) {
				updatedCookie += "=" + propValue;
			}
		}
		document.cookie = updatedCookie;
		return true;
	}
	
	__getLocal(name) {
		return window.localStorage.getItem(name);
	}
	
	__setLocal(name, value) {
		window.localStorage.setItem(name, value);
	}
	
	get(name) {
		return this.is_local ? this.__getLocal(name) : this.__getCookie(name);
	}
	
	set(name, value, options) {
		return this.is_local ? this.__setLocal(name, value) : this.__setCookie(name, value, options);
	}
	
	remove(name) {
		if(!this.is_local) {
			var options = {
				expires: - 1
			};
			return this.__setCookie(name, '', options);
		} else {
			return window.localStorage.removeItem(name);
		}
	}
	
	mremove(keys) {
		keys.map(key => this.remove(key));
	}
}