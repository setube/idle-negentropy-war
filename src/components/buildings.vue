<template>
  <!-- 建筑系统 -->
  <el-card class="building-panel" shadow="never">
    <template #header>
      <div class="card-header">
        <span>建筑系统({{ unlockedBuildings.length }}/{{ Object.entries(buildingsData).length }})</span>
      </div>
    </template>
    <div class="building-grid">
      <el-alert title="后续建筑可以通过科技系统解锁" type="primary" v-if="unlockedBuildings.length === 1" />
      <div
        v-for="[name, building] in unlockedBuildings"
        :key="name"
        :class="[
          'building-item',
          {
            'can-afford':
              gameStore.updateDisplayCost(buildingsData[name].cost, building.count, building.level, false) ||
              gameStore.updateDisplayCost(buildingsData[name].upgradeCost, building.count, building.level, true)
          }
        ]"
      >
        <div class="building-info">
          <el-tooltip effect="dark" placement="top">
            <h4 @click="building.add = !building.add">
              {{ buildingsData[name].name }}
              <el-icon>
                <MinusOutlined v-if="building.add" />
                <AddOutlined v-else />
              </el-icon>
            </h4>
            <template #content>
              <div class="tooltip" v-if="building.count">
                <p>产出信息</p>
                <div v-for="(item, index) in gameStore.canResource(name)" :key="index">
                  {{ resourcesData[item.res]?.name }}：{{ item.val > 0 ? '+' : '' }}
                  {{ gameStore.formatNumber(item.val) }} / 天
                </div>
                <div>数量：{{ gameStore.formatNumber(building.count) }}</div>
                <div>等级：{{ gameStore.formatNumber(building.level) }}</div>
              </div>
              <div class="tooltip" v-else>
                <p>建造消耗</p>
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
            </template>
          </el-tooltip>
        </div>
        <div :style="{ display: !building.add ? 'none' : '' }">
          <div class="building-upgrade">
            <p>建筑信息:</p>
            <div>数量: {{ gameStore.formatNumber(building.count) }}</div>
            <div>等级: {{ gameStore.formatNumber(building.level) }}</div>
          </div>
          <div class="building-upgrade" v-if="building.count">
            <p>产出信息:</p>
            <div v-for="(item, index) in gameStore.canResource(name)" :key="index">
              {{ resourcesData[item.res]?.name }}：{{ item.val > 0 ? '+' : '' }}
              {{ gameStore.formatNumber(item.val) }} / 天
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
              {{ resourcesData[resource].name }}:
              <span :style="gameStore.resources[resource] < cost ? 'color: #f56c6c' : 'color: #67c23a'">
                {{ gameStore.formatNumber(cost) }}
              </span>
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
                {{ resourcesData[resource].name }}:
                <span :style="gameStore.resources[resource] < cost ? 'color: #f56c6c' : 'color: #67c23a'">
                  {{ gameStore.formatNumber(cost) }}
                </span>
              </div>
            </div>
            <div v-else>无升级消耗</div>
          </div>
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
  import { computed, onMounted } from 'vue'
  import { useGameStore } from '@/stores/gameStore'
  import buildingsData from '@/data/buildings'
  import resourcesData from '@/data/resources'
  import { AddOutlined, MinusOutlined } from '@vicons/material'

  const gameStore = useGameStore()

  // 自动解锁到当前熵减阶段为止的所有建筑
  const unlockBuilding = () => {
    const stageOrder = gameStore.stageOrder
    const idx = stageOrder.indexOf(gameStore.currentEntropyStage)
    if (idx === -1) return
    for (let i = 0; i <= idx; i++) {
      Object.keys(buildingsData).forEach(key => {
        if (buildingsData[key].entropyStage === stageOrder[i] && !gameStore.buildings[key].unlocked) {
          gameStore.buildings[key].unlocked = true
        }
      })
    }
  }

  // 计算属性
  const unlockedBuildings = computed(() =>
    Object.entries(gameStore.buildings).filter(([name, building]) => building.unlocked)
  )

  onMounted(unlockBuilding)
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

  .can-afford {
    border-color: #67c23a;
    background: rgba(103, 194, 58, 0.1);
  }

  .tooltip p {
    margin: 0;
    text-align: center;
  }

  @media (max-width: 768px) {
    .building-item {
      width: 100%;
      margin-right: 0;
    }
  }
</style>
