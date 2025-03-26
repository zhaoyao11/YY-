<script setup>
import { ref } from 'vue';

//定义一个数据
const UserData = ref({
  username:"miraculous",
  avator:"https://img2.baidu.com/it/u=3739988182,1148289226&fm=253&fmt=auto&app=120&f=JPEG?w=500&h=689",
  message:"你好"
})
</script>


<template>
  <div class="common-layout">
    <el-container>
      <el-aside width="200px">Aside</el-aside>
      <el-container>
        <el-header class="header">
          {{ UserData.username }}
        </el-header>
        <el-main class="main">
          <div class="message">
            <el-avatar style="margin-left: 10px; margin-right: 10px;" shape="square" size="10px" :src="UserData.avator" />
            {{UserData.message }}
          </div>
          
        </el-main>
        <el-footer class="footer">
          <div>
            "这里是我打的字"
          </div>
          <el-button type="primary">发送</el-button>
        </el-footer>
      </el-container>
    </el-container>
  </div>
</template>


<style scoped>
.common-layout{
  width: 700px;
  height: 700px;
  background-color:aquamarine;
  margin: 56px auto;
  display: flex;
}
.header{
  flex: 0.15;
  background-color: bisque;
  text-align: center;
  align-content: center;
}
.main{
  background-color: greenyellow;
  flex: 0.75;
}
.footer {
  display: flex; 
  justify-content: space-between; /* 子元素水平分布 */
  align-items: flex-end; /* 子元素垂直对齐到容器的底部 */
  padding: 10px; /* 添加一些内边距 */
}

.footer div {
  flex: 1; /* 让文本内容占据剩余空间 */
}

.footer .el-button {
  margin-left: 10px; /* 添加一些左边距，使按钮与文本内容分开 */
}
.message{
  background-color:yellow;
  width: 200px;
  display: flex;
  justify-content:start;
  align-items:center;
  height: auto;
}

</style>