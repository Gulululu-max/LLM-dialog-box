<template>
    <div class="input-container">
       <el-input v-model="input" class="custom-textarea" type="textarea" :rows="5" maxlength="5000" show-word-limit placeholder="请输入..." 
       @keyup.enter="send" />
       <div class="button-group">
          <el-button type="primary" size="small" @click="send" :disabled="input.trim() === ''">
            <el-icon><Search /></el-icon>发送
          </el-button>
          <el-upload>上传</el-upload>
       </div>
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
    // const isSendDisabled = computed(() => {
    //   return input.value.trim() === '';//trim方法去除字符串两端的空白字符后检查是否为空
    // })
    const send = () => {
      emit('send', {input: input.value, content_type: 'text'});
      input.value = '';
    };

    return{
      input,
      send
    };

  }
}
</script>

<style scoped>
.input-container {
  display: flex;
  width: 100%;
}
.custom-textarea {
  width: 800px;
  flex-direction: row;
  justify-content: center;
}
.button-group{
  position: absolute;
  display: flex;
  right: 10px;
  bottom: 10px;
  gap: 8px; /* 按钮之间的距离 */
}
</style>