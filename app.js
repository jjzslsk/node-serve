const express = require('express')
const mongoose = require('mongoose');
const fs = require('fs');
const app = express()
const multer  = require('multer')
const port = 3000
mongoose.connect('mongodb://localhost:27017/users');
var Schema = mongoose.Schema;

//建立数据模型
var userSchema = new Schema({
  user:  String,
  paw: String,
  body:   String,
});

//发布模型 并返回对象
var User = mongoose.model('User',userSchema)

// view engine setup
app.engine('html', require('express-art-template'));
// app.set('view', {
//     debug: process.env.NODE_ENV !== 'production'
// });
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'art');

//文件上传
var createFolder = function(folder){
    try{
        fs.accessSync(folder); 
    }catch(e){
        fs.mkdirSync(folder);
    }  
};
var uploadFolder = 'upload';
createFolder(uploadFolder);
// 通过 filename 属性定制
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadFolder);    // 保存的路径，备注：需要自己创建
    },
    filename: function (req, file, cb) {
        console.log("🚀 ~ file", file)
        // 将保存文件名设置为 字段名 + 时间戳，比如 logo-1478521468943
        // cb(null, file.fieldname + '-' + Date.now());  
        cb(null, file.originalname);
    }
});
// 通过 storage 选项来对 上传行为 进行定制化
var upload = multer({ storage: storage })
// 单图上传
app.post('/upload', upload.single('logo'), function(req, res, next){
    var file = req.file;
    res.send({ret_code: '0'});
});

app.get('/form', function(req, res, next){
    var form = fs.readFileSync('./views/form.html', {encoding: 'utf8'});
    res.send(form);
});








app.get('/', (req, res) =>{
    User.find(function(err,ret){
        if(err){
            console.log('查询失败',err)
        }else{
            res.render('index.html', {
                title:'通讯录',
                userList:ret
            });
        }
    })
    
})
app.get('/index.html', (req, reo) =>{
    User.find(function(err,ret){
        if(err){
            console.log('查询失败',err)
        }else{
            reo.render('index.html', {
                title:'通讯录',
                userList:ret
            });
        }
    })
})
app.get('/userLogin', (req, resp) =>{
    const param = new User({
        user:req.query.username,
        paw:req.query.password,
    })
    User.find({user:req.query.username,paw:req.query.password},function(err,ret){
        if(err){
            console.log('查询失败',err)
        }else{
            if(ret.length > 0){
                console.log('查询成功',ret)
                    const param = {
                    code: 0,
                    data: ret,
                    message: "登录成功",
                    success: true
                }
                resp.send(param)
            }else{
            console.log('查询失败')
                const param = {
                    code: 1,
                    data: ret,
                    message: "登录失败",
                    success: false
                }
                resp.send(param)
            }
        }
    })
})
app.get('/delUser',(req,resp)=>{
    User.remove({
            _id: req.query.id
        },(err,res)=>{
            if(err){
                console.log("删除失败",res);
                const param = {
                    code: 0,
                    message: "删除失败",
                    success: false
                }
                resp.send(param)
            }
            else {
                console.log("删除成功，res是",res)
                const param = {
                    code: 0,
                    message: "删除成功",
                    success: true
                }
                resp.send(param)
            };
        }
    )
})
app.get('/editUser',(req,resp)=>{
    User.findByIdAndUpdate(req.query.id,{
        user:'lsk'
    },(err,res)=>{
        if(err){
            console.log("修改失败",res);
            const param = {
                code: 0,
                message: "修改失败",
                success: false
            }
            resp.send(param)
        }
        else {
            console.log("修改成功，res是",res)
            const param = {
                code: 0,
                message: "修改成功",
                success: true
            }
            resp.send(param)
        };
    })
})
app.get('/addUser', (req, resp) =>{
    if(req.query.username && req.query.password){
        const param = new User({
            user:req.query.username,
            paw:req.query.password,
        })
        User.find({user:req.query.username},function(err,ret){
            if(err){
                console.log('查询失败',err)
            }else{
                if(ret.length > 0){
                    console.log('查询成功',ret)
                    const param = {
                        code: 200,
                        message: "用户已存在",
                        success: false
                    }
                    resp.send(param)
                }else{
                    param.save(function(err,res){
                        if(err){
                            console.log('保存失败')
                            const param = {
                                code: 1,
                                data: res,
                                message: "保存失败",
                                success: false
                            }
                            resp.send(param)
                        }else{
                            console.log('保存成功')
                            const param = {
                                code: 0,
                                data: res,
                                message: "保存成功",
                                success: true
                            }
                            resp.send(param)
                        }
                    })
                }
            }
        })

    }else{
        resp.send({
            code: 0,
            message: "请输入完整信息",
            success: false
        })
    }
    
})
app.get('/login.html', (req, res) =>{
    res.render('login.html', {
        loginFrom: {
            name:'登录',
            head: '欢迎',
            tags: ['art', 'template', 'nodejs']
        }
    });
})
app.get('/add.html', (req, res) =>{
    res.render('add.html');
})


app.use('/static', express.static('public'))
app.listen(port, () => console.log(`Example app listening on port ${port}!`))