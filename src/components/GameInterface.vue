<template>
  <div class="game-interface">
    <!-- 游戏控制面板 -->
    <el-card class="status-bar" shadow="never">
      <div class="status-controls">
        <el-button @click="toggleGame" :icon="gameRunning ? VideoPause : VideoPlay" class="status-controls-item">
          {{ gameRunning ? '暂停游戏' : '继续游戏' }}
        </el-button>
        <el-button @click="resetGame" :icon="Refresh" class="status-controls-item">重置游戏</el-button>
        <el-upload
          class="button el-button status-controls-item"
          action="#"
          style="display: unset"
          :http-request="upload"
          :show-file-list="false"
          accept="application/json"
        >
          <el-icon>
            <Upload />
          </el-icon>
          导入存档
        </el-upload>
        <el-button @click="download" :icon="Download" class="status-controls-item">导出存档</el-button>
        <el-button @click="showHelp = true" :icon="QuestionFilled" class="status-controls-item">游戏说明</el-button>
        <el-tooltip effect="dark" content="QQ群: 920930589" placement="top">
          <el-button :icon="ChatRound" class="status-controls-item">官方群聊</el-button>
        </el-tooltip>
        <a class="el-button status-controls-item" target="_blank" href="https://github.com/setube/idle-negentropy-war">
          <el-icon>
            <Position />
          </el-icon>
          <span>开源地址</span>
        </a>
      </div>
    </el-card>
    <!-- 顶部状态栏 -->
    <el-card class="status-bar" shadow="never">
      <div class="status-grid">
        <div class="status-item">
          <el-icon><Clock /></el-icon>
          <span>时间: {{ gameStore.formatTime(gameStore.gameTime) }}</span>
        </div>
        <div class="status-item">
          <el-icon><Star /></el-icon>
          <span>文明等级: {{ gameStore.civilizationLevel }}</span>
        </div>
        <div class="status-item">
          <el-icon><Compass /></el-icon>
          <span>存续度: {{ gameStore.civilizationSurvival.toFixed(2) }}</span>
        </div>
        <div
          class="status-item"
          :class="{ chaos: gameStore.universeState === 'chaos', order: gameStore.universeState === 'order' }"
        >
          <el-icon><Sunny /></el-icon>
          <span>宇宙状态: {{ gameStore.universeState === 'chaos' ? '混沌态' : '有序态' }}</span>
        </div>
      </div>
    </el-card>
    <!-- 宇宙监控面板 -->
    <el-card class="resource-panel" shadow="never">
      <template #header>
        <div class="card-header">
          <span>宇宙监控</span>
        </div>
      </template>
      <div class="universe-grid">
        <div class="universe-item">
          <h4>
            坐标暴露值
            <el-tooltip
              class="box-item"
              effect="dark"
              content="当文明等级>=1并且暴露值超过上限会遭受到来自黑暗森林的降维打击(惩罚很严重)"
              placement="top"
            >
              <el-icon><Warning /></el-icon>
            </el-tooltip>
          </h4>
          <p>
            {{
              formatNumber(gameStore.resources.coordinateExposure) +
              '/' +
              formatNumber(gameStore.resources.coordinateExposureMax)
            }}
            <el-tag v-if="gameStore.exposureCooldown > 0" type="success" effect="dark" style="margin-left: 8px">
              安全期：{{ gameStore.formatTime(gameStore.exposureCooldown) }}
            </el-tag>
          </p>
          <el-progress
            :percentage="
              Math.min(
                Math.max((gameStore.resources.coordinateExposure / gameStore.resources.coordinateExposureMax) * 100, 0),
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
              content="当三体偏差值达到无限时这个世界会在受到不可抗力因素后毁灭"
              placement="top"
            >
              <el-icon><Warning /></el-icon>
            </el-tooltip>
          </h4>
          <p>{{ gameStore.tripleStarDeviation.toFixed(3) }}/∞</p>
          <el-progress
            :percentage="Math.min(Math.max((gameStore.tripleStarDeviation / 0.5) * 100, 0), 100)"
            :color="getDeviationColor"
            :show-text="false"
          />
        </div>
      </div>
    </el-card>
    <!-- 资源面板 -->
    <el-card class="resource-panel" shadow="never">
      <template #header>
        <div class="card-header">
          <span>资源系统</span>
        </div>
      </template>
      <div class="resource-grid">
        <div class="resource-item" v-for="(amount, resource) in resourcesData" :key="resource">
          <el-icon><Star /></el-icon>
          <span>{{ getResourceName(resource) }}: {{ formatNumber(gameStore.resources[resource]) }}</span>
        </div>
      </div>
    </el-card>
    <!-- 主要游戏区域 -->
    <div class="main-game-area">
      <!-- 建筑系统 -->
      <el-card class="building-panel" shadow="never">
        <template #header>
          <div class="card-header">
            <span>建筑系统({{ unlockedBuildings.length }}/{{ Object.entries(buildingsData).length }})</span>
          </div>
        </template>
        <div class="building-grid">
          <div
            v-for="[name, building] in unlockedBuildings"
            :key="name"
            class="building-item"
            :class="{ 'can-afford': gameStore.canAfford(building.cost, building) }"
          >
            <div class="building-info">
              <h4>{{ buildingsData[name].name }}</h4>
              <p v-if="buildingsData[name].description" class="building-description">
                {{ buildingsData[name].description }}
              </p>
            </div>
            <div class="building-upgrade">
              <p>建筑信息:</p>
              <div>数量: {{ formatNumber(building.count) }}</div>
              <div>等级: {{ formatNumber(building.level) }}</div>
            </div>
            <div class="building-upgrade" v-if="building.count">
              <p>产出信息:</p>
              <div v-for="(item, index) in gameStore.canResource(name)" :key="index">
                {{ getResourceName(item.res) }}：{{ item.val > 0 ? '+' : '' }} {{ formatNumber(item.val) }} / 天
              </div>
            </div>
            <div class="building-upgrade">
              <p>建造消耗:</p>
              <div
                v-for="(cost, resource) in gameStore.getDisplayCost(
                  buildingsData[name].cost,
                  building.count,
                  building.level
                )"
                :key="resource"
              >
                {{ getResourceName(resource) }}: {{ formatNumber(cost) }}
              </div>
            </div>
            <div class="building-upgrade" v-if="building.count">
              <p>升级消耗:</p>
              <div v-if="Object.keys(buildingsData[name].upgradeCost).length">
                <div
                  v-for="(cost, resource) in gameStore.getDisplayCost(
                    buildingsData[name].upgradeCost,
                    building.count,
                    building.level,
                    true
                  )"
                  :key="resource"
                >
                  {{ getResourceName(resource) }}: {{ formatNumber(cost) }}
                </div>
              </div>
              <div v-else>无升级消耗</div>
            </div>
            <el-button
              class="panelButton"
              type="primary"
              @click="gameStore.buildStructure(name)"
              :disabled="
                !gameStore.updateDisplayCost(buildingsData[name].upgradeCost, building.count, building.level, false)
              "
            >
              {{
                !gameStore.updateDisplayCost(buildingsData[name].upgradeCost, building.count, building.level, false)
                  ? '资源不足'
                  : '建造建筑'
              }}
            </el-button>
            <el-button
              class="panelButton"
              type="success"
              @click="gameStore.upgradeBuilding(name)"
              :disabled="
                !gameStore.updateDisplayCost(buildingsData[name].upgradeCost, building.count, building.level, true)
              "
            >
              {{
                !gameStore.updateDisplayCost(buildingsData[name].upgradeCost, building.count, building.level, true)
                  ? '资源不足'
                  : '升级建筑'
              }}
            </el-button>
          </div>
        </div>
      </el-card>
      <!-- 科技树 -->
      <el-card class="tech-panel" shadow="never">
        <template #header>
          <div class="card-header">
            <span>科技树({{ visibleTechnologies.length }}/{{ Object.entries(technologiesData).length }})</span>
          </div>
        </template>
        <div class="tech-grid">
          <div
            v-for="[name, tech] in visibleTechnologies"
            :key="name"
            class="tech-item"
            :class="{ unlocked: tech.unlocked, 'can-unlock': !tech.unlocked && gameStore.canUnlockTech(name) }"
          >
            <div class="tech-info">
              <h4>{{ technologiesData[name].group }}</h4>
              <p v-if="tech.unlocked">效率: {{ (tech.efficiency * 100).toFixed(1) }}%</p>
              <p v-else>状态: 未解锁</p>
              <p v-if="tech.prerequisites && tech.prerequisites.length && !tech.unlocked">
                前置科技: {{ tech.prerequisites.map(getTechName).join('、') }}
              </p>
              <p v-if="tech.unlocked">{{ technologiesData[name].effect }}</p>
            </div>
            <div class="tech-cost" v-if="!tech.unlocked">
              <p>解锁消耗:</p>
              <div v-for="(cost, resource) in technologiesData[name].cost" :key="resource">
                {{ getResourceName(resource) }}: {{ formatNumber(cost) }}
              </div>
            </div>
            <el-button
              v-if="!tech.unlocked"
              type="success"
              @click="gameStore.unlockTechnology(name)"
              :disabled="!gameStore.canUnlockTech(name) || !gameStore.canAfford(technologiesData[name].cost)"
              class="panelButton"
            >
              {{
                !gameStore.canUnlockTech(name) || !gameStore.canAfford(technologiesData[name].cost)
                  ? '资源不足'
                  : '解锁科技'
              }}
            </el-button>
          </div>
        </div>
      </el-card>
    </div>
    <!-- 帮助对话框 -->
    <el-dialog v-model="showHelp" title="熵减战争 - 游戏说明" width="80%" class="help-dialog">
      <div class="help-content">
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
          游戏的核心进度完全由“熵减阶段”推进决定。每当你手动完成一个熵减阶段，文明将进入新的时代，解锁新的科技和建筑。只有推进到下一个熵减阶段，才会解锁该阶段的科技和建筑内容。文明时代的变迁、资源体系的扩展、科技树的分支，全部与熵减阶段同步。熵减阶段的推进需要消耗资源，建议优先提升产出和效率，避免陷入资源瓶颈或死局。游戏目标是逐步完成所有熵减阶段，最终实现宇宙单一化，达到最低熵状态。
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
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
  import { useGameStore } from '@/stores/gameStore'
  import { ref, onBeforeUnmount, computed, onMounted, onUnmounted } from 'vue'
  import {
    Clock,
    Star,
    Sunny,
    VideoPlay,
    VideoPause,
    QuestionFilled,
    Refresh,
    Download,
    Upload,
    Position,
    ChatRound,
    Compass,
    Warning
  } from '@element-plus/icons-vue'
  import { ElMessage, ElMessageBox } from 'element-plus'
  import 'element-plus/es/components/message-box/style/css'
  import { saveAs } from 'file-saver'
  import buildingsData from '@/data/buildings'
  import technologiesData from '@/data/technologies'
  import resourcesData from '@/data/resources'
  import WorkerTimer from '@/plugins/worker-timer.js?worker'

  const gameStore = useGameStore()
  const gameRunning = ref(true)
  const showHelp = ref(false)
  const exposureCooldownTimer = ref(null)
  const worker = new WorkerTimer()

  // 格式化函数
  const formatNumber = num => {
    const absNum = Math.abs(num) // 取绝对值来做单位判断
    if (absNum < 1000) return num.toFixed(3)
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    const units = []
    for (let i = 0; i < 100; i++) {
      let symbol = ''
      let temp = i
      if (temp < 26) {
        symbol = alphabet[temp]
      } else {
        const first = Math.floor(temp / 26) - 1
        const second = temp % 26
        symbol = alphabet[first] + alphabet[second]
      }
      const value = Math.pow(1000, i + 1)
      units.unshift({ value, symbol })
    }
    for (let unit of units) {
      if (absNum >= unit.value) {
        const value = (num / unit.value).toFixed(2) // 保留符号
        return `${value}${unit.symbol}`
      }
    }
    return Math.floor(num).toString()
  }

  // 名称映射
  const getResourceName = resource => {
    const names = {
      knowledge: '知识',
      energy: '能量',
      matter: '物质',
      entropy: '熵值',
      darkMatter: '暗物质',
      antiMatter: '反物质',
      nanoMaterial: '纳米材料',
      quantumBits: '量子比特',
      bioOrder: '生物有序度',
      coordinateExposure: '坐标暴露值',
      coordinateExposureMax: '坐标暴露值上限',
      entropyReductionRate: '熵减速率'
    }
    return names[resource] || resource
  }

  const getTechName = tech => {
    const names = {
      atomicManipulation: '基础科技',
      thermalControl: '热控制',
      stellarEngineering: '恒星科技',
      blackholePhysics: '黑洞科技',
      energyConversion: '宇宙科技',
      universalTheory: '宇宙科技',
      quantumComputing: '高等科技',
      spacetimeManipulation: '宇宙科技',
      lowPotentialTrapTech: '分子冷却科技',
      quantumDecoherenceTech: '分子冷却科技',
      brownianCaptureTech: '分子冷却科技',
      stealthAlgorithm: '隐匿科技',
      darkMatterExtraction: '暗物质提取',
      antiMatterSynthesis: '反物质合成',
      nanoManufacturing: '纳米制造'
    }
    return names[tech] || tech
  }

  // 计算属性
  const unlockedBuildings = computed(() =>
    Object.entries(gameStore.buildings).filter(([name, building]) => {
      // 已解锁的始终显示
      if (building.unlocked) return true
      // 当前阶段可解锁的也显示
      if (building.entropyStage && building.entropyStage === gameStore.currentEntropyStage) return true
      // 支持建筑始终显示
      return ['quantumComputer', 'spacetimePortal'].includes(name)
    })
  )

  const visibleTechnologies = computed(() => {
    return Object.entries(gameStore.technologies).filter(([name, tech]) => {
      // 已解锁的始终显示
      if (tech.unlocked) return true
      // 当前阶段可解锁的也显示
      if (tech.entropyStage && tech.entropyStage === gameStore.currentEntropyStage) return true
      // 支持科技始终显示
      return ['quantumComputing', 'spacetimeManipulation'].includes(name)
    })
  })

  const getExposureColor = computed(() => {
    const { coordinateExposure, coordinateExposureMax } = gameStore.resources
    const percentage = (coordinateExposure / coordinateExposureMax) * 100
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
    if (gameRunning.value) startGameLoop()
    else stopGameLoop()
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
    ElMessageBox.confirm('你确定要删除数据吗?', '提示', {
      type: 'warning',
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
    startGameLoop()
    exposureCooldownTimer.value = setInterval(() => {
      if (gameStore.exposureCooldown > 0) {
        gameStore.exposureCooldown--
      }
    }, 1000)
    if (gameStore.tripleStarDeviation >= 100) {
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
  })
</script>

<style scoped>
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
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    margin-bottom: 20px;
  }

  .building-panel,
  .tech-panel {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
  }

  .building-grid,
  .tech-grid {
    display: grid;
    gap: 15px;
  }

  .building-item {
    display: flex;
    flex-direction: column;
    padding: 16px;
    border-radius: 12px;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    transition: all 0.3s ease;
  }

  .building-info {
    margin-bottom: 12px;
  }

  .building-info h4 {
    margin: 0;
    font-size: 1.1em;
    color: #4fc3f7;
  }

  .building-description {
    margin: 4px 0 0;
    font-size: 0.9em;
    color: #bbb;
    line-height: 1.4;
  }

  .building-upgrade {
    margin-top: 8px;
    font-size: 0.9em;
    color: #ccc;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
  }

  .building-upgrade > div {
    margin-bottom: 4px;
  }

  .building-actions {
    margin-top: auto;
    display: flex;
    justify-content: flex-end;
    gap: 8px;
  }

  .panelButton {
    margin-top: 5px;
    width: 100%;
  }

  .panelButton + .panelButton {
    margin-left: 0px;
  }

  .tech-item {
    padding: 16px;
    border-radius: 12px;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    transition: all 0.3s ease;
  }

  .tech-info h4 {
    margin: 0 0 4px;
    font-size: 1.1em;
    color: #4fc3f7;
  }

  .tech-info p {
    margin: 2px 0;
    font-size: 0.9em;
  }

  .tech-info .efficiency-badge {
    display: inline-block;
    padding: 2px 8px;
    background: rgba(64, 158, 255, 0.2);
    border-radius: 8px;
    color: #4fc3f7;
    font-weight: bold;
  }

  .tech-prerequisites {
    color: #888;
    font-size: 0.85em;
    margin-top: 4px;
  }

  .tech-cost {
    margin-top: 8px;
    font-size: 0.9em;
    color: #ccc;
  }

  .tech-actions {
    margin-top: 12px;
    text-align: right;
  }

  .can-afford,
  .tech-item.can-unlock {
    border-color: #67c23a;
    background: rgba(103, 194, 58, 0.1);
  }

  .tech-item.unlocked {
    border-color: #409eff;
    background: rgba(64, 158, 255, 0.1);
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
  }

  .card-header {
    font-weight: bold;
    color: #409eff;
  }

  @media (max-width: 768px) {
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
  }
</style>
