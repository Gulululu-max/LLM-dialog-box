<template>
    <div class = "contanier">
        <ChatBox></ChatBox>
        <!-- <div class = "chat-frame">
            <img alt="Vue logo" src="../assets/logo.png">
        </div>
        <div class = "input-frame">
            
        </div> -->
    </div>
    
</template>
  
<script>
import ChatBox from '../components/ChatBox.vue';
  
export default {
    name: 'Home',
    components: {
      ChatBox
    }
}
</script>
  
<style scoped>
.contanier{
    /* display: flex;
    flex-direction: column; */
    height: 100vh;
}
/* .chat-frame{
    height: 85vh;
}
.input-frame{
    height: 15VH;

} */

</style>
  