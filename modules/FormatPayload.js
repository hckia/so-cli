module.exports.payloadFormatter = (queryResults, object, objects, answerCount) => {
    let tempPayload = queryResults;
    let queryDate;
    queryResults[0].creationDate ? queryDate = queryResults[0].creationDate.toISOString().slice(0,10) : '';
    tempPayload.push({
        id: object.id,
        title: object.title, username: '',
        date: object.creationDate.slice(0, 10),
        userId: object.ownerUserId,
        postType: object.postType,
        body: object.body,
        questionFullPayload: object,
        answers: []
    });
    //console.log(objects)
    if(queryDate){
        for (let j = 0; j < objects.length; j++) {
            if (objects[j].parentId == tempPayload[queryResults.length - 1].id && objects[j].creationDate.slice(0, 10) == queryDate) {
                tempPayload[queryResults.length - 1].answers.push(objects[j]);
            } 
        }
    } else {
        for (let j = 0; j < objects.length; j++) {
            if (objects[j].parentId == tempPayload[queryResults.length-1].id) {
                tempPayload[queryResults.length - 1].answers.push(objects[j]);
            }
        }   
    }
    return tempPayload;
}