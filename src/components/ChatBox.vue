<template>
  <div class="chat-box-container">
    <div class="message-list">
      <Message v-for="(msg, index) in messages" :key="index" :message="msg" />
    </div>   
    <InputBox class="input-box" @send="handleSend"/>
    <!-- <div class = "chat-box"></div> -->
  </div>
</template>
<script>
import Message from './Message.vue';
import InputBox from './InputBox.vue';
//import axios from 'axios';
import { CozeAPI, COZE_COM_BASE_URL, ChatStatus, RoleType } from '@coze/api';

// 初始化客户端，使用个人访问令牌
const client = new CozeAPI({
  token: 'pat_Qa4oY8TFgwHLiNuM8foptxbLkez12qHgK33j90f861fc5MITbgHm5sjDvgQVRzPB', 
  baseURL: COZE_COM_BASE_URL,// 设置为 COZE_COM_BASE_URL 表示使用 Coze.com 的 API 服务器
  allowPersonalAccessTokenInBrowser: true,
});

export default {
    name: 'ChatBox',
    components: {
        Message,
        InputBox
    },
    data() {
        return {
            messages: []
        }
    },
    methods: {
    async handleSend(content) {
      try {
    // 将用户的消息添加到消息列表中
    this.messages.push({
      role: 'user',
      content: content.input,
      content_type: content.content_type || 'text' // 默认类型为文本
    });

    // 发送消息并处理响应
    const response = await client.chat.createAndPoll({
      bot_id: '7446725230778744850', // 你的 Bot ID
      additional_messages: [{
        role: RoleType.User,
        content: content.input,
        content_type: content.content_type || 'text'
      }],
    });

    // 检查聊天状态并处理消息
    if (response.chat.status === ChatStatus.COMPLETED) {
      response.messages.forEach(item => {
        console.log(`[${item.role}]:[${item.type}]:${item.content}`);
      });
      console.log('usage', response.chat.usage);

      // 将助手的消息添加到消息列表中
      this.messages.push({
        role: 'assistant',
        content: response.messages[0].content,
        content_type: 'text' // 假设助手返回的是文本
      });
    }
  } catch (error) {
    console.error('Error sending message:', error);
    // 可以在这里添加错误提示逻辑，例如显示一个错误消息
  }
      //       // 将用户的消息添加到消息列表中
      //       this.messages.push({role: 'user', content: content.input});
      //       //console.log(this.messages);
      //       //this.input = '';
      //       // 发送消息并处理响应
      //       const response = await client.chat.createAndPoll({
      //       bot_id: '7446725230778744850',
      //       additional_messages: [{
      //         role: RoleType.User,
      //         content: content,
      //         content_type: 'text',
      //       }],
      //     });

      // // 检查聊天状态并处理消息
      //     if (response.chat.status === ChatStatus.COMPLETED) {
      //       response.messages.forEach(item => {
      //         console.log(`[${item.role}]:[${item.type}]:${item.content}`);
      //       });
      //       console.log('usage', response.chat.usage);
      //       // 将助手的消息添加到消息列表中
      //       this.messages.push({ role: 'assistant', content: response.messages[0].content });
      //     }
      }
    }
}
</script>
<style>
.chat-box-container {
    display: flex; /* 弹性布局 */
    flex-direction: column; /* 将子元素的排列方向设置为纵向排列。 */
    justify-content: flex-end;
    height: 100%;
    /* overflow-y: auto; 允许滚动 */
}
.message-list {
  flex: 1; /* 占据剩余空间 */
  overflow-y: auto; /* 允许内容滚动 */
  padding: 10px; /* 内边距 */
}
.input-box{
  height: 20%;
}
</style>