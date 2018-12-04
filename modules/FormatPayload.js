module.exports.payloadFormatter = (queryResults, object) => {
    let tempPayload = queryResults;
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
    for (let j = 0; j < object.length; j++) {
        if (object[j].parentId == tempPayload[answerCount].id) {
            tempPayload[answerCount].answers.push(object[j]);
        }
    }
    return tempPayload;
}