const Passport = require('passport');
const BasicStrategy = require('passport-http').BasicStrategy;
const ClientPasswordStrategy = require('passport-oauth2-client-password').Strategy;
const BearerStrategy = require('passport-http-bearer').Strategy;
const Libs = __dirname + '/../';
const Config = require(Libs + 'connectors/config');
const AccessToken = require(Libs + '/models/accessToken');
const RefreshToken = require(Libs + '/models/RefreshToken');
const User = require(Libs + '/models/user');

Passport.use(new BasicStrategy(function(username, password, done) {
	User.findOne({email : username, active: true}, function(error, user) {
		if(error) return done(error);
		if(!user) return done(null, false, {error_message: 'User not found'});//not found user
		if(user.password !== password) return done(null, false, {error_message : 'Incorrect password'}); //incorrect password
		return done(null, user);
	});
}));

Passport.use(new ClientPasswordStrategy(function(username, password, done) {
	User.findOne({email : username, active: true}, function(error, user) {
		if(error) return done(error);
		if(!user) return done(null, false, {error_message : 'User not found'});//not found user
		if(!user.checkPassword(password)) return done(null, false, {error_message: "Incorrect password"}); //incorrect password
		return done(null, user);
	});
}));

Passport.use(new BearerStrategy(function(access_token, done) {

	AccessToken.findOne({token : access_token}, function(error, token) {
		if(error) return done(error);
		if(!token) return done(null, false);
		if(Math.round((Date.now()-token.created_at)/1000) > Config.get('security:ttl')) {
			AccessToken.remove({token : access_token}, function(error) {
				if(error) return done(error);
			});
			return done(null, false, {error_message : 'Access token expire'});
		}

		User.findOne({_id: token.userId, active: true}).populate('user_rule').exec(function(error, user) {
			if(error) return done(error);
			if(!user) return done(null, false, {error_message : 'User not found'});
			var info = {scope : "*"};
			done(null, user, info);
		});
	});
}));