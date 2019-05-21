const express = require("express");
const app = express();
var lg,alg;
var s =[],pt = "",msg = "",apt="";
var pg = require('pg');
var conString = "postgres://postgres:password@localhost:5432/postgres";

var client = new pg.Client(conString);
async function start(){
await client.connect();
}
async function rd()
{
	lg = await client.query("SELECT * FROM student");
lg.rows.forEach(row=>{
    console.log(row.name);
});
alg = await client.query("SELECT * FROM admin");
alg.rows.forEach(row=>{
    console.log(row.name);
});
}
function chk(n,p){
	s = [];
	lg.rows.forEach(row=>{
		if( row.name == n && row.password == p)
		{
			s.push(row);
			pt = row.id;
		}
	});
	if( pt == "")
	{
		console.log("invalid");
	}
}
function achk(n,p){
	sa = [];
	alg.rows.forEach(row=>{
		if( row.name == n && row.password == p)
		{
			sa.push(row);
			apt = row.id;
		}
	});
	if( apt == "")
	{
		console.log("invalid");
	}
}


app.use(express.static(__dirname + '/public'));
app.get("/",function(req,res){
	start();
	rd();
    res.render("home.ejs");
});
app.get("/student",function(req,res){
    res.render("student.ejs",{details: res});
});
app.get("/admin",function(req,res){
	console.log(msg);
    res.render("admin.ejs",{msg:msg});
});
app.get("/login/:name/:pass", function(req,res){
	
	var qn = req.params.name;
	var qp = req.params.pass;
	console.log(qn+ "\n" +qp );
	chk(qn,qp);
	console.log(pt);
	if(pt != "" )
	{
		//console.log("home");
		pt = "";
		res.render("studhome.ejs",{full: s});
	}else
	{
		res.redirect("/register");
	}
});
app.get("/alogin/:name/:pass", function(req,res){
	
	var qn = req.params.name;
	var qp = req.params.pass;
	console.log(qn+ "\n" +qp );
	achk(qn,qp);
	console.log(pt);
	if(apt != "" )
	{
		//console.log("home");
		apt = "";
		res.render("adminhome.ejs",{full: sa});
	}else
	{	
		msg = "invalid";
		res.redirect("/admin");
	}
});

app.get("/register",function(req,res){
	    res.render("studreg.ejs");
	});


app.get("/register/:id/:name/:pass/:email/:phone",function(req,res){

	var i = req.params.id;
	var n = req.params.name;
	var p = req.params.pass;
	var e = req.params.email;
	var ph = req.params.phone;
	reg(i,n,p,e,ph);
	console.log(i+"\n"+n+"\n"+p+"\n"+e+"\n"+ph);
	res.redirect("/");
});

async function reg(i,n,p,e,ph){
	var oi= await client.query("INSERT INTO Student values('"+i+"','"+n+"','"+p+"','"+e+"','"+ph+"');");
}
app.listen(3018,function(){
	console.log("Server started successfully go to http://localhost:3018/");
});


