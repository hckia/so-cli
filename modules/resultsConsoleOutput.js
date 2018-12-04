module.exports.results = (questionCount, answerCount, resultFileName) => {
    console.log(`Number of Questions ${questionCount}
Number of Answers ${answerCount - 1}`)
    let resultsFilePath = __dirname + resultFileName.slice(1, resultFileName.length);
    let regex = /modules\//;
    resultsFilePath = resultsFilePath.replace(regex, '');
    console.log(`you may now see your results in ${resultsFilePath}`);
}