#!/usr/local/bin/node

const fs = require('fs');
const commandLineArgs = require('command-line-args');

/*class DateCreator{
  constructor(dateFormat){
    this.dateFormat = dateFormat.toISOString();
    console.log(this.dateFormat);
  }
} */

const optionDefinitions = [
  { name: 'search', alias: 's', type: String, defaultOption: true },
  { name: 'searchById', alias: 'i', type: Number },
  { name: 'searchByTitle', alias: 't' },
  { name: 'postType', alias: 'p', type: Number },
  { name: 'creationDate', alias: 'd', type: date => new Date(date) }
]

const options = commandLineArgs(optionDefinitions)

console.log(options.search);
process.exit(1);

if(options.search){
  console.log(options);
} else if(options.searchById) {
  console.log(options);
} else if(options.searchByTitle) {
  console.log(options);
} else if(options.postType) {
  console.log(options);
} else if(options.creationDate) {
  console.log(options.creationDate);
}

//process.exit(1);

// failed parseInt results in NaN, so try/catch wont work
//isNaN(parseInt(process.argv[2])) ? console.log("query looks good! proceed") : console.log(`${process.argv[2]} is not a number. Exiting.`); process.exit(1);
//if(isNaN(parseInt(process.argv[2]))){
  //console.log(`${process.argv[2]} is not a number. Exiting.`);
  //process.exit(1);
//} 

const argId = parseInt(process.argv[2]);
 
fs.readFile('./posts.json', 'utf8', function(err, contents) {
     var objects = JSON.parse(contents);
     var objectKeys = Object.keys(objects[0]);
     console.log(objectKeys);
     console.log(options.creationDate);
     let dateGiven = options.creationDate.toISOString();
     console.log(dateGiven.slice(0,10));
     for(let i=0;i<objects.length;i++){
	//console.log(objects[i])
	//console.log(objects[i].creationDate.slice(0,10));
	if(objects[i].creationDate.slice(0,10) == dateGiven.slice(0,10)){
	  console.log(objects[i]);
	} /*
	if(objects[i].parentId == options.date) {
	 console.log(objects[i]); 
	} */
    }
});

