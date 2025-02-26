<template>
  <div class="input-container">
    <div class="button-group">
      <el-button type="primary" size="small" @click="send" :disabled="input.trim() === ''">
        发送
        <!-- <el-icon><Search /></el-icon> -->
      </el-button>
      <el-tooltip content="仅支持上传文件与图片" placement="top">
        <el-button type="primary" size="small" @click="triggerUpload">
          上传
          <el-icon class="el-icon--right"><Upload /></el-icon>
        </el-button>
      </el-tooltip>
      <!-- 隐藏的文件输入框 -->
      <input type="file" ref="fileInput" style="display: none" @change="handleFileChange"
        accept=".jpg,.jpeg,.png,.pdf,.doc,.docx"/>
    </div>
    <el-input v-model="input" class="custom-textarea" type="textarea" :rows="5" maxlength="5000" show-word-limit placeholder="请输入..." 
      @keydown="handleKeydown"/>     
  </div>
</template>

<script>
import {ref} from 'vue';
export default {
  name: 'InputBox',
  setup(props, {emit}){
    const input = ref('');
    const fileInput = ref(null);

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
    const triggerUpload = () => {
      fileInput.value.click();
    };
    // 处理文件选择
    const handleFileChange = (event) => {
      const file = event.target.files[0]; // 获取选中的文件
      if (file) {
        // 检查文件类型
        const allowedTypes = [
          'image/jpeg',
          'image/png',
          'image/gif',
          'application/pdf',
          'application/msword',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        ];
        if (allowedTypes.includes(file.type)) {
          // 触发上传事件
          emit('upload', {
            file,
            content_type: file.type,
            role: 'user', // 文件角色
          });
        } else {
          alert('不支持的文件类型，请上传图片或文档！');
        }
      }
      // 清空文件输入框的值，以便再次选择同一文件
      event.target.value = '';
    };

    return{
      input,
      fileInput,
      handleKeydown,
      send,
      triggerUpload,
      handleFileChange
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