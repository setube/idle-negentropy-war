<template>
  <el-card class="gm-panel" shadow="never">
    <template #header>
      <div class="card-header">
        <span>GM万能面板（开发/测试专用）</span>
      </div>
    </template>
    <el-button-group>
      <el-button size="small" type="success" @click="maxAllResources">一键资源最大</el-button>
      <el-button size="small" type="warning" @click="unlockAllTech">全量解锁科技</el-button>
      <el-button size="small" type="primary" @click="unlockAllBuildings">全量解锁建筑</el-button>
      <el-button size="small" type="danger" @click="unlockAllStages">全量解锁熵减阶段</el-button>
      <el-button size="small" type="info" @click="resetAll">清空所有（重置）</el-button>
    </el-button-group>
    <el-tabs v-model="activeTab">
      <el-tab-pane label="资源" name="res">
        <el-table :data="resourceList" size="small" style="width: 100%">
          <el-table-column prop="name" label="资源" width="120" />
          <el-table-column label="数量">
            <template #default="{ row }">
              <el-input-number v-model="gameStore.resources[row.key]" :min="0" :max="1e18" :step="1" size="small" />
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="建筑" name="building">
        <el-table :data="buildingList" size="small" style="width: 100%">
          <el-table-column prop="name" label="建筑" width="120" />
          <el-table-column label="数量">
            <template #default="{ row }">
              <el-input-number
                v-model="gameStore.buildings[row.key].count"
                :min="0"
                :max="1e6"
                :step="1"
                size="small"
              />
            </template>
          </el-table-column>
          <el-table-column label="等级">
            <template #default="{ row }">
              <el-input-number
                v-model="gameStore.buildings[row.key].level"
                :min="1"
                :max="1e6"
                :step="1"
                size="small"
              />
            </template>
          </el-table-column>
          <el-table-column label="解锁">
            <template #default="{ row }">
              <el-switch v-model="gameStore.buildings[row.key].unlocked" />
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="科技" name="tech">
        <el-table :data="techList" size="small" style="width: 100%">
          <el-table-column prop="name" label="科技" width="120" />
          <el-table-column label="解锁">
            <template #default="{ row }">
              <el-switch v-model="gameStore.technologies[row.key].unlocked" />
            </template>
          </el-table-column>
          <el-table-column label="效率">
            <template #default="{ row }">
              <el-input-number
                v-model="gameStore.technologies[row.key].efficiency"
                :min="0.1"
                :max="100"
                :step="0.1"
                size="small"
              />
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
      <el-tab-pane label="熵减阶段" name="stage">
        <el-table :data="stageList" size="small" style="width: 100%">
          <el-table-column prop="name" label="阶段" width="120" />
          <el-table-column label="解锁">
            <template #default="{ row }">
              <el-switch v-model="gameStore.entropyReductionStages[row.key].unlocked" />
            </template>
          </el-table-column>
          <el-table-column label="进度">
            <template #default="{ row }">
              <el-input-number
                v-model="gameStore.entropyReductionStages[row.key].progress"
                :min="0"
                :max="gameStore.entropyReductionStages[row.key].maxProgress || 1e9"
                :step="1"
                size="small"
              />
            </template>
          </el-table-column>
        </el-table>
      </el-tab-pane>
    </el-tabs>
  </el-card>
</template>

<script setup>
  import { ref } from 'vue'
  import { useGameStore } from '@/stores/gameStore'
  import resourcesData from '@/data/resources'
  import buildingsData from '@/data/buildings'
  import technologiesData from '@/data/technologies'
  import entropyReductionsData from '@/data/entropyReductions'

  const gameStore = useGameStore()
  const activeTab = ref('res')

  const resourceList = Object.entries(resourcesData).map(([key, val]) => ({ key, name: val.name }))
  const buildingList = Object.entries(buildingsData).map(([key, val]) => ({ key, name: val.name }))
  const techList = Object.entries(technologiesData).map(([key, val]) => ({ key, name: val.group || key }))
  const stageList = Object.entries(entropyReductionsData).map(([key, val]) => ({ key, name: val.name }))

  const maxAllResources = () => {
    resourceList.forEach(r => {
      gameStore.resources[r.key] = 1e18
    })
  }

  const unlockAllTech = () => {
    techList.forEach(t => {
      gameStore.technologies[t.key].unlocked = true
      gameStore.technologies[t.key].efficiency = 10
    })
  }

  const unlockAllBuildings = () => {
    buildingList.forEach(b => {
      gameStore.buildings[b.key].unlocked = true
      gameStore.buildings[b.key].count = 1000
      gameStore.buildings[b.key].level = 100
    })
  }

  const unlockAllStages = () => {
    stageList.forEach(s => {
      gameStore.currentEntropyStage = 'universalUnification'
      gameStore.entropyReductionStages[s.key].unlocked = true
      gameStore.entropyReductionStages[s.key].progress = entropyReductionsData[s.key].maxProgress
    })
  }

  const resetAll = () => {
    resourceList.forEach(r => {
      gameStore.resources[r.key] = 0
    })
    buildingList.forEach(b => {
      gameStore.buildings[b.key].unlocked = false
      gameStore.buildings[b.key].count = 0
      gameStore.buildings[b.key].level = 1
    })
    techList.forEach(t => {
      gameStore.technologies[t.key].unlocked = false
      gameStore.technologies[t.key].efficiency = 1
    })
    stageList.forEach(s => {
      gameStore.entropyReductionStages[s.key].unlocked = false
      gameStore.entropyReductionStages[s.key].progress = 0
    })
    gameStore.currentEntropyStage = 'atomicOrdering'
  }
</script>

<style scoped>
  .gm-panel {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    margin: 20px auto;
    max-width: 900px;
  }
  .card-header {
    display: flex;
    align-items: center;
    gap: 12px;
  }
</style>
