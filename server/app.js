import express from 'express'
import cors from 'cors'
import db from '../db/index.js'
import router from './router/user.js'
import expressJWT from 'express-jwt'
const app = express()

//将CORS注册为全局中间件
app.use(cors())

//配置解析token的中间件
app.use(expressJWT({secret:"yaoyao No1"}).unless({path:[/^\/api\//]}))

//配置解析表单数据的中间件
app.use(express.urlencoded({ extended: false }))
app.use(express.json());
//导入并注册路由
app.use(router)

//验证token的有效性的中间件
app.use((req,res,next)=>{
    const authHeader = req.headers['Authorization']
    const token = authHeader && authHeader.split(' ')[1]
    console.log('token:' + token);

    if(!token){
        //如果token不存在
        return res.status(1).json({error:'No Token Provided'})
    }

    //验证token有效性
    jwt.verify(token,(err,user)=>{
        if(err){
            return res.status(1).json({error:'Invalid Token'})
        }
        //将用户信息附加到请求对象
        req.user = user
        next()
    })
})

//配置错误中间件
app.use((err,req,res,next)=>{
    if(err.name === 'UnauthorizedError'){
        return res.send({
            status:1,
            message:'身份认证失败'
        })
    }
})


// 测试连接
db.query('select 1',(err,result)=>{
    if(err){
        return console.log(err);
    }
    console.log(result);
})



//监听
app.listen(8080,()=>{
    console.log('server running at http://127.0.0.1:8080');
})