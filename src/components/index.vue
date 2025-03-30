<script setup>
import axios from "axios";
import { ElMessage } from "element-plus";
import { ref } from "vue";
//当前用户信息
const CurrentUserName = ref({
  isOnline: false,
  username: "",
  avator: "",
});

//文本输入区域
const textarea = ref("");
//当前用户
const isActive = ref(0);

//定义一个数据
const UserData = ref([{}]);

//定义消息数组
// const messages_other = ref([]);
// const messages_my = ref([]);
const id = ref(1)
const Allmessages = ref([])

//创建websocket连接
const socket = new WebSocket("http://localhost:3000");

//监听websocket链接
socket.onopen = async () => {
  //获取用户信息
  const token = localStorage.getItem("token");
  const res = await axios.get("http://0.0.0.0:8080/my/info", {
    headers: {
      Authorization: token,
    },
  });
  // console.log(res,"userinfo");
  CurrentUserName.value.username = res.data.data.username;
  CurrentUserName.value.isOnline = true;
  CurrentUserName.value.avator = res.data.data.user_pic;
  // console.log("连接到服务器");
  socket.send(
    JSON.stringify({ type: "userInfo", data: CurrentUserName.value })
  );
};
//监听服务器消息
socket.onmessage = (event) => {
  // const message = event.data;
  const message = JSON.parse(event.data);
  console.log(message, "message");

  // CurrentUserName.value = message.user
  if (message.type === "message") {
    // console.log(message,"jijiy");

    Allmessages.value.push({
      type:"other",
      id:id.value,
      message:message.message
    });
    id.value++;
    // console.log(message_other.value, "value");
  }

  if (message.type === "1") {
    UserData.value = message.users.filter((item) => {
      return item.username !== CurrentUserName.value.username;
    });
    //表示进入聊天室
    ElMessage({
      message: message.message,
      type: "success",
    });
    //将该用户加入
  }
  if (message.type === 0) {
    //表示退出聊天室
    ElMessage(message.message);
  }
};
//监听websocket错误
socket.onerror = (err) => {
  console.log("Websocket错误:", err);
};

//点击发送的回调函数
const onSubmit = () => {
  //获取当前用户用户名
  console.log(UserData.value[isActive.value].username);
  const toname = UserData.value[isActive.value].username;
  //将消息发送给服务端再由服务端推送给指定用户
  const json = {
    type: "message",
    toName: toname,
    message: textarea.value,
  };
  Allmessages.value.push({
    type:"my",
    id:id.value,
    message:textarea.value
  })
  id.value++
  socket.send(JSON.stringify(json));
  textarea.value = "";
};

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
            v-for="(item, index) in Allmessages"
            :class="item.type === 'other' ? 'message_other ' : 'message_my'"
            :key="item.id"
          >
          <div v-if="item.type === 'other'" class="main_message">
            <el-avatar
              :class="item.type === 'other' ? 'other_avatar ' : 'my_avatar'"
              shape="square"
              size="10px"
              :src="item.type === 'other' ? UserData[isActive].avator : CurrentUserName.avator"
            />
            <span :class="item.type === 'other' ? 'other_span ' : 'my_span'">{{ item.message }}</span>
          </div>
          <div v-else class="main_message">
            <span :class="item.type === 'other' ? 'other_span ' : 'my_span'">{{ item.message }}</span>
            <el-avatar
              :class="item.type === 'other' ? 'other_avatar ' : 'my_avatar'"
              shape="square"
              size="10px"
              :src="item.type === 'other' ? UserData[isActive].avator : CurrentUserName.avator"
            />
          </div>
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
.main_message{
  display: flex;
  flex-direction: row
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
.my_span{
  padding: 5px;
  background-color: greenyellow;
  line-height: 30px;
}
.my_avatar{
  margin-right: 10px; 
  margin-left: 10px
}
.other_span{
  padding: 5px;
  background-color: white; 
  line-height: 30px
}
.other_avatar{
  margin-left: 10px; 
  margin-right: 10px
}
</style>
