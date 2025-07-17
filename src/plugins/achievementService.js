import achievementsData from '@/data/achievements'
import { useGameStore } from '@/stores/gameStore'

// 检查单个成就是否达成
const checkAchievement = (cfg, state, gameStore) => {
  switch (cfg.type) {
    case 'resource':
      return cfg.resource.every(res => gameStore.resources[res] >= state.currentTarget)
    case 'building':
      return gameStore.buildings[cfg.building]?.count >= state.currentTarget
    case 'tech':
      return gameStore.technologies[cfg.tech]?.unlocked
    case 'entropyStage':
      return gameStore.entropyReductionStages[cfg.entropyStage]?.unlocked
    case 'compound':
      return cfg.conditions.every(cond => {
        if (cond.type === 'resource') return gameStore.resources[cond.resource] >= cond.target
        if (cond.type === 'tech') return gameStore.technologies[cond.tech]?.unlocked
        if (cond.type === 'building') return gameStore.buildings[cond.building]?.count >= (cond.target || 1)
        if (cond.type === 'entropyStage') return gameStore.entropyReductionStages[cond.entropyStage]?.unlocked
        return false
      })
    default:
      return false
  }
}

// 计算奖励
const getAchievementReward = (cfg, state) => {
  if (cfg.reward) return cfg.reward
  // 兼容旧数据
  if (cfg.resource && cfg.baseReward) {
    const reward = {}
    cfg.resource.forEach(res => {
      reward[res] = Math.floor(cfg.baseReward * Math.pow(cfg.rewardMultiplier || 1, state.level))
    })
    return reward
  }
  return {}
}

// 领取成就奖励
const claimAchievement = (id, gameStore) => {
  const cfg = achievementsData.find(a => a.id === id)
  const state = gameStore.achievements[id]
  if (!state.completed) return
  // 发放奖励
  const reward = getAchievementReward(cfg, state)
  Object.entries(reward).forEach(([res, val]) => {
    if (gameStore.resources[res] !== undefined) {
      gameStore.resources[res] += val
    }
  })
  // 特殊奖励/解锁
  if (cfg.unlock) {
    if (cfg.unlock.tech) gameStore.technologies[cfg.unlock.tech].unlocked = true
    if (cfg.unlock.building) gameStore.buildings[cfg.unlock.building].unlocked = true
  }
  if (cfg.once) state.unlocked = true
  // 递增目标和奖励（仅支持部分类型）
  if (cfg.type === 'resource' || cfg.type === 'building') {
    state.level++
    state.currentTarget = Math.floor(cfg.baseTarget * Math.pow(cfg.targetMultiplier, state.level))
    state.completed = false
  } else {
    state.completed = false
  }
}

// 检查所有成就
const checkAllAchievements = gameStore => {
  achievementsData.forEach(cfg => {
    const state = gameStore.achievements[cfg.id]
    if (!state.completed && checkAchievement(cfg, state, gameStore)) {
      state.completed = true
    }
  })
}

export const useAchievementService = () => {
  const gameStore = useGameStore()
  return {
    checkAllAchievements: () => checkAllAchievements(gameStore),
    claimAchievement: id => claimAchievement(id, gameStore),
    getAchievementReward: (cfg, state) => getAchievementReward(cfg, state),
    checkAchievement: (cfg, state) => checkAchievement(cfg, state, gameStore)
  }
}
