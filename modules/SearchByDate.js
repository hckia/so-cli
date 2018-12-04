const fs = require('fs');
const path = require('path');
const format = require('./FormatOutput');
const payload = require('./FormatPayload');
const consoleLogResults = require('./resultsConsoleOutput');

function dateHandler(searchArg) {
    fs.readFile(path.join(__dirname + '/../posts.json'), 'utf8', function (err, contents) {
        let objects = JSON.parse(contents);
        let dateGiven = searchArg.creationDate.toISOString();
        let theDate = new Date();
        let resultFileType;
        if (searchArg.html) {
            resultFileType = 'html'
        } else if (searchArg.markdown) {
            resultFileType = 'md'
            console.log('markdown takes longer to process. Importing library...')
        } else {
            resultFileType = 'txt'
        }
        let resultFileName = `./results/${dateGiven.slice(0,10)}results${theDate.getMilliseconds()}.${resultFileType}`;
        let queryResults = [searchArg];
        let questionCount = 0;
        //since index 0 includes searchArguments, we need to begin answerCount at 1
        let answerCount = 1;
        for (let i = 0; i < objects.length; i++) {
            //should consider modularizing this since the paylods will be identical. Only the control Statements will be unique.
            if (objects[i].creationDate.slice(0, 10) == dateGiven.slice(0, 10) && objects[i].postType == 'question') {
                questionCount++;
                //add FormatPayload function here
                queryResults = payload.payloadFormatter(queryResults, objects[i]);
                answerCount++;
            }
        }
        // since index 0 includes searchArguments, we need to subtract one from answerCount.
        format.formatOutput(queryResults, resultFileName);
        consoleLogResults.results(questionCount, answerCount, resultFileName);
    })
}

module.exports.search = (searchArg) => {
    console.log("Search by Date Parameters: ", searchArg);
    dateHandler(searchArg);
}
