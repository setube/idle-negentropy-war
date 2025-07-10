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
          <span>时间: {{ formatTime(gameStore.gameTime) }}</span>
        </div>
        <div class="status-item">
          <el-icon><Star /></el-icon>
          <span>文明等级: {{ gameStore.civilizationLevel }}</span>
        </div>
        <div class="status-item">
          <el-icon><TrendCharts /></el-icon>
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
    <!-- 资源面板 -->
    <el-card class="resource-panel" shadow="never">
      <template #header>
        <div class="card-header">
          <span>资源系统</span>
        </div>
      </template>
      <div class="resource-grid">
        <div class="resource-item" v-for="(amount, resource) in gameStore.resources" :key="resource">
          <el-icon><Coin /></el-icon>
          <span>{{ getResourceName(resource) }}: {{ formatNumber(amount) }}</span>
        </div>
      </div>
    </el-card>
    <!-- 主要游戏区域 -->
    <div class="main-game-area">
      <!-- 建筑系统 -->
      <el-card class="building-panel" shadow="never">
        <template #header>
          <div class="card-header">
            <span>建筑系统</span>
          </div>
        </template>
        <div class="building-grid">
          <div
            v-for="[name, building] in unlockedBuildings"
            :key="name"
            class="building-item"
            :class="{ 'can-afford': gameStore.canAfford(building.cost) }"
          >
            <div class="building-info">
              <h4>{{ getBuildingName(name) }}</h4>
              <p v-if="building.description" class="building-description">{{ building.description }}</p>
              <p>数量: {{ building.count }}</p>
              <p>等级: {{ building.level }}</p>
            </div>
            <div class="building-cost">
              <p>成本:</p>
              <div v-for="(cost, resource) in building.cost" :key="resource">
                {{ getResourceName(resource) }}: {{ formatNumber(cost) }}
              </div>
            </div>
            <div class="building-upgrade" v-if="building.count">
              <p>升级消耗:</p>
              <div v-for="(cost, resource) in building.upgradeCost" :key="resource">
                {{ getResourceName(resource) }}: {{ formatNumber(cost) }}
              </div>
            </div>
            <el-button
              v-if="building.count"
              type="success"
              @click="gameStore.upgradeBuilding(name)"
              :disabled="!gameStore.canAfford(building.upgradeCost)"
            >
              升级
            </el-button>
            <el-button
              type="primary"
              @click="gameStore.buildStructure(name)"
              :disabled="!gameStore.canAfford(building.cost)"
            >
              建造
            </el-button>
          </div>
        </div>
      </el-card>
      <!-- 科技树 -->
      <el-card class="tech-panel" shadow="never">
        <template #header>
          <div class="card-header">
            <span>科技树</span>
          </div>
        </template>
        <div class="tech-grid">
          <div
            v-for="[name, tech] in visibleTechnologies"
            :key="name"
            class="tech-item"
            :class="{ unlocked: tech.unlocked, 'can-unlock': !tech.unlocked && canUnlockTech(name) }"
          >
            <div class="tech-info">
              <h4>{{ getTechName(name) }}</h4>
              <p v-if="tech.unlocked">效率: {{ (tech.efficiency * 100).toFixed(1) }}%</p>
              <p v-else>状态: 未解锁</p>
              <p v-if="tech.prerequisites && tech.prerequisites.length">
                前置科技: {{ tech.prerequisites.map(getTechName).join('、') }}
              </p>
            </div>
            <div class="tech-cost" v-if="!tech.unlocked">
              <p>解锁成本:</p>
              <div v-for="(cost, resource) in getTechCost(name)" :key="resource">
                {{ getResourceName(resource) }}: {{ formatNumber(cost) }}
              </div>
            </div>
            <el-button
              v-if="!tech.unlocked"
              type="success"
              @click="gameStore.unlockTechnology(name)"
              :disabled="!canUnlockTech(name) || !gameStore.canAfford(getTechCost(name))"
            >
              解锁
            </el-button>
          </div>
        </div>
      </el-card>
    </div>
    <!-- 宇宙监控面板 -->
    <el-card class="universe-panel" shadow="never">
      <template #header>
        <div class="card-header">
          <span>宇宙监控</span>
        </div>
      </template>
      <div class="universe-grid">
        <div class="universe-item">
          <h4>坐标暴露值</h4>
          <p>
            {{ formatNumber(gameStore.coordinateExposure) }}
            <el-tag v-if="gameStore.exposureCooldown > 0" type="success" effect="dark" style="margin-left: 8px">
              安全期：{{ gameStore.exposureCooldown }}s
            </el-tag>
          </p>
          <el-progress
            :percentage="
              Math.min(Math.max((gameStore.coordinateExposure / gameStore.concealmentAbility) * 100, 0), 100)
            "
            :color="getExposureColor"
            :show-text="false"
          />
        </div>
        <div class="universe-item">
          <h4>三体偏差值</h4>
          <p>{{ gameStore.tripleStarDeviation.toFixed(3) }}</p>
          <el-progress
            e
            :percentage="Math.min(Math.max((gameStore.tripleStarDeviation / 0.5) * 100, 0), 100)"
            :color="getDeviationColor"
            :show-text="false"
          />
        </div>
        <div class="universe-item">
          <h4>文明基因库</h4>
          <p>保存数量: {{ gameStore.resources.civilizationGenes }}</p>
          <el-button
            type="warning"
            @click="gameStore.saveCivilizationGenes"
            :disabled="gameStore.resources.energy < 1000 || gameStore.resources.knowledge < 100"
          >
            保存文明基因 (消耗: 1000能量 + 100知识)
          </el-button>
        </div>
      </div>
    </el-card>
    <el-dialog
      v-model="showBranchDialog"
      :title="`选择${currentEraName}分支`"
      width="400px"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :show-close="false"
    >
      <div v-if="currentEraBranches">
        <el-row :gutter="16">
          <el-col :span="24" v-for="branch in currentEraBranches" :key="branch.key" style="margin-bottom: 12px">
            <el-card shadow="hover">
              <div style="display: flex; flex-direction: column; align-items: flex-start">
                <div style="font-weight: bold; font-size: 18px">{{ branch.name }}</div>
                <div style="margin: 8px 0 12px 0; color: #888">{{ branch.desc }}</div>
                <el-button type="primary" size="small" @click="chooseBranch(branch.key)">选择该分支</el-button>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </div>
    </el-dialog>
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
  import { useGameStore } from '../stores/gameStore'
  import { ref, watch, computed, onMounted, onUnmounted } from 'vue'
  import {
    Clock,
    Star,
    TrendCharts,
    Sunny,
    Coin,
    VideoPlay,
    VideoPause,
    QuestionFilled,
    Refresh,
    Download,
    Upload,
    Position,
    ChatRound
  } from '@element-plus/icons-vue'
  import { ElMessage, ElMessageBox } from 'element-plus'
  import 'element-plus/es/components/message-box/style/css'
  import { saveAs } from 'file-saver'

  const gameStore = useGameStore()
  const gameRunning = ref(true)
  const gameInterval = ref(null)
  const showHelp = ref(false)
  const exposureCooldownTimer = ref(null)

  // 游戏循环
  const startGameLoop = () => {
    gameInterval.value = setInterval(() => {
      if (gameRunning.value) {
        gameStore.updateGame()
      }
    }, 1000) // 每秒更新一次
  }

  // 停止游戏循环
  const stopGameLoop = () => {
    if (gameInterval.value) {
      clearInterval(gameInterval.value)
      gameInterval.value = null
    }
  }

  // 切换游戏状态
  const toggleGame = () => {
    gameRunning.value = !gameRunning.value
    if (gameRunning.value) {
      startGameLoop()
    } else {
      stopGameLoop()
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

  // 格式化函数
  const formatNumber = num => {
    if (typeof num !== 'number' || isNaN(num)) return '0'
    if (num >= 1e6) return (num / 1e6).toFixed(1) + 'M'
    if (num >= 1e3) return (num / 1e3).toFixed(1) + 'K'
    return num.toFixed(1)
  }

  const formatTime = seconds => {
    const days = Math.floor(seconds / 86400)
    const hours = Math.floor((seconds % 86400) / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${days}天${hours}时${minutes}分${secs}秒`
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
      civilizationGenes: '文明基因'
    }
    return names[resource] || resource
  }

  const getBuildingName = building => {
    const names = {
      atomicSorter: '原子排序器',
      molecularCooler: '分子冷却器',
      stellarExtinguisher: '恒星熄灭器',
      blackholeDecompressor: '黑洞解压器',
      energyMaterializer: '能量物质化器',
      universalUnifier: '宇宙单一化器',
      quantumComputer: '量子计算机',
      spacetimePortal: '时空传送门',
      lowPotentialTrap: '低势能陷阱',
      quantumDecoherenceSuppressor: '量子退相干抑制器',
      brownianCaptureNet: '布朗运动捕获网',
      stealthGenerator: '隐匿发生器'
    }
    return names[building] || building
  }

  const getTechName = tech => {
    const names = {
      atomicManipulation: '原子操控',
      thermalControl: '热控制',
      stellarEngineering: '恒星工程',
      blackholePhysics: '黑洞物理',
      energyConversion: '能量转换',
      universalTheory: '宇宙理论',
      quantumComputing: '量子计算',
      spacetimeManipulation: '时空操控',
      lowPotentialTrapTech: '低势能陷阱技术',
      quantumDecoherenceTech: '量子退相干技术',
      brownianCaptureTech: '布朗运动捕获技术',
      stealthAlgorithm: '隐匿算法'
    }
    return names[tech] || tech
  }

  const getTechCost = techName => {
    const costs = {
      atomicManipulation: { energy: 10, matter: 5 },
      thermalControl: { energy: 50, matter: 20 },
      stellarEngineering: { energy: 200, matter: 100, knowledge: 50 },
      blackholePhysics: { energy: 1000, matter: 500, knowledge: 200, darkMatter: 10 },
      energyConversion: { energy: 5000, matter: 2000, knowledge: 1000, darkMatter: 100 },
      universalTheory: { energy: 20000, matter: 10000, knowledge: 5000, darkMatter: 500, antiMatter: 100 },
      quantumComputing: { energy: 100, matter: 50, knowledge: 20 },
      spacetimeManipulation: { energy: 2000, matter: 1000, knowledge: 500, darkMatter: 50 },
      lowPotentialTrapTech: { energy: 500, matter: 200, knowledge: 100 },
      quantumDecoherenceTech: { energy: 1000, matter: 500, knowledge: 200 },
      brownianCaptureTech: { energy: 2000, matter: 1000, knowledge: 500 },
      stealthAlgorithm: { energy: 5000, matter: 2000, knowledge: 1000 }
    }
    return costs[techName] || {}
  }

  // 判断科技是否可解锁
  const canUnlockTech = name => {
    const tech = gameStore.technologies[name]
    if (tech.unlocked) return false
    if (!tech.prerequisites || tech.prerequisites.length === 0) return true
    return tech.prerequisites.every(prereq => gameStore.technologies[prereq].unlocked)
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
    const percentage = (gameStore.coordinateExposure / gameStore.concealmentAbility) * 100
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

  const showBranchDialog = ref(false)
  const currentEra = computed(() => gameStore.currentEra)
  const currentEraName = computed(() => {
    const era = gameStore.eras.find(e => e.key === gameStore.currentEra)
    return era ? era.name : ''
  })
  const currentEraBranches = computed(() => gameStore.eraBranches[gameStore.currentEra] || null)

  watch(
    () => gameStore.branchChoiceRequired,
    val => {
      if (val) showBranchDialog.value = true
    },
    { immediate: true }
  )

  const chooseBranch = branchKey => {
    // 只允许选择一次
    if (!gameStore.selectedBranch[gameStore.currentEra]) {
      gameStore.selectedBranch[gameStore.currentEra] = branchKey
      showBranchDialog.value = false
    }
  }

  // 组件挂载时启动游戏
  onMounted(() => {
    startGameLoop()
    exposureCooldownTimer.value = setInterval(() => {
      if (gameStore.exposureCooldown > 0) {
        gameStore.exposureCooldown--
      }
    }, 1000)
  })
  // 组件卸载时清理
  onUnmounted(() => {
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

  .building-item,
  .tech-item {
    padding: 15px;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 8px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    transition: all 0.3s ease;
  }

  .building-description {
    color: #ccc;
    font-style: italic;
    font-size: 12px;
    margin: 5px 0;
  }

  .building-item.can-afford,
  .tech-item.can-unlock {
    border-color: #67c23a;
    background: rgba(103, 194, 58, 0.1);
  }

  .tech-item.unlocked {
    border-color: #409eff;
    background: rgba(64, 158, 255, 0.1);
  }

  .building-info,
  .tech-info {
    margin-bottom: 10px;
  }

  .building-info h4,
  .tech-info h4 {
    margin: 0 0 8px 0;
    color: #409eff;
  }

  .building-cost,
  .tech-cost {
    margin-bottom: 10px;
    font-size: 0.9em;
    color: #a0a0a0;
  }

  .building-upgrade {
    margin: 10px 0;
    padding-top: 10px;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
  }

  .building-upgrade p {
    margin-bottom: 5px;
    font-size: 0.9em;
    color: #a0a0a0;
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
