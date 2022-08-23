安装mongoDB教程
启动服务配置如：D:\Program Files\MongoDB\Server\5.0\bin mongod --dbpath "D:\lsk\mongodb\data\db" --logpath "D:\lsk\mongodb\data\log" -install -serviceName "MongoDB"

启动 win MongoDB服务
net start MongoDB
关闭
net stop MongoDB
移除
C:\mongodb\bin\mongod.exe --remove

启动mongdb 查看是否启动成 功
http://127.0.0.1:27017/

装依赖
npm install

全局安装nodemon 热更新
npm install --g nodemon

启动app.js
npm run serve
http://127.0.0.1:3000/

热更新
nodemon app.js

先链接-再mongo-



打开mongo
cd D:\lsk\mongodb\bin
λ mongo

链接远程服务器
cd D:\lsk\mongodb\bin 
λ mongo 171.104.147.24:27018
成功后 可以查表了  show dbs

连接本地数据库
cd D:\lsk\mongodb\bin 
λ mongod --dbpath=..\data\db

显示数据库列表,所有集合
show dbs

创建集合 表  并切换到该集合下
use users

显示当前链接数据库中的集合（类似关系数据库中的表）
show collections

查询集合为users数据
db.users.find()

添加
db.users.save({user:'mss'})

删除
db.users.remove({user:'lsk12'})

修改数据
db.users.update({"name":"小明"}, {$set:{"age":16}});   
//将name等于小明的语句修改为age等于16
完整替换：
不写后面set关键字

js 查询集合为User，所有文档 记录
 User.find(function(err,ret){
    if(err){
        console.log('查询失败',err)
    }else{
        console.log(ret)
    }
})

查看端口
lsof -i:3000