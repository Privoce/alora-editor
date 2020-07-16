
import React from 'react';
import Editor from 'rich-markdown-editor';
import debounce from 'lodash.debounce';
import { save, setLastEditorId, restore } from '../Storage';


class AloraEditor extends React.Component {
    constructor(props) {
        super(props);
        this.state = {text: ""};
    }

    componentDidMount() {
        restore(this.props.id).then(it =>{ 
            this.setState({text: it[this.props.id] ? it[this.props.id] : "" });
        });
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.id !== this.props.id) {
            restore(this.props.id).then(it =>{ 
                this.setState({text: it[this.props.id] ? it[this.props.id] : "" });
            });
        }
    }

    changeHandler = debounce((value) => {
        const text = value();
        save(text, this.props.id);
        setLastEditorId(this.props.id);
    }, 500);

    render() {
        return <Editor
            key={this.props.id}
            dark={this.props.dark}
            value={this.state.text}
            onChange={this.changeHandler}
        />
    }

}

export default AloraEditor