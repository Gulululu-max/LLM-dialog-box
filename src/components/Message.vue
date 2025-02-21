<template>
    <div class="single-message" :class="message.role">
      <!-- <div v-if="message && message.content_type === 'text'">{{ message.content }}</div>
      <img v-if="message && message.content_type === 'image'" :src="message.content" alt="Image content">
      <a v-if="message && message.content_type === 'link'" :href="message.content">{{ message.content }}</a>
      <a v-if="message && message.content_type === 'pdf'" :href="message.content" target="_blank">{{ message.content }}</a> -->
      <div v-if="message">
        <p>Role: {{ message.role }}</p>
        <p>Content Type: {{ message.content_type }}</p>
        <p>Content: {{ message.content }}</p>
      </div>
      <div v-else class="placeholder">暂无消息</div>
    </div>
</template>

<script>
export default {
    name: 'Message',
    props: {
        message: {
            type: Object,
            required: true
        }
    }
}
</script>

<style scoped>
.single-message {
  margin: 10px 0;
  padding: 10px 15px; /* 上下 10px，左右 15px */
  border-radius: 12px;
  height:auto;
  min-height: 40px;
  max-width: 80%;
  min-width: 200px;
  background-color: aquamarine;
  font-size: 16px;
  line-height: 1.5;
  word-wrap: break-word;
  white-space: pre-wrap; /* 保留空白符，但允许换行 */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
.user {
  margin-left: auto;
  background-color: #e0f7fa; /* 用户消息背景色 */
}
.assistant {
  margin-right: auto;
  /* text-align: left; */
  background-color: #f5f5f5; /* 助手消息背景色 */
}
.placeholder {
  color: gray;
  text-align: center;
  line-height: 50px; /* 与最小高度匹配 */
}
</style>