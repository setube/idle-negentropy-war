<template>
  <el-card class="exploration-panel" shadow="never">
    <template #header>
      <div class="card-header">
        <span>宇宙探索</span>
      </div>
    </template>
    <el-tabs v-model="activeName">
      <el-tab-pane :label="item.name" :name="item.type" v-for="(item, index) in tabsList" :key="index" />
    </el-tabs>
    <div class="exploration-list" v-if="activeName === 'list'">
      <div v-for="target in explorations" :key="target.id" class="exploration-item">
        <div class="exploration-info">
          <h4>{{ target.name }}</h4>
          <p>{{ target.desc }}</p>
          <div class="exploration-cost"></div>
          <div class="exploration-pool">
            <p>
              探索损耗：
              <span>
                {{
                  Object.entries(target.cost)
                    .map(([k, v]) => `${gameStore.formatNumber(v)} ${resourcesData[k].name}`)
                    .join('、')
                }}
              </span>
            </p>
            <p>
              常规掉落：
              <span>
                {{
                  target.commonPool
                    .map(
                      k =>
                        `${gameStore.formatNumber(k.min)}~${gameStore.formatNumber(k.max)} ${resourcesData[k.res].name}`
                    )
                    .join('、')
                }}
              </span>
            </p>
            <p>
              稀有掉落：
              <span>
                {{
                  target.rarePool
                    .map(
                      k =>
                        `${explorationResData[k.res]?.name}(概率${gameStore.formatNumber(
                          Math.round(k.chance * 1000) / 10
                        )}%)`
                    )
                    .join('、')
                }}
              </span>
            </p>
            <p>
              失败补偿：
              <span v-for="(val, res) in target.failReward" :key="res">
                {{ gameStore.formatNumber(val) }}{{ explorationResData[res].name || res }}
              </span>
            </p>
          </div>
          <el-button
            type="primary"
            :disabled="isOnCooldown(target.id) || !canAfford(target.cost) || gameStore.explorationres.probe <= 0"
            @click="startExploration(target)"
          >
            <template v-if="gameStore.explorationres.probe <= 0">无探测器</template>
            <template v-else-if="isOnCooldown(target.id)">冷却中({{ getCooldown(target.id) }})</template>
            <template v-else-if="!canAfford(target.cost)">资源不足</template>
            <template v-else>派遣探索</template>
          </el-button>
        </div>
      </div>
    </div>
    <div class="exploration-collect" v-else>
      <h4>探测器({{ gameStore.explorationres.probe }}/5)</h4>
      <el-button
        size="small"
        type="success"
        @click="makeProbe"
        :disabled="gameStore.explorationres.probe >= 5 || !canAfford(probeCost)"
      >
        制造探测器（{{ gameStore.formatNumber(probeCost.energy) }}能量/{{
          gameStore.formatNumber(probeCost.matter)
        }}物质）
      </el-button>
      <h4>收集与合成</h4>
      <div class="collect-list">
        <div v-for="item in collectList" :key="item.res" class="collect-item">
          <div class="collect-info">
            <h4>{{ explorationResData[item.res].name }}</h4>
            <p>
              {{ gameStore.formatNumber(gameStore.explorationres[item.res]) }}
              /
              {{ gameStore.formatNumber(item.need) }}
            </p>
          </div>
          <el-button
            size="small"
            type="warning"
            @click="synthesize(item)"
            :disabled="gameStore.explorationres[item.res] < item.need"
          >
            合成{{ item.rewardText }}
          </el-button>
        </div>
      </div>
    </div>
  </el-card>
</template>

