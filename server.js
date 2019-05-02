
var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'dbadmin123456',
  database : 'nodejsmapdb',
  port:3306
});

connection.connect();


var fs = require('fs');
var http = require("http");
const url = require("url");
const querystring = require("querystring");
const server = http.createServer((request, response) => {
    let   corsUrl = "http://127.0.0.1:8080";
    console.log(request.url);
    if (request.url.startsWith("/get?")) {
        
        if(request.headers["origin"] === "http://127.0.0.1:8080"){
            corsUrl = "http://127.0.0.1:8080";
        }else if(request.headers["origin"] === "http://localhost:8080"){
            corsUrl = "http://localhost:8080";
        }
        // process data
        const obj = url.parse(request.url, true)
        var peopleName=obj.query['peoplename'].toString()
        var arrName = peopleName.split(" ")
        let firstname=''
        let middlename=''
        let lastname=''
        let nameNum=0 //middle name would be empty
        let index=[]
        let j=0
        for(let i=0;i<arrName.length;i++)
        {
            if(arrName[i]!='')nameNum+=1
            if(arrName[i]!='') {
                    index[j] = i
                    j++
                }
        }

        if(nameNum==2)
        {
            firstname=arrName[index[0]].toString()
            lastname=arrName[index[1]].toString()
        }
        else
        {
            firstname=arrName[index[0]].toString()
            middlename=arrName[index[1]].toString()
            lastname=arrName[index[2]].toString()
        }

        var  userAddSql_Params = [firstname, middlename,lastname];
        //var  userAddSql_Params = ['Donald', 'C','Delisi'];

        connection.query('SELECT addrbusiness,city,state FROM peopleinfo where firstname=? and middlename=? and lastname=?',userAddSql_Params, function (error, results) {
          if (error) throw error;
          console.log('The addr is: ', results[0].addrbusiness +' ' + results[0].city+ ' ' + results[0].state);

          response.writeHead(200,"ok",{
            "Content-type":"application/x-javascript",
            "Access-Control-Allow-Origin":corsUrl,
            "Access-Control-Allow-Headers":"damu",
            "Access-Control-Allow-Methods":"PUT,DELETE,POST",
            "Access-Control-Max-Age":"10"
        })

        //    if (item.hasOwnProperty("name")) {     }
        //var str = JSON.stringify(url.parse(request.url, true).query);
        response.write(results[0].addrbusiness +' ' + results[0].city+ ' ' + results[0].state);
        response.end();
        });


    } else if (request.url.startsWith("/post")) {



    } else {
       // response.writeHead(500, "Invalid Request", {"Content-Type": "text/html; charset=utf-8"});
       // response.end("invalid request");
        // parse request
       var pathname = url.parse(request.url).pathname;

       // output requested filename
       console.log("Request for " + pathname + " received.");

       // read requested file content from file system
       fs.readFile(pathname.substr(1), function (err, data) {
          if (err) {
             console.log(err);
             // HTTP status: 404 : NOT FOUND
             // Content Type: text/html
             response.writeHead(404, {'Content-Type': 'text/html'});
          }else{
             // HTTP status: 200 : OK
             // Content Type: text/html
             response.writeHead(200, {'Content-Type': 'text/html'});

             // response of file content
             response.write(data.toString());
          }
          //  send response 
          response.end();
       });
    }
})

server.listen(8080, '127.0.0.1', () => {
    //console.log(`server starting at ${config.host}:${config.port}`)
    console.log(`server starting at 127.0.0.1:8080`)
})