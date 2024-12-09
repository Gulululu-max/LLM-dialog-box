<template>
    <div class = "chat-box">
        <Message v-for="(msg, index) in messages" :key="index" :message="msg"/>
        <InputBox @send="handleSend"/>
    </div>
</template>
<script>
import Message from './Message.vue';
import InputBox from './InputBox.vue';
import axios from 'axios';

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
            const response = await axios.post('https://api.coze.cn/open_api/v2/chat', {
                query: content,
                stream: true
            },
            {
                headers: {
                    'Authorization': 'Bearer MY API KEY'
                }
            }
        );
        this.messages.push({role: 'user', content: content});
        this.messages.push({role: 'assistant', content: response.data.message.content})
        }
    }
}
</script>
<style>
.chat-box {
    display: flex; /* 将元素的显示模式设置为弹性盒模型（Flexbox）。这使得子元素可以灵活地排列和对齐。 */
    flex-direction: column; /* 将子元素的排列方向设置为纵向排列。 */
    height: 100%;
}
</style>