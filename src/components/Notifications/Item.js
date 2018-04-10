import React from 'react';
import { Link } from 'react-router';

class Item extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			close: false
		}
	}

	__handleClick(event) {
		event.preventDefault();
		this.setState({close: true});
		if(typeof this.props.onRemove != "undefined") {
			this.props.onRemove(this.props.index);
		}
	}

	componentDidMount() {
		
	}

	render() {
		let className = ['m2note'];
		
		if(this.props.type) {
			className.push(this.props.type);
		}

		if(this.state.close) {
			className.push('m2note_close');
		}

		let icon = '<use xlink:href="#svg_icon_close"></use>'

		return (
			<div className={className.join(' ')}>
				<div className="m2note_info">
					{this.props.title && this.props.title != '' ? <div className="m2note_title">{this.props.title}</div> : ''}
					{this.props.text && this.props.text != '' ? <div className="m2note_text">{this.props.text}</div> : ''}
				</div>
				<div className="m2note_actions">
					<Link className="m2note_close" to="#" onClick={this.__handleClick.bind(this)}>
						<svg dangerouslySetInnerHTML={{__html: icon}}></svg>
					</Link>
				</div>
			</div>
		);
	}
}

export default Item;