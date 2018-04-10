const Oauth = require('oauth2orize');
const Passport = require('passport');
const Crypto = require('crypto');
const Libs = __dirname + '/../';
const Config = require(Libs + 'connectors/config');
const Logs = require(Libs + 'connectors/logs')(module);
const DB = require(Libs + 'connectors/db');
const User = require(Libs + 'models/user');
const AccessToken = require(Libs + 'models/accessToken');
const RefreshToken = require(Libs + 'models/RefreshToken');
const OAuthServer = Oauth.createServer();

const errHandler = function(callback, error) {
	if(error && callback) return callback(error);
}

const generateToken = function (data, done, info) {
	var errorHandler = errHandler(undefined, done),
		refreshToken,
		refreshTokenValue,
		token,
		tokenValue;
	RefreshToken.remove(data, errorHandler);
	AccessToken.remove(data, errorHandler);
	tokenValue = Crypto.randomBytes(32).toString('hex');
	refreshTokenValue = Crypto.randomBytes(32).toString('hex');
	data.token = tokenValue;
	token = new AccessToken(data);
	data.token = refreshToken;
	refreshToken = new RefreshToken(data);
	refreshToken.save(errorHandler);
	token.save(function (error) {
		if(error) {
			Logs.error(error);
			return done(error);
		}
		done(null, tokenValue, refreshTokenValue, {
			'expire_in' : Config.get('secure:ttl'),
			'info': (info) ? info : {}
		});
	});
}

OAuthServer.exchange(Oauth.exchange.password(function(client, username, password, scope, done) {
	User.findOne({email : username, active: true}).populate('user_rule').exec(function(error, user) {
		if(error) return done(error);
		if(!user) return done(null, false, {error : 'User not found'});
		if(!user.checkPassword(password)) return done(null, false, {error: 'Incorrect password'});
		var model = {
			userId : user.userId,
			clientId : user.email
		}

		generateToken(model, done, {
			email: user.email,
			user_id: user.id,
			email: user.email,
			balance: user.balance,
			first_name: user.first_name,
			second_name: user.second_name,
			third_name: user.third_name,
			group: {
				alias: user.user_rule[0].alias
			}
		});
	});
}));

OAuthServer.exchange(Oauth.exchange.refreshToken(function(client, refreshToken, scope, done) {
	RefreshToken.findOne({token : RefreshToken, userId: client.clientId}, function(error, token) {
		if(error) return done(error);
		if(!token) return done(null, false, {error : 'Incorrect refresh token'});
		User.findOne({id: token.userId,active: true}).populate('user_rule').exec(function(error, user) {
			if(error) return done(error);
			if(!user) return done(null, false, {error : 'User not found'});
			var model = {
				userId : user.id,
				clientId: client.clientId
			};

			generateToken(model, done, {
				email: user.email,
				user_id: user.id,
				email: user.email,
				balance: user.balance,
				first_name: user.first_name,
				second_name: user.second_name,
				third_name: user.third_name,
				group: {
					alias: user.user_rule[0].alias
				}
			});
		});
	});
}));

exports.token = [
	Passport.authenticate(['oauth2-client-password'], { session: false }),
	OAuthServer.token(),
	OAuthServer.errorHandler()
]