<template>
  <div id="app">
    <div class="game-header">
      <h1>{{ title }}{{ version }}</h1>
      <p>{{ desc }}</p>
      <div
        class="music-vinyl"
        :class="{ spinning: isPlaying }"
        @click="toggleMusic"
        :title="isPlaying ? '暂停音乐' : '播放音乐'"
      >
        <div class="music-cover">
          <img src="/cover.jpg" alt="音乐封面" class="vinyl-img" />
          <el-icon class="vinyl-icon">
            <component :is="isPlaying ? MusicNoteOutlined : MusicOffOutlined" />
          </el-icon>
        </div>
      </div>
      <audio ref="audioRef" src="/music.mp3" loop preload="auto" />
    </div>
    <div class="game-container">
      <div class="game-main">
        <div class="game-interface">
          <!-- 面板 -->
          <el-card class="resource-panel" shadow="never">
            <template #header>
              <div class="card-header">
                <span>{{ categories[activeCategory][1] }}</span>
                <el-button-group style="float: right">
                  <el-button
                    v-for="(item, key) in categories"
                    :key="key"
                    size="small"
                    :type="activeCategory === key ? 'primary' : 'default'"
                    @click="activeCategory = key"
                  >
                    {{ item[0] }}
                  </el-button>
                </el-button-group>
              </div>
            </template>
            <!-- 资源 -->
            <div class="resource-grid" v-show="activeCategory == 'resourceSys'">
              <div class="resource-item" v-for="(item, key) in resourcesData" :key="key">
                <el-icon><AutoAwesomeOutlined /></el-icon>
                <el-tooltip class="box-item" effect="dark" placement="top">
                  <template #content>
                    <span v-if="gameStore.resourceDelta[key]?.total">
                      {{ gameStore.formatNumber(gameStore.resourceDelta[key]?.total) }} / 天
                    </span>
                    <span v-else>暂无产出</span>
                  </template>
                  <span>
                    <span>{{ item.name }}: {{ gameStore.formatNumber(gameStore.resources[key]) }}</span>
                  </span>
                </el-tooltip>
              </div>
            </div>
            <!-- 信息 -->
            <div class="status-grid" v-show="activeCategory == 'cosmicInfo'">
              <div class="status-item">
                <el-icon><WatchLaterOutlined /></el-icon>
                <span>时间: {{ gameStore.formatTime(gameStore.gameTime) }}</span>
              </div>
              <div class="status-item">
                <el-icon><WifiChannelRound /></el-icon>
                <span>科技效率: {{ gameStore.eventBonus }}</span>
              </div>
              <div class="status-item">
                <el-icon><TurnSharpLeftOutlined /></el-icon>
                <span>熵减速率: {{ gameStore.entropyReductionRate }}</span>
              </div>
              <div class="status-item">
                <el-icon><TrendingUpOutlined /></el-icon>
                <span>坐标暴露值上限: {{ gameStore.formatNumber(gameStore.coordinateExposureMax) }}</span>
              </div>
              <div class="status-item">
                <el-icon><WebhookOutlined /></el-icon>
                <span>文明等级: {{ gameStore.civilizationLevel }}</span>
              </div>
              <div class="status-item">
                <el-icon><SpokeOutlined /></el-icon>
                <span>存续度: {{ civilizationSurvival.toFixed(2) }}</span>
              </div>
              <div
                class="status-item"
                :class="{ chaos: gameStore.universeState === 'chaos', order: gameStore.universeState === 'order' }"
              >
                <el-icon><StreamOutlined /></el-icon>
                <span>宇宙状态: {{ gameStore.universeState === 'chaos' ? '混沌态' : '有序态' }}</span>
              </div>
            </div>
            <!-- 监控 -->
            <div class="jiankong" v-show="activeCategory == 'cosmicWatch'">
              <div class="universe-grid">
                <div class="universe-item">
                  <h4>
                    坐标暴露值
                    <el-tooltip
                      class="box-item"
                      effect="dark"
                      content="当文明等级>3并且暴露值超过上限会遭受到来自黑暗森林的降维打击(惩罚很严重)"
                      placement="top"
                    >
                      <el-icon><ErrorOutlineFilled /></el-icon>
                    </el-tooltip>
                  </h4>
                  <p>
                    {{
                      gameStore.formatNumber(gameStore.resources.coordinateExposure) +
                      '/' +
                      gameStore.formatNumber(gameStore.coordinateExposureMax)
                    }}
                    <el-tag v-if="gameStore.exposureCooldown > 0" type="success" effect="dark" style="margin-left: 8px">
                      安全期：{{ gameStore.formatTime(gameStore.exposureCooldown) }}
                    </el-tag>
                  </p>
                  <el-progress
                    :percentage="
                      Math.min(
                        Math.max((gameStore.resources.coordinateExposure / gameStore.coordinateExposureMax) * 100, 0),
                        100
                      )
                    "
                    :color="getExposureColor"
                    :show-text="false"
                  />
                </div>
                <div class="universe-item">
                  <h4>
                    三体偏差值
                    <el-tooltip
                      class="box-item"
                      effect="dark"
                      content="当三体偏差值达到无限时这个世界会在受到不可抗力因素后毁灭, 完成终极文明后可以阻止"
                      placement="top"
                    >
                      <el-icon><ErrorOutlineFilled /></el-icon>
                    </el-tooltip>
                  </h4>
                  <p>{{ gameStore.tripleStarDeviation.toFixed(3) }}/∞</p>
                  <el-progress
                    :percentage="Math.min(Math.max((gameStore.tripleStarDeviation / 2) * 100, 0), 100)"
                    :color="getDeviationColor"
                    :show-text="false"
                  />
                </div>
              </div>
              <el-card class="grad-progress-card" shadow="never" style="margin-top: 20px">
                <template #header>
                  <span>毕业进度({{ (gameStore.progressRatio * 100).toFixed(1) }}%)</span>
                </template>
                <div class="grad-progress-list">
                  <el-descriptions :column="2" border>
                    <el-descriptions-item :label="item.name" v-for="item in gradProgress" :key="item">
                      {{ (item.progress * 100).toFixed(1) }}%
                    </el-descriptions-item>
                  </el-descriptions>
                </div>
              </el-card>
            </div>
            <!-- 设置 -->
            <div class="status-controls" v-show="activeCategory == 'entropyMgmt'">
              <el-button
                @click="toggleGame"
                :icon="gameRunning ? PauseCircleOutlineFilled : PlayCircleOutlineFilled"
                class="status-controls-item main-action"
              >
                {{ gameRunning ? '暂停游戏' : '继续游戏' }}
              </el-button>
              <el-button @click="resetGame" :icon="RefreshOutlined" class="status-controls-item secondary-action">
                重置游戏
              </el-button>
              <el-upload
                class="button el-button status-controls-item secondary-action"
                action="#"
                style="display: unset"
                :http-request="upload"
                :show-file-list="false"
                accept="application/json"
              >
                <el-icon>
                  <FileUploadOutlined />
                </el-icon>
                导入存档
              </el-upload>
              <el-button @click="download" :icon="FileDownloadOutlined" class="status-controls-item secondary-action">
                导出存档
              </el-button>
              <el-button
                @click="showHelp = true"
                :icon="QuestionMarkOutlined"
                class="status-controls-item secondary-action"
              >
                游戏说明
              </el-button>
              <el-tooltip effect="dark" content="QQ群: 920930589" placement="top">
                <el-button :icon="ChatBubbleOutlineFilled" class="status-controls-item secondary-action">
                  官方群聊
                </el-button>
              </el-tooltip>
              <a
                class="el-button status-controls-item"
                target="_blank"
                href="https://github.com/setube/idle-negentropy-war"
              >
                <el-icon>
                  <LinkFilled />
                </el-icon>
                <span>开源地址</span>
              </a>
              <el-tooltip effect="dark" content="《熵减协议》- 星缘之境" placement="top">
                <a
                  class="el-button status-controls-item"
                  target="_blank"
                  href="https://y.qq.com/n/ryqq/albumDetail/000P6I8m4OyaDZ"
                >
                  <el-icon>
                    <LibraryMusicOutlined />
                  </el-icon>
                  <span>游戏主题曲</span>
                </a>
              </el-tooltip>
            </div>
          </el-card>
          <div class="main-game-area">
            <el-tabs v-model="activeName">
              <template v-for="(item, index) in tabsList" :key="index">
                <el-tab-pane :label="item.name" :name="item.type" v-if="item.show">
                  <component :is="item.is" />
                </el-tab-pane>
              </template>
            </el-tabs>
          </div>
        </div>
      </div>
      <div class="game-sidebar">
        <EventSystem />
      </div>
    </div>
    <el-dialog
      v-model="showHelp"
      title="熵减战争 - 游戏说明"
      width="80%"
      :lock-scroll="false"
      destroy-on-close
      class="help-dialog"
    >
      <el-scrollbar height="400px" class="help-content">
        <h3>世界观</h3>
        <p>
          在熵减战争中，你领导一个文明对抗宇宙的熵增法则。从微观的原子排序开始，逐步实现分子冷却、恒星熄灭、黑洞解压，最终达到能量物质化和宇宙单一化，将所有物质重新转化为氢，实现最低熵状态。
        </p>
        <h3>熵减进程</h3>
        <ul>
          <li>
            <strong>原子排序</strong>
            ：手动排列原子，建立有序结构，减缓局部热运动
          </li>
          <li>
            <strong>分子冷却</strong>
            ：减缓分子热运动，降低系统温度，建立分子级有序
          </li>
          <li>
            <strong>恒星熄灭</strong>
            ：熄灭恒星，停止核聚变产生的熵增，控制恒星活动
          </li>
          <li>
            <strong>黑洞解压</strong>
            ：解压黑洞，释放被压缩的信息，实现超大规模熵减
          </li>
          <li>
            <strong>能量物质化</strong>
            ：将纯能量转化为有序物质，实现宇宙级熵减
          </li>
          <li>
            <strong>宇宙单一化</strong>
            ：将所有物质重新转化为氢，达到最低熵状态
          </li>
        </ul>
        <h3>核心系统</h3>
        <ul>
          <li>
            <strong>渐进熵减</strong>
            ：从微观到宏观，逐步实现宇宙的有序化
          </li>
          <li>
            <strong>双态宇宙规则</strong>
            ：有序态时科技效率+300%，混沌态时资源产出-90%
          </li>
          <li>
            <strong>黑暗森林法则</strong>
            ：坐标暴露值过高会触发降维打击。暴露值代表文明在宇宙中的可被发现程度，过高时将遭受资源损失或建筑摧毁。可通过特定科技和建筑降低暴露值。
          </li>
          <li>
            <strong>三体混沌引擎</strong>
            ：偏差值过大时触发乱纪元，建筑产出归零
          </li>
          <li>
            <strong>知识黑洞效应</strong>
            ：文明等级提升时前代技术效率衰减
          </li>
        </ul>
        <h3>游戏目标</h3>
        <p>
          通过建造熵减建筑、解锁相关科技、管理资源，逐步完成从原子到宇宙的熵减进程。最终目标是实现宇宙单一化，将所有物质重新转化为氢，达到最低熵状态。
        </p>
        <h3>进度与熵减阶段说明</h3>
        <p>
          游戏的核心进度完全由“熵减阶段”推进决定。每当你手动完成一个熵减阶段，文明将进入新的时代，解锁新的科技和建筑。只有推进到下一个熵减阶段，才会解锁该阶段的科技和建筑内容。文明时代的变迁、资源体系的扩展、科技的分支，全部与熵减阶段同步。熵减阶段的推进需要消耗资源，建议优先提升产出和效率，避免陷入资源瓶颈或死局。游戏目标是逐步完成所有熵减阶段，最终实现宇宙单一化，达到最低熵状态。
        </p>
        <h3>文明时代推进</h3>
        <p>
          文明时代的推进完全由熵减阶段决定。每当你完成一个熵减阶段，文明自动进入新时代，解锁新科技和建筑，并获得全局奖励（如科技效率+10%、建筑产出+10%、资源与文明基因奖励等）。文明时代不会倒退，只能不断进化。每次进入新时代，奖励内容会在事件日志中显示。
        </p>
        <h3>操作指南</h3>
        <ul>
          <li>执行熵减：消耗资源进行当前阶段的熵减操作</li>
          <li>建造建筑：建造当前熵减阶段的相关建筑</li>
          <li>解锁科技：解锁支持当前熵减阶段的科技</li>
          <li>阶段推进：完成当前阶段后自动解锁下一阶段</li>
          <li>保存文明基因：防止技术效率过度衰减</li>
          <li>监控威胁：注意坐标暴露和三体偏差</li>
        </ul>
      </el-scrollbar>
    </el-dialog>
    <audio ref="bgRef" src="/bg.mp3" loop preload="auto" />
    <div class="bg" @click="toggleGame" v-if="!gameRunning">
      <div class="spinner">
        <PlayCircleOutlineFilled class="circular" />
        <p class="text">游戏已暂停</p>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { useGameStore } from '@/stores/gameStore'
  import { ref, onBeforeUnmount, computed, onMounted } from 'vue'
  import {
    PauseCircleOutlineFilled,
    PlayCircleOutlineFilled,
    RefreshOutlined,
    FileUploadOutlined,
    FileDownloadOutlined,
    QuestionMarkOutlined,
    ChatBubbleOutlineFilled,
    LinkFilled,
    MusicNoteOutlined,
    MusicOffOutlined,
    LibraryMusicOutlined,
    ErrorOutlineFilled,
    AutoAwesomeOutlined,
    WatchLaterOutlined,
    WebhookOutlined,
    WifiChannelRound,
    TurnSharpLeftOutlined,
    TrendingUpOutlined,
    StreamOutlined,
    SpokeOutlined
  } from '@vicons/material'
  import { ElMessage, ElMessageBox } from 'element-plus'
  import { saveAs } from 'file-saver'
  import resourcesData from '@/data/resources'
  import WorkerTimer from '@/plugins/worker-timer.js?worker'
  import buildings from '@/components/buildings.vue'
  import technologies from '@/components/technologies.vue'
  import AchievementPanel from '@/components/AchievementPanel.vue'
  import EntropyProgress from '@/components/EntropyProgress.vue'
  import EventSystem from '@/components/EventSystem.vue'
  import ExplorationPanel from '@/components/ExplorationPanel.vue'
  import GmPanel from '@/components/GmPanel.vue'

  const version = __APP_VER__
  const title = __APP_TITLE__
  const desc = __APP_DESC__
  const gameStore = useGameStore()
  const gameRunning = ref(false)
  const showHelp = ref(false)
  const exposureCooldownTimer = ref(null)
  const worker = new WorkerTimer()
  const activeName = ref('buildings')
  const activeCategory = ref('resourceSys')
  const gmNum = ref(0)
  const isPlaying = ref(false)
  const audioRef = ref(null)
  const bgRef = ref(null)

  const toggleMusic = () => {
    const audio = audioRef.value
    const bg = bgRef.value
    if (!audio || !bg) return
    if (isPlaying.value) {
      audio.pause()
      bg.play()
      isPlaying.value = false
    } else {
      audio.play()
      bg.pause()
      isPlaying.value = true
    }
  }

  // 存续度计算
  const civilizationSurvival = computed(() => {
    const knowledgeDensity = Math.log10(gameStore.resources.knowledge + 1)
    const energyDensity = Math.log10(gameStore.resources.energy + 1)
    return knowledgeDensity * energyDensity
  })

  const gradProgress = computed(() => {
    return {
      techRatio: { name: '科技毕业度', progress: gameStore.techRatio },
      stageRatio: { name: '阶段毕业度', progress: gameStore.stageRatio },
      buildRatio: { name: '建筑毕业度', progress: gameStore.buildRatio },
      entropyGap: { name: '熵减完成度', progress: gameStore.entropyGap }
    }
  })
  const categories = {
    resourceSys: ['资源', '资源系统'],
    cosmicInfo: ['信息', '宇宙信息'],
    cosmicWatch: ['监控', '宇宙监控'],
    entropyMgmt: ['设置', '系统设置']
  }

  const tabsList = computed(() => {
    return [
      { type: 'buildings', name: '建筑系统', is: buildings, show: true },
      { type: 'technologies', name: '科技系统', is: technologies, show: true },
      { type: 'EntropyProgress', name: '熵减进程', is: EntropyProgress, show: true },
      { type: 'exploration', name: '宇宙探索', is: ExplorationPanel, show: true },
      { type: 'achievement', name: '成就系统', is: AchievementPanel, show: true },
      { type: 'gm', name: 'GM系统', is: GmPanel, show: gameStore.isGm }
    ]
  })

  const getExposureColor = computed(() => {
    const percentage = (gameStore.resources.coordinateExposure / gameStore.coordinateExposureMax) * 100
    if (percentage > 80) return '#f56c6c'
    if (percentage > 60) return '#e6a23c'
    return '#67c23a'
  })

  const getDeviationColor = computed(() => {
    const percentage = (gameStore.tripleStarDeviation / 0.5) * 100
    if (percentage > 80) return '#f56c6c'
    if (percentage > 60) return '#e6a23c'
    return '#67c23a'
  })

  const tickQueue = ref(0)
  const processing = ref(false)

  const scheduleNext = () => {
    if (tickQueue.value <= 0) {
      processing.value = false
      return
    }
    processing.value = true
    setTimeout(() => {
      gameStore.updateGame()
      tickQueue.value--
      scheduleNext()
    }, 1000)
  }

  // 游戏循环
  const startGameLoop = () => worker.postMessage('start')

  // 停止游戏循环
  const stopGameLoop = () => worker.postMessage('pause')

  worker.onmessage = () => {
    tickQueue.value++
    if (!processing.value) scheduleNext()
  }

  // 切换游戏状态
  const toggleGame = () => {
    gameRunning.value = !gameRunning.value
    if (gameRunning.value) {
      startGameLoop()
      bgRef.value.play()
    } else {
      stopGameLoop()
      bgRef.value.pause()
    }
  }

  // 导出存档
  const download = () => {
    try {
      saveAs(
        new Blob([localStorage.getItem(__APP_NAME__)], { type: 'application/json' }),
        `${__APP_TITLE__}存档数据-${new Date().toISOString().slice(0, 10)}-${Date.now()}.json`
      )
      ElMessage.success('存档已导出')
    } catch (error) {
      ElMessage.error('存档导出失败：' + error.message)
      gameStore.addToEventLog('存档导出失败：' + error.message)
    }
  }

  // 导入存档
  const upload = data => {
    const file = data.file
    const reader = new FileReader()
    reader.onload = e => {
      try {
        localStorage.setItem(__APP_NAME__, e.target.result)
        location.reload()
      } catch (error) {
        ElMessage.error('存档导入失败：' + error.message)
      }
    }
    reader.readAsText(file)
  }

  // 重置游戏
  const resetGame = () => {
    gmNum.value++
    if (gmNum.value >= 10) {
      gameStore.isGm = true
      ElMessage({ message: 'GM功能已开启', type: 'success' })
      return
    }
    ElMessageBox.confirm('你确定要删除数据吗?', '提示', {
      type: 'warning',
      lockScroll: false,
      distinguishCancelAndClose: true,
      confirmButtonText: '确定',
      cancelButtonText: '取消'
    })
      .then(() => {
        localStorage.removeItem(__APP_NAME__)
        ElMessage.success('游戏数据已重置')
        location.reload()
      })
      .catch(() => {})
  }

  // 组件挂载时启动游戏
  onMounted(() => {
    if (gameRunning.value) {
      startGameLoop()
      bgRef.value.play()
    }
    exposureCooldownTimer.value = setInterval(() => {
      if (gameStore.exposureCooldown > 0) {
        gameStore.exposureCooldown--
      }
    }, 1000)
    if (!gameStore.achievements['compound_allTech_allStage'].unlocked && gameStore.tripleStarDeviation >= 100) {
      ElMessageBox.confirm(
        '这个误差被无限放大，最终导致文明无法预测未来、无法避免毁灭，你的文明已毁灭！',
        '三体偏差值已被无限放大',
        {
          lockScroll: true,
          showClose: false,
          showCancelButton: false,
          confirmButtonText: '重新开始',
          closeOnPressEscape: false,
          closeOnClickModal: false
        }
      )
        .then(() => {
          localStorage.removeItem(__APP_NAME__)
          ElMessage.success('游戏数据已重置')
          location.reload()
        })
        .catch(() => {})
    }
  })
  // 组件卸载时清理
  onBeforeUnmount(() => {
    stopGameLoop()
    if (exposureCooldownTimer.value) {
      clearInterval(exposureCooldownTimer.value)
      exposureCooldownTimer.value = null
    }
    if (audioRef.value) audioRef.value.pause()
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

  .game-interface {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
    background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
    min-height: 100vh;
    color: #e0e0e0;
  }

  .status-bar {
    margin-bottom: 20px;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
  }

  .status-controls {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
  }

  .status-controls-item {
    width: 23%;
    margin-bottom: 10px;
  }

  .status-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 15px;
  }

  .status-item {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 8px;
    width: 100%;
  }

  .status-item.chaos {
    background: rgba(245, 108, 108, 0.2);
    border: 1px solid rgba(245, 108, 108, 0.3);
  }

  .status-item.order {
    background: rgba(103, 194, 58, 0.2);
    border: 1px solid rgba(103, 194, 58, 0.3);
  }

  .resource-panel {
    margin-bottom: 20px;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
  }

  .resource-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 10px;
  }

  .resource-item {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 6px;
  }

  .main-game-area {
    margin-bottom: 20px;
  }

  .universe-panel {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
  }

  .universe-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 20px;
  }

  .universe-item {
    padding: 15px;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 8px;
  }

  .universe-item h4 {
    margin: 0 0 10px 0;
    color: #409eff;
    display: flex;
    align-items: center;
    gap: 4px;
  }

  .card-header {
    font-weight: bold;
    color: #409eff;
  }

  :deep(.el-tabs__item) {
    color: var(--el-border-color-light);
  }

  :deep(.el-tabs__item.is-active, .el-tabs__item:hover) {
    color: var(--el-color-primary);
  }

  :deep(.el-dialog__title) {
    color: #e0e0e0;
  }

  .grad-progress-card {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    margin-bottom: 20px;
  }

  .music-vinyl {
    position: absolute;
    right: 32px;
    top: 32px;
    z-index: 10;
    width: 72px;
    height: 72px;
    border-radius: 50%;
    background: radial-gradient(circle at 60% 40%, #fff 0%, #222 80%, #000 100%);
    border: 6px solid #222;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: box-shadow 0.2s;
    animation: spin 10s linear infinite;
    animation-play-state: paused;
  }

  .music-vinyl.spinning {
    animation-play-state: running;
    box-shadow: 0 8px 32px #409eff88;
  }

  @keyframes spin {
    100% {
      transform: rotate(360deg);
    }
  }

  .music-cover {
    display: grid;
    border: 3px solid #fff;
    border-radius: 50%;
    box-shadow: 0 0 8px #000a;
  }

  .music-cover::after {
    content: '';
    position: absolute;
    inset: 6px;
    border-radius: 50%;
    background: rgba(0, 0, 0, 0.5);
    pointer-events: none;
    width: 100%;
    height: 100%;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
  }

  .vinyl-img {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    object-fit: cover;
  }

  .vinyl-icon {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    pointer-events: none;
    color: #fff;
    text-shadow: 0 0 8px #000a;
    z-index: 1;
    font-size: 32px;
  }

  .bg {
    background-color: rgba(0, 0, 0, 0.7);
    z-index: 2001;
    position: fixed;
    bottom: 0;
    left: 0;
    margin: 0;
    right: 0;
    top: 0;
  }

  .bg .spinner {
    position: absolute;
    text-align: center;
    top: 50%;
    width: 100%;
    margin-top: calc((0px - 50px) / 2);
    color: var(--el-color-primary);
  }

  .bg .circular {
    display: inline;
    height: 50px;
    width: 50px;
  }

  .bg .text {
    font-size: 14px;
    margin: 3px 0;
  }

  @media (max-width: 768px) {
    .game-header h1 {
      font-size: 2em;
    }

    .game-container {
      padding: 10px;
      display: initial;
    }
    .main-game-area {
      grid-template-columns: 1fr;
    }

    .status-grid {
      grid-template-columns: 1fr;
    }

    .resource-grid {
      grid-template-columns: repeat(2, 1fr);
    }

    .status-controls-item {
      width: 45%;
    }

    .music-vinyl {
      width: 51px;
      height: 51px;
      right: 20px;
      top: 20px;
    }

    .music-cover {
      border: 2px solid #fff;
    }

    .vinyl-img {
      width: 41px;
      height: 41px;
    }

    .vinyl-icon {
      font-size: 20px;
    }
  }
</style>

<style>
  * {
    box-sizing: border-box;
  }

  html {
    font-size: 100%;
    overflow-y: scroll;
    -webkit-text-size-adjust: 100%;
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
    overflow-x: hidden;
    max-width: 100%;
    image-rendering: -webkit-optimize-contrast;
  }

  body {
    margin: 0;
    padding: 0;
    overflow-x: hidden;
    line-height: 1.4;
    font-family: -apple-system, BlinkMacSystemFont, Helvetica Neue, PingFang SC, Microsoft YaHei, Source Han Sans SC,
      Noto Sans CJK SC, WenQuanYi Micro Hei, sans-serif;
    text-rendering: optimizeLegibility;
    font-feature-settings: 'liga' on;
    -webkit-font-smoothing: subpixel-antialiased;
    font-style: normal;
  }

  ::-webkit-scrollbar {
    width: 6px;
  }

  ::-webkit-scrollbar:horizontal {
    height: 6px;
  }

  ::-webkit-scrollbar-track {
    border-radius: 10px;
  }

  ::-webkit-scrollbar-thumb {
    background-color: #0003;
    border-radius: 10px;
    transition: all 0.2s ease-in-out;
  }

  ::-webkit-scrollbar-thumb:hover {
    cursor: pointer;
    background-color: #0000004d;
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
