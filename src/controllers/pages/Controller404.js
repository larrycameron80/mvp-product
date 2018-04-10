import React from 'react';
import * as Config from '../../config';
import Header from '../../components/Header';
import FooterScripts from '../../components/FooterScripts';
import T, {t} from '../../components/Translate/Translate';

class AboutController extends React.Component {

	render() {
        document.title = '404';
		return (
			<div className="m2page_controller">
				<Header navigation={Config.STATIC_PAGES} langs={Config.LANGS}/>
				<main className="m2page_row m2page m2static_page">
					<h1 style={{textAlign: 'center'}}>Not found</h1>
					<FooterScripts/>
					<footer className="m2page_row">
						<p><T ph="LANDING_FOOTER_1" def="2018 - World WiFi. Все права защищены"/></p>
						<p><T ph="LANDING_FOOTER_2" def="Любое несанкционированное копирование материалов сайта карается законом."/></p>
					</footer>
				</main>
			</div>
		);
	}
}

export default AboutController;