const fs = require('fs');
const path = require('path');
const format = require('./FormatOutput');
const payload = require('./FormatPayload');
const consoleLogResults = require('./resultsConsoleOutput');

function searchHanlder(searchArg){
    fs.readFile(path.join(__dirname + '/../posts.json'), 'utf8', function (err, contents) {
    let objects = JSON.parse(contents);
    // may want to test if integer
    let searchParam = searchArg.search;//.toString();
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
    //instead of slice, we need to remove any spaces in the argument...
    let resultFileName = `./results/${searchParam}results${theDate.getMilliseconds()}.${resultFileType}`;
    let queryResults = [searchArg];
    let questionCount = 0;
    //since index 0 includes searchArguments, we need to begin answerCount at 1
    let answerCount = 1;
    for (let i = 0; i < objects.length; i++) {
        //should consider modularizing this since the paylods will be identical. Only the control Statements will be unique.
        //the condition statement here should be a function where we can loop through the objects value keys and compare. it should only return a boolean
        if (objects[i].body == searchParam && objects[i].postType == 'question') {
            questionCount++;
            //add FormatPayload function here
            queryResults = payload.payloadFormatter(queryResults, objects[i]);
            answerCount++;
        }
    }
    // since index 0 includes searchArguments, we need to subtract one from answerCount.
    /* 
        take questionCount, AnswerCount, resultsFileName/resultsFilePath, regex, and console.log lines and
        put them into their own file.
    */
    format.formatOutput(queryResults, resultFileName);
    consoleLogResults.results(questionCount, answerCount, resultFileName);
})
}

module.exports.search = (searchArg) =>{
    console.log("Search: ", searchArg);
    searchHanlder(searchArg);
}