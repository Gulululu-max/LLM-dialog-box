<template>
    <div class="sidebar-container">
      <!-- 侧边栏图标区域 -->
      <div class="sidebar-icons">
        <!-- 第一个图标：图片 + 悬浮提示 -->
        <el-tooltip content="这里是kiki小助手" placement="right">
          <div class="icon-wrapper">
            <img src="@/assets/logo.png" alt="图标" class="icon" />
          </div>
        </el-tooltip>
  
        <!-- 第二个图标：展开/收起侧边栏 -->
        <div class="icon-wrapper" @click="toggleSidebar">
          <el-icon :size="24">
            <component :is="isSidebarExpanded ? 'Fold' : 'Expand'" />
          </el-icon>
        </div>
  
        <!-- 第三个图标：新增会话 -->
        <div class="icon-wrapper" @click="addNewSession">
          <el-icon :size="24">
            <Plus />
          </el-icon>
        </div>
      </div>
  
      <!-- 展开的侧边栏内容 -->
      <div class="sidebar-content" :class="{ expanded: isSidebarExpanded }">
        <!-- 收起按钮 -->
        <div class="collapse-button" @click="toggleSidebar">
          <el-icon :size="20">
            <ArrowLeft />
          </el-icon>
        </div>
  
        <!-- 历史会话框 -->
        <div class="history-sessions">
          <div v-for="session in sessions" :key="session.id" class="session-item">
            <span>会话 {{ session.id }}</span>
            <el-button type="text" @click="openSession(session.id)">打开</el-button>
            <el-button type="text" @click="deleteSession(session.id)">删除</el-button>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { ref, computed } from 'vue';
  import { useStore } from 'vuex';
  import { ElIcon, ElTooltip, ElButton, ElMessage} from 'element-plus';
  import { Fold, Expand, Plus, ArrowLeft } from '@element-plus/icons-vue';
  
  export default {
    name: 'SideBar',
    components: {
      ElIcon,
      ElTooltip,
      ElButton,
      Fold,
      Expand,
      Plus,
      ArrowLeft,
      ElMessage
    },
    setup() {
      const store = useStore();
      const isSidebarExpanded = ref(false); // 控制侧边栏展开/收起
      const sessions = computed(() => store.state.sessions); // 从 Vuex 中获取历史会话
  
      // 切换侧边栏展开/收起
      const toggleSidebar = () => {
        isSidebarExpanded.value = !isSidebarExpanded.value;
      };
  
      // 新增会话
      const addNewSession = () => {
        store.dispatch('addSession'); // 调用 Vuex action
        ElMessage.success('新增会话成功！');
      };
  
      // 打开会话
      const openSession = (sessionId) => {
        store.dispatch('setCurrentSession', sessionId); // 设置当前会话
        ElMessage.info(`打开会话：${sessionId}`);
      };

      const deleteSession = (sessionId) => {
        store.dispatch('deleteSession', sessionId); // 调用 Vuex action
        ElMessage.success('删除会话成功！');
      };

      return {
        isSidebarExpanded,
        sessions,
        toggleSidebar,
        addNewSession,
        openSession,
        deleteSession,
      };
    },
  };
  </script>
  
  <style scoped>
  .sidebar-container {
    display: flex;
    height: 100vh;
    background-color: #f5f5f5;
  }
  
  .sidebar-icons {
    width: 60px;
    background-color: #304156;
    padding: 20px 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
  }
  
  .icon-wrapper {
    cursor: pointer;
    color: #fff;
    transition: color 0.3s;
  }
  
  .icon-wrapper:hover {
    color: #409eff;
  }
  
  .icon {
    width: 24px;
    height: 24px;
  }
  
  .sidebar-content {
    width: 0;
    overflow: hidden;
    background-color: #fff;
    transition: width 0.3s;
  }
  
  .sidebar-content.expanded {
    width: 250px;
  }
  
  .collapse-button {
    padding: 10px;
    text-align: right;
    cursor: pointer;
    color: #606266;
    transition: color 0.3s;
  }
  
  .collapse-button:hover {
    color: #409eff;
  }
  
  .history-sessions {
    padding: 10px;
    max-height: calc(100vh - 60px);
    overflow-y: auto;
  }
  
  .session-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
    border-bottom: 1px solid #ebeef5;
    transition: background-color 0.3s;
  }
  
  .session-item:hover {
    background-color: #f5f7fa;
  }
  
  /* 美化滚动条 */
  .history-sessions::-webkit-scrollbar {
    width: 6px;
  }
  
  .history-sessions::-webkit-scrollbar-thumb {
    background-color: #c1c1c1;
    border-radius: 3px;
  }
  
  .history-sessions::-webkit-scrollbar-track {
    background-color: #f1f1f1;
  }
  </style>