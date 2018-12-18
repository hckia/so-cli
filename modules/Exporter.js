const fs = require('fs');
const path = require('path');
const format = require('./FormatOutput');
const payload = require('./FormatPayload');
const consoleLogResults = require('./resultsConsoleOutput');

function exportAsMd(searchArg){
    fs.readFile(path.join(__dirname + '/../posts.json'), 'utf8', function (err, contents) {
        let objects = JSON.parse(contents);
        //this needs to get its name from the title, the replace portion can stay. It'll be defined in FormatOutput in this instance.
        let resultFileName =  '';//`./backups/${searchParam.replace(/\s/g, '')}.${resultFileType}`;
        let queryResults = [searchArg];
        let questionCount = 0;
        let answerCount = 0;
        for (let i = 0; i < objects.length; i++) { 
                if (objects[i].postType == 'question') {
                    questionCount++;
                    queryResults = payload.payloadFormatter(queryResults, objects[i], objects, answerCount);
                    (!queryResults[queryResults.length - 1].answers.length == 0) ? answerCount = queryResults[queryResults.length - 1].answers.length + answerCount : ''/*console.log("no answers")*/;
                }
        }
        //use optional parameter
        let exportall = true;
        console.log("this might take a moment...")
        format.formatOutput(queryResults, resultFileName, exportall);
        console.log("WE MADE IT!");
        consoleLogResults.results(questionCount, answerCount, './backups');
    })
}

module.exports.exportHandler = (searchArg) => {
    console.log("Exporting parameter: ", searchArg);
    //may have different exportdoc parameters, for now it will default to md..
    exportAsMd(searchArg);
}