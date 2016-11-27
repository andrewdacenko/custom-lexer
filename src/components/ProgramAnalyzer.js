import React, {Component} from 'react';
import Chip from 'material-ui/Chip';
import {Card, CardText} from 'material-ui/Card';

import {InformationTable} from './InformationTable';

export class ProgramAnalyzer extends Component {
    constructor(props, context) {
        super(props, context);

        this.styles = {
            chip: {
                margin: 4,
            },
            errorChip: {
                margin: 4,
                backgroundColor: 'red'
            },
            wrapper: {
                display: 'flex',
                flexWrap: 'wrap',
            },
            root: {
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'space-around',
            },
            card: {
                margin: 10
            },
            tables: {
                display: 'flex'
            }
        };
    }

    renderTokens(tokens) {
        return tokens.map((token, index) => (
            <Chip
                key={index}
                style={this.styles.chip}
            >
                {token.type} - {token.value}
            </Chip>
        ));
    }

    renderErrors(tokens) {
        return (tokens.errors || []).map((error, index) => (
            <Chip key={index} style={this.styles.errorChip}>
                {error.description} on {error.lineNumber}:{error.column}
            </Chip>
        ));
    }

    renderTables(tokens) {
        return Object.keys(tokens.tables).map((key, index) => (
            <InformationTable
                key={index}
                title={key}
                table={tokens.tables[key]}
            />
        ));
    }

    render() {
        const {tokens} = this.props;

        if (!tokens) return null;

        return (
            <div>
                <Card style={this.styles.card}>
                    <CardText style={this.styles.wrapper} key={'program'}>
                        {this.renderTokens(tokens)}
                        {this.renderErrors(tokens)}
                    </CardText>
                </Card>
                <div key="tables" style={this.styles.tables}>
                    {this.renderTables(tokens)}
                </div>
            </div>
        );
    }
}