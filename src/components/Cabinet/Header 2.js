import React from 'react';
import { Link } from 'react-router';


class Header extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<header className="m2dashboard_container">
				<div className="m2dashboard_content">
					<div className="m2dash2 brand">
						<Link to="/cp"><img src="/images/adrenta_logo.svg" style={{width: '132px'}}/></Link>
					</div>
					<div className="m2dash7 m2dash_nav">
						<Link to="/cp/campaigns/add">Создать кампанию</Link>
						<Link to="/cp/platforms/add">Создать площадку</Link>
						<Link to="/cp/users/add"><T ph="LBL_ADD" def="Добавить"/></Link>
					</div>
					<div className="m2dash1 m2dash_line m2dash_overflow">
						<Link to="/profile" className="adminMenu">
							<img src="/images/user_login.svg" />
							<div className="m2dash_admin_menu">
								<div className="m2dash_admin_menu_title">Меню администратора <img src="/images/user_login_white.svg" /></div>
								<div className="m2dash_admin_menu_items">
									<Link to="/users/groups">Группы</Link>
									<Link to="/pages">Страницы</Link>
									<Link to="/lists">Списки</Link>
									<Link to="/logout">Выйти</Link>
								</div>
							</div>
						</Link>
					</div>
				</div>
			</header>
		);
	}
}

export default Header;