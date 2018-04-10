import React from 'react';


class FooterScripts extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		let yaMetricsScript = "(function (d, w, c) {\n" +
            "                (w[c] = w[c] || []).push(function() {\n" +
            "                    try {\n" +
            "                        w.yaCounter44774719 = new Ya.Metrika({\n" +
            "                            id:44774719,\n" +
            "                            clickmap:true,\n" +
            "                            trackLinks:true,\n" +
            "                            accurateTrackBounce:true,\n" +
            "                            webvisor:true,\n" +
            "                            trackHash:true\n" +
            "                        });\n" +
            "                    } catch(e) { }\n" +
            "                });\n" +
            "\n" +
            "                var n = d.getElementsByTagName(\"script\")[0],\n" +
            "                s = d.createElement(\"script\"),\n" +
            "                f = function () { n.parentNode.insertBefore(s, n); };\n" +
            "                s.type = \"text/javascript\";\n" +
            "                s.async = true;\n" +
            "                s.src = \"https://cdn.jsdelivr.net/npm/yandex-metrica-watch/watch.js\";\n" +
            "\n" +
            "                if (w.opera == \"[object Opera]\") {\n" +
            "                d.addEventListener(\"DOMContentLoaded\", f, false);\n" +
            "            } else { f(); }\n" +
            "            })(document, window, \"yandex_metrika_callbacks\");";
        let yaMetrics = (
			<div>
				<script type="text/javascript" dangerouslySetInnerHTML={{__html: yaMetricsScript}}/>
				<noscript>
					<div>
						<img src="https://mc.yandex.ru/watch/44774719" style={{position: 'absolute', left: -9999}} alt=""/>
					</div>
				</noscript>
			</div>);

		let gglScript = "(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){\n" +
            "            (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),\n" +
            "            m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)\n" +
            "        })(window,document,'script','https://www.google-analytics.com/analytics.js','ga');\n" +
            "\t\t\tga('create', 'UA-35878743-3', 'auto');\n" +
            "\t\t\tga('send', 'pageview');\n";
		let googleAnal = (
			<script dangerouslySetInnerHTML={{__html: gglScript}}/>);
		return (
			<div className="anal-scripts">
				{yaMetrics}
				{googleAnal}
			</div>
		)
	}
}

export default FooterScripts;