<template>
  <div class="chat-box-container">
    <div class="message-list" ref="messageList">
      <Message v-for="(msg, index) in messages" :key="index" :message="msg"/>
    </div>   
    <InputBox class="input-box" @send="handleSend"/>
  </div>
</template>

<script>
import { computed, onMounted, watch } from 'vue';
import { useStore } from 'vuex';
import Message from './Message.vue';
import InputBox from './InputBox.vue';
import { RoleType } from '@coze/api';

export default {
  name: 'ChatBox',
  components: {
    Message,
    InputBox
  },
  setup() {
    const store = useStore();
    const currentSession = computed(() => store.getters.currentSession);
    const messages = computed(() => currentSession.value ? currentSession.value.messages : []); // 从 Vuex 中获取 messages

    const handleSend = async (content) => {
      try {
        // 确保有一个当前会话
        if (!store.state.currentSessionId) {
          store.dispatch('addSession');
        }
        // 将用户的消息添加到消息列表中
        store.commit('ADD_MESSAGE', {
          role: 'user',
          content: content.input,
          content_type: content.content_type || 'text', // 默认类型为文本
          isNew: true,
        });
        // saveMessages();
        // 占位符消息支持流式内容
        let assistantMessage = {
          role: 'assistant',
          content: '',
          content_type: 'text',
          isNew: true,
        };
        store.commit('ADD_MESSAGE', assistantMessage);
        // saveMessages();
        // 发送消息并处理响应
        const response = await fetch('https://api.coze.com/v3/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer pat_71YqP7PwruMoK31gyqp9EboLlYD3JXkk1M8lp8lhEhaM6fn0BzhjFW2zwroBdHg6`
          },
          body: JSON.stringify({
            bot_id: '7446725230778744850', // Bot ID
            user_id: "123456", // 必传
            stream: true, // 开启流式传输
            additional_messages: [{
              role: RoleType.User,
              content: content.input,
              content_type: content.content_type || 'text'
            }],
          })
        });
        if (!response.ok) { // 响应失败
          throw new Error(`响应失败! 状态: ${response.status}`);
        }
        // 实现流式读取
        const reader = response.body.getReader(); // 创建一个读取器
        const decoder = new TextDecoder('utf-8');
        console.log("decoder:", decoder);

        let eventType = '';
        let eventData = '';
        let condition = true;
        while (condition) { // 循环不断读取流式数据
          const { done, value } = await reader.read(); // done表示是否结束，value存储读取的数据
          if (done) {
            condition = false;
            break;
          }
          const chunk = decoder.decode(value);
          const lines = chunk.split('\n');
          for (const line of lines) {
            if (line.startsWith('event:')) {
              eventType = line.slice(6).trim();
            } else if (line.startsWith('data:')) {
              eventData = JSON.parse(line.slice(5).trim());
              console.log("eventData:", eventData);
              if (eventType === 'conversation.message.delta') {
                assistantMessage = { ...assistantMessage, content: assistantMessage.content + eventData.content };
                // 替换最后一个消息
                store.commit('UPDATE_LAST_MESSAGE', assistantMessage);
                scrollToBottom();
              } else if (eventType === 'conversation.chat.completed' || eventType === 'done') {
                console.log('流式传输结束');
                condition = false;
                break;
              } else if (eventType === 'conversation.chat.failed') {
                assistantMessage = { ...assistantMessage, content: assistantMessage.content + eventData.last_error.msg };
                // 替换最后一个消息
                store.commit('UPDATE_LAST_MESSAGE', assistantMessage);
                scrollToBottom();
              }
            }
          }
        }
      } catch (error) {
        console.error('返回错误', error);
      }
    };

    const scrollToBottom = () => {
      const container = document.querySelector('.message-list');
      if (container) {
        container.scrollTop = container.scrollHeight;
      }
    };

    onMounted(() => {
      // 标记所有加载的消息为旧消息
      messages.value.forEach(message => {
        message.isNew = false;
      });
    });

    watch(messages, () => {
      scrollToBottom();
    }, { deep: true });

    return {
      messages,
      handleSend,
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
  height: calc(100vh - 20%); /* 确保高度足够 */
}
.input-box {
  height: 20%;
}
</style>