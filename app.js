var express = require('express');
var bodyParser = require('body-parser');
var session = require('express-session');
var db = require('./db_conn.js');

var app = express();

app.use(bodyParser.urlencoded({extended:true}));
app.use(session({secret:"test123$#%"}));
app.set('view engine','ejs');



// LOGIN

app.get('/',function(req,res){
    var msg = "";
    if(req.session.msg!=""){
         msg=req.session.msg;
    }
    
    res.render('login',{msg:msg});

});


app.post('/login_submit',function(req,res){
    const {email,pass} = req.body;
    var sql='';
    if(isNaN(email))
        sql="select * from User where email = '"+email+"'and password = '"+pass+"'and status = 1 and softdelete = 0";
    else   
        sql="select * from User where mobile = '"+email+"'and password = '"+pass+"'and status = 1 and softdelete = 0";
    
    db.query(sql,function(err,result,fields){
        if(err)
            throw err;
        if(result.length==0)
            res.render('login',{msg:"bad credentials"});
        else{
            req.session.userid=result[0].uid;
            res.redirect('/home');
        }
    });
});


// SIGNUP

app.get('/signup',(req,res)=>{
    
    res.render('signup',{msg:""});
});

app.post('/signup_submit',(req,res)=>{
    const {fname,mname,lname,email,pass,cpass,dob,gender}=req.body;
    let sql_check = "";
    if(isNaN(email))
        sql_check = "select email from user where email='"+email+"'";
    else
        sql_check = "select mobile from user where mobile="+email;
    db.query(sql_check,function(err,result,fields){
        if(err)
            throw err;
        if(result.length==1)
        {
            let errmsg="";
            if(isNaN(email))
                errmsg="email id already exists";
            else
                errmsg = "mobile number already exists";
            res.render('signup',{errmsg:errmsg});
        }
        else
        {
            let curdate = new Date();
            let month = curdate.getMonth()+1
            let dor = curdate.getFullYear()+"-"+month+"-"+curdate.getDate();
            let sql = "";
            if(isNaN(email))
                sql = "insert into user (fname,mname,lname,email,password,dob,dor,gender) values(?,?,?,?,?,?,?,?)";
            else
                sql = "insert into user (fname,mname,lname,mobile,password,dob,dor,gender) values(?,?,?,?,?,?,?,?)";

                db.query(sql,[fname,mname,lname,email,pass,dob,dor,gender], function(err,result,fields){
                    if(err)
                        throw err;
                    if(result.insertId>0){
                        req.session.msg = "Your account is created, check email or mobile for verification code";
                        res.redirect('/');
                    }
                    else{
                        res.render('signup',{msg:"unable to register try again"});
                    }
                });
        }
    });
});



// HOME

app.get('/home',(req,res)=>{
    if(req.session.userid!=""){
        let msg = "";
        if(req.session.msg!="")
            msg=req.session.msg;
        res.render("home",{data:"user tweet will be displayed"});
    }
    else{
        req.session.msg="first login to view the home page";
        res.redirect('/');
    }
});






app.listen(8080,()=>{console.log("server running at localhost port no 8080")});