/*
 *  @BUAACTF 2023
 *  @AUTHOR FYHSSGSS
 */

const admin_token = '77037611-b007-7030-ed56-ca23b30a7e20'; // this is not the real token and password!
const admin_pass = '892deee6-21ff-fc5a-d2e9-29af9b06cf4d'; 
const fs = require("fs");
const express = require('express');
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const crypto = require('crypto');
const sqlite3 = require('sqlite3');
const app = express();
const utils = require('./util.js');
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(cookieParser());

const db = new sqlite3.Database('db/ihome.db', (err) => {
    if(err) {
        return console.log(err.message);
    }else{
        console.log('ihome database is connected');
    }
});

app.use(function(_req, res, next) {
    res.setHeader("Content-Security-Policy", "default-src 'none'; object-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self'; font-src 'self'; connect-src 'self';");
    res.setHeader("X-Frame-Options", "DENY");
    return next();
});

app.set('view engine', 'ejs');

app.get('/', (_req, res) => {
    res.render('article/index');
});

app.get('/view', (req, res) => {
    if(!req.cookies['appeal_id']) {
        const new_id = req.query['add_id'] ? req.query['add_id'] : crypto.randomBytes(18).toString('hex');        
        res.cookie('appeal_id', new_id, {maxAge: new Date(Date.now() + 3600000), httpOnly: true, sameSite:'strict'});
    }
    res.redirect('/appeal');
});
app.get('/share', (_req, res) => {
    res.render('article/share');
});

app.get('/self', (_req, res) => {
    res.render('article/self');
});

app.get('/appeal/', (_req, res) => {
    res.render('article/appeal');
});

app.post('/appeal/add', (req, res) => {
    if(req.cookies['appeal_id'] && req.body['type'] && req.body['content']) {
        let appeal_id = req.cookies['appeal_id'];
        let appeal_type = utils.purify_string(req.body['type'], 'nonono');
        let appeal_content = utils.purify_string(req.body['content'], 'nonono');
        query = `insert into appeal (appeal_id, appeal_type, appeal_content) values(?,?,?)`;
        db.run(query, [appeal_id, appeal_type, appeal_content], (err) => {
            if(err){
                res.json({'msg': '异常'});
            }else{
                res.json({'msg': '诉求提交成功!我们会尽快联系相关部分回复您~'});
            }
        });
    }else{
        res.json({'msg':"诉求提交失败,看看是哪里的问题捏~"});
    }
});

app.get('/appeal/get', (req, res) => {
    if(req.cookies['appeal_id']){
        const appeal_id = req.cookies['appeal_id'];
        query = `SELECT appeal_type, appeal_content FROM appeal WHERE appeal_id = ?`;
        db.all(query, [appeal_id], (err, rows) => {
            if(!err){
                let result = {};
                for(let row of rows){
                    try{
                        result[row['appeal_type']] = JSON.parse(row['appeal_content']);
                    }catch{
                        continue;
                    }
                }
                res.json(result);
            }else{
                res.send('something went wrong');
            }
        });
    }else {
        res.json({});
    }
});

const authenticateAdmin = (req, res, next) => {
    if(req.cookies['Authentication'] == admin_token){
      next();
    }else{
      res.redirect('/admin/login');
    }
}

app.get('/admin/login', (req, res) => {
    if(req.query['pass'] === admin_pass){
        res.cookie('Authentication', admin_token, {maxAge: new Date(Date.now() + 3600000), httpOnly: true, sameSite:'strict'});
    }
    res.redirect('/');
});

app.get('/admin/check', authenticateAdmin, (req, res)=> {
    let harmonious = req.query['harmonious'] ? req.query['harmonious'] : '**';
    if(/^[A-Za-z][ -9A-Za-z]+$/.test(harmonious)) {
        res.redirect("/");
    }
    if(req.query['appeal_id']) {
        query = `SELECT appeal_content FROM appeal WHERE appeal_id = ? and appeal_type = 'appeal'`;
        db.all(query,[req.query['appeal_id']], (err, rows) => {
            if(!err){
                try{
                    let row = rows[rows.length - 1]['appeal_content'];
                    let content = utils.purify(JSON.parse(row), /or4nge/g, harmonious), comment = ''; 
                    if(JSON.stringify(content).includes("i love or4nge")) {
                        console.log("win");
                        comment = fs.readFileSync('flag.txt').toString()
                    }else{
                        comment = "已阅,下次一定";
                    }
                    content['comment'] = comment;
                    query = `UPDATE appeal SET appeal_content = ? WHERE appeal_id = ?`;
                    db.run(query, [JSON.stringify(content), req.query['appeal_id']]);
                }catch {
                }
                res.redirect("/appeal");
            }
        });
    }else{
        res.redirect('/');
    }
});

app.get('/error', (_req, res) => {
    res.render('article/error');
});


app.listen(11451, () => {
    console.log('express listening on 21451')
});
