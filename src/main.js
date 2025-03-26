import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'
import { createRouter,createWebHistory } from 'vue-router'

const app = createApp(App)

//创建路由

const router = createRouter({
    history: createWebHistory(),
    routes:[{ path: '/',name:"App" ,component:()=> App },
        { path: '/home',name:"Home", component:()=> import('./components/index.vue')},
        {path:'/login',name:'Login',component:()=>import('./components/login.vue')}
    ],
  })

//设置路由守卫
router.beforeEach(async (to,from,next)=>{
  console.log('前置路由守卫触发');
  const token = await localStorage.getItem('token')
  if(!token){
    //如果token不存在
    if(to.path !== '/login'){
      //如果目标页面不是登录页
      next('/login')
    }else{
      next()
    }
  }else{
    //如果token存在
    next()
  }
})


app.use(router)
app.use(ElementPlus)
app.mount('#app')

export default router
