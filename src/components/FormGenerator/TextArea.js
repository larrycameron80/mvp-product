import React from 'react';


class TextArea extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            value: ''
        }
    }

    __change(event) {
        event.preventDefault();
        this.setState({value: event.target.value});


    }

    updateParent() {
        if(typeof this.props.callback != "undefined") {
            this.props.callback(this.state.value);
        }
    }


    componentWillReceiveProps(nextProps) {
        if(nextProps && nextProps.value) {
            this.setState({value: nextProps.value});
        }
    }

    render() {
        return (
            <div className="m2form_input m2form_textarea_input">
                {this.props.label && <label>{this.props.label}</label>}
                <textarea
                    onChange={this.__change.bind(this)}
                    placeholder={this.props.placeholder}
                    required={this.props.require ? true : false}
                    onBlur={this.updateParent.bind(this)}
                    value={this.state.value}
                ></textarea>
            </div>
        );
    }

}

export default TextArea;