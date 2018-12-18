const fs = require('fs');
const path = require('path');

module.exports.matchingUser = (matchId) => {
    // this function needs to return a mathching user, so we'd need to supply it with the ownerUserId and have it return the matching user's name.
    let contents = fs.readFileSync(path.join(__dirname + '/../users.json'), 'utf8');
    let objects = JSON.parse(contents);
//    return objects[matchId].realName;

    for (let i = 0; i < objects.length; i++) {
        //console.log(objects[i]);
        //console.log(`matchId: ${matchId}`)
        //console.log(`objects id: ${objects[i].id}`)
        if (objects[i].id == matchId) {
            //console.log(objects[i].realName);
            //console.log(objects[i].realName)
            return objects[i].realName
        }
    }

    // fs.readFile(path.join(__dirname + '/../users.json'), 'utf8', function (err, contents) {
    //     var objects = JSON.parse(contents);
    //     var objectKeys = Object.keys(objects[0]);
    //     console.log(matchId);
    //     //console.log(objectKeys);
    //     //let dateGiven = searchArg.creationDate.toISOString();
    //     for (let i = 0; i < objects.length; i++) {
    //         //console.log(objects[i].id);
    //         if (objects[i].id = matchId) {
    //             //console.log(objects[i].realName);
    //             //console.log(object[i].realName)
    //             return objects[i].realName
    //         }
    //     }
    // })
    //return `USERS NAME HERE ${id}`
}