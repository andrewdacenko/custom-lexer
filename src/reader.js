import fs from 'fs';
import path from 'path';

export default async function reader(source) {
    const filePath = path.resolve(source);

    return await readFile(filePath);
}

function readFile(path) {
    return new Promise((resolve, reject) => {
        fs.readFile(path, 'utf-8', (err, data) => {
            if (err) {
                return reject(err);
            }

            return resolve(data);
        });
    });
}
