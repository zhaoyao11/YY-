<script setup>
import { ref } from "vue";
import router from '../main.js'
import axios from 'axios'
const username = ref("");
const password = ref("");



//定义正则表达式
const reg_username = /^[a-zA-Z0-9]+$/;
const reg_password = /^[a-zA-Z0-9_]{2,16}$/;

//用户名变化回调函数
const onUsernameChange = (event) => {
  // console.log(event);
  if (!reg_username.test(event)) {
    ElMessage({
      message: "用户名格式不对，只能是字母和数字",
      type: "warning",
      plain: true,
    });
  }
};

//密码变化回调函数
const onPasswordChange = (event) => {
  if (!reg_password.test(event)) {
    ElMessage({
      message: "密码格式不对，只能包含字母、数字、下划线",
      type: "warning",
      plain: true,
    });
  }
};

//点击登录按钮的回调函数
const onLogin = async ()=>{
  // console.log('点击上了登录按钮');
//   console.log('此时的账号为：'+ username.value+' 密码为：'+password.value);
  const data = {
    username:username.value,
    password:password.value
  }
  const res = await axios({
    method:'post',
    url:'http://127.0.0.1:8080/api/login',
    data:{
      username:username.value,
      password:password.value
    }
  })
  //用户不存在
  if(res.data.status){
    ElMessage({
      message: res.data.message,
      type: "error",
      plain: true,
    });
  }else{
    //用户存在
     ElMessage({
      message:res.data.message,
      type:"success",
      plain:true
    })
    //拿到token信息
    console.log(res);
    const my_token = res.data.token
    //将token存放到localstorage中
    localStorage.setItem('token',my_token)
    //跳转路由
     router.push('/home')
  }
}

//点击注册按钮的回调函数
const onRegister =async()=>{
    //获取此时的账号和密码
    const data = {
    username:username.value,
    password:password.value
  }
//   console.log(data,'data');
  //发起注册请求
  const res = await axios({
    method:'post',
    url:'http://127.0.0.1:8080/api/register',
    data:{
        username:data.username,
        password:data.password
    }
  })
  console.log(res);
  if(res.data.status){
    //该账号已经被注册
    ElMessage({
      message:res.data.message,
      type:"error",
      plain:true
    })
  }else{
    //账号注册成功
    ElMessage({
      message:res.data.message,
      type:"success",
      plain:true
    })
  }

  
  
  
}

</script>

<template>
 
    <div class="container">
    <!-- 背景照片 -->
    <div class="img_container">
      <div>
        <el-image
          style="height: 300px"
          src="../public/login_picture.jpg"
          fit="contain"
        />
      </div>

      <!-- 账号和密码 -->
      <div class="username_box">
        <div>
          <label for="username">账号</label>
          <el-input
            @change="onUsernameChange"
            id="username"
            label="用户名"
            v-model="username"
            style="width: 240px; margin-left: 10px"
            placeholder="请输入用户名"
            input-type="planarity"
          />
        </div>
        <div style="margin-top: 12px">
          <label for="password">密码</label>
          <el-input
            @change="onPasswordChange"
            id="password"
            label="密码"
            v-model="password"
            type="password"
            style="width: 240px; margin-left: 10px"
            placeholder="请输入密码"
            :show-password="true"
            input-type="planarity"
          />
        </div>
        <!-- 登录和注册按钮 -->
        <div class="loginbut">
          <el-button @click="onLogin" :round=true type="primary">登录</el-button>
          <el-button @click="onRegister" style="margin-left: 150px;" :round=true type="primary">注册</el-button>
        </div>
      </div>
    </div>
  </div>

  
</template>

<style scoped>
.container {
  width: 100%;
  height: 800px;
  display: flex;
  /* align-items: center; */
  justify-content: center;
  padding-top: 100px;
}

.img_container {
  /* justify-content: center; */
  height: 500px;
  background-color: rgb(240, 240, 235);
}

.username_box {
  width: 100%;
  height: 100%;
  padding-left: 55px;
}

.loginbut{
  margin-top: 35px;

}

</style>
