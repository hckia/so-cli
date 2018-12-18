const htmlToText = require('html-to-text');
let TurnDownService = null;
const users = require('./GetUsers');
const fs = require('fs');

function formatHtml(currentObj, searchArg, logStream, resultFileName){
    logStream.write(`<h1>Results for ${searchArg.creationDate}</h1>
`)
    if (searchArg.verbose) {
        console.log('verbose flag has not been implemented yet, but will ouput ALL keys to the file...')
        console.log(Object.keys(currentObj));
        //need to regex resultFileName.slice(1, resultFileName.length for 'module' directory and remove it.)
        let deleteFile = `${__dirname}${resultFileName.slice(1, resultFileName.length)}`;
        fs.unlinkSync(resultFileName)
        console.log(`As such, no results will show. ${deleteFile} has been deleted.
ending process...`);
        process.exit(1);
    } else {
        logStream.write(`<h2>${currentObj.postType}: ${currentObj.title}</h2>
<h4>Author: ${users.matchingUser(currentObj.userId)}</h4>
<h4>Date: ${currentObj.date}</h4>
<h4>ID: ${currentObj.id}</h4>
<h4>Post Type: ${currentObj.postType}</h4>

${currentObj.body}
<hr />

`)
        let answers = currentObj.answers;
// for lop with turndown library formatting...
        for (let j = 0; j < answers.length; j++) {
            logStream.write(`<h2>${answers[j].postType} to: ${currentObj.title}</h2>
<h4>Author: ${users.matchingUser(currentObj.answers[j].ownerUserId)}</h4>
<h4>Date: ${answers[j].creationDate.slice(0, 10)}</h4>
<h4>ParentID: ${answers[j].parentId}</h4>

${answers[j].body}
<hr />
`);
    }
}}

function formatMarkdown(currentObj, searchArg, logStream, resultFileName){
    let turndownService = new TurnDownService();
    let markdownResultsHeader = turndownService.turndown(`<h1>Results for ${searchArg.creationDate}</h1>`);
    logStream.write(`${markdownResultsHeader}
`)
    let markdownTitle = turndownService.turndown(`<h1>${currentObj.postType}: ${currentObj.title}</h1>`);
    let markdownCurrentUser = turndownService.turndown(`<h3>Author: ${users.matchingUser(currentObj.userId)}</h3>`);
    let markdownDate = turndownService.turndown(`<h3>Date: ${currentObj.date}</h3>`);
    let markdownId = turndownService.turndown(`<h3>ID: ${currentObj.id}</h3>`);
    let markdownBody = turndownService.turndown(currentObj.body);
    let markdownBreak = turndownService.turndown(`<hr />`);
    if (searchArg.verbose) {
        console.log('verbose flag has not been implemented yet, but will ouput ALL keys to the file...')
        console.log(Object.keys(currentObj));
        let deleteFile = `${__dirname}${resultFileName.slice(1, resultFileName.length)}`;
        fs.unlinkSync(resultFileName)
        console.log(`As such, no results will show. ${deleteFile} has been deleted.
ending process...`);
        process.exit(1);
    } else {
        logStream.write(`${markdownTitle}
${markdownCurrentUser}
${markdownDate}
${markdownId}

${markdownBody}
${markdownBreak}
`);
        let answers = currentObj.answers;
// for lop with turndown library formatting...
        for (let j = 0; j < answers.length; j++) {
            let markdownAnswerTitle = turndownService.turndown(`<h3>${answers[j].postType} to: ${currentObj.title}</h3>`);
            let markdownAnswerUser = turndownService.turndown(`<h3>Author: ${users.matchingUser(currentObj.answers[j].ownerUserId)}</h3>`);
            let markdownDate = turndownService.turndown(`<h3>Date: ${answers[j].creationDate.slice(0, 10)}</h3>`);
            let markdownParentId = turndownService.turndown(`<h3>ParentID: ${answers[j].parentId}</h3>`);
            let markdownAnswerBody = turndownService.turndown(`${answers[j].body}`);
            logStream.write(`
${markdownAnswerTitle}
${markdownAnswerUser}
${markdownDate}
${markdownParentId}

${markdownAnswerBody}
${markdownBreak}
`);
        }
    }
}
//end of formatMarkdown

function formatText(currentObj, searchArg, logStream, resultFileName){
    logStream.write(`Results for ${searchArg.creationDate}`);
    let currentUser = `Author: ${users.matchingUser(currentObj.userId)}`;
    let headerText = `
==========
${currentObj.postType}: ${currentObj.title.toUpperCase()}`;
    let bodyText = htmlToText.fromString(currentObj.body, {
        wordwrap: 130,
        singleNewLineParagraphs: true
    });
    if (searchArg.verbose) {
        console.log('verbose flag has not been implemented yet, but will ouput ALL keys to the file...')
        console.log(Object.keys(currentObj));
        let deleteFile = `${__dirname}${resultFileName.slice(1, resultFileName.length)}`;
        fs.unlinkSync(resultFileName)
        console.log(`As such, no results will show. ${deleteFile} has been deleted.
ending process...`);
        process.exit(1);
    } else {
        logStream.write(`
${headerText}
${currentUser}
Date: ${currentObj.date}
ID: ${currentObj.id}
==========
\n${bodyText}
`);
        let answers = currentObj.answers;
        for(let j = 0;j< answers.length;j++){
            let headerText = `
==========
${answers[j].postType} to: ${currentObj.title.toUpperCase()}`;
            let bodyText = htmlToText.fromString(answers[j].body, {
                wordwrap: 130,
                singleNewLineParagraphs: false
            });
            let currentAnswerUser = `Author: ${users.matchingUser(currentObj.answers[j].ownerUserId)}`;
            logStream.write(`${headerText}
${currentAnswerUser}
Date: ${answers[j].creationDate.slice(0,10)}
ParentID: ${answers[j].parentId}
==========
\n${bodyText}
`);
        }
    }
}

module.exports.formatOutput = (queryResults, resultFileName, exportall) => {
    exportall = exportall || false;
    let searchArg = queryResults[0];
    if (searchArg.markdown || exportall) TurnDownService = require('turndown');
    let logStream = (!exportall) ? fs.createWriteStream(resultFileName, { 'flags': 'a' }) : '';
    if (exportall) {
        for (let i = 1; i < queryResults.length; i++) {
            let currentObj = queryResults[i];
            //console.log(currentObj.title.replace(/\s/g, ''));
            // wow fix this regex scrub :)
            let resultFileName = `./backups/${currentObj.title.replace(/\s/g, '').replace("[^0-9a-zA-Z]+", '').replace(/[()#.:?/'"]+/g, '')}.md`
            logStream = fs.createWriteStream(resultFileName, { 'flags': 'a' });
            formatMarkdown(currentObj, searchArg, logStream, resultFileName);
        }        
    }
    else if (searchArg.html) {
        for (let i = 1; i < queryResults.length; i++) {
            let currentObj = queryResults[i];
            formatHtml(currentObj, searchArg, logStream, resultFileName);
        }
    } else if (searchArg.markdown) {
        for (let i = 1; i < queryResults.length; i++) {
            let currentObj = queryResults[i];
            formatMarkdown(currentObj, searchArg, logStream, resultFileName);
        }
    } else {
        for (let i = 1; i < queryResults.length; i++) {
            let currentObj = queryResults[i];
            //console.log(currentObj.title);
            formatText(currentObj, searchArg, logStream, resultFileName);
        }
    }
}