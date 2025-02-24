<template>
    <div class="single-message" :class="message.role">
      <!-- <div v-if="message && message.content_type === 'text'">{{ message.content }}</div>
      <img v-if="message && message.content_type === 'image'" :src="message.content" alt="Image content">
      <a v-if="message && message.content_type === 'link'" :href="message.content">{{ message.content }}</a>
      <a v-if="message && message.content_type === 'pdf'" :href="message.content" target="_blank">{{ message.content }}</a> -->
      <div v-if="message" v-loading="isLoading">
        <!-- <p>Role: {{ message.role }}</p>
        <p>Content Type: {{ message.content_type }}</p> -->
        <!-- <div v-if="isLoading"></div> -->
        <p>{{ printContent }}</p>
        <button v-if="isShowCopy" @click="copyToClipboard(printContent)">复制</button>
      </div>
      <div v-else class="placeholder">暂无消息</div>
    </div>
</template>
<script>
import { ref, watch, onBeforeUnmount } from 'vue';

export default {
  name: 'Message',
  props: {
    message: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    //以下是消息逐字打印的相关实现
    const printContent = ref('');
    const currentIndex = ref(0);
    const timeId = ref(null);
    const isLoading = ref(props.message.role === 'assistant' && props.message.isNew === true);

    const startTypingEffect = (content) => {
      if (timeId.value) {
        clearInterval(timeId.value);
      }
      printContent.value = '';
      currentIndex.value = 0;
      isLoading.value = true;

      timeId.value = setInterval(() => {
        if (currentIndex.value < content.length) {
          printContent.value += content[currentIndex.value];
          currentIndex.value++;
        } else {
          clearInterval(timeId.value);
          
        }
      }, 50);
      isLoading.value = false;

    };

    watch(
      () => props.message.content,
      (newContent) => {
        if (props.message.role === 'user' || !props.message.isNew) {
          printContent.value = props.message.content;
        } else {
          startTypingEffect(newContent);
        }
      },
      { immediate: true }
    );

    onBeforeUnmount(() => {
      if (timeId.value) {
        clearInterval(timeId.value);
      }
    });

    //以下是复制回答部分
    const isShowCopy = ref(props.message.role === 'assistant');
    const copyToClipboard = (text) => {
      navigator.clipboard.writeText(text).then(() => {
        alert('内容已复制至剪贴板');
      }).catch(err => {
        console.error('复制失败', err);
      })
    };

    return {
      printContent,
      isLoading,
      copyToClipboard,
      isShowCopy,
    };
  }
};
</script>

<!-- <script>
// import { th } from 'element-plus/es/locales.mjs';

export default {
    name: 'Message',
    props: {
        message: {
            type: Object,
            required: true
        }
    },
    data(){
      return{
        printContent: '',//逐步显示的内容
        currentIndex: 0,//当前显示的字符索引
        timeId: null,
        isLoading: (this.message.role === 'assistant' && this.message.isNew === true)? true:false,
      }
    },
    watch:{
      //监听消息内容的变化
      'message.content':{
        handler(newContent){
          if(this.message.role === 'user' || !this.message.isNew){//用户的消息和缓存中的旧消息不用逐字打印
            this.printContent = this.message.content;
          }else{
            this.startTypingEffect(newContent);
          }
          // if (this.message.role === 'assistant') {
          //   this.startTypingEffect(newContent);
          // }else{
          //   // 如果是用户消息，直接显示内容
          //   this.displayContent = newContent;
          // }
        },
        immediate: true//立即执行
      }
    },
    methods:{
      //实现逐字打印效果
      startTypingEffect(content){
        if(this.timeId){
          clearInterval(this.timeId);
        }
        this.printContent = '';
        this.currentIndex = 0;
        this.isLoading = true;

        this.timeId = setInterval(() => {//指定时间间隔内重复执行
          if(this.currentIndex < content.length){
            this.printContent += content[this.currentIndex];
            this.currentIndex++;
          }else{
            //内容加载完毕，清楚定时器
            clearInterval(this.timeId);
            
          }
        }, 50);
        this.isLoading = false;//一旦消息开始打印就关闭加载特效
      }
    },
    onBeforeUnmount(){
      if(this.timeId){// 组件销毁前清除定时器
        clearInterval(this.timeId);
      }
    }
    
}
</script> -->

<style scoped>
.single-message {
  margin: 10px 0;
  padding: 10px 15px; /* 上下 10px，左右 15px */
  border-radius: 12px;
  height:auto;
  min-height: 40px;
  max-width: 80%;
  min-width: 200px;
  width: fit-content;
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