const srch = require('./Search');
const srchById = require('./SearchById');
const srchByTitle = require('./SearchByTitle');
const srchByPostType = require('./SearchByPostType');
const srchByDate = require('./SearchByDate');

module.exports.route = (chosenArg, options) => {
    console.log(`Chosen arg: ${chosenArg}`);
    //srch.search(options);
    switch(chosenArg){
        case 'search':
            srch.search(options);
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
        console.log("nope");
    }
}