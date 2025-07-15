<template>
  <div id="app">
    <!-- 游戏标题 -->
    <div class="game-header">
      <h1>熵减战争{{ version }}</h1>
      <p>对抗宇宙熵增的科幻放置游戏</p>
    </div>
    <!-- 游戏主界面 -->
    <div class="game-container">
      <!-- 左侧：游戏接口 -->
      <div class="game-main">
        <GameInterface />
      </div>
      <!-- 右侧：事件系统 -->
      <div class="game-sidebar">
        <EventSystem />
        <!-- 熵减进程 -->
        <EntropyProgress />
      </div>
    </div>
  </div>
</template>

<script setup>
  import GameInterface from '@/components/GameInterface.vue'
  import EventSystem from '@/components/EventSystem.vue'
  import EntropyProgress from '@/components/EntropyProgress.vue'
  const version = __APP_VER__
</script>

<style scoped>
  #app {
    min-height: 100vh;
    background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%);
    color: #e0e0e0;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  }

  .game-header {
    text-align: center;
    padding: 20px;
    background: rgba(255, 255, 255, 0.05);
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }

  .game-header h1 {
    margin: 0;
    font-size: 2.5em;
    color: #409eff;
    text-shadow: 0 0 10px rgba(64, 158, 255, 0.5);
  }

  .game-header p {
    margin: 10px 0 0 0;
    color: #a0a0a0;
    font-size: 1.1em;
  }

  .game-container {
    display: grid;
    grid-template-columns: 1fr 400px;
    gap: 20px;
    padding: 20px;
    max-width: 1600px;
    margin: 0 auto;
  }

  .game-main {
    min-height: 600px;
  }

  .game-sidebar {
    min-height: 600px;
  }

  .help-dialog {
    background: rgba(15, 15, 35, 0.95);
  }

  .help-content {
    color: #e0e0e0;
    line-height: 1.6;
  }

  .help-content h3 {
    color: #409eff;
    margin: 20px 0 10px 0;
  }

  .help-content ul {
    margin: 10px 0;
    padding-left: 20px;
  }

  .help-content li {
    margin: 5px 0;
  }

  :deep(.el-dialog__title) {
    color: #e0e0e0;
  }

  @media (max-width: 1200px) {
    .game-container {
      grid-template-columns: 1fr;
    }

    .game-sidebar {
      order: 1;
    }
  }

  @media (max-width: 768px) {
    .game-header h1 {
      font-size: 2em;
    }

    .game-container {
      padding: 10px;
    }
  }

  .trait-btn {
    position: fixed;
    top: 80px;
    right: 40px;
    z-index: 2000;
  }
</style>

<style>
  /* 全局样式 */
  * {
    box-sizing: border-box;
  }

  body {
    margin: 0;
    padding: 0;
    background: #0f0f23;
  }

  /* Element Plus 组件样式覆盖 */
  .el-card {
    background: rgba(255, 255, 255, 0.05) !important;
    border: 1px solid rgba(255, 255, 255, 0.1) !important;
    color: #e0e0e0 !important;
  }

  .el-card__header {
    background: rgba(255, 255, 255, 0.05) !important;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1) !important;
  }

  .el-progress {
    background: rgba(255, 255, 255, 0.1) !important;
  }

  .el-dialog {
    background: rgba(15, 15, 35, 0.95) !important;
    border: 1px solid rgba(255, 255, 255, 0.1) !important;
  }

  .el-dialog__header,
  .el-message-box__header {
    background: transparent !important;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1) !important;
    color: #409eff !important;
  }

  .el-dialog__body,
  .el-message-box {
    background: rgba(15, 15, 35, 0.95) !important;
    color: #e0e0e0 !important;
  }

  .el-message-box__message p,
  .el-message-box__title {
    color: #e0e0e0;
  }

  a:-webkit-any-link {
    text-decoration: none;
  }

  .status-controls .el-button + .el-button {
    margin-left: 0px;
    margin-right: 12px;
  }

  .status-controls .el-button:nth-child(2) {
    margin-left: 12px;
  }
</style>
