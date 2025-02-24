<template>
  <div class="chat-box-container">
    <div class="message-list">
      <Message v-for="(msg, index) in messages" :key="index" :message="msg"/>
    </div>   
    <InputBox class="input-box" @send="handleSend"/>
    <!-- <div class = "chat-box"></div> -->
  </div>
</template>
<script>
import {ref, onMounted} from 'vue';
import Message from './Message.vue';
import InputBox from './InputBox.vue';
//import axios from 'axios';
import {RoleType} from '@coze/api';//CozeAPI, COZE_COM_BASE_URL,
// 初始化客户端，使用个人访问令牌
// const client = new CozeAPI({
//   token: 'pat_Qa4oY8TFgwHLiNuM8foptxbLkez12qHgK33j90f861fc5MITbgHm5sjDvgQVRzPB', 
//   baseURL: COZE_COM_BASE_URL,// 设置为 COZE_COM_BASE_URL 表示使用 Coze.com 的 API 服务器
//   allowPersonalAccessTokenInBrowser: true,
// });

export default {
    name: 'ChatBox',
    components: {
        Message,
        InputBox
    },
    setup(){
      const messages = ref(JSON.parse(localStorage.getItem('messages')) || []);//data
      //console.log("messages:", messages);

      onMounted(() => {
      // 标记所有加载的消息为旧消息
        messages.value.forEach(message => {
          message.isNew = false;
        });
        //saveMessages();
      });

      //方法
      const handleSend = async(content) => {
      try {
    // 将用户的消息添加到消息列表中
    messages.value.push({
      role: 'user',
      content: content.input,
      content_type: content.content_type || 'text', // 默认类型为文本
      isNew: true,
    });
    saveMessages();
    //占位符消息支持流式内容
    let assistantMessage = {
      role: 'assistant',
      content: '',
      content_type: 'text',
      isNew: true,
    };
    messages.value.push(assistantMessage);
    saveMessages();
    // 发送消息并处理响应
    const response = await fetch('https://api.coze.com/v3/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer pat_71YqP7PwruMoK31gyqp9EboLlYD3JXkk1M8lp8lhEhaM6fn0BzhjFW2zwroBdHg6`
      },
      body: JSON.stringify({
        bot_id: '7446725230778744850', //Bot ID
        user_id: "123456",//必传
        stream: true, //开启流式传输
        additional_messages: [{
          role: RoleType.User,
          content: content.input,
          content_type: content.content_type || 'text'
        }],
      })
    });
    if (!response.ok) {//响应失败
          throw new Error(`响应失败! 状态: ${response.status}`);
        }
    //实现流式读取
    const reader = response.body.getReader();//创建一个读取器
    const decoder = new TextDecoder('utf-8');
    console.log("decoder:", decoder);

    let eventType = '';
    let eventData = '';
    let condition = true;
    while(condition){//循环不断读取流式数据
      const {done, value} = await reader.read();//done表示是否结束，value存储读取的数据
      //console.log("reader:", reader);
      if(done){
        condition = false;
        break;
      }
      const chunk = decoder.decode(value);
      //console.log("chunk:", chunk);
      const lines = chunk.split('\n');
      for(const line of lines){
        if(line.startsWith('event:')){
          eventType = line.slice(6).trim();
        }else if(line.startsWith('data:')){
          eventData = JSON.parse(line.slice(5).trim());
          console.log("enevtData:", eventData);
          if(eventType === 'conversation.message.delta'){
            //this.$set(assistantMessage, 'content', assistantMessage.content + eventData.content);
            //assistantMessage.content += eventData.content;//没有触发响应式更新！！！why
            // 尝试重新分配对象希望能触发响应性更新
            assistantMessage = { ...assistantMessage, content: assistantMessage.content + eventData.content };
            // 替换最后一个消息
            messages.value.splice(messages.value.length - 1, 1, assistantMessage);
            saveMessages();
            scrollToBottom();
          }else if(eventType === 'conversation.chat.completed' || eventType === 'done'){
            console.log('流式传输结束');
            condition = false;
            break;
          }else if(eventType === 'conversation.chat.failed'){
            assistantMessage = { ...assistantMessage, content: assistantMessage.content + eventData.last_error.msg};
            // 替换最后一个消息
            messages.value.splice(messages.value.length - 1, 1, assistantMessage);
            saveMessages();
          }
        }
      }
    } 
  } catch (error) {
    console.error('返回错误', error);
  }
      };

      const saveMessages = () => {
      localStorage.setItem('messages', JSON.stringify(messages.value));
    };

    const scrollToBottom = () => {
      const container = document.querySelector('.message-list');
      if (container) {
        container.scrollTop = container.scrollHeight;
      }
    };

    return {
      messages,
      handleSend,
      //saveMessages,
      //scrollToBottom
    };
    }
}
</script>
<style>
/* 确保 html 和 body 元素的高度为 100%，并设置 overflow: hidden 来防止滚动条的出现 */
html, body {
  height: 100%;
  margin: 0;
  overflow: hidden;
}
.chat-box-container {
    display: flex; 
    flex-direction: column; 
    justify-content: flex-end;
    height: 100%;
}
.message-list {
  flex: 1; /* 占据剩余空间 */
  overflow-y: auto; /* 允许内容滚动 */
  padding: 10px; 
}
.input-box{
  height: 20%;
}
</style>