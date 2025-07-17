<template>
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
          <div>数量: {{ gameStore.formatNumber(building.count) }}</div>
          <div>等级: {{ gameStore.formatNumber(building.level) }}</div>
        </div>
        <div class="building-upgrade" v-if="building.count">
          <p>产出信息:</p>
          <div v-for="(item, index) in gameStore.canResource(name)" :key="index">
            {{ resourcesData[item.res].name }}：{{ item.val > 0 ? '+' : '' }} {{ gameStore.formatNumber(item.val) }} /
            天
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
            {{ resourcesData[resource].name }}: {{ gameStore.formatNumber(cost) }}
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
              {{ resourcesData[resource].name }}: {{ gameStore.formatNumber(cost) }}
            </div>
          </div>
          <div v-else>无升级消耗</div>
        </div>
        <el-button
          class="panelButton"
          type="primary"
          @click="gameStore.buildStructure(name)"
          :disabled="!gameStore.updateDisplayCost(buildingsData[name].cost, building.count, building.level, false)"
        >
          {{
            !gameStore.updateDisplayCost(buildingsData[name].cost, building.count, building.level, false)
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
</template>

<script setup>
  import { computed } from 'vue'
  import { useGameStore } from '@/stores/gameStore'
  import buildingsData from '@/data/buildings'
  import resourcesData from '@/data/resources'

  const gameStore = useGameStore()

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
</script>

<style scoped>
  .building-panel {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
  }

  .building-grid {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
  }

  .building-item {
    display: flex;
    flex-direction: column;
    padding: 16px;
    border-radius: 12px;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    transition: all 0.3s ease;
    width: calc(33% - 20px);
    margin-right: 10px;
    margin-top: 10px;
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

  @media (max-width: 768px) {
    .building-item {
      width: 100%;
      margin-right: 0;
    }
  }
</style>
