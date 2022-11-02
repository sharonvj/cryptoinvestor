const fs = require('fs');
const csv = require('csv-parser');
const moment = require('moment');

const data = {};
let lastRead;

const readCsvFile = (path, schema) => {
  const promise = new Promise((resolve, reject) => {
    fs.stat(path, (error, stats) => {
      if (stats.size <= 209715200) {
        const timeDiff = moment.duration(moment().diff(lastRead)).asSeconds();

        if (!data[path] && !lastRead || timeDiff > 60) {
          data[path] = [];

          fs.createReadStream(path)
            .pipe(csv())
            .on('data', (row) => {
              data[path].push(row);
            }).on('error', (err) => {
              reject(err.message);
            })
            .on('end', () => {
              resolve(data[path]);
              lastRead = moment();
            });
        } else {
          resolve(data[path]);
        }
      } else {
        reject(`CSV File Size is ${stats.size} Bytes. We Can't Process this large file. Maximum Proccessable Size is ${209715200} bytes`);
      }
    });
  });

  return promise;
};

module.exports = {
  readCsvFile,
};
