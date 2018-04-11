const Express = require('express');
const Passport = require('passport');
const Router = Express.Router();

const Libs = __dirname + '/../';
const Logs = require(Libs + 'connectors/logs')(module);
const Config = require(Libs + 'connectors/config');
const DB = require(Libs + 'connectors/db');
const AXIOS = require('axios');
const UserModel = require(Libs + 'models/user');


Router.post('/', function(req, res) {

    if(req.body.login && req.body.password) {
        let config = {
            method: "POST",
            data: {
                'username': req.body.login,
                'password': req.body.password,
                'grant_type': 'password',
                'client_id': req.body.login,
                'client_secret': req.body.password
            },
            url: Config.get('path_auth')
        };

        AXIOS(config).then(function(response) {
            if(response.data && response.data.access_token) {
                UserModel.findOne({_id: response.data.info.user_id}).exec(function(err, user) {
                    if(err) {
                        res.json({result: 'error', data: 'error load user info'});
                    } else {
                        if(user.api == 1) {
                            let result_data = {
                                access_token: response.data.access_token,
                                token_type: response.data.token_type,
                                info: {
                                    email: response.data.info.email,
                                    balance: response.data.info.balance
                                }
                            }
                            res.json({result: 'success', data: result_data});
                        } else {
                            res.json({result: 'error', data: 'api disabled'});
                        }
                    }
                });
            } else {
                res.json({result: 'error', data: 'access token incorrect'});
            }

        }).catch(function(error) {
            console.log(error);
            res.json({result: 'error', data: 'login or password incorrect'});
        });
    } else {
        res.json({result: 'error', data: 'body are empty'});
    }

});


module.exports = Router;
