const fs = require('fs');
const path = require('path');
const format = require('./FormatOutput');
const payload = require('./FormatPayload');
const consoleLogResults = require('./resultsConsoleOutput');

function searchHanlder(searchArg){
    fs.readFile(path.join(__dirname + '/../posts.json'), 'utf8', function (err, contents) {
    let objects = JSON.parse(contents);
    let searchParam = searchArg.search.toLowerCase();
    //console.log(searchParam);
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
    let resultFileName = `./results/${searchParam.replace(/\s/g, '')}results${theDate.getMilliseconds()}.${resultFileType}`;
    let queryResults = [searchArg];
    let questionCount = 0;
    let answerCount = 0;
    // https://www.ef.edu/english-resources/english-grammar/determiners/
    let determiners = ['the', 'a', 'an', 'this', 'that', 'these', 'those', 'my', 'your', 'his', 'her', 'its', 'our', 'their', 'few', 'little', 'much', 'many', 'lot', 'of', 'most', 'some', 'any', 'enough', 'all', 'both', 'half', 'either', 'neither', 'each', 'every', 'other', 'another', 'one', 'two', 'three', 'such', 'what', 'rather', 'quite', 'can', 'possible', 'is', 'it', 'to', 'use', 'on', "let's", 'with'];
    let searchParamSplit = searchParam.split(' ');
    let determinersFound;
    for (let i = 0; i < objects.length; i++) {
        //should consider modularizing this since the paylods will be identical. Only the control Statements will be unique.
        for(key in objects[i]){
            if (key == 'creationDate') {
                if (objects[i].creationDate.slice(0, 10) == searchParam.slice(0, 10) && objects[i].postType == 'question') {
                    let questionPosition = objects.map(object => { return object.id; }).indexOf(objects[i].parentId);
                    queryResults = payload.payloadFormatter(queryResults, objects[questionPosition], objects, answerCount);
                    answerCount = queryResults[queryResults.length - 1].answers.length + answerCount;
                }
            } else {
                for (let x = 0; x < searchParamSplit.length;x++){
                    for(let y=0; y < determiners.length;y++){
                        if(determiners[y] == searchParamSplit[x]){
                            searchParam = searchParam.replace(determiners[y], '');
                            searchParam = searchParam.replace('  ', ' ');
                        }
                    }
                }
                searchParamSplit = searchParam.split(' ');
                searchParamSplit.find((value, index) => {
                    if(value == ''){
                        delete searchParamSplit[index]
                    }
                });
                for (let x = 0; x < searchParamSplit.length; x++){
                    if (objects[i][key].toString().toLowerCase().includes(searchParamSplit[x]) && objects[i].postType == 'question') {
                        questionCount++;
                        queryResults = payload.payloadFormatter(queryResults, objects[i], objects, answerCount);
                        (!queryResults[queryResults.length - 1].answers.length == 0) ? answerCount = queryResults[queryResults.length - 1].answers.length + answerCount : ''/*console.log("no answers")*/;
                    }
                }
        }
        }
    }
    if (questionCount == 0) {
        console.log('no questions found. Checking again for individual Answers...');
        for (let i = 0; i < objects.length; i++) {
            //should consider modularizing this since the paylods will be identical. Only the control Statements will be unique.
            for (key in objects[i]) {
                if (key == 'creationDate'){
                    if (objects[i].creationDate.slice(0, 10) == searchParam.slice(0, 10) && objects[i].postType == 'answer') { 
                        let questionPosition = objects.map(object => { return object.id; }).indexOf(objects[i].parentId);
                        queryResults = payload.payloadFormatter(queryResults, objects[questionPosition], objects, answerCount);
                        answerCount = queryResults[queryResults.length - 1].answers.length + answerCount;           
                    }
                } else {
                    for (let x = 0; x < searchParamSplit.length; x++) {
                        for (let y = 0; y < determiners.length; y++) {
                            if (determiners[y] == searchParamSplit[x]) {
                                searchParam = searchParam.replace(determiners[y], '');
                                searchParam = searchParam.replace('  ', ' ');
                            }
                        }
                    }
                    searchParamSplit = searchParam.split(' ');
                    searchParamSplit.find((value, index) => {
                        if (value == '') {
                            delete searchParamSplit[index]
                        }
                    })
                    for (let x = 0; x < searchParamSplit.length; x++) {
                        if (objects[i][key].toString().toLowerCase().includes(searchParamSplit[x]) && objects[i].postType == 'answer') { 
                            let questionPosition = objects.map(object => { return object.id; }).indexOf(objects[i].parentId);
                            queryResults = payload.payloadFormatter(queryResults, objects[questionPosition], objects, answerCount);
                            answerCount = queryResults[queryResults.length - 1].answers.length + answerCount;
                        }
                    }
                }
            }
        }
        console.log(`----------
NOTE: Questions contained in this specific Result are not from the Specified date, but are included due to the fact that they are related to An Answer on the specified date.
----------`);
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