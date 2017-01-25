import React, {Component} from 'react';
import Chip from 'material-ui/Chip';
import {Card, CardText} from 'material-ui/Card';

import {InformationTable} from './InformationTable';
import {ProgramTree} from './ProgramTree';
import {Parser} from './../sigma/parser';

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
            successChip: {
                margin: 4,
                backgroundColor: 'green'
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
            <Chip key={index} style={this.styles.chip}>
                {token.type} `<b>{token.value}</b>`
                {' at '}
                <b>
                <span>{token.loc.start.line}:{token.loc.start.column}</span>
                {' - '}
                <span>{token.loc.end.line}:{token.loc.end.column}</span>
                </b>
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

    renderAnalyzeErrors(tokens) {
        let report, tree;

        if (tokens.errors.length) {
            return null;
        }

        try {
            const parser = new Parser(tokens);
            tree = parser.parse();

            report = <Chip style={this.styles.successChip}>Syntax is Correct</Chip>;
        } catch (err) {
            const pos = err.token ? ` at ${err.token.loc.start.line}:${err.token.loc.start.column}` : '';
            report = <Chip style={this.styles.errorChip}>{err.message} {pos}</Chip>;
        }

        debugger;

        return <CardText style={this.styles.wrapper} key={'analyze-report'}>
            {report}
            <ProgramTree tree={tree} tables={tokens.tables} />
        </CardText>;
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
            <div style={{flex: 3}}>
                <Card style={this.styles.card}>
                    <CardText style={this.styles.wrapper} key={'program'}>
                        {this.renderTokens(tokens)}
                        {this.renderErrors(tokens)}
                    </CardText>
                    {this.renderAnalyzeErrors(tokens)}
                </Card>
                <div key="tables" style={this.styles.tables}>
                    {this.renderTables(tokens)}
                </div>
            </div>
        );
    }
}