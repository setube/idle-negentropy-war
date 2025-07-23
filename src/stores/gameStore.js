import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { decryptData, encryptData } from '@/plugins/crypto'
import buildingsData from '@/data/buildings'
import technologiesData from '@/data/technologies'
import entropyReductionData from '@/data/entropyReductions'
import resourcesData from '@/data/resources'
import explorationResData from '@/data/explorationRes'
import achievementsData from '@/data/achievements'
import { useAchievementService } from '@/plugins/achievementService'
import { ElNotification } from 'element-plus'

export const useGameStore = defineStore(
  'game',
  () => {
    // 游戏状态
    const isGm = ref(false)
    const gameTime = ref(0) // 游戏时间（天）
    const civilizationLevel = ref(0) // 文明等级
    // 宇宙状态
    const universeState = ref('chaos') // 'order' | 'chaos'
    const tripleStarDeviation = ref(0)
    // 事件系统
    const events = ref([])
    const activeEvent = ref(null)
    const eventBonus = ref(1)
    // 暴露冷却
    const exposureCooldown = ref(0) // 单位：秒
    // 成就相关逻辑
    const achievementService = useAchievementService()
    // 熵减进程
    const entropyReductionStages = ref({})
    Object.keys(entropyReductionData).forEach(key => {
      entropyReductionStages.value[key] = {
        unlocked: entropyReductionData[key].unlocked,
        progress: 0,
        efficiency: entropyReductionData[key].efficiency
      }
    })
    // 当前熵减阶段
    const currentEntropyStage = ref('atomicOrdering')
    // 熵减速率
    const entropyReductionRate = ref(0)
    // 坐标暴露值上限
    const coordinateExposureMax = ref(0)
    // 资源系统
    const resources = ref({})
    Object.keys(resourcesData).forEach(key => {
      resources.value[key] = resourcesData[key].count
    })
    if (resources.value['[object Object]']) delete resources.value['[object Object]']
    // 资源增减明细
    const resourceDelta = ref({})
    // 探索相关资源
    const explorationres = ref({})
    Object.keys(explorationResData).forEach(key => {
      explorationres.value[key] = explorationResData[key].count
    })
    // 探索冷却
    const cooldowns = ref({})
    // 科技
    const technologies = ref({})
    Object.keys(technologiesData).forEach(key => {
      technologies.value[key] = {
        unlocked: technologiesData[key].unlocked,
        efficiency: technologiesData[key].efficiency
      }
    })
    // 建筑
    const buildings = ref({})
    Object.keys(buildingsData).forEach(key => {
      const { count, level, unlocked, add } = buildingsData[key]
      buildings.value[key] = { count, level, unlocked, add }
    })
    // 成就系统状态
    const achievements = ref({})
    // 初始化成就
    achievementsData.forEach(cfg => {
      achievements.value[cfg.id] = {
        level: 0,
        unlocked: false,
        currentTarget: cfg.baseTarget || 1,
        completed: false, // 是否可领取
        progress: 0 // 进度型成就
      }
    })

    // 毕业强度计算
    const techRatio = computed(() => {
      const unlocked = Object.values(technologies.value).filter(t => t.unlocked).length
      const total = Object.keys(technologies.value).length
      return total ? unlocked / total : 0
    })

    const stageOrder = [
      'atomicOrdering',
      'molecularCooling',
      'stellarExtinction',
      'blackholeDecompression',
      'energyMaterialization',
      'universalUnification'
    ]

    const stageRatio = computed(() => {
      const lastIndex = stageOrder.length - 1
      const currentIndex = stageOrder.findIndex(s => currentEntropyStage.value === s)
      return Math.max(0, Math.min(1, currentIndex / lastIndex))
    })

    const buildRatio = computed(() => {
      const maxLevel = 100 // 理论满级
      const totalLevel = Object.values(buildings.value).reduce((sum, b) => sum + (b.level || 0), 0)
      const maxTotal = Object.keys(buildings.value).length * maxLevel
      return maxTotal ? totalLevel / maxTotal : 0
    })

    const entropyGap = computed(() => {
      const stages = Object.values(entropyReductionStages.value)
      const entropy = Object.values(entropyReductionData)
      const maxEntropy = entropy.reduce((sum, s) => sum + (s.maxProgress || 0), 0)
      const currentEntropy = stages.reduce((sum, s) => sum + (s.progress || 0), 0)
      const max = (maxEntropy - currentEntropy) / maxEntropy
      return max === 0 ? 1 : max
    })

    const progressRatio = computed(() => {
      return (techRatio.value + stageRatio.value + buildRatio.value + entropyGap.value) / 4
    })

    // 事件类型
    const triggerRandomEvent = () => {
      if (gameTime.value > 0 && gameTime.value % 300 === 0) {
        const duration = 365
        const remaining = duration
        const day = duration / 365
        const rand = Math.random()
        let title, type, description
        if (rand < 0.1) {
          title = '科技突破'
          type = 'breakthrough'
          description = `全体产出翻倍，持续${day}年`
          eventBonus.value = 2
          // 科技突破
          activeEvent.value = { type, title, description, duration, remaining }
          addEvent({ timestamp: Date.now(), title, description, type })
        } else if (rand < 0.18) {
          title = '宇宙灾变'
          type = 'disaster'
          description = `所有产出减半，持续${day}年`
          eventBonus.value = 0.5
          // 宇宙灾变
          activeEvent.value = { type, title, description, duration, remaining }
          addEvent({ timestamp: Date.now(), title, description, type })
        } else if (rand < 0.25) {
          title = '贸易繁荣'
          type = 'tradeboom'
          description = `纳米材料产出翻倍，持续${day}年`
          eventBonus.value = 1
          // 贸易繁荣
          activeEvent.value = { type, title, description, duration, remaining }
          addEvent({ timestamp: Date.now(), title, description, type })
        }
      }
    }

    // 推进熵减阶段
    const completeEntropyStage = stageKey => {
      const currentIndex = stageOrder.indexOf(stageKey)
      if (currentIndex < stageOrder.length - 1) {
        const nextStageKey = stageOrder[currentIndex + 1]
        entropyReductionStages.value[nextStageKey].unlocked = true
        currentEntropyStage.value = nextStageKey
        Object.keys(buildingsData).forEach(key => {
          if (buildingsData[key].entropyStage === nextStageKey && !buildings.value[key].unlocked) {
            buildings.value[key].unlocked = true
          }
        })
      }
    }

    // 执行熵减
    const performEntropyReduction = (times = 1) => {
      for (let i = 0; i < times; i++) {
        const currentStage = entropyReductionStages.value[currentEntropyStage.value]
        const data = entropyReductionData[currentEntropyStage.value]
        if (!currentStage || !currentStage.unlocked) return
        if (!canAfford(data.cost)) return
        Object.entries(data.cost).forEach(([resource, amount]) => {
          resources.value[resource] -= amount
        })
        const reductionAmount = currentStage.efficiency * getEntropyReductionBonus()
        currentStage.progress += reductionAmount
        if (currentStage.progress >= data.maxProgress) {
          completeEntropyStage(currentEntropyStage.value)
          achievementService.checkAllAchievements()
          break // 阶段完成后停止批量
        }
        entropyReductionRate.value += reductionAmount
      }
      achievementService.checkAllAchievements()
    }

    const getEntropyReductionBonus = () => {
      let bonus = 1
      // 科技效率加成
      const currentTech = getCurrentStageTech()
      if (currentTech && currentTech.efficiency) {
        bonus *= currentTech.efficiency
      }
      return bonus
    }

    const getCurrentStageTech = () => {
      const stageTechMap = {
        atomicOrdering: 'atomicManipulation',
        molecularCooling: 'thermalControl',
        stellarExtinction: 'stellarEngineering',
        blackholeDecompression: 'blackholePhysics',
        energyMaterialization: 'energyConversion',
        universalUnification: 'universalTheory'
      }
      const techKey = stageTechMap[currentEntropyStage.value]
      return techKey ? technologies.value[techKey] : null
    }

    // 判断资源是否足够
    const canAfford = (baseCost, factor = 1) => {
      if (!baseCost || typeof baseCost !== 'object') return false
      const cost = calcDynamicCost(baseCost, factor)
      return Object.entries(cost).every(([res, amt]) => {
        return resources.value[res] >= amt
      })
    }

    // 根据原始成本 + 动态系数，返回实际成本表
    const calcDynamicCost = (baseCost, factor = 1) =>
      Object.fromEntries(Object.entries(baseCost).map(([res, amt]) => [res, amt * factor]))

    // 获取实际产出资源
    const canResource = item => {
      const data = buildingsData[item]
      const info = buildings.value[item]
      const arr = []
      if (info.count) {
        // 获取科技加成等
        let techEff = 1
        // 建筑-科技映射表
        const buildingTechMap = {
          atomicSorter: 'atomicManipulation',
          molecularCooler: 'thermalControl',
          stellarExtinguisher: 'stellarEngineering',
          blackholeDecompressor: 'blackholePhysics',
          energyMaterializer: 'energyConversion',
          universalUnifier: 'universalTheory',
          quantumComputer: 'quantumComputing',
          spacetimePortal: 'spacetimeManipulation'
        }
        const techKey = buildingTechMap[item]
        if (techKey && technologies.value[techKey]) {
          techEff = technologies.value[techKey].efficiency
        }
        // 阶段加成
        const isCurrentStageBuilding = data.entropyStage === currentEntropyStage.value
        const stageBonus = isCurrentStageBuilding ? 2 : 1
        // 产出
        Object.entries(data.outputs).forEach(([res, baseVal]) => {
          arr.push({ res, val: baseVal * info.level * info.count * techEff * stageBonus * eventBonus.value })
        })
      }
      return arr
    }

    // 判断科技是否可解锁
    const canUnlockTech = key => {
      const tech = technologies.value[key]
      if (tech.unlocked) return false
      if (!tech.prerequisites || tech.prerequisites.length === 0) return true
      return tech.prerequisites.every(prereq => technologies.value[prereq].unlocked)
    }

    // 解锁科技
    const unlockTechnology = key => {
      const tech = technologies.value[key]
      const data = technologiesData[key]
      if (!tech.unlocked && canAfford(data.cost) && canUnlockTech(key)) {
        tech.unlocked = true
        // 扣除资源
        Object.entries(data.cost).forEach(([resource, amount]) => {
          resources.value[resource] -= amount
        })
        // 解锁科技
        const techToBuilding = {
          fire: 'campfire',
          agriculture: 'farm',
          metallurgy: 'mine',
          mining: 'mine',
          electricity: 'datacenter',
          nuclear: 'reactor',
          quantum: 'quantumComputer',
          spacetime: 'spaceport',
          vacuum: 'dysonSphere',
          eco: 'ecoPark',
          gene: 'geneCenter',
          deepSpace: 'probe',
          ai: 'aiCenter',
          trade: 'tradeStation',
          blackhole: 'blackholePlant',
          lowPotentialTrapTech: 'lowPotentialTrap',
          quantumDecoherenceTech: 'quantumDecoherenceSuppressor',
          brownianCaptureTech: 'brownianCaptureNet',
          stealthAlgorithm: 'stealthGenerator',
          darkMatterExtraction: 'darkMatterCollector',
          antiMatterSynthesis: 'antiMatterSynthesizer',
          nanoManufacturing: 'nanoFactory'
        }
        const buildingName = techToBuilding[key]
        if (buildingName && buildings.value[buildingName]) {
          buildings.value[buildingName].unlocked = true
        }
        achievementService.checkAllAchievements()
      }
    }

    // 建筑建造
    const buildStructure = key => {
      const building = buildings.value[key]
      const data = buildingsData[key]
      if (!building) return
      const cost = getDisplayCost(data.cost, building.count, building.level, false)
      if (!updateDisplayCost(data.cost, building.count, building.level, false)) return
      // 解锁校验
      const ok =
        building.unlocked ||
        data.entropyStage === currentEntropyStage.value ||
        ['quantumComputer', 'spacetimePortal'].includes(key)
      if (!ok) return
      // 扣费 & 建造
      Object.entries(cost).forEach(([res, amt]) => (resources.value[res] -= amt))
      building.count++
      achievementService.checkAllAchievements()
    }

    // 建筑升级
    const upgradeBuilding = key => {
      const building = buildings.value[key]
      const data = buildingsData[key]
      if (!building) return
      const cost = getDisplayCost(data.upgradeCost, building.count, building.level, true)
      if (!updateDisplayCost(data.upgradeCost, building.count, building.level, true)) return
      // 扣费 & 升级
      Object.entries(cost).forEach(([res, amt]) => (resources.value[res] -= amt))
      building.level++
      achievementService.checkAllAchievements()
    }

    // 返回“建造下一座”或“升级下一级”的实际成本
    const getDisplayCost = (baseCost, count = 0, level = 1, isUpgrade = false) =>
      calcDynamicCost(baseCost, isUpgrade ? (level + 1) * 1.7 || 1 : count * 1.7 || 1)

    // 返回能否“建造下一座”或“升级下一级”
    const updateDisplayCost = (baseCost, count = 0, level = 1, isUpgrade = false) => {
      const cost = getDisplayCost(baseCost, count, level, isUpgrade)
      return Object.entries(cost).every(([res, amt]) => resources.value[res] >= amt)
    }

    // 游戏逻辑
    const updateGame = () => {
      // 每tick前清空
      Object.keys(resources.value).forEach(res => {
        resourceDelta.value[res] = { total: 0 }
      })
      gameTime.value++
      // 更新三体运动偏差
      tripleStarDeviation.value = Math.log10(civilizationLevel.value + 1 + gameTime.value / 100000)
      if (tripleStarDeviation.value >= 100) return
      // 更新资源生产
      let totalProduction = 0,
        max = 0
      Object.entries(buildings.value).forEach(([key, item]) => {
        // 产出
        canResource(key).forEach(({ res, val }) => {
          resources.value[res] += val
          resourceDelta.value[res].total += val
          totalProduction += item.count
          max += item.count * item.level
        })
      })
      // 更新坐标暴露值上限
      coordinateExposureMax.value = 100 + max
      // 更新熵减速率
      entropyReductionRate.value = totalProduction * (universeState.value === 'order' ? 3 : 0.1)
      // 检查宇宙状态切换
      if (entropyReductionRate.value > 1 && universeState.value === 'chaos') {
        universeState.value = 'order'
        setTimeout(() => {
          universeState.value = 'chaos'
        }, 72 * 60 * 60 * 1000) // 72小时有序态
      }
      // 检查黑暗森林打击
      checkDarkForestStrike()
      // 更新文明等级
      updateCivilizationLevel()
      // 事件触发
      triggerRandomEvent()
      // 事件倒计时与结束
      if (activeEvent.value) {
        activeEvent.value.remaining--
        if (activeEvent.value.remaining <= 0) {
          eventBonus.value = 1
          activeEvent.value = null
        }
      }
      // 检查成就达成
      achievementService.checkAllAchievements()
    }

    // 发送历史事件通知
    const addEvent = event => {
      events.value.unshift(event)
      if (events.value.length > 20) {
        events.value.length = 20
      }
    }

    // 文明等级更新
    const updateCivilizationLevel = () => {
      const newLevel = Math.floor(Math.log10(resources.value.knowledge + 1))
      if (newLevel > civilizationLevel.value) {
        civilizationLevel.value = newLevel
        // 奖励：所有科技效率提升
        Object.values(technologies.value).forEach(tech => {
          if (tech.unlocked) tech.efficiency *= 1.05
        })
        addEvent({
          title: '文明进化',
          description: '文明等级提升，科技效率提升！',
          type: 'reward'
        })
      } else if (newLevel < civilizationLevel.value) {
        civilizationLevel.value = newLevel
        // 惩罚：所有科技效率降低
        Object.values(technologies.value).forEach(tech => {
          if (tech.unlocked) tech.efficiency *= 0.9
        })
        addEvent({
          title: '文明退化',
          description: '文明等级下降，科技效率降低！',
          type: 'punish'
        })
      }
    }

    // 降维打击判定逻辑前，增加冷却判断
    const checkDarkForestStrike = () => {
      const { coordinateExposure } = resources.value
      const duration = 1825
      const day = duration / 365
      // 冷却期间或者阈值小于100或者文明等级小于1不触发打击
      if (exposureCooldown.value > 0 || coordinateExposure < coordinateExposureMax.value || civilizationLevel.value < 3)
        return
      if (Math.random() < 1 && civilizationLevel.value < 10) {
        // 冷却
        exposureCooldown.value = duration
        // 惩罚递增
        Object.values(technologies.value).forEach(tech => {
          if (tech.unlocked) {
            tech.efficiency *= Math.exp(-0.05 * civilizationLevel.value)
          }
        })
        // 暴露值清零并进入冷却
        if (coordinateExposure !== undefined) {
          resources.value.coordinateExposure = 0
        }
        // 所有建筑的等级和数量减半
        Object.values(buildings.value).forEach(b => {
          b.level = Math.max(1, Math.floor(b.level / 2))
          b.count = Math.max(0, Math.floor(b.count / 2))
          // 移除建筑
          if ((b.level && !b.count) || (!b.level && !b.count)) {
            delete buildings.value[b]
          }
        })
        const title = '降维打击'
        const message = `由于坐标暴露过高，文明遭受降维打击，科技效率下降！所有建筑等级和数量损失过半！如果建筑等级或数量过低建筑会被移除！暴露值已清零，${day}年内不会再次被打击。`
        ElNotification({ title, message })
        events.value.unshift({ title, description: message, type: 'strike' })
      }
    }

    const formatTime = seconds => {
      const totalDays = Math.floor(seconds) // 总天数
      const years = Math.floor(totalDays / 365)
      const months = Math.floor((totalDays % 365) / 30) || 1
      const days = totalDays % 30 || 1
      return `${years}年${months}月${days}天`
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

    return {
      gameTime,
      civilizationLevel,
      resources,
      explorationres,
      technologies,
      buildings,
      universeState,
      tripleStarDeviation,
      events,
      activeEvent,
      eventBonus,
      entropyReductionStages,
      currentEntropyStage,
      canAfford,
      updateGame,
      buildStructure,
      unlockTechnology,
      upgradeBuilding,
      canUnlockTech,
      performEntropyReduction,
      getEntropyReductionBonus,
      getCurrentStageTech,
      completeEntropyStage,
      exposureCooldown,
      checkDarkForestStrike,
      canResource,
      getDisplayCost,
      updateDisplayCost,
      formatTime,
      achievements,
      formatNumber,
      addEvent,
      entropyReductionRate,
      coordinateExposureMax,
      cooldowns,
      techRatio,
      stageRatio,
      buildRatio,
      entropyGap,
      progressRatio,
      isGm,
      stageOrder,
      resourceDelta
    }
  },
  {
    persist: {
      key: __APP_NAME__,
      storage: localStorage,
      serializer: {
        serialize: state => encryptData(state),
        deserialize: value => decryptData(value)
      }
    }
  }
)
