<script setup>
import Login from './components/login.vue'
import index from './components/index.vue'
import router from './main'
const onClick = ()=>{
  console.log(router);
  
}
</script>

<template>
  
<router-view>
  
</router-view>
  
</template>

<style scoped>

</style>
