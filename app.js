const express = require('express')
const mongoose = require('mongoose');
const fs = require('fs');
var path = require("path");
var exec = require('child_process')
const app = express()
const multer  = require('multer')
const port = 3000
// mongoose.connect('mongodb://localhost:27017/users');
mongoose.connect(
    'mongodb://localhost:27017/users',
    {useUnifiedTopology: true,useNewUrlParser: true,})
.then(() => console.log('数据库已链接'))
.catch(err => {});

const Schema = mongoose.Schema;

//建立数据模型
const userSchema = new Schema({
  user:  String,
  paw: String,
  body:   String,
});

//发布模型 并返回对象
const User = mongoose.model('User',userSchema)

app.engine('html', require('express-art-template'));

function readLocalFile(){
    return new Promise((resolve, reject) => {
        var pathName = "D:\\lsk\\node-serve\\public\\upload";
        var dirs = [];
        let data = fs.readdir(pathName, function(err, files){
            (function iterator(i){
            if(i == files.length) {
                dirs = dirs
                // console.log(dirs);
                resolve(dirs)
                return ;
            }
            fs.stat(path.join(pathName, files[i]), function(err, data){     
                if(data.isFile()){               
                    dirs.push(files[i]);
                }
                iterator(i+1);
            });   
            })(0);
        });
    });
    
}


//文件上传
const createFolder = function(folder){
    try{
        fs.accessSync(folder); 
    }catch(e){
        fs.mkdirSync(folder);
    }  
};
const uploadFolder = 'public/upload';
createFolder(uploadFolder);
// 通过 filename 属性定制
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadFolder);    // 保存的路径，备注：需要自己创建
    },
    filename: function (req, file, cb) {
        // 将保存文件名设置为 字段名 + 时间戳，比如 logo-1478521468943
        // cb(null, file.fieldname + '-' + Date.now());  
        cb(null, file.originalname);
    },
});
// 通过 storage 选项来对 上传行为 进行定制化
const upload = multer({ storage: storage })
// 单图上传
app.post('/upload', upload.single('singleFile'), function(req, res, next){
    res.render('js.html',{

    })
});

app.get('/form', function(req, res, next){
    let form = fs.readFileSync('./views/form.html', {encoding: 'utf8'});
    res.send(form);
});


app.get('/', (req, res) =>{
    User.find(function(err,ret){
        readLocalFile().then((imgList)=>{
            if(err){
                console.log('查询失败',err)
                res.render('index.html', {
                    title:'通讯录',
                    userList:[],
                    imgList: imgList
                });
            }else{
                res.render('index.html', {
                    title:'通讯录',
                    userList:ret,
                    imgList: imgList
                });
            }
        })
        
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
                resp.send({code: 0,data: ret,message: "登录成功",success: true})
            }else{
                console.log('查询失败')
                resp.send({code: 1,data: ret,message: "登录失败",success: false})
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
                resp.send({code: 0,message: "删除失败",success: false})
            }
            else {
                console.log("删除成功，res是",res)
                resp.send({code: 0,message: "删除成功",success: true})
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
            resp.send({code: 0,message: "修改失败",success: false})
        }
        else {
            console.log("修改成功，res是",res)
            resp.send({code: 0,message: "修改成功",success: true})
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
                    resp.send({code: 200,message: "用户已存在",success: false})
                }else{
                    param.save(function(err,res){
                        if(err){
                            console.log('保存失败')
                            resp.send({code: 1,data: res,message: "保存失败",success: false})
                        }else{
                            console.log('保存成功')
                            resp.send({code: 0,data: res,message: "保存成功",success: true})
                        }
                    })
                }
            }
        })
    }else{
        resp.send({code: 0,message: "请输入完整信息",success: false})
    }
})

app.post('/ActiveCommand1',(req,res,next)=>{
ActiveCommand()
res.end('success');
})


function ActiveCommand() {  
    const { exec } = require("child_process");
    exec('start http://localhost:3000/');  // 自动打开默认浏览器

    // return new Promise(function(resolve, reject) {
    //     var cmd = "Calc";  // nodepad：唤醒记事本 Calc：唤醒计算器  调用工具命令：obj23dtiles -i xiaobai.obj --tileset
    //     exec(cmd,{
    //         maxBuffer: 1024 * 2000
    //     }, function(err, stdout, stderr) {
    //         if (err) {
    //             console.log(err);
    //             reject(err);
    //         } else if (stderr.lenght > 0) {
    //             reject(new Error(stderr.toString()));
    //         } else {
    //             console.log(stdout);
    //             resolve();
    //         }
    //     });
    // });
};

app.get('/ActiveCommand2',(req,res,next)=>{
    fs.unlink(`./public/upload/${req.query.file}`, (err) => {
        if (err) {
            console.error(err)
            return
        }
    })
    res.end('success');
})

app.use('/static', express.static('public'))
app.listen(port, () => console.log(`Example app listening on port ${port}!`))

