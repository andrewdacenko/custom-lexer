import Table from 'cli-table';
import reader from './reader';
import analyze from './src/compiler/lexer';

try {
    run();
} catch (e) {
    console.error(e);
}

async function run() {
    const data = await reader('PROGRAM.txt');
    const {program, tables} = analyze(data);

    const programTable = new Table({
        head: ['Program']
    });

    programTable.push([program.map(i => i.code).join(', ')]);

    console.log(programTable.toString());

    const metaTable = new Table({
        head: Object.keys(tables)
    });

    const rows = Object.keys(tables).reduce((max, key) => {
        return Object.keys(tables[key]).length > max ? Object.keys(tables[key]).length : max;
    }, 0);

    for (let index = 0; index < rows; index++) {
        const row = [];

        Object.keys(tables).forEach((tableName) => {
            const table = tables[tableName];

            const values = Object.keys(table).map((key) => {
                if (tableName === 'WHITESPACES') {
                    return table[key];
                }

                return `${table[key]} - ${key}`;
            });

            if (values.length <= index) {
                row.push('');
            } else {
                row.push(values[index]);
            }
        });

        metaTable.push(row);
    }

    console.log(metaTable.toString());
}
