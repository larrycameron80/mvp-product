//список роутов

import React from 'react';
import { Route, IndexRoute } from 'react-router';

//load main app container
import Application from './containers/Application';


//import controllers
import MainController from './controllers/MainController';
import AboutController from './controllers/pages/AboutController';
import ContactsController from './controllers/pages/ContactsController';
import FAQController from './controllers/pages/FAQController';
import FranchiseController from './controllers/pages/FranchiseController';
import SignInController from './controllers/pages/SignInController';
import SignUpController from './controllers/pages/SignUpController';
import OffertController from './controllers/pages/OffertController';
import Controller404 from './controllers/pages/Controller404';


/*admin controllers*/
import AdminIndex from './controllers/Admin/Index';


/*users*/
import AdminUsers from './controllers/Admin/Users';
import AdminUsersAdd from './controllers/Admin/Users/Add';
import AdminUsersEdit from './controllers/Admin/Users/Edit';

/*groups*/
import AdminGroup from './controllers/Admin/UserGroups';
import AdminGroupAdd from './controllers/Admin/Groups/Add';
import AdminGroupEdit from './controllers/Admin/Groups/Edit';

/*lists*/
import AdminLists from './controllers/Admin/Lists';
import AdminTranslations from './controllers/Admin/Translations';
import AdminTranslationLang from './controllers/Admin/Translations/Item';

/*notifications*/
import AdminNotification from './controllers/Admin/Notification';
import AdminNotificationTemplate from './controllers/Admin/Notification/Item';

/*cabinet*/
import CabinetIndex from './controllers/Cabinet';
import CabinetCampaign from './controllers/Cabinet/Campaigns';
import CabinetCampaignAdd from './controllers/Cabinet/Campaigns/Add.js';
import CabinetCampaignEdit from './controllers/Cabinet/Campaigns/Edit.js';
import CabinetCampaignStats from './controllers/Cabinet/Campaigns/Stats.js';
import CabinetUsers from './controllers/Cabinet/Users';
import CabinetBills from './controllers/Cabinet/Bills';
import CabinetPofile from './controllers/Cabinet/Profile';
import CabinetPlatforms from './controllers/Cabinet/Platforms';
import CabinetPlatformsAdd from './controllers/Cabinet/Platforms/Add';
import CabinetPlatformsStats from './controllers/Cabinet/Platforms/Stats';
import CabinetPlatformsEdit from './controllers/Cabinet/Platforms/Edit';

export default (
	<Route path="/" component={Application}>
		<IndexRoute component={MainController}/>
		<Route path="/signin" component={SignInController} />
		<Route path="/signup" component={SignUpController} />
		<Route path="/admin">
			<IndexRoute component={AdminIndex} />

			<Route path="/admin/users" component={AdminUsers} />
			<Route path="/admin/users/groups" component={AdminGroup} />
			<Route path="/admin/users/groups/add" component={AdminGroupAdd} />
			<Route path="/admin/users/groups/:id" component={AdminGroupEdit} />
			<Route path="/admin/users/add" component={AdminUsersAdd} />
			<Route path="/admin/users/:id" component={AdminUsersEdit} />

			<Route path="/admin/lists" component={AdminLists} />
			<Route path="/admin/translations" component={AdminTranslations} />
			<Route path="/admin/translations/:id" component={AdminTranslationLang} />
			<Route path="/admin/notifications" component={AdminNotification} />
			<Route path="/admin/notifications/:alias/:lang" component={AdminNotificationTemplate} />


		</Route>
		<Route path="/cp">
			<IndexRoute component={CabinetIndex} />
			<Route path="/cp/users" component={CabinetUsers} />
			<Route path="/cp/profile" component={CabinetPofile} />
		</Route>
		<Route path="*" component={Controller404}/>
	</Route>
)