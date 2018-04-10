import M2Storage from './M2Store';
import axios from 'axios';


const Storage = new M2Storage();

export default function M2Request(url, method, headers, data) {
	let config = {
		url: url,
		method: method,
		data: data
	};

	let access_token = Storage.get('access_token');
	
	if(access_token && typeof access_token != "undefined") {
		
		if(headers) {
			headers['Authorization'] = 'Bearer ' + access_token;
		} else {
			headers = {
				'Authorization': 'Bearer ' + access_token
			}
		}
	}

	config['headers'] = headers;

	return axios(config);
}