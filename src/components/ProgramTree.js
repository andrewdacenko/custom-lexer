import React, {Component} from 'react';
import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton';

import {parse} from '../compiler/parser';

export const ProgramTree = ({
    program,
    tables,
    open,
    onRequestClose
}) => {
    const actions = [
        <FlatButton
            label="Close"
            primary={true}
            onClick={onRequestClose}
        />
    ];

    return (
        <Dialog
            title="Program Tree"
            actions={actions}
            modal={false}
            open={open}
            onRequestClose={onRequestClose}
            autoScrollBodyContent={true}
        >
            {renderTree(program, tables)}
        </Dialog>
    );
};

function renderTree(program, tables) {
    const parsed = parse(program);

    if (typeof parsed === 'string') {
        return <div>{parsed}</div>;
    }

    return (program || []).map((lexem, index) => (
        <div key={index}>{lexem.token}</div>
    ));
}
