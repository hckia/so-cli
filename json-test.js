#!/usr/local/bin/node

var fs = require('fs');

// failed parseInt results in NaN, so try/catch wont work
if(isNaN(parseInt(process.argv[2]))){
  console.log(`${process.argv[2]} is not a number. Exiting.`);
  process.exit(1);
}

const argId = parseInt(process.argv[2]);
 
fs.readFile('./posts.json', 'utf8', function(err, contents) {
     var objects = JSON.parse(contents);
     for(let i=0;i<objects.length;i++){
	//console.log(objects[i])
	if(objects[i].id == argId && objects[i].postType != 'answer'){
	  console.log(objects[i]);
	}
	if(objects[i].parentId == argId) {
	 console.log(objects[i]); 
	}
    }
});

