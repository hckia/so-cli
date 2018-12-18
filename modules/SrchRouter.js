const srch = require('./Search');
const srchById = require('./SearchById');
const srchByTitle = require('./SearchByTitle');
const srchByPostType = require('./SearchByPostType');
const srchByDate = require('./SearchByDate');
const exporter = require('./Exporter');

module.exports.route = (chosenArg, options) => {
    //console.log(`Chosen arg: ${chosenArg}`);
    switch(chosenArg){
        case 'search':
            srch.search(options);
        break;
        case 'exportdocs':
            exporter.exportHandler(options);
        break;
        case 'searchById':
            srchById.search(options);
        break;
        case 'searchByTitle':
            srchByTitle.search(options);
        break;
        case 'postType':
            srchByPostType.search(options);
        break;
        case 'creationDate':
            srchByDate.search(options);
        break;
        default:
        console.log("Something's wrong, no appropriate search parameter has been found");
    }
}