import React, {Component} from 'react';
import {Subject} from '@reactivex/rxjs';
import AppBar from 'material-ui/AppBar';

import {analyze} from '../compiler/lexer';
import {tokenize} from '../sigma/sigma';

import {InlineEditable} from './InlineEditable';
import {ProgramAnalyzer} from './ProgramAnalyzer';
import {ProgramTree} from './ProgramTree';

const styles = {
    container: {
        textAlign: 'center',
        paddingTop: 200,
    },
};

class App extends Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            program: '',
            open: false,
            analyzedProgram: {}
        };

        this.update$ = new Subject();
    }

    componentWillMount() {
        this.subscription = this.update$.asObservable()
            .debounceTime(100)
            .subscribe((value) => {
                const {program, tables} = analyze(value);
                const tokens = tokenize(value);

                this.setState({
                    tokens,
                    program: value,
                    analyzedProgram: {program, tables}
                });
            });
    }

    componentWillUnmount() {
        this.subscription.unsubscribe();
    }

    showBuildTree = () => {
        this.setState({
            open: true
        });
    };

    render() {
        return <div className={styles.container}>
            <AppBar
                key="appbar"
                title="SIGNAL COMPILER"
            />
            <InlineEditable
                onInputChanged={(event) => {
                    this.update$.next(event);
                }}
                onBuildTreeClick={this.showBuildTree}
            />
            <ProgramAnalyzer tokens={this.state.tokens}/>
            <ProgramTree
                open={this.state.open}
                onRequestClose={() => {
                    this.setState({
                        open: false
                    });
                }}
                tokens={this.state.tokens}
                {...this.state.analyzedProgram}
            />
        </div>;
    }
}

export default App;
