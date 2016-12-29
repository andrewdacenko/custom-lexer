import React, {Component} from 'react';
import TextField from 'material-ui/TextField';
import {Card, CardText} from 'material-ui/Card';
import Chip from 'material-ui/Chip';

const styles = {
    inlineEditable: {}
};

const SAMPLES = [{
    label: 'Minimal',
    code: `
PROGRAM a; 
BEGIN END.
`
}, {
    label: 'Simple',
    code: `
PROGRAM a;
VAR
BEGIN END.
`
}, {
    label: 'Normal',
    code: `
PROGRAM a;
VAR a: [1..2];
BEGIN END.
`
}, {
    label: 'Complex',
    code: `
PROGRAM a;
VAR a, b1, c3: 
    SIGNAL 
    FLOAT 
    [ 12..22
    , 33..22
    ];
BEGIN END.
`
}, {
    label: 'Hard',
    code: `
PROGRAM a;
VAR a, b1, c3: 
    SIGNAL 
    FLOAT 
    [ 12..22
    , 33..22
    ];
k: INTEGER;
BEGIN END.
`
}, {
    label: 'With Comments',
    code: ` 
PROGRAM something;
VAR hello, some, q:
    SIGNAL
    INTEGER
    [2 .. 5, 9 .. 18];
    (* 
     PROGRAM hidden;
     *)
kkk: FLOAT;
BEGIN END.
`
}, {
    label: 'Wrong lexem',
    code: `PROGRAM 1a`
}, {
    label: 'Wrong syntax',
    code: `
PROGRAM something;
VAR hello, some, q:
    SIGNAL
    INTEGER
    [2 .. 5, 9 .. 18];
    (* 
     PROGRAM hidden;
     *)
VAR kkk; FLOAT;
BEGIN END.`
}];

export class InlineEditable extends Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            value: SAMPLES[5].code
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

                    <div>{SAMPLES.map((item, index) => (
                        <Chip
                            key={index}
                            style={{margin: 4}}
                            onTouchTap={() => {
                                this.setState({
                                    value: item.code
                                });

                                this.props.onInputChanged(item.code);
                            }}
                        >
                            {item.label}
                        </Chip>
                    ))}</div>
                </CardText>
            </Card>
        );
    }
}
