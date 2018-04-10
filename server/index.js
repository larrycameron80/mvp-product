const Express = require('express');
const Path = require('path');
const BodyParser = require('body-parser');
const CookieParser = require('cookie-parser');
const MethodOverride = require('method-override');
const Debug = require('debug')('restapi');
const Passport = require('passport');
const CORS = require('cors');
const FileUploader = require('express-fileupload');


const Libs = __dirname + '/';
const Config = require(Libs + 'connectors/config');
const Logs = require(Libs + 'connectors/logs')(module);
const OAuth = require(Libs + 'authorization/oauth');
require(Libs + '/authorization/auth');

const App = Express();
const httpServer = require('http').createServer(App);


/*middlewares*/
App.use(FileUploader());
App.use(BodyParser.json());
App.use(BodyParser.urlencoded({ extended: false }));
App.use(CookieParser());
App.use(MethodOverride());
App.use(Passport.initialize())
App.use(Express.static(Path.resolve(__dirname, '../build')));
App.use(CORS());
App.options('*', CORS());


/*router endpoints*/
const UserRouter = require(Libs + 'routes/users');
const StatsRouter = require(Libs + 'routes/status');
const CampaignRouter = require(Libs + 'routes/campaigns');
const PlatformRouter = require(Libs + 'routes/platforms');
const PublicRouter = require(Libs + 'routes/public');
const PhotoRouter = require(Libs + 'routes/uploader');
const BillRouter = require(Libs + 'routes/bills');
const GeneratorRouter = require(Libs + 'routes/generator');
const RotatorRouter = require(Libs + 'routes/rotator');
const GroupsRouter = require(Libs + 'routes/groups');
const ListsRouter = require(Libs + 'routes/lists');
const TranslateRouter = require(Libs + 'routes/translate');
const ReportRouter = require(Libs + 'routes/report');
const CoorpRouter = require(Libs + 'routes/coorps');
const NotificationRouter = require(Libs + 'routes/notifications');
const CabinetRouter = require(Libs + 'routes/cabinet');

App.use(Config.get('express:prefix') + '/user/token', OAuth.token);
App.use(Config.get('express:prefix') + '/user', UserRouter);
App.use(Config.get('express:prefix') + '/stats', StatsRouter);
App.use(Config.get('express:prefix') + '/campaigns', CampaignRouter);
App.use(Config.get('express:prefix') + '/platforms', PlatformRouter);
App.use(Config.get('express:prefix') + '/public', PublicRouter);
App.use(Config.get('express:prefix') + '/uploader', PhotoRouter);
App.use(Config.get('express:prefix') + '/bills', BillRouter);
App.use(Config.get('express:prefix') + '/generator', GeneratorRouter);
App.use(Config.get('express:prefix') + '/rotator', RotatorRouter);
App.use(Config.get('express:prefix') + '/groups', GroupsRouter);
App.use(Config.get('express:prefix') + '/lists', ListsRouter);
App.use(Config.get('express:prefix') + '/translate', TranslateRouter);
App.use(Config.get('express:prefix') + '/reports', ReportRouter);
App.use(Config.get('express:prefix') + '/coorps', CoorpRouter);
App.use(Config.get('express:prefix') + '/notifications', NotificationRouter);
App.use(Config.get('express:prefix') + '/cabinet', CabinetRouter);


/*errors*/
App.use(function(req, res, next){
	res.status(404);
	Logs.debug('%s %d %s', req.method, res.statusCode, req.url);
	res.json({error : 'Not found'});
	return;
});

App.use(function(err, req, res, next){
	res.status(err.status || 500);
	Logs.error('%s %d %s', req.method, res.statusCode, err.message);
	res.json({ error: err.message});
	return;
});


App.set('port', process.env.PORT || Config.get('express:port') || 9000);
App.start = App.listen = function () {
	return httpServer.listen.apply(httpServer, arguments)
};

Logs.info("start listening at %s port", App.get('port'));
App.start(App.get('port'));


//start cron tasks
require(Libs + 'tasks/collect_stats.js');
require(Libs + 'tasks/load_placements.js');
require(Libs + 'tasks/load_banners.js');
require(Libs + 'tasks/aggregate/platform.js');

// dump translations from mongo to redis
require(Libs + 'tasks/dump_translations.js');