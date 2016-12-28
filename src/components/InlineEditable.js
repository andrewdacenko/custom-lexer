import React, {Component} from 'react';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import {Card, CardText, CardActions} from 'material-ui/Card';

const styles = {
    inlineEditable: {}
};

const DEFAULT_PROGRAM = ` 
PROGRAM something;
VAR hello, some, q:
    SIGNAL
    INTEGER
    [2 .. 5, 9 .. 18];
    (* 
     PROGRAM hidden;
     *)
VAR kkk: FLOAT;
BEGIN END.
`;

export class InlineEditable extends Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            value: DEFAULT_PROGRAM
        };

        this.props.onInputChanged(this.state.value);
    }

    handleChange = (event) => {
        this.setState({
            value: event.target.value,
        });

        this.props.onInputChanged(event.target.value);
    };

    render() {
        return (
            <Card style={{margin: 10, flex: 1}}>
                <CardText>
                    <TextField
                        hintText="Put your program here"
                        floatingLabelText="Program"
                        multiLine={true}
                        rows={2}
                        style={styles.inlineEditable}
                        onChange={this.handleChange}
                        fullWidth={true}
                        value={this.state.value}
                    />
                </CardText>
                <CardActions style={{textAlign: 'center'}}>
                    <FlatButton label="Build Tree" onClick={this.props.onBuildTreeClick}/>
                </CardActions>
            </Card>
        );
    }
}
