<script setup>
import { isIOS } from "element-plus/es/utils/browser.mjs";
import { ref } from "vue";
//文本输入区域
const textarea = ref("");
//当前用户
const isActive = ref(0);

//定义一个数据
const UserData = ref([
  {
    username: "miraculous",
    avator:
      "https://img2.baidu.com/it/u=3739988182,1148289226&fm=253&fmt=auto&app=120&f=JPEG?w=500&h=689",
    message: "你好1",
  },
  {
    username: "miraculous1",
    avator:
      "https://img2.baidu.com/it/u=3739988182,1148289226&fm=253&fmt=auto&app=120&f=JPEG?w=500&h=689",
    message: "你好2",
  },
  {
    username: "miraculous2",
    avator:
      "https://img2.baidu.com/it/u=3739988182,1148289226&fm=253&fmt=auto&app=120&f=JPEG?w=500&h=689",
    message: "你好3",
  },
  {
    username: "miraculous3",
    avator:
      "https://img2.baidu.com/it/u=3739988182,1148289226&fm=253&fmt=auto&app=120&f=JPEG?w=500&h=689",
    message: "你好",
  },
  {
    username: "miraculous4",
    avator:
      "https://img2.baidu.com/it/u=3739988182,1148289226&fm=253&fmt=auto&app=120&f=JPEG?w=500&h=689",
    message: "你好",
  },
  {
    username: "miraculous5",
    avator:
      "https://img2.baidu.com/it/u=3739988182,1148289226&fm=253&fmt=auto&app=120&f=JPEG?w=500&h=689",
    message: "你好",
  },
  {
    username: "miraculous6",
    avator:
      "https://img2.baidu.com/it/u=3739988182,1148289226&fm=253&fmt=auto&app=120&f=JPEG?w=500&h=689",
    message: "你好",
  },
  {
    username: "miraculous7",
    avator:
      "https://img2.baidu.com/it/u=3739988182,1148289226&fm=253&fmt=auto&app=120&f=JPEG?w=500&h=689",
    message: "你好",
  },
  {
    username: "miraculous8",
    avator:
      "https://img2.baidu.com/it/u=3739988182,1148289226&fm=253&fmt=auto&app=120&f=JPEG?w=500&h=689",
    message: "你好",
  },
  {
    username: "miraculous9",
    avator:
      "https://img2.baidu.com/it/u=3739988182,1148289226&fm=253&fmt=auto&app=120&f=JPEG?w=500&h=689",
    message: "你好",
  },
  {
    username: "miraculous10",
    avator:
      "https://img2.baidu.com/it/u=3739988182,1148289226&fm=253&fmt=auto&app=120&f=JPEG?w=500&h=689",
    message: "你好",
  },
  {
    username: "miraculous11",
    avator:
      "https://img2.baidu.com/it/u=3739988182,1148289226&fm=253&fmt=auto&app=120&f=JPEG?w=500&h=689",
    message: "你好",
  },
  {
    username: "miraculous12",
    avator:
      "https://img2.baidu.com/it/u=3739988182,1148289226&fm=253&fmt=auto&app=120&f=JPEG?w=500&h=689",
    message: "你好",
  },
]);

//定义消息数组
const messages_other = ref([
  {
    id: 1,
    message: "让我们红尘作伴",
  },
  {
    id: 2,
    message: "活得潇潇洒洒",
  },
  {
    id: 3,
    message: "策马奔腾",
  },
]);
const messages_my = ref([]);

//创建websocket连接
const socket = new WebSocket("http://localhost:3000");

//监听websocket链接
socket.onopen = () => {
  console.log("连接到服务器");
};
const messagesDiv = document.getElementById("main");
const messageInput = document.getElementsByClassName("InputArea");

//监听服务器消息
socket.onmessage = (event) => {
  const message = event.data;
  console.log("消息为：" + message);
  messages_my.value.push({
    id: messages_my.value.length + 1,
    message: message,
  });
};
//监听websocket错误
socket.onerror = (err) => {
  console.log("Websocket错误:", err);
};

//点击发送的回调函数
const onSubmit = () => {
  // console.log("发送内容为：" + textarea.value);
  socket.send(textarea.value);
  textarea.value = "";
};

