import React, {Component} from 'react';
import Dialog from 'material-ui/Dialog'
import FlatButton from 'material-ui/FlatButton';

export const ProgramTree = ({
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

        </Dialog>
    );
};

function renderTree(program) {
    // const parsed = parse(program);

    // if (typeof parsed === 'string') {
    //     return <div>{parsed}</div>;
    // }

    // return (program || []).map((lexem, index) => (
    //     <div key={index}>{lexem.token}</div>
    // ));
    return null;
}
