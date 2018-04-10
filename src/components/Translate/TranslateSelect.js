import React from 'react';
import { Link } from 'react-router';
import M2Store from '../../library/M2Store';
import $ from 'jquery';
import {API_URL} from '../../config';
import M2Request from '../../library/M2Request';


const Storage = new M2Store();

let info = Storage.get('info') ? JSON.parse(Storage.get('info')) : false;
let locale = Storage.get('locale');
let userLocale = locale ? locale : false;


class TranslateSelect extends React.Component {
    constructor(props) {
        super(props);
        if (!userLocale) {
            Storage.set('locale', window.tr.default.locale);
            userLocale = window.tr.default.locale;
        }
        if(userLocale && !window.tr[userLocale]) {
            // если вдруг у пользака выбрана локаль и юрчик грохнул ее на сервере
            Storage.set('locale', window.tr.default.locale);
            userLocale = window.tr.default.locale;
        }

        if (window && window.tr) {
            this.curLocale = (userLocale && window.tr[userLocale]) ? userLocale : window.tr.default.locale;
            this.curTranslation = window.tr[this.curLocale];
            let locales = {};
            for (var item in window.tr) {
                if (item != 'default') locales[item] = window.tr[item].name;
            }
            this.state = {
                locales: locales,
                lang_visible: false,
                extraClass: props.extraClass ? props.extraClass : ''
            };
        }

    }

    componentDidMount() {
        this.init = true;
        var component = this;


        $(document).on('click', function(event) {
            if(!$(event.target).hasClass('m2langs') && !$(event.target).closest('.m2langs').length) {
                if(component.init) component.setState({lang_visible: false});
            }
        });

        $(document).on('keyup', function(event) {
            if(component.init) component.setState({lang_visible: false});
        });
    }

    __changeLanguage(event) {
        event.preventDefault();
        let newLocale = event.target.attributes['data-locale'].value;
        Storage.set('locale', newLocale);
        if (Storage.get('info')) {
            M2Request(API_URL + 'user/update_lang', 'PUT', {}, {locale: newLocale}).then(function(result) {
                let info = JSON.parse(Storage.get('info'));
                if(info.lang) {
                    info.lang.locale = newLocale;
                }
                Storage.set('info', JSON.stringify(info));
                window.location.reload();
            });
        } else {
            window.location.reload();
        }
    }

    __showLangs(event) {
        event.preventDefault();
        this.setState({lang_visible: !this.state.lang_visible});
    }

    render() {
        return <div className={"m2col_langs m2langs " + this.state.extraClass}>
            <Link to="#" className={this.state.lang_visible ? 'default_lang visible' : 'default_lang'} key={'default_' + this.curLocale} onClick={this.__showLangs.bind(this)}>{this.state.locales[this.curLocale]}</Link>
            <ul className={this.state.lang_visible ? 'visible' : ''}>
            {this.state.locales && Object.keys(this.state.locales).map((locale) => {
                    return <li key={locale}>
                        <Link to="#"
                              data-locale={locale}
                              onClick={this.__changeLanguage.bind(this)}>{this.state.locales[locale]}</Link>
                    </li>
            })}
            </ul>
        </div>;
    }
}
//{this.props.items.map(item => <Item key={item.prefix + "_lang_select"} item={item} changeLang={component.props.changeLang} />)}
export default TranslateSelect;