//监听输入框输入回车时发送消息

//切换用户回调函数
const onChangeUserItem = (index) => {
  isActive.value = index;
};
</script>

<template>
  <div class="common-layout">
    <el-container>
      <el-aside class="aside" width="200px">
        <el-scrollbar :always="false">
          <!-- 侧边栏用户栏 -->
          <div
            v-for="(item, index) in UserData"
            :key="item.id"
            class="userItem"
            :class="isActive === index ? 'ItemActive' : 'ItemUsual'"
            @click="onChangeUserItem(index)"
          >
            <el-avatar
              style="margin-left: 10px; margin-right: 10px"
              shape="square"
              size="8px"
              :src="item.avator"
            />
            <span>{{ item.username }}</span>
          </div>
        </el-scrollbar>
      </el-aside>
      <el-container>
        <el-header class="header">
          {{ UserData[isActive].username }}
        </el-header>
        <el-main class="main">
          <div
            class="message_other"
            v-for="(item, index) in messages_other"
            :key="item.id"
          >
            <el-avatar
              style="margin-left: 10px; margin-right: 10px"
              shape="square"
              size="10px"
              :src="UserData[isActive].avator"
            />
            <span
              style="padding: 5px; background-color: white; line-height: 30px"
              >{{ item.message }}</span
            >
          </div>
          <div
            class="message_my"
            v-for="(item, index) in messages_my"
            :key="item.id"
          >
            <span
              style="padding: 5px; background-color: greenyellow; line-height: 30px"
              >{{ item.message }}</span
            >
            <el-avatar
              style="margin-right: 10px; margin-left: 10px"
              shape="square"
              size="10px"
              :src="UserData[isActive].avator"
            />
          </div>
        </el-main>
        <el-footer class="footer">
          <el-input
            v-model="textarea"
            :rows="7"
            type="textarea"
            placeholder="请输入内容"
            class="InputArea"
            @keydown.enter.exact.prevent="onSubmit"
          />
          <el-button @click="onSubmit" type="primary">发送</el-button>
        </el-footer>
      </el-container>
    </el-container>
  </div>
</template>

<style scoped>
.common-layout {
  width: 700px;
  height: 700px;
  background-color: aquamarine;
  margin: 56px auto;
  display: flex;
}
.aside {
  background-color: white;
  border-left: 1px solid rgb(218, 213, 213);
  border-top: 1px solid rgb(218, 213, 213);
}
.header {
  flex: 0.15;
  background-color: rgb(246, 248, 248);
  text-align: center;
  align-content: center;
  border-bottom: 1px solid rgb(218, 213, 213);
  border-left: 1px solid rgb(218, 213, 213);
}
.main {
  background-color: rgb(246, 248, 248);
  flex: 0.75;
  border-bottom: 1px solid rgb(218, 213, 213);
  border-left: 1px solid rgb(218, 213, 213);
  display: flex;
  flex-direction: column;
}
.footer {
  display: flex;
  justify-content: space-between; /* 子元素水平分布 */
  align-items: flex-end; /* 子元素垂直对齐到容器的底部 */
  padding: 10px; /* 添加一些内边距 */
  background-color: rgb(246, 248, 248);
  border-left: 1px solid rgb(218, 213, 213);
  flex: 0.3;
}

.footer div {
  flex: 1; /* 让文本内容占据剩余空间 */
}

.footer .el-button {
  margin-left: 10px; /* 添加一些左边距，使按钮与文本内容分开 */
}
.message_other {
  background-color: rgb(246, 248, 248);
  width: 200px;
  display: flex;
  justify-content: start;
  align-items: center;
  height: auto;
  margin-bottom: 15px;
}
.message_my {
  background-color: rgb(246, 248, 248);
  width: 200px;
  display: flex;
  justify-content: end;
  align-items: center;
  margin-bottom: 15px;
  margin-left: 250px;
}
.userItem {
  height: 70px;
  background-color: white;
  display: flex;
  align-items: center;
}
.ItemActive {
  background-color: rgb(231, 233, 233);
}
</style>
