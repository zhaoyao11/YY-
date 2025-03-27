import express from "express";
import cors from "cors";
import db from "../db/index.js";
import router from "./router/user.js";
import expressJWT from "express-jwt";
import WebSocket from "ws";
import http from "http";
const app = express();

//创建http服务器
const HttpServer = http.createServer(app);
//创建Websocket服务器
const wss = new WebSocket.Server({ server: HttpServer });
//存储连接的客户端
const clients = new Set();

//客户端连接
wss.on("connection", (ws) => {
  console.log("客户端连接成功");
  clients.add(ws);

  //监听websocket连接
  ws.on("message", (message) => {
    console.log("收到消息", message);
    //广播消息给所有客户端
    for (const client of clients) {
      if (client.readyState === WebSocket.OPEN) {
        // console.log("进入广播");
        client.send(message);
      }
    }
  });
  //监听客户端断开连接
  ws.on("close", () => {
    console.log("客户端断开连接");
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

//监听
app.listen(8080, () => {
  console.log("server running at http://127.0.0.1:8080");
});
