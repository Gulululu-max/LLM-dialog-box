<template>
    <div class="input-container">
        <div class="button-group">
          <el-button type="primary" size="small" @click="send" :disabled="input.trim() === ''">
            发送
            <!-- <el-icon><Search /></el-icon> -->
          </el-button>
          <el-button type="primary" size="small">
            上传<el-icon class="el-icon--right"><Upload /></el-icon>
          </el-button>
       </div>
       <el-input v-model="input" class="custom-textarea" type="textarea" :rows="5" maxlength="5000" show-word-limit placeholder="请输入..." 
         @keydown="handleKeydown" />
       <!-- <div>
         
       </div> -->
  </div>
</template>

<script>
import {ref} from 'vue';
export default {
  name: 'InputBox',
  // data() {
  //   return {
  //     input: ''
  //   }
  // },
  // methods: {
  //   send() {
  //     this.$emit('send', { input: this.input, content_type: this.content_type });// 触发父组件的send事件，并传递input的值
  //     this.input = ''// 清空input的值
  //   }
  // }
  //尝试vue3写法
  setup(props, {emit}){
    const input = ref('');
    const handleKeydown = (event) => {
      if (event.shiftKey && event.key === 'Enter') {//Shift+enter换行
        input.value += '\n';
        event.preventDefault();
      } else if (event.key === 'Enter') {
        send();
      }
    };
    const send = () => {
      emit('send', {input: input.value, content_type: 'text'});
      input.value = '';
    };

    return{
      input,
      handleKeydown,
      send
    };

  }
}
</script>

<style scoped>
.input-container {
  display: flex;
  width: 100%;
  align-items: center;
  flex-direction: column;

}
.custom-textarea {
  width: 800px;
  margin-top: 10px;
  
}
.button-group{
  /* position: absolute; */
  /* display: flex; */
  right: 10px;
  bottom: 10px;
  gap: 1px; /* 按钮之间的距离 */
}
</style>