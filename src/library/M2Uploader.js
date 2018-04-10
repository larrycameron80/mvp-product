import M2Storage from './M2Store';
import axios from 'axios';


const Storage = new M2Storage();


export default function M2Uploader(url, progress_callback, headers, data) {
	let config = {
		url: url,
		data: data,
		method: "POST",
		onUploadProgress: progressEvent => {
			let percentCompleted = Math.floor((progressEvent.loaded * 100) / progressEvent.total);
			progress_callback(percentCompleted);
		}
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