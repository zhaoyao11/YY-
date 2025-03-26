import express from "express";
import db from "../../db/index.js";
import jwt from "jsonwebtoken";
import bcrypt from 'bcryptjs'
//创建路由对象
const router = express.Router();

//注册用户
router.post("/api/register", (req, res) => {
  const body = req.body;
  //首先查询数据库中是否存在该用户名
  db.query(
    "select * from ev_users where username = ?",
    body.username,
    (err, result) => {
      if (err) {
        return console.log(err);
      }
      if (result.length > 0) {
        //用户存在
        res.send({
          status: 1,
          message: "该账号已经注册过了",
        });
      } else {
        //对用户的密码进行加密
        const hashPassword = bcrypt.hashSync(body.password,10)
        // console.log('hashpassword:' + hashPassword);
        
        //用户不存在，将其存放到数据库中
        db.query(
          "insert into ev_users (username,password) values (?,?)",
          [body.username, hashPassword],
          (err, result) => {
            if (err) {
              return console.log(err);
            }
            // console.log("存储成功" + result);
          }
        );
        res.send({
          status: 0,
          message: "账号注册成功",
        });
      }
    }
  );
});

//登录接口
router.post("/api/login", (req, res) => {
  //拿到了前端表单中的数据
  const data = req.body;
  //首先进行数据库查询是否有该用户
  db.query(
    "select * from ev_users where username = ?",
    data.username,
    (err, result) => {
      if (err) {
        return console.log(err);
      }
      if (result.length > 0) {
        //用户存在
        //获取数据库中加密后的密码
        const hash_password = result[0].password
        //验证密码
        const isMatch = bcrypt.compareSync(data.password,hash_password)
        //进行密码匹配
        if (isMatch) {
          //生成用户token
          const userInfo = {
            ...result[0],
            password:'',
          };
          //密钥
          const secretKey = "yaoyao No1";
          //生成token
          const token = jwt.sign(userInfo, secretKey, { expiresIn: "1h" });

          res.send({
            status: 0,
            message: "登录成功",
            token:'Bearer ' + token 
          });
        } else {
          res.send({
            status: 1,
            message: "密码错误，请重新输入",
          });
        }
      } else {
        //用户不存在
        res.send({
          status: 1,
          message: "该账号不存在，请前去注册",
        });
      }
    }
  );
});



//携带token参数的请求测试
router.get('/my/info',(req,res)=>{
    //查询数据库拿到用户头像
    const userId = req.user.id
    db.query('select * from ev_users where id = ?',userId,(err,result)=>{
        if(err){
            return console.log(err);
        }
        //创建一个新对象，排除特定的键值对
        const newresult = {...result[0]}
        delete newresult.password

        res.send({
            status:0,
            message:'用户信息获取成功',
            data:newresult
        })
    })
})



//将路由对象共享出去
export default router;
