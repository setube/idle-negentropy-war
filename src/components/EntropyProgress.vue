<template>
  <div class="entropy-progress">
    <h3>熵减进程</h3>
    <!-- 当前阶段显示 -->
    <div class="current-stage">
      <h4>当前阶段: {{ currentStageName }}</h4>
      <p class="stage-description">{{ currentStageDescription }}</p>
    </div>
    <!-- 进度条 -->
    <div class="progress-container">
      <div class="progress-bar">
        <div class="progress-fill" :style="{ width: progressPercentage + '%' }"></div>
      </div>
      <div class="progress-text">
        {{ currentProgress.toFixed(1) }} / {{ maxProgress }} ({{ progressPercentage.toFixed(1) }}%)
      </div>
    </div>
    <!-- 阶段效果 -->
    <div class="stage-effect">
      <strong>效果:</strong>
      {{ currentStageEffect }}
    </div>
    <!-- 资源消耗 -->
    <div class="resource-cost">
      <strong>每次熵减消耗:</strong>
      <div class="cost-items">
        <span
          v-for="(amount, resource) in currentStageCost"
          :key="resource"
          :class="{ insufficient: !canAffordResource(resource, amount) }"
        >
          {{ formatResource(resource) }}: {{ formatNumber(amount) }}
        </span>
      </div>
    </div>
    <!-- 熵减效率 -->
    <div class="efficiency-info">
      <strong>当前效率:</strong>
      {{ formatNumber(currentEfficiency) }}x
      <div class="efficiency-breakdown">
        <div>基础效率: {{ formatNumber(currentStage.efficiency) }}x</div>
        <div v-if="quantumBonus > 0">量子计算加成: +{{ formatNumber(quantumBonus) }}x</div>
        <div v-if="spacetimeBonus > 0">时空操控加成: +{{ formatNumber(spacetimeBonus) }}x</div>
        <div v-if="techBonus > 1">科技效率: {{ formatNumber(techBonus) }}x</div>
      </div>
    </div>
    <!-- 手动熵减按钮 -->
    <button @click="performManualEntropyReduction(1)" :disabled="!canPerformEntropyReduction" class="entropy-button">
      执行熵减 (×1)
    </button>
    <button
      @click="performManualEntropyReduction(100)"
      :disabled="!canPerformEntropyReductionBatch(100)"
      class="entropy-button"
    >
      执行熵减 (×100)
    </button>
    <button
      @click="performManualEntropyReduction(1000)"
      :disabled="!canPerformEntropyReductionBatch(1000)"
      class="entropy-button"
    >
      执行熵减 (×1000)
    </button>
    <!-- 所有阶段概览 -->
    <div class="all-stages">
      <h4>熵减阶段</h4>
      <div class="stage-list">
        <div
          v-for="(stage, key) in entropyReductionStages"
          :key="key"
          :class="[
            'stage-item',
            {
              current: key === currentEntropyStage,
              completed: stage.progress >= stage.maxProgress,
              locked: !stage.unlocked
            }
          ]"
        >
          <div class="stage-header">
            <span class="stage-name">{{ stage.name }}</span>
            <span class="stage-status">
              {{ getStageStatus(key) }}
            </span>
          </div>
          <div class="stage-progress">
            <div class="mini-progress">
              <div class="mini-fill" :style="{ width: (stage.progress / stage.maxProgress) * 100 + '%' }"></div>
            </div>
            <span class="mini-text">{{ formatNumber(stage.progress) }} / {{ formatNumber(stage.maxProgress) }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { computed } from 'vue'
  import { useGameStore } from '@/stores/gameStore'

  const gameStore = useGameStore()

  // 计算属性
  const currentEntropyStage = computed(() => gameStore.currentEntropyStage)
  const entropyReductionStages = computed(() => gameStore.entropyReductionStages)
  const resources = computed(() => gameStore.resources)

  const currentStage = computed(() => entropyReductionStages.value[currentEntropyStage.value])
  const currentStageName = computed(() => currentStage.value?.name || '未知阶段')
  const currentStageDescription = computed(() => currentStage.value?.description || '')
  const currentStageEffect = computed(() => currentStage.value?.effect || '')
  const currentStageCost = computed(() => currentStage.value?.cost || {})
  const currentProgress = computed(() => currentStage.value?.progress || 0)
  const maxProgress = computed(() => currentStage.value?.maxProgress || 1)
  const progressPercentage = computed(() => (currentProgress.value / maxProgress.value) * 100)

  // 效率计算
  const currentEfficiency = computed(() => gameStore.getEntropyReductionBonus())
  const quantumBonus = computed(() => {
    const quantumComputer = gameStore.buildings.quantumComputer
    return quantumComputer.count > 0 ? quantumComputer.count * quantumComputer.level * 0.1 : 0
  })
  const spacetimeBonus = computed(() => {
    const spacetimePortal = gameStore.buildings.spacetimePortal
    return spacetimePortal.count > 0 ? spacetimePortal.count * spacetimePortal.level * 0.2 : 0
  })
  const techBonus = computed(() => {
    const currentTech = gameStore.getCurrentStageTech()
    return currentTech?.efficiency || 1
  })

  // 检查是否可以执行熵减
  const canPerformEntropyReduction = computed(() => {
    if (!currentStage.value || !currentStage.value.unlocked) return false
    return gameStore.canAfford(currentStageCost.value)
  })

  // 检查单个资源是否足够
  const canAffordResource = (resource, amount) => {
    return resources.value[resource] >= amount
  }

  // 格式化数字
  const formatNumber = num => {
    if (num < 1000) return Math.floor(num).toString()
    // 26位字母单位系统
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    const units = []
    // 生成单位：A=1e3, B=1e6, C=1e9, ..., Z=1e78, AA=1e81, AB=1e84...
    for (let i = 0; i < 100; i++) {
      // 支持到100个单位
      let symbol = ''
      let temp = i
      if (temp < 26) {
        symbol = alphabet[temp]
      } else {
        // 双字母单位：AA, AB, AC...
        const first = Math.floor(temp / 26) - 1
        const second = temp % 26
        symbol = alphabet[first] + alphabet[second]
      }
      const value = Math.pow(1000, i + 1)
      units.unshift({ value, symbol })
    }
    for (let unit of units) {
      if (num >= unit.value) {
        const value = (num / unit.value).toFixed(2)
        return `${value}${unit.symbol}`
      }
    }
    return Math.floor(num).toString()
  }

  // 格式化资源名称
  const formatResource = resource => {
    const resourceNames = {
      energy: '能量',
      matter: '物质',
      darkMatter: '暗物质',
      antiMatter: '反物质',
      nanoMaterial: '纳米材料',
      quantumBits: '量子比特'
    }
    return resourceNames[resource] || resource
  }

  // 获取阶段状态
  const getStageStatus = stageKey => {
    const stage = entropyReductionStages.value[stageKey]
    if (!stage) return '未知'
    if (stageKey === currentEntropyStage.value) return '进行中'
    if (stage.progress >= stage.maxProgress) return '已完成'
    if (!stage.unlocked) return '未解锁'
    return '已解锁'
  }

  // 手动执行熵减
  const performManualEntropyReduction = (times = 1) => {
    gameStore.performEntropyReduction(times)
  }

  // 检查是否可以批量熵减
  const canPerformEntropyReductionBatch = times => {
    const cost = currentStageCost.value
    return Object.entries(cost).every(([resource, amount]) => resources.value[resource] >= amount * times)
  }
</script>

<style scoped>
  .entropy-progress {
    background: rgba(0, 0, 0, 0.8);
    border: 1px solid #444;
    border-radius: 8px;
    padding: 20px;
    margin: 20px 0;
    color: #fff;
  }

  .current-stage {
    margin-bottom: 20px;
  }

  .current-stage h4 {
    color: #4caf50;
    margin: 0 0 10px 0;
  }

  .stage-description {
    color: #ccc;
    font-style: italic;
    margin: 0;
  }

  .progress-container {
    margin: 20px 0;
  }

  .progress-bar {
    width: 100%;
    height: 20px;
    background: #333;
    border-radius: 10px;
    overflow: hidden;
    margin-bottom: 10px;
  }

  .progress-fill {
    height: 100%;
    background: linear-gradient(90deg, #4caf50, #8bc34a);
    transition: width 0.3s ease;
  }

  .progress-text {
    text-align: center;
    color: #ccc;
    font-size: 14px;
  }

  .stage-effect {
    margin: 15px 0;
    padding: 10px;
    background: rgba(76, 175, 80, 0.1);
    border-left: 3px solid #4caf50;
  }

  .resource-cost {
    margin: 15px 0;
  }

  .cost-items {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-top: 5px;
  }

  .cost-items span {
    padding: 5px 10px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 4px;
    font-size: 12px;
  }

  .cost-items span.insufficient {
    background: rgba(244, 67, 54, 0.3);
    color: #ff6b6b;
  }

  .efficiency-info {
    margin: 15px 0;
    padding: 10px;
    background: rgba(33, 150, 243, 0.1);
    border-left: 3px solid #2196f3;
  }

  .efficiency-breakdown {
    margin-top: 10px;
    font-size: 12px;
    color: #ccc;
  }

  .efficiency-breakdown > div {
    margin: 2px 0;
  }

  .entropy-button {
    width: 100%;
    padding: 12px;
    background: linear-gradient(45deg, #4caf50, #8bc34a);
    color: white;
    border: none;
    border-radius: 6px;
    font-size: 16px;
    cursor: pointer;
    transition: all 0.3s ease;
    margin: 20px 0;
  }

  .entropy-button:hover:not(:disabled) {
    background: linear-gradient(45deg, #45a049, #7cb342);
    transform: translateY(-2px);
  }

  .entropy-button:disabled {
    background: #666;
    cursor: not-allowed;
    opacity: 0.6;
  }

  .all-stages {
    margin-top: 30px;
  }

  .all-stages h4 {
    color: #2196f3;
    margin-bottom: 15px;
  }

  .stage-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .stage-item {
    padding: 10px;
    border: 1px solid #444;
    border-radius: 6px;
    background: rgba(255, 255, 255, 0.05);
  }

  .stage-item.current {
    border-color: #4caf50;
    background: rgba(76, 175, 80, 0.1);
  }

  .stage-item.completed {
    border-color: #2196f3;
    background: rgba(33, 150, 243, 0.1);
  }

  .stage-item.locked {
    opacity: 0.5;
    border-color: #666;
  }

  .stage-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
  }

  .stage-name {
    font-weight: bold;
    color: #fff;
  }

  .stage-status {
    font-size: 12px;
    padding: 2px 8px;
    border-radius: 12px;
    background: #333;
  }

  .stage-item.current .stage-status {
    background: #4caf50;
  }

  .stage-item.completed .stage-status {
    background: #2196f3;
  }

  .stage-progress {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .mini-progress {
    flex: 1;
    height: 8px;
    background: #333;
    border-radius: 4px;
    overflow: hidden;
  }

  .mini-fill {
    height: 100%;
    background: linear-gradient(90deg, #4caf50, #8bc34a);
    transition: width 0.3s ease;
  }

  .mini-text {
    font-size: 12px;
    color: #ccc;
    min-width: 80px;
    text-align: right;
  }
</style>
