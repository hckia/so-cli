#!/usr/local/bin/node

const commandLineArgs = require('command-line-args');
const srchRouter = require('./modules/SrchRouter');

const optionDefinitions = [
    { name: 'search', alias: 's', type: String, defaultOption: true },
    { name: 'exportdocs', type: Boolean },
    { name: 'verbose', alias: 'v', type: Boolean},
    { name: 'html', type: Boolean },
    { name: 'markdown', type: Boolean },
    { name: 'searchById', alias: 'i', type: Number },
    { name: 'searchByTitle', alias: 't' },
    { name: 'postType', alias: 'p', type: Number },
    { name: 'creationDate', alias: 'd', type: date => new Date(date) },
]

const options = commandLineArgs(optionDefinitions);
const args = ['search', 'exportdocs', 'searchById', 'searchByTitle', 'postType', 'creationDate'];
const chosenArg = args.find(arg => (arg in options));

if ((options.html && options.markdown)){
    console.log('Please only choose html or markdown flag');
    process.exit(1);
}

srchRouter.route(chosenArg, options);