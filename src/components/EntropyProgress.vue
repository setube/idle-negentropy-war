<template>
  <el-card shadow="never">
    <template #header>
      <div class="card-header">
        <span>熵减进程</span>
      </div>
    </template>
    <!-- 当前阶段显示 -->
    <div class="current-stage">
      <h4>当前阶段: {{ currentData.name }}</h4>
      <p class="stage-description">{{ currentData.description }}</p>
    </div>
    <!-- 进度条 -->
    <div class="progress-container">
      <div class="progress-bar">
        <div class="progress-fill" :style="{ width: progressPercentage + '%' }"></div>
      </div>
      <div class="progress-text">
        {{ gameStore.formatNumber(currentProgress) }} / {{ gameStore.formatNumber(maxProgress) }} ({{
          progressPercentage.toFixed(1)
        }}%)
      </div>
    </div>
    <!-- 阶段效果 -->
    <div class="stage-effect">
      <strong>效果:</strong>
      {{ currentData.effect }}
    </div>
    <!-- 资源消耗 -->
    <div class="resource-cost">
      <strong>每次熵减消耗:</strong>
      <div class="cost-items">
        <span
          v-for="(amount, resource) in currentData.cost"
          :key="resource"
          :class="{ insufficient: !canAffordResource(resource, amount) }"
        >
          {{ resourcesData[resource].name }}: {{ gameStore.formatNumber(amount) }}
        </span>
      </div>
    </div>
    <!-- 熵减效率 -->
    <div class="efficiency-info">
      <strong>当前效率:</strong>
      {{ gameStore.formatNumber(currentEfficiency) }}x
      <div class="efficiency-breakdown">
        <div>基础效率: {{ gameStore.formatNumber(currentStage.efficiency) }}x</div>
        <div v-if="quantumBonus > 0">量子计算加成: +{{ gameStore.formatNumber(quantumBonus) }}x</div>
        <div v-if="spacetimeBonus > 0">时空操控加成: +{{ gameStore.formatNumber(spacetimeBonus) }}x</div>
        <div v-if="techBonus > 1">科技效率: {{ gameStore.formatNumber(techBonus) }}x</div>
      </div>
    </div>
    <!-- 手动熵减按钮 -->
    <el-button
      v-for="(item, index) in [1, 100, 1000]"
      :key="index"
      type="success"
      @click="gameStore.performEntropyReduction(item)"
      :disabled="!canPerformEntropyReductionBatch(item)"
      class="entropy-button"
    >
      {{ canPerformEntropyReductionBatch(item) ? `执行熵减 (×${item})` : '资源不足' }}
    </el-button>
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
              completed: stage.progress >= entropyReductionData[key].maxProgress,
              locked: !stage.unlocked
            }
          ]"
        >
          <div class="stage-header">
            <span class="stage-name">{{ entropyReductionData[key].name }}</span>
            <span class="stage-status">
              {{ getStageStatus(key) }}
            </span>
          </div>
          <div class="stage-progress">
            <div class="mini-progress">
              <div
                class="mini-fill"
                :style="{ width: (stage.progress / entropyReductionData[key].maxProgress) * 100 + '%' }"
              ></div>
            </div>
            <span class="mini-text">
              {{ gameStore.formatNumber(stage.progress) }} /
              {{ gameStore.formatNumber(entropyReductionData[key].maxProgress) }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </el-card>
</template>

<script setup>
  import { computed } from 'vue'
  import { useGameStore } from '@/stores/gameStore'
  import resourcesData from '@/data/resources'
  import entropyReductionData from '@/data/entropyReductions'

  const gameStore = useGameStore()

  // 当前熵减阶段
  const currentEntropyStage = computed(() => gameStore.currentEntropyStage)
  // 熵减进程数据
  const entropyReductionStages = computed(() => gameStore.entropyReductionStages)
  // 资源
  const resources = computed(() => gameStore.resources)
  // 当前熵减进程阶段数据
  const currentStage = computed(() => entropyReductionStages.value[currentEntropyStage.value])
  // 本地熵减进程阶段数据
  const currentData = computed(() => entropyReductionData[gameStore.currentEntropyStage])
  // 当前熵减阶段进度
  const currentProgress = computed(() => currentStage.value?.progress || 0)
  const maxProgress = computed(() => currentData.value?.maxProgress || 1)
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
    return gameStore.canAfford(currentData.value.cost)
  })

  // 检查单个资源是否足够
  const canAffordResource = (resource, amount) => {
    return resources.value[resource] >= amount
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

  // 检查是否可以批量熵减
  const canPerformEntropyReductionBatch = times => {
    const cost = currentData.value.cost
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
    border: none;
    border-radius: 6px;
    font-size: 16px;
    cursor: pointer;
    transition: all 0.3s ease;
    margin: 20px 0;
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
