import React from 'react';
import {List, ListItem} from 'material-ui/List';
import {Card, CardTitle, CardText} from 'material-ui/Card';

export const InformationTable = ({title, table}) => (
    <Card style={{
        flex: 1,
        margin: 10
    }}>
        <CardTitle title={title} titleStyle={{fontSize: 14}}/>
        <CardText>
            <List>
                {Object.keys(table).map((key, index) => (
                    <ListItem key={index} primaryText={table[key] + ': ' + key}/>
                ))}
            </List>
        </CardText>
    </Card>
);
