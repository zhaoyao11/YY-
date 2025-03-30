import express from "express";
import cors from "cors";
import db from "../db/index.js";
import router from "./router/user.js";
import expressJWT from "express-jwt";
import WebSocket from "ws";
import http from "http";
import { userInfo } from "os";
import { da } from "element-plus/es/locales.mjs";
const app = express();

//创建http服务器
const HttpServer = http.createServer(app);
//创建Websocket服务器
const wss = new WebSocket.Server({ server: HttpServer });
//存储连接的客户端
const clients = new Map();
//判断用户是否存在于clients中
const isSaveInClients = (username)=>{
  const clientsArray = [...clients.values()];
  if(clientsArray.includes(`username:${username}`)){
    return true
  }
  return false
}

//客户端连接
wss.on("connection", (ws) => {
  var userInfo = {};
  //监听websocket连接
  ws.on("message", (message) => {
    const data = JSON.parse(message);
    //如果传入的是用户信息
    if (data.type == "userInfo") {
      //判断该用户是否已经在clients中
      if(isSaveInClients(data.data.username)){
        return
      }
      // console.log("进来了");
      //如果客户端发送来的是用户信息
      userInfo = data.data;
      clients.set(ws, userInfo);
      // console.log(clients.values(), "clients");
      //将map转为array
      const clientsArray = [...clients.values()];
      //广播消息给所有客户端
      for (const [clientWs, clientUserInfo] of clients) {
        //给其他用户广播有新用户登录
        if (clientWs.readyState === WebSocket.OPEN) {
          // console.log("进来了广播");
          clientWs.send(
            JSON.stringify({
              type: "1",
              user: {
                username: userInfo.username,
                isOnline: true,
              },
              message: `${userInfo.username}进入聊天室`,
              users: clientsArray,
            })
          );
        }
      }
    }
    //如果传入的是聊天信息
    if(data.type === "message"){
      // console.log("传入的是聊天信息"); 
      console.log(data,"聊天信息");
      for(const [clientWs,clientUserInfo] of clients){
        if(clientUserInfo.username === data.toName && clientWs.readyState === WebSocket.OPEN){
          clientWs.send(JSON.stringify({
            type:"message",
            message:data.message
          }))
        }
      }
    }
    //  console.log("收到消息", data);
  });
  //监听客户端断开连接
  ws.on("close", () => {
    // console.log(username +"退出聊天室");
    //退出聊天室广播
    for (const [clientWs,clientUserInfo] of clients) {
      if (clientWs.readyState === WebSocket.OPEN) {
        clientWs.send(
          JSON.stringify({
            type: "0",
            user: {
              username: userInfo.username,
              isOnline: true,
            },
            message: `${userInfo.username}退出聊天室`,
          })
        );
      }
    }
    clients.delete(ws);
  });
});

//启动服务器
const PORT = 3000;
HttpServer.listen(PORT, () => {
  console.log(`服务器运行在 http://localhost:${PORT}`);
});

//将CORS注册为全局中间件
app.use(cors());

//配置解析token的中间件
app.use(expressJWT({ secret: "yaoyao No1" }).unless({ path: [/^\/api\//] }));

//配置解析表单数据的中间件
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
//导入并注册路由
app.use(router);

//验证token的有效性的中间件
app.use((req, res, next) => {
  const authHeader = req.headers["Authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  console.log("token:" + token);

  if (!token) {
    //如果token不存在
    return res.status(1).json({ error: "No Token Provided" });
  }

  //验证token有效性
  jwt.verify(token, (err, user) => {
    if (err) {
      return res.status(1).json({ error: "Invalid Token" });
    }
    //将用户信息附加到请求对象
    req.user = user;
    next();
  });
});

//配置错误中间件
app.use((err, req, res, next) => {
  if (err.name === "UnauthorizedError") {
    return res.send({
      status: 1,
      message: "身份认证失败",
    });
  }
});

// 测试连接
db.query("select 1", (err, result) => {
  if (err) {
    return console.log(err);
  }
  console.log(result);
});

const IP = "0.0.0.0"
//监听
app.listen(8080, () => {
  console.log(`server running at http://${IP}:8080`);
});
