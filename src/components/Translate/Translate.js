/**
 * Created by WorldWifiTeam
 */

import React from 'react';
import TranslatePopup from '../../components/Translate/TranslatePopup';
import M2Store from '../../library/M2Store';
import M2Request from '../../library/M2Request';
import * as Config from '../../config';


const Storage = new M2Store();

let info = Storage.get('info') ? JSON.parse(Storage.get('info')) : false;
let locale = Storage.get('locale');
let userLocale = locale ? locale : false;


function getPhValues(ph, def) {
    if (window && window.tr) {
        setUserLocale();
        // если не нашли значения и мы админы - создадим такой ph в базе
        let curTranslation = window.tr[userLocale];
        // TODO: вернуть после работы с кабинетамми
        if (curTranslation && ph && !curTranslation['phs'][ph]) {// && info && info.group.alias == 'admin') {
            __adminCreatePh(ph, def);
        }
        return (curTranslation && ph && curTranslation['phs'][ph]) ? curTranslation['phs'][ph] : ['{' + ph + '}', '', ''];
    } else {
        console.error('fuck you in getPhValues!');
    }
}

function __adminCreatePh(ph, def) {
    let data = {
        name: ph,
        locale: userLocale,
        values: [def ? def : '', '', ''],
        def: def ? def : ''
    };
    M2Request(Config.API_URL + 'translate/ph/', 'POST', {}, data)
        .then(function (res) {
            if (res && res.data && res.data.result == 'success') {
                window.tr[userLocale]['phs'][ph] = [def ? def : '', '', ''];
            }
        })
}

function setUserLocale() {
    // проверим, вдруг кто-то через админку выставил нам локаль принудительно
    if (info && info.lang && info.lang.locale && info.lang.locale != userLocale) {
        Storage.set('locale', info.lang.locale);
        userLocale = info.lang.locale;
    }
    if (!userLocale) {
        // проверяем наличие GET параметра lang в URL
        let m = window.location.toString().match(/[&?]lang=([a-z]{2})/),
            lang = m ? m[1] : null;
        if(lang) {
            userLocale = lang;
            Storage.set('locale', lang);
        }
    }
    if (window && window.tr) {
        if (!userLocale) {
            Storage.set('locale', window.tr.default.locale);
            userLocale = window.tr.default.locale;
        }
        if (!window.tr[userLocale]) {
            // если вдруг у пользака выбрана локаль и юрчик грохнул ее на сервере
            Storage.set('locale', window.tr.default.locale);
            userLocale = window.tr.default.locale;
        }
    } else {
        console.error('fuck you in setUserLocale!')
    }
}

export function t(ph, def, val) {
    if (window && window.tr) {

        let vals = getPhValues(ph, def, val);
        if (val) {
            // нужно выбрать соответсвующий плейсхолдер, т.к. нам передали значение
            let intVal = parseInt(val);
            if (intVal == 0 || !intVal) {
                return vals[0];
            }
            else if (intVal == 1){
                return vals[1];
            }
            else {
                return vals[2];
            }
        } else {
            return vals[0];
        }
    } else {
        console.error('fuck you in getTranslation!');
        return '{' + ph + '}';
    }
}

class T extends React.Component {
    /*

    примеры

    <Translate ph="about_ph1" def="Текст, который мы заменили меткой (необязательно, но лучше ставить для самих себя)"/>
    <Translate ph="custom_ph2" val={undefined}/>
    <Translate ph="custom_ph2" val={null}/>
    <Translate ph="custom_ph2" val={NaN}/>
    <Translate ph="custom_ph2" val="0"/>
    <Translate ph="custom_ph2" val={0}/>
    <Translate ph="custom_ph2" val="1"/>
    <Translate ph="custom_ph2" val={1}/>
    <Translate ph="custom_ph2" val="2"/>
    <Translate ph="custom_ph2" val={2}/>
    <Translate ph="custom_ph2" val="20.12"/>
    <Translate ph="custom_ph2" val={20.12}/>
    <Translate ph="custom_ph2" val="0.12"/>
    <Translate ph="custom_ph2" val={0.12}/>
    <Translate ph="custom_ph211111" val="2"/>

    */
    constructor(props) {
        super(props);
        this.state = {
            values: getPhValues(props.ph, props.def, props.val)
        };
    }

    __phValue() {
        let val = parseInt(this.props.val);
        if (val == 0 || !val) {
            return this.state.values[0];
        }
        else if (val == 1){
            return this.state.values[1];
        }
        else {
            return this.state.values[2];
        }
    }

    __updateCaption(values) {
        if (userLocale) {
            let self = this;
            let data = {
                'locale': userLocale,
                'name': self.props.ph,
                'values': values
            };
            M2Request(Config.API_URL + 'translate/ph/', 'PUT', {}, data)
                .then(function (res) {
                    if (res && res.data && res.data.result == 'success') {
                        self.setState({
                            values: values
                        });
                    }
                });
        }
    }

    __createMarkup(text) {
        return {__html: text};
    };

    render() {
        let caption = this.props.val ? this.__phValue() : this.state.values[0];
        let lang_switch = Storage.get('lang_switcher');

        // if (info && info.group.alias == 'admin' && lang_switch && lang_switch == 'on') {
        // TODO: вернуть после работы с кабинетамми
        if (lang_switch && lang_switch == 'on') {
            if (caption == '') caption = '{' + this.props.ph + '}';
            let template = <TranslatePopup {...this.props} values={this.state.values} updateCaption={this.__updateCaption.bind(this)}/>;

            return (
                <span className="trPopup" >
                    <span dangerouslySetInnerHTML={this.__createMarkup(caption)}></span>
                    {template}
                </span>
            );
        }
        else {
            return (
                <span dangerouslySetInnerHTML={this.__createMarkup(caption)}></span>
            );
        }
    }
}

export default T;
