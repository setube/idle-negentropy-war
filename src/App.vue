<template>
  <div id="app">
    <!-- 游戏标题 -->
    <div class="game-header">
      <h1>熵减战争</h1>
      <p>对抗宇宙熵增的科幻放置游戏</p>
      <div class="era-bar">
        <el-tag type="success" size="large" disable-transitions>当前文明时代：{{ gameStore.currentEraName }}</el-tag>
      </div>
    </div>
    <!-- 游戏主界面 -->
    <div class="game-container">
      <!-- 左侧：游戏接口 -->
      <div class="game-main">
        <GameInterface />
      </div>
      <!-- 右侧：事件系统 -->
      <div class="game-sidebar">
        <EventSystem ref="eventSystem" />
        <!-- 熵减进程 -->
        <EntropyProgress />
      </div>
    </div>
    <el-dialog
      v-model="showTraitDialog"
      title="选择文明特性"
      width="400px"
      :close-on-click-modal="false"
      :show-close="false"
    >
      <div v-if="!gameStore.selectedTrait">
        <el-radio-group v-model="traitChoice">
          <el-radio v-for="trait in gameStore.traits" :key="trait.key" :value="trait.key">
            <b>{{ trait.name }}</b>
            ：{{ trait.desc }}
          </el-radio>
        </el-radio-group>
        <div style="margin-top: 20px; text-align: right">
          <el-button type="primary" @click="chooseTrait" :disabled="!traitChoice">确定</el-button>
        </div>
      </div>
      <div v-else>
        <p>
          已选择特性：
          <b>{{ getTraitName(gameStore.selectedTrait) }}</b>
        </p>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
  import { ref, onMounted, onUnmounted } from 'vue'
  import { useGameStore } from './stores/gameStore'
  import GameInterface from './components/GameInterface.vue'
  import EventSystem from './components/EventSystem.vue'
  import EntropyProgress from './components/EntropyProgress.vue'

  const gameStore = useGameStore()
  const eventSystem = ref(null)
  const showTraitDialog = ref(false)
  const traitChoice = ref('')

  const getTraitName = key => {
    const found = gameStore.traits.find(t => t.key === key)
    return found ? found.name : key
  }

  const chooseTrait = () => {
    gameStore.selectedTrait = traitChoice.value
    showTraitDialog.value = false
  }

  // 组件挂载时启动游戏
  onMounted(() => {
    if (!gameStore.selectedTrait) {
      showTraitDialog.value = true
    }
  })
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

  .era-bar {
    margin-top: 10px;
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

  .el-button {
    background: rgba(64, 158, 255, 0.2) !important;
    border: 1px solid rgba(64, 158, 255, 0.3) !important;
    color: #409eff !important;
  }

  .el-button:hover {
    background: rgba(64, 158, 255, 0.3) !important;
    border-color: #409eff !important;
  }

  .el-button--primary {
    background: rgba(64, 158, 255, 0.8) !important;
    color: white !important;
  }

  .el-button--warning {
    background: rgba(230, 162, 60, 0.8) !important;
    color: white !important;
  }

  .el-button--success {
    background: rgba(103, 194, 58, 0.8) !important;
    color: white !important;
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

  .status-controls .el-button+.el-button {
    margin-left: 0px;
    margin-right: 12px;
  }

  .status-controls .el-button:nth-child(2) {
    margin-left: 12px
  }
</style>
