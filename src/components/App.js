import React, {Component} from 'react';
import {Subject} from '@reactivex/rxjs';
import AppBar from 'material-ui/AppBar';

import {tokenize} from '../sigma/sigma';

import {InlineEditable} from './InlineEditable';
import {ProgramAnalyzer} from './ProgramAnalyzer';

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
                iconElementLeft={<div></div>}
                title="SIGNAL ANALYZER"
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
        </div>;
    }
}

export default App;
