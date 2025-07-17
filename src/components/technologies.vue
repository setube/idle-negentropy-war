<template>
  <!-- 科技树 -->
  <el-card class="tech-panel" shadow="never">
    <template #header>
      <div class="card-header">
        <span>科技系统({{ visibleTechnologies.length }}/{{ Object.entries(technologiesData).length }})</span>
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
            {{ resourcesData[resource].name }}: {{ formatNumber(cost) }}
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
</template>

<script setup>
  import { ref, onBeforeUnmount, computed, onMounted, onUnmounted } from 'vue'
  import { useGameStore } from '@/stores/gameStore'
  import resourcesData from '@/data/resources'
  import technologiesData from '@/data/technologies'

  const gameStore = useGameStore()

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
</script>

<style scoped>
  .tech-panel {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
  }

  .tech-grid {
    display: grid;
    gap: 15px;
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
  
  .panelButton {
    margin-top: 5px;
    width: 100%;
  }
</style>