<script setup>
  import { ref } from 'vue'
  import explorations from '@/data/explorations'
  import resourcesData from '@/data/resources'
  import explorationResData from '@/data/explorationRes'
  import { useGameStore } from '@/stores/gameStore'

  const gameStore = useGameStore()
  const activeName = ref('collect')
  const tabsList = [
    { type: 'collect', name: '碎片合成' },
    { type: 'list', name: '探索宇宙' }
  ]
  const probeCost = { energy: 2000, matter: 1000 }

  const collectList = [
    { res: 'relicShard', need: 10, reward: { alienFragment: 1 }, rewardText: '外星科技碎片' },
    { res: 'alienFragment', need: 5, reward: { techBoost: 1 }, rewardText: '科技效率提升' },
    { res: 'techFragment', need: 10, reward: { knowledge: 5000 }, rewardText: '知识' },
    { res: 'ancientLog', need: 3, reward: { energy: 10000 }, rewardText: '能量' },
    { res: 'timeShard', need: 10, reward: { singularityCore: 1 }, rewardText: '奇点核心' },
    { res: 'planetDust', need: 10, reward: { planetRelic: 1 }, rewardText: '星球遗珍' },
    { res: 'voidLog', need: 5, reward: { voidCrystal: 1 }, rewardText: '虚空结晶' }
  ]

  const canAfford = cost => {
    return Object.entries(cost).every(([res, val]) => gameStore.resources[res] >= val)
  }

  const synthesize = item => {
    if (gameStore.explorationres[item.res] < item.need) return
    gameStore.explorationres[item.res] -= item.need
    Object.entries(item.reward).forEach(([res, val]) => {
      if (res === 'techBoost') {
        Object.values(gameStore.technologies).forEach(tech => {
          tech.efficiency *= 1.05
        })
      } else {
        gameStore.explorationres[res] += val
      }
    })
  }

  const makeProbe = () => {
    if (gameStore.explorationres.probe >= 5) return
    if (!canAfford(probeCost)) return
    Object.entries(probeCost).forEach(([res, val]) => {
      gameStore.resources[res] -= val
    })
    gameStore.explorationres.probe++
  }

  const isOnCooldown = id => {
    const now = Date.now() / 1000
    return gameStore.cooldowns[id] && gameStore.cooldowns[id] > now
  }

  const getCooldown = id => {
    const now = Date.now() / 1000
    return gameStore.formatTime(Math.max(0, Math.floor((gameStore.cooldowns[id] || 0) - now)))
  }

  const weightedRandom = pool => {
    const total = pool.reduce((sum, item) => sum + (item.weight || 1), 0)
    let r = Math.random() * total
    for (const item of pool) {
      r -= item.weight || 1
      if (r < 0) return item
    }
    return pool[pool.length - 1]
  }

  const startExploration = target => {
    if (gameStore.explorationres.probe <= 0) return
    // 扣除资源
    Object.entries(target.cost).forEach(([res, val]) => {
      gameStore.resources[res] -= val
    })
    // 消耗探测器
    gameStore.explorationres.probe--
    // 设置冷却
    gameStore.cooldowns[target.id] = Date.now() / 1000 + target.cooldown
    // 判定结果
    const roll = Math.random()
    let result = '探索失败'
    let reward = {}
    if (roll < target.chance) {
      // 掉落常规奖励
      const common = weightedRandom(target.commonPool)
      const amount = Math.floor(common.min + Math.random() * (common.max - common.min + 1))
      reward[common.res] = amount
      // 稀有掉落
      for (const rare of target.rarePool) {
        if (Math.random() < rare.chance) {
          reward[rare.res] = (reward[rare.res] || 0) + 1
        }
      }
      // 特殊奖励处理
      if (reward.techBoost) {
        Object.values(gameStore.technologies).forEach(tech => {
          tech.efficiency *= 1.05
        })
      }
      result = '探索成功'
    } else {
      // 失败必得补偿
      Object.entries(target.failReward).forEach(([res, val]) => {
        reward[res] = val
      })
      result = '探索失败（获得补偿）'
    }
    // 发放奖励
    Object.entries(reward).forEach(([res, val]) => {
      if (res === 'techBoost') return // 已处理
      if (gameStore.resources[res] !== undefined) {
        gameStore.resources[res] += val
      } else {
        gameStore.explorationres[res] += val
      }
    })
    gameStore.addEvent({
      title: `${target.name} - ${result}`,
      description: Object.entries(reward)
        .map(([k, v]) => `${gameStore.formatNumber(v)} ${resourcesData[k]?.name || explorationResData[k]?.name}`)
        .join('、'),
      type: 'reward'
    })
  }
</script>

<style scoped>
  .exploration-panel {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
  }
  .card-header {
    display: flex;
    align-items: center;
    gap: 16px;
  }
  .exploration-list {
    display: grid;
    gap: 15px;
  }
  .exploration-item {
    padding: 16px;
    border-radius: 12px;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    transition: all 0.3s ease;
  }
  .exploration-info h4 {
    margin: 0 0 4px;
    font-size: 1.1em;
    color: #ffd700;
  }
  .exploration-info p {
    margin: 2px 0;
    font-size: 0.9em;
  }
  .exploration-cost {
    margin-top: 8px;
    font-size: 0.9em;
    color: #ccc;
  }
  .exploration-pool {
    margin: 5px 0;
    font-size: 0.9em;
    color: #8cf;
  }
  .exploration-collect {
    margin-top: 20px;
    font-size: 0.95em;
  }
  .collect-list {
    display: flex;
    flex-wrap: wrap;
  }
  .collect-item {
    padding: 16px;
    border-radius: 12px;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    width: calc(50% - 10px);
    margin: 5px;
    display: grid;
    justify-content: center;
    text-align: center;
  }

  @media (max-width: 768px) {
    .collect-item {
      display: flex;
      flex-wrap: wrap;
    }
  }
</style>
