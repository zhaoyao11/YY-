<script setup>
import router from "../main";
import { ref } from "vue";
import axios from 'axios'
//设置默认图像
const pic_url = ref('https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png')
//点击退出登录按钮
const onBack = () => {
  //清除当前用户token
  localStorage.removeItem("token");
  console.log("token已清除");
  //跳转到登录页
  router.push("/login");
};

//点击测试按钮
const GetInfo = async ()=>{
    //获取用户token
    const token = localStorage.getItem('token')
    console.log('token:'+token);
    
    //发起请求
    const res = await axios({
        method:'get',
        url:'http://127.0.0.1:8080/my/info',
        headers:{
            Authorization: token
        }
    })
    console.log(res);
    //获取用户头像
    pic_url.value = res.data.data.user_pic
    
}


</script>

<template>
  <h1>主页</h1>
  <div>
    <el-button @click="GetInfo" type="primary">测试按钮</el-button>
    <el-button @click="onBack" type="danger">退出登录</el-button>
  </div>
  <div style="margin-top: 50px;margin-left: 20px;" class="block">
    <el-avatar :size="50" :src="pic_url" />
  </div>
</template>

<style scoped></style>
