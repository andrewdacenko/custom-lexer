import React, {Component} from 'react';
import archy from 'archy';

export class TreeView extends Component {
    recursiveNodes(el, index, last) {
        index = index || 0;

        const tables = this.props.tables;
        const {type, value} = el.token;
        const id = (type && tables[type]) ? tables[type][value] : null;
        const text = type ? `${id ? id + ' ': ''}${value}` : el.name;

        return this.pad(text, index, last) + '\n' +
            el.children.map((n, i) => {
                return this.recursiveNodes(n, index + 1, el.children.length === i + 1)
            }).join('');
    }

    pad(text, number, last) {
        if (!number) {
            return '.   ' + text;
        }

        const prefix = last ? '└──' : '├──';
        return Array(number).join('|  ') + prefix + ' ' + text;
    }

    render() {
        const tables = this.props.tables;

        const tree = {
            label: this.props.tree.name,
            nodes: this.props.tree.children.map(rt)
        };

        function rt(node) {
            const {type, value} = node.token;
            const isToken = type && value;
            const id = isToken && tables[type] && tables[type][value] ? tables[type][value] : null;
            const label = isToken ? (id ? `${id} ${value}` : value ) : node.name;
            const nodes = node.children.map(rt);
            return {
                label,
                nodes
            };
        }

        return (
            <div className="Chart">
                <pre style={{
                    fontFamily: '"Courier 10 Pitch", Courier, monospace',
                    fontSize: '95%',
                    lineHeight: '140%',
                    whiteSpace: 'pre',
                    display: 'none'
                }}>{this.recursiveNodes(this.props.tree)}</pre>
                <pre style={{
                    lineHeight: '0.9',
                    fontSize: '67%'
                }}>{archy(tree)}</pre>
            </div>
        );
    }
}

