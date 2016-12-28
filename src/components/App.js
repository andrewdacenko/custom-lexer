import React, {Component} from 'react';
import {Subject} from '@reactivex/rxjs';
import AppBar from 'material-ui/AppBar';

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
        };

        this.update$ = new Subject();
    }

    componentWillMount() {
        this.subscription = this.update$.asObservable()
            .debounceTime(100)
            .subscribe((value) => {
                const tokens = tokenize(value);

                this.setState({
                    tokens,
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
            <div style={{display: 'flex'}}>
                <InlineEditable
                    onInputChanged={(event) => {
                        this.update$.next(event);
                    }}
                    onBuildTreeClick={this.showBuildTree}
                />
                <ProgramAnalyzer
                    tokens={this.state.tokens}
                />
            </div>
            <ProgramTree
                open={this.state.open}
                onRequestClose={() => {
                    this.setState({
                        open: false
                    });
                }}
                tokens={this.state.tokens}
            />
        </div>;
    }
}

export default App;
