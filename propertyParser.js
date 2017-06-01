'use strict';

const fs = require('fs');
const fse = require('fs-extra')
const Prompt = require('prompt');
const Colors = require('colors/safe');
const Pino = require('pino')();
const Sanitize = require('sanitize-filename');
const PropertiesParser = require('properties-parser');
const PropertiesParser2 = require('properties-parser');
const request = require('request');
const querystring = require('querystring');
const util = require('util');

const key = 'trnsl.1.1.20170505T025536Z.3edcea2be083e2f2.63e93143a8cbe4e89a2de0d36c0bbb7c4259f2d6';

Prompt.start();
Prompt.message = '';
Prompt.delimiter = ':';

//Prompt schema
var schema = {
    properties: {
        filename: {
            description: Colors.magenta('What is the name of file?'),
            format: 'string', //validation by flatiron/revalidator
            message: 'Name must be only letters, spaces, or dashes',
            required: true
        },
        locale: {
            description: Colors.magenta('What locale do you want to convert to?'),
            format: 'string', //validation by flatiron/revalidator
            message: 'Name must be only letters',
            required: true
        }
    }
};

Prompt.get(schema, function(err, result) {
    Pino.info('Command-line input received:');
    //Pino.info(`filename:  ${result.filename}`);
    let filename = Sanitize(result.filename);
    Pino.info(`  Sanitized filename: ${filename}`);
    Pino.info(`  locale: ${result.locale}`);
    let locale = result.locale;
    fs.access(filename, fs.constants.R_OK | fs.constants.W_OK, (err) => {
        if (err) {
            Pino.error(`err.code: ${err.code}`);
            //Display the full error
            //Pino.error(err);
            if (err.code === 'ENOENT') {
                return Pino.error(`File doesn't exist!`);
            }
            return Pino.error(`You don't have access to ${filename}`);
        }
        //Pino.info(`You have access.  Yeah!`);

        //Duplicate the file but for a different local
        let newFileName = '';
        try {
            let fileArray = filename.split('.');
            let ext = fileArray.pop();
            let basename = fileArray[0];
            newFileName = `${basename}_${locale}.${ext}`;
            fse.copySync(filename, newFileName);
            Pino.info(`New filename: ${newFileName}`);
        } catch (err) {
            console.error(err)
        }

        PropertiesParser.read(filename, (err, data) => {
            PropertiesParser2.createEditor(`./${newFileName}`, (err, editor) => {
                let interval = 0;
                let incrementValue = 250; //Wait about 250ms between requests.
                for (const element in data) {
                    if (data[element] !== "") {
                        incrementValue = incrementValue + (Math.floor(Math.random() * 3) + 1); //Random creep added so we don't look like a script to the service provider..
                        interval = interval + incrementValue;
                        setTimeout(function() {
                            Pino.info(`Processing: ${data[element]}, interval: ${Date.now()}`);
                            yandexTranslate({
                                key: key,
                                lang: `en-${locale}`,
                                text: data[element]
                            }, result => {
                                let key = element;
                                let value = result[data[element]];
                                editor.set(key, value);
                                editor.save();
                            });
                        }, interval);
                    } else {
                        setTimeout(function() {
                            Pino.info(`Processing: ${data[element]}, interval: ${Date.now()}`);
                            let key = element;
                            let value = data[element]; //basically a blank value
                            editor.set(key, value);
                            editor.save();
                        }, interval);
                    }
                }
            });
        });
    });
});

//Yandex Translate is free!
let yandexTranslate = function(opts, callback) {
    //opts = Object.assign(opts, { lang: 'en-es', key: 'secret',  text: 'text' });

    var url = 'https://translate.yandex.net/api/v1.5/tr.json/translate?' + querystring.stringify(opts);
    //console.log(`url: ${url}`);

    request.get(url, function(err, response, body) {
        if (err) throw err;
        var json = JSON.parse(body);
        if (json.error) {
            throw json.error.message;
        }
        var strings = util.isArray(opts.text) ? opts.text : [opts.text];
        var result = {};
        strings.forEach(function(orig, i) {
            result[orig] = json.text[i];
        });
        //console.log(result);
        callback(result);
    });
};
