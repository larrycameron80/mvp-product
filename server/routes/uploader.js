const Express = require('express');
const Passport = require('passport');
const Router = Express.Router();
const UniqID = require('uniqid');
const FS = require('fs');
const MKDIR = require('mkdirp');

const Libs = __dirname + '/../';
const Logs = require(Libs + 'connectors/logs')(module);
const Config = require(Libs + 'connectors/config');
const DB = require(Libs + 'connectors/db');

const ImagesModel = require(Libs + 'models/banners_images');

Router.post('/photo_upload', Passport.authenticate('bearer', {session: false}), function(req, res) {
	if(!req.files) {
		res.json({result:'error', data : 'No files uploaded'});
	} else {
		let date = new Date();
		let replace_path = Libs + Config.get('express:upload');
		let path = Libs + Config.get('express:upload') + '/' + date.getFullYear() + '/' + date.getMonth() + '/' + date.getDate();
		for(var i in req.files) {
			var file = req.files[i];
			if(file.mimetype == 'image/jpeg' || file.mimetype == 'image/png' || file.mimetype == 'image/gif') {
				let user_path = path + '/' + req.user.userId;
				MKDIR(user_path, function(err) {
					if(!err) {
						let file_name_origin = file.name.split('.');
						let fileName = UniqID() + '.' + file_name_origin[file_name_origin.length - 1];
						let file_path = user_path + '/' + fileName;
						file.mv(file_path, function (error) {
							if(error) {
								result.json({result: 'error', data: 'error upload file'});
							} else {
								res.json({result: 'success', data: Config.get('express:result_upload_path') + file_path.replace(replace_path, '')});
							}
						});
					}
				});
			}
		}
	}
});

Router.post('/video_upload', Passport.authenticate('bearer', {session: false}), function(req, res) {
	if(!req.files) {
		res.json({result:'error', data : 'No files uploaded'});
	} else {
		let date = new Date();
		let replace_path = Libs + Config.get('express:upload');
		let path = Libs + Config.get('express:upload') + '/' + date.getFullYear() + '/' + date.getMonth() + '/' + date.getDate();
		for(var i in req.files) {
			var file = req.files[i];
			if(file.mimetype == 'video/avi' || file.mimetype == 'video/mp4' || file.mimetype == 'video/webm') {
				let user_path = path + '/' + req.user.userId;
				MKDIR(user_path, function(err) {
					if(!err) {
						let file_name_origin = file.name.split('.');
						let fileName = UniqID() + '.' + file_name_origin[file_name_origin.length - 1];
						let file_path = user_path + '/' + fileName;
						file.mv(file_path, function (error) {
							if(error) {
								result.json({result: 'error', data: 'error upload file'});
							} else {
								res.json({result: 'success', data: Config.get('express:result_upload_path') + file_path.replace(replace_path, '')});
							}
						});
					}
				});
			}
		}
	}
});

module.exports = Router;