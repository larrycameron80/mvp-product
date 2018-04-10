import React from 'react';
import { Link } from 'react-router';
import $ from 'jquery';

import Navigation from './Navigation';
import TranslateSelect from './Translate/TranslateSelect';
import M2Store from '../library/M2Store';
import T, {t} from '../components/Translate/Translate';
const Store = new M2Store();


class Header extends React.Component {
	constructor(props) {
		super(props);
		let user_auth = '';
		if(Store.get('info')) {
			let info = JSON.parse(Store.get('info'));
			user_auth = info.group.alias;

		}
		this.state = {
			is_fixed: false,
			user_auth: user_auth
		}
	}

	componentDidMount() {
		var component = this;

		$(document).ready(function(event) {
			$(document).on('mouseup', function(event) {

				if(
					$(event.target).closest('.m2menu_trigger').length == 0 && 
					!$(event.target).hasClass('m2menu_trigger') && 
					!$(event.target).hasClass('m2_nav_col') && 
					$(event.target).closest('.m2_nav_col').length == 0)
				{
					$('.m2_nav_col').removeClass('menu_open');
				}
			});
		});
	}

	showMobileMenu(event) {
		event.preventDefault();
		$('.m2_nav_col').toggleClass('menu_open');
	}

	render() {
		let headerClassName = (this.state.is_fixed) ? 
			"m2page_row m2page_row_fixed m2page_header" : "m2page_row m2page_header";
		var nav_items = this.props.navigation;
		let link_lk_acitve = (window.location.pathname == '/signin') ? 'active m2link_icon' : 'm2link_icon';
		
		let link = '/signin';
		if(this.state.user_auth) {
			if(this.state.user_auth == 'admin') {
				link = '/admin';
			} else {
				if(this.state.user_auth == 'client' || this.state.user_auth == 'owner') {
					link = '/cp'
				}
			}
		}
		return (
			<header className={headerClassName}>
				<div className="m2row_container">
					<div className="m2col_2 m2brand_col">
						<Link to="/"><img style={{maxWidth: '132px'}} src="/images/logo.svg" /></Link>
					</div>
					<div className="m2col_6 m2_nav_col">
						<Navigation langs={this.props.langs} navigation={nav_items}/>
					</div>
					<div className="m2col_2 m2_login_col">
						<Link to={link} className={link_lk_acitve}>
							<span className="icon"><img src="/images/user_login.svg" /></span>
							<span className="m2link_text"><T ph="HEADER_PRIVATE" def="Личный кабинет"/></span>
						</Link>
					</div>
					<TranslateSelect extraClass="mobile" />
					<div className="m2trigger_mobile_container display_mobile">
						<Link to="/" className="trigger_back"></Link>
						<Link to="#" className="m2menu_trigger" onClick={this.showMobileMenu.bind(this)}>
							<img src="/images/menu_trigger.svg" />
						</Link>
					</div>
				</div>
			</header>
		)
	}
}

export default Header;