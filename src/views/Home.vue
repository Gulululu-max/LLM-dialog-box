<template>
    <div class = "contanier">
        <SideBar class="sidebar"></SideBar>
        <ChatBox class="chat-box"></ChatBox>
    </div>
    
</template>
  
<script>
import ChatBox from '../components/ChatBox.vue';
import SideBar from '../components/SideBar.vue';
  
export default {
    name: 'Home',
    components: {
      SideBar,
      ChatBox
    }
}
</script>
  
<style scoped>
.contanier{
    display: flex;
    height: 100vh;
}
.sidebar{
    max-width: 250px;
    background-color: #f5f5f5; 
    border-right: 1px solid #ddd; /* 侧边栏右边框 */
    overflow-y: auto; 
}
.chat-box {
  flex: 1; 
  /* display: flex;
  flex-direction: column; */
}
</style>
  