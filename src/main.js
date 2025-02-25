import { createApp } from 'vue'
import App from './App.vue'
import store from './store'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
//统一导入及注册全局el-icon组件
import * as icons from '@element-plus/icons-vue'

const app = createApp(App);
app.use(ElementPlus);
app.use(store);
Object.keys(icons).forEach(key => {
    app.component(key, icons[key])
});
app.mount('#app');// 挂载到id为app的元素上

