var mysql = require('mysql');
var db = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"#Godisthe1",
    database:"threads"
});
db.connect(function(err){
    if(err)
        throw err;
    });
    module.exports=db;
