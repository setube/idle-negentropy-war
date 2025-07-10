import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { decryptData, encryptData } from '@/plugins/crypto'

export const useGameStore = defineStore(
  'game',
  () => {
    // 核心游戏状态
    const gameTime = ref(0) // 游戏时间（秒）
    const civilizationLevel = ref(0) // 文明等级
    const entropyReductionRate = ref(0) // 熵减速率
    const universeEntropyRate = ref(1) // 宇宙熵增速率
    const coordinateExposure = ref(0) // 坐标暴露值
    const concealmentAbility = ref(100) // 隐匿能力

    // 熵减进程系统 - 从微观到宏观的渐进过程
    const entropyReductionStages = ref({
      // 第一阶段：微观熵减
      atomicOrdering: {
        name: '原子排序',
        description: '手动排列原子，建立有序结构',
        unlocked: true,
        progress: 0,
        maxProgress: 1000,
        efficiency: 0.1,
        cost: { energy: 1, matter: 1 },
        effect: '基础熵减，减缓局部热运动'
      },
      molecularCooling: {
        name: '分子冷却',
        description: '减缓分子热运动，降低系统温度',
        unlocked: false,
        progress: 0,
        maxProgress: 5000,
        efficiency: 0.5,
        cost: { energy: 5, matter: 2 },
        effect: '中等熵减，建立分子级有序'
      },
      // 第二阶段：宏观熵减
      stellarExtinction: {
        name: '恒星熄灭',
        description: '熄灭恒星，停止核聚变产生的熵增',
        unlocked: false,
        progress: 0,
        maxProgress: 10000,
        efficiency: 2.0,
        cost: { energy: 100, matter: 50, darkMatter: 10 },
        effect: '大规模熵减，控制恒星活动'
      },
      blackholeDecompression: {
        name: '黑洞解压',
        description: '解压黑洞，释放被压缩的信息',
        unlocked: false,
        progress: 0,
        maxProgress: 50000,
        efficiency: 5.0,
        cost: { energy: 1000, matter: 500, darkMatter: 100, antiMatter: 50 },
        effect: '超大规模熵减，信息恢复'
      },
      // 第三阶段：宇宙级熵减
      energyMaterialization: {
        name: '能量物质化',
        description: '将纯能量转化为有序物质',
        unlocked: false,
        progress: 0,
        maxProgress: 100000,
        efficiency: 10.0,
        cost: { energy: 10000, matter: 1000, darkMatter: 500, antiMatter: 200 },
        effect: '宇宙级熵减，能量有序化'
      },
      universalUnification: {
        name: '宇宙单一化',
        description: '将所有物质重新转化为氢，达到最低熵状态',
        unlocked: false,
        progress: 0,
        maxProgress: 1000000,
        efficiency: 50.0,
        cost: { energy: 100000, matter: 10000, darkMatter: 1000, antiMatter: 500, nanoMaterial: 100 },
        effect: '终极熵减，宇宙回归原始状态'
      }
    })

    // 当前熵减阶段
    const currentEntropyStage = ref('atomicOrdering')

    // 资源系统
    const resources = ref({
      knowledge: 0, // 知识总量
      energy: 10, // 能量
      matter: 20, // 物质
      entropy: 0, // 熵值
      darkMatter: 0, // 暗物质
      antiMatter: 0, // 反物质
      nanoMaterial: 0, // 纳米材料
      quantumBits: 0, // 量子比特
      civilizationGenes: 0 // 文明基因
    })

    // 科技系统 - 重新设计以支持熵减进程
    const technologies = ref({
      // 基础科技 - 支持原子级熵减
      atomicManipulation: {
        unlocked: true,
        level: 0,
        efficiency: 1,
        prerequisites: [],
        group: '基础科技',
        effect: '解锁原子排序能力',
        entropyStage: 'atomicOrdering'
      },
      thermalControl: {
        unlocked: false,
        level: 0,
        efficiency: 1,
        prerequisites: ['atomicManipulation'],
        group: '基础科技',
        effect: '解锁分子冷却能力',
        entropyStage: 'molecularCooling'
      },
      // 恒星科技 - 支持恒星级熵减
      stellarEngineering: {
        unlocked: false,
        level: 0,
        efficiency: 1,
        prerequisites: ['thermalControl'],
        group: '恒星科技',
        effect: '解锁恒星熄灭能力',
        entropyStage: 'stellarExtinction'
      },
      // 黑洞科技 - 支持黑洞级熵减
      blackholePhysics: {
        unlocked: false,
        level: 0,
        efficiency: 1,
        prerequisites: ['stellarEngineering'],
        group: '黑洞科技',
        effect: '解锁黑洞解压能力',
        entropyStage: 'blackholeDecompression'
      },
      // 宇宙科技 - 支持宇宙级熵减
      energyConversion: {
        unlocked: false,
        level: 0,
        efficiency: 1,
        prerequisites: ['blackholePhysics'],
        group: '宇宙科技',
        effect: '解锁能量物质化能力',
        entropyStage: 'energyMaterialization'
      },
      universalTheory: {
        unlocked: false,
        level: 0,
        efficiency: 1,
        prerequisites: ['energyConversion'],
        group: '宇宙科技',
        effect: '解锁宇宙单一化能力',
        entropyStage: 'universalUnification'
      },
      // 支持科技
      quantumComputing: {
        unlocked: false,
        level: 0,
        efficiency: 1,
        prerequisites: ['thermalControl'],
        group: '高等科技',
        effect: '提升熵减计算效率'
      },
      spacetimeManipulation: {
        unlocked: false,
        level: 0,
        efficiency: 1,
        prerequisites: ['stellarEngineering'],
        group: '宇宙科技',
        effect: '提升时空操控能力'
      },
      lowPotentialTrapTech: {
        unlocked: false,
        level: 0,
        efficiency: 1,
        prerequisites: ['thermalControl'],
        group: '分子冷却科技',
        effect: '解锁低势能陷阱',
        entropyStage: 'molecularCooling'
      },
      quantumDecoherenceTech: {
        unlocked: false,
        level: 0,
        efficiency: 1,
        prerequisites: ['thermalControl'],
        group: '分子冷却科技',
        effect: '解锁量子退相干抑制器',
        entropyStage: 'molecularCooling'
      },
      brownianCaptureTech: {
        unlocked: false,
        level: 0,
        efficiency: 1,
        prerequisites: ['thermalControl'],
        group: '分子冷却科技',
        effect: '解锁布朗运动捕获网',
        entropyStage: 'molecularCooling'
      },
      // 新科技
      stealthAlgorithm: {
        unlocked: false,
        level: 0,
        efficiency: 1,
        prerequisites: ['stellarEngineering'],
        group: '隐匿科技',
        effect: '解锁隐匿发生器，降低暴露值增长速率',
        entropyStage: 'stellarExtinction'
      }
    })

    // 建筑系统 - 重新设计以支持熵减进程
    const buildings = ref({
      // 基础建筑
      atomicSorter: {
        name: '原子排序器',
        count: 0,
        level: 1,
        production: 1,
        cost: { matter: 10, energy: 5 },
        upgradeCost: { matter: 20, energy: 10 },
        unlocked: true,
        entropyStage: 'atomicOrdering',
        description: '手动排列原子，建立有序结构'
      },
      molecularCooler: {
        name: '分子冷却器',
        count: 0,
        level: 1,
        production: 5,
        cost: { matter: 100, energy: 50 },
        upgradeCost: { matter: 200, energy: 100 },
        unlocked: false,
        entropyStage: 'molecularCooling',
        description: '减缓分子热运动，降低系统温度'
      },
      // 恒星建筑
      stellarExtinguisher: {
        name: '恒星熄灭器',
        count: 0,
        level: 1,
        production: 20,
        cost: { matter: 1000, energy: 500, darkMatter: 10 },
        upgradeCost: { matter: 2000, energy: 1000, darkMatter: 20 },
        unlocked: false,
        entropyStage: 'stellarExtinction',
        description: '熄灭恒星，停止核聚变产生的熵增'
      },
      // 黑洞建筑
      blackholeDecompressor: {
        name: '黑洞解压器',
        count: 0,
        level: 1,
        production: 100,
        cost: { matter: 10000, energy: 5000, darkMatter: 100, antiMatter: 50 },
        upgradeCost: { matter: 20000, energy: 10000, darkMatter: 200, antiMatter: 100 },
        unlocked: false,
        entropyStage: 'blackholeDecompression',
        description: '解压黑洞，释放被压缩的信息'
      },
      // 宇宙建筑
      energyMaterializer: {
        name: '能量物质化器',
        count: 0,
        level: 1,
        production: 500,
        cost: { matter: 100000, energy: 50000, darkMatter: 500, antiMatter: 200 },
        upgradeCost: { matter: 200000, energy: 100000, darkMatter: 1000, antiMatter: 400 },
        unlocked: false,
        entropyStage: 'energyMaterialization',
        description: '将纯能量转化为有序物质'
      },
      universalUnifier: {
        name: '宇宙单一化器',
        count: 0,
        level: 1,
        production: 2000,
        cost: { matter: 1000000, energy: 500000, darkMatter: 1000, antiMatter: 500, nanoMaterial: 100 },
        upgradeCost: { matter: 2000000, energy: 1000000, darkMatter: 2000, antiMatter: 1000, nanoMaterial: 200 },
        unlocked: false,
        entropyStage: 'universalUnification',
        description: '将所有物质重新转化为氢，达到最低熵状态'
      },
      // 支持建筑
      quantumComputer: {
        name: '量子计算机',
        count: 0,
        level: 1,
        production: 0, // 不直接产出，提升熵减效率
        cost: { matter: 1000, energy: 500, quantumBits: 10 },
        upgradeCost: { matter: 2000, energy: 1000, quantumBits: 20 },
        unlocked: false,
        entropyStage: 'molecularCooling',
        description: '提升熵减计算效率'
      },
      spacetimePortal: {
        name: '时空传送门',
        count: 0,
        level: 1,
        production: 0, // 不直接产出，提升时空操控能力
        cost: { matter: 100000, energy: 50000, darkMatter: 100 },
        upgradeCost: { matter: 200000, energy: 100000, darkMatter: 200 },
        unlocked: false,
        entropyStage: 'blackholeDecompression',
        description: '提升时空操控能力'
      },
      lowPotentialTrap: {
        name: '低势能陷阱',
        count: 0,
        level: 1,
        production: { energy: 5, matter: 2 },
        cost: { matter: 200, energy: 100 },
        upgradeCost: { matter: 400, energy: 200 },
        unlocked: false,
        entropyStage: 'molecularCooling',
        description: '减缓热运动，利用温差产出能量和物质'
      },
      quantumDecoherenceSuppressor: {
        name: '量子退相干抑制器',
        count: 0,
        level: 1,
        production: { quantumBits: 1, energy: -10 },
        cost: { matter: 300, energy: 200 },
        upgradeCost: { matter: 600, energy: 400 },
        unlocked: false,
        entropyStage: 'molecularCooling',
        description: '消耗能量，产生量子比特'
      },
      brownianCaptureNet: {
        name: '布朗运动捕获网',
        count: 0,
        level: 1,
        production: 0,
        cost: { matter: 150, energy: 80 },
        upgradeCost: { matter: 300, energy: 160 },
        unlocked: false,
        entropyStage: 'molecularCooling',
        description: '提升原子排序器生产效率'
      },
      // 新建筑
      stealthGenerator: {
        name: '隐匿发生器',
        count: 0,
        level: 1,
        production: 0, // 不产出资源，减少暴露值
        cost: { matter: 2000, energy: 1000 },
        upgradeCost: { matter: 4000, energy: 2000 },
        unlocked: false,
        entropyStage: 'stellarExtinction',
        description: '每秒减少坐标暴露值'
      }
    })

    // 宇宙状态
    const universeState = ref('chaos') // 'order' | 'chaos'
    const tripleStarDeviation = ref(0) // 三体运动偏差值
    const reaperThreat = ref(0) // 收割者威胁度

    // 事件系统
    const events = ref([])
    const activeEvent = ref(null)
    const eventBonus = ref(1)

    // 自动化功能：AI中心自动升级建筑
    const autoUpgradeBuildings = () => {
      if (buildings.value.aiCenter && buildings.value.aiCenter.unlocked && buildings.value.aiCenter.count > 0) {
        Object.entries(buildings.value).forEach(([name, building]) => {
          if (building.unlocked && canAfford(building.upgradeCost)) {
            upgradeBuilding(name)
          }
        })
      }
    }

    // 扩展事件类型
    // 宇宙灾变：产出减半60秒
    // 贸易繁荣：纳米材料产出翻倍60秒
    const triggerRandomEvent = () => {
      if (gameTime.value > 0 && gameTime.value % 300 === 0) {
        const rand = Math.random()
        if (rand < 0.1) {
          // 科技突破
          activeEvent.value = {
            type: 'breakthrough',
            title: '科技突破',
            description: '全体产出翻倍，持续60秒',
            duration: 60,
            remaining: 60
          }
          eventBonus.value = 2
          addEvent({
            timestamp: Date.now(),
            title: '科技突破',
            description: '全体产出翻倍，持续60秒',
            type: 'breakthrough'
          })
        } else if (rand < 0.18) {
          // 宇宙灾变
          activeEvent.value = {
            type: 'disaster',
            title: '宇宙灾变',
            description: '所有产出减半，持续60秒',
            duration: 60,
            remaining: 60
          }
          eventBonus.value = 0.5
          addEvent({
            timestamp: Date.now(),
            title: '宇宙灾变',
            description: '所有产出减半，持续60秒',
            type: 'disaster'
          })
        } else if (rand < 0.25) {
          // 贸易繁荣
          activeEvent.value = {
            type: 'tradeboom',
            title: '贸易繁荣',
            description: '纳米材料产出翻倍，持续60秒',
            duration: 60,
            remaining: 60
          }
          eventBonus.value = 1
          addEvent({
            timestamp: Date.now(),
            title: '贸易繁荣',
            description: '纳米材料产出翻倍，持续60秒',
            type: 'tradeboom'
          })
        }
      }
    }

    // 事件倒计时与结束
    const updateEvent = () => {
      if (activeEvent.value) {
        activeEvent.value.remaining--
        if (activeEvent.value.remaining <= 0) {
          eventBonus.value = 1
          activeEvent.value = null
        }
      }
    }

    // 计算属性
    const civilizationSurvival = computed(() => {
      const knowledgeDensity = Math.log10(resources.value.knowledge + 1)
      const energyDensity = Math.log10(resources.value.energy + 1)
      const entropyRate = universeEntropyRate.value
      return (knowledgeDensity * energyDensity) / entropyRate
    })

    const canAfford = cost => {
      return Object.entries(cost).every(([resource, amount]) => resources.value[resource] >= amount)
    }

    const totalProduction = computed(() => {
      let total = 0
      Object.entries(buildings.value).forEach(([building, data]) => {
        total += data.count * data.production
      })
      return total
    })

    // 文明特性
    const traits = [
      { key: 'energy', name: '节能优先', desc: '能量产出+20%' },
      { key: 'knowledge', name: '科技至上', desc: '知识产出+20%' },
      { key: 'matter', name: '资源极大化', desc: '物质产出+20%' }
    ]
    const selectedTrait = ref(null)

    // 产出加成
    const getTraitBonus = type => {
      if (!selectedTrait.value) return 1
      return selectedTrait.value === type ? 1.2 : 1
    }

    // 文明时代（移除原始时代）
    const eras = [
      { key: 'industrial', name: '工业时代' },
      { key: 'info', name: '信息时代' },
      { key: 'space', name: '太空时代' },
      { key: 'singularity', name: '奇点时代' },
      { key: 'ultimate', name: '终极时代' }
    ]
    const currentEra = ref(eras[0].key)
    const currentEraName = computed(() => eras.find(e => e.key === currentEra.value)?.name || '')

    // 熵减阶段与文明时代映射
    const stageEraMap = {
      molecularCooling: 'industrial',
      stellarExtinction: 'info',
      blackholeDecompression: 'space',
      energyMaterialization: 'singularity',
      universalUnification: 'ultimate'
    }

    // 修改 completeEntropyStage，在推进熵减阶段时同步推进文明时代
    const completeEntropyStage = stageKey => {
      const stage = entropyReductionStages.value[stageKey]
      if (!stage) return

      // 解锁下一个阶段
      const stageOrder = [
        'atomicOrdering',
        'molecularCooling',
        'stellarExtinction',
        'blackholeDecompression',
        'energyMaterialization',
        'universalUnification'
      ]

      const currentIndex = stageOrder.indexOf(stageKey)
      if (currentIndex < stageOrder.length - 1) {
        const nextStageKey = stageOrder[currentIndex + 1]
        entropyReductionStages.value[nextStageKey].unlocked = true
        currentEntropyStage.value = nextStageKey

        // 触发阶段完成事件
        addEvent({
          timestamp: Date.now(),
          title: '熵减突破',
          description: `完成${stage.name}阶段，解锁${entropyReductionStages.value[nextStageKey].name}`,
          type: 'entropy'
        })
      }

      // 文明时代推进（从 molecularCooling 开始）
      if (stageEraMap[stageKey]) {
        currentEra.value = stageEraMap[stageKey]

        // 新时代奖励
        // 1. 全体科技效率提升
        Object.values(technologies.value).forEach(tech => {
          if (tech.unlocked) tech.efficiency *= 1.1 // +10%
        })
        // 2. 全体建筑产出提升
        Object.values(buildings.value).forEach(building => {
          if (building.unlocked) building.production = Math.ceil(building.production * 1.1)
        })
        // 3. 一次性资源奖励
        resources.value.energy += 1000 * (eras.findIndex(e => e.key === currentEra.value) + 1)
        resources.value.matter += 1000 * (eras.findIndex(e => e.key === currentEra.value) + 1)
        resources.value.knowledge += 500 * (eras.findIndex(e => e.key === currentEra.value) + 1)
        // 4. 文明基因奖励
        resources.value.civilizationGenes += 1

        // 5. 事件提示
        events.value.unshift({
          timestamp: Date.now(),
          title: '文明进化',
          description: `进入${
            eras.find(e => e.key === currentEra.value)?.name
          }！\n\n奖励：科技效率+10%，建筑产出+10%，获得大量资源与文明基因。`,
          type: 'era'
        })
      }

      // 解锁相关科技
      unlockStageTechnologies(stageKey)
    }

    // 建筑-科技映射表：决定每个建筑受哪项科技效率影响
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

    // 熵减进程相关函数
    const performEntropyReduction = (times = 1) => {
      for (let i = 0; i < times; i++) {
        const currentStage = entropyReductionStages.value[currentEntropyStage.value]
        if (!currentStage || !currentStage.unlocked) return
        if (!canAfford(currentStage.cost)) return
        Object.entries(currentStage.cost).forEach(([resource, amount]) => {
          resources.value[resource] -= amount
        })
        const reductionAmount = currentStage.efficiency * getEntropyReductionBonus()
        currentStage.progress += reductionAmount
        if (currentStage.progress >= currentStage.maxProgress) {
          completeEntropyStage(currentEntropyStage.value)
          break // 阶段完成后停止批量
        }
        entropyReductionRate.value += reductionAmount
      }
    }

    const getEntropyReductionBonus = () => {
      let bonus = 1

      // 量子计算机提升熵减效率
      if (buildings.value.quantumComputer.count > 0) {
        bonus += buildings.value.quantumComputer.count * buildings.value.quantumComputer.level * 0.1
      }

      // 时空传送门提升时空操控能力
      if (buildings.value.spacetimePortal.count > 0) {
        bonus += buildings.value.spacetimePortal.count * buildings.value.spacetimePortal.level * 0.2
      }

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

    const unlockStageTechnologies = stageKey => {
      const stageTechMap = {
        atomicOrdering: ['atomicManipulation'],
        molecularCooling: [
          'thermalControl',
          'quantumComputing',
          'lowPotentialTrapTech',
          'quantumDecoherenceTech',
          'brownianCaptureTech'
        ],
        stellarExtinction: ['stellarEngineering'],
        blackholeDecompression: ['blackholePhysics', 'spacetimeManipulation'],
        energyMaterialization: ['energyConversion'],
        universalUnification: ['universalTheory']
      }

      const techsToUnlock = stageTechMap[stageKey] || []
      techsToUnlock.forEach(techKey => {
        if (technologies.value[techKey]) {
          technologies.value[techKey].unlocked = true
        }
      })
    }

    const unlockEntropyStage = stageKey => {
      if (entropyReductionStages.value[stageKey]) {
        entropyReductionStages.value[stageKey].unlocked = true
      }
    }

    // 游戏逻辑
    const updateGame = () => {
      gameTime.value++
      // 更新三体运动偏差
      tripleStarDeviation.value = Math.log10(civilizationLevel.value + 1 + gameTime.value / 100000)
      const isChaosEra = tripleStarDeviation.value > 0.5

      // 更新资源生产
      Object.entries(buildings.value).forEach(([building, data]) => {
        if (data.count > 0) {
          // 获取对应科技效率，未解锁则为1
          let techEff = 1
          const techKey = buildingTechMap[building]
          if (techKey && technologies.value[techKey]) {
            techEff = technologies.value[techKey].efficiency || 1
          }

          // 检查建筑是否属于当前熵减阶段
          const isCurrentStageBuilding = data.entropyStage === currentEntropyStage.value
          const stageBonus = isCurrentStageBuilding ? 2 : 1 // 当前阶段建筑产出翻倍

          let prod = isChaosEra
            ? 0
            : data.production *
              data.level *
              data.count *
              (universeState.value === 'order' ? 3 : 0.1) *
              techEff *
              stageBonus

          // 能量产出
          if (
            [
              'atomicSorter',
              'molecularCooler',
              'stellarExtinguisher',
              'blackholeDecompressor',
              'energyMaterializer',
              'universalUnifier'
            ].includes(building)
          ) {
            resources.value.energy += prod * getTraitBonus('energy')
          }

          // 物质产出
          if (
            [
              'atomicSorter',
              'molecularCooler',
              'stellarExtinguisher',
              'blackholeDecompressor',
              'energyMaterializer',
              'universalUnifier'
            ].includes(building)
          ) {
            resources.value.matter += prod * getTraitBonus('matter')
          }

          // 知识产出
          if (building === 'quantumComputer') {
            resources.value.knowledge += isChaosEra
              ? 0
              : data.count * 0.5 * data.level * getTraitBonus('knowledge') * techEff
          } else {
            resources.value.knowledge += isChaosEra
              ? 0
              : data.count * 0.1 * data.level * getTraitBonus('knowledge') * techEff
          }

          // 特殊资源产出
          if (building === 'stellarExtinguisher') {
            resources.value.darkMatter += prod * 0.1 * getTraitBonus('matter')
          }
          if (building === 'blackholeDecompressor') {
            resources.value.antiMatter += prod * 0.2 * getTraitBonus('matter')
          }
          if (building === 'energyMaterializer') {
            resources.value.nanoMaterial += prod * 0.3 * getTraitBonus('matter')
          }

          // 低势能陷阱产出
          if (building === 'lowPotentialTrap') {
            resources.value.energy += data.count * data.level * data.production.energy
            resources.value.matter += data.count * data.level * data.production.matter
          }
          // 量子退相干抑制器产出
          if (building === 'quantumDecoherenceSuppressor') {
            resources.value.energy += data.count * data.level * data.production.energy // 负数，消耗
            resources.value.quantumBits += data.count * data.level * data.production.quantumBits
          }
          // 布朗运动捕获网加成
          if (building === 'brownianCaptureNet') {
            // 记录加成，后续用于原子排序器
            brownianBonus = 1 + 0.2 * data.count * data.level
          }
        }
      })

      // 在原子排序器产出时加上 brownianBonus
      let brownianBonus = 1
      if (buildings.value.brownianCaptureNet && buildings.value.brownianCaptureNet.count > 0) {
        brownianBonus = 1 + 0.2 * buildings.value.brownianCaptureNet.count * buildings.value.brownianCaptureNet.level
      }
      if (buildings.value.atomicSorter && buildings.value.atomicSorter.count > 0) {
        // 原有产出 × brownianBonus
        resources.value.energy +=
          buildings.value.atomicSorter.count *
          buildings.value.atomicSorter.level *
          buildings.value.atomicSorter.production *
          brownianBonus
      }

      // 更新熵减速率
      entropyReductionRate.value = totalProduction.value * (universeState.value === 'order' ? 3 : 0.1)

      // 更新坐标暴露值
      let stealthReduction = 0
      if (buildings.value.stealthGenerator && buildings.value.stealthGenerator.count > 0) {
        stealthReduction = buildings.value.stealthGenerator.count * buildings.value.stealthGenerator.level * 1 // 每个每秒-1
      }
      coordinateExposure.value = Math.max(
        0,
        coordinateExposure.value +
          (resources.value.energy * Math.pow(civilizationLevel.value + 1, 2)) / 1000000 -
          stealthReduction
      )

      // 科技影响暴露值增长速率
      let stealthRate = 1
      if (technologies.value.stealthAlgorithm && technologies.value.stealthAlgorithm.unlocked) {
        stealthRate -= 0.1 * technologies.value.stealthAlgorithm.level // 每级-10%
      }
      coordinateExposure.value = Math.max(
        0,
        coordinateExposure.value +
          ((resources.value.energy * Math.pow(civilizationLevel.value + 1, 2)) / 1000000) * stealthRate -
          stealthReduction
      )

      // 检查宇宙状态切换
      if (entropyReductionRate.value > universeEntropyRate.value && universeState.value === 'chaos') {
        universeState.value = 'order'
        setTimeout(() => {
          universeState.value = 'chaos'
        }, 72 * 60 * 60 * 1000) // 72小时有序态
      }

      // 检查黑暗森林打击
      const darkForestLevel = 10
      let strikeChance = 1
      if (civilizationLevel.value > darkForestLevel) {
        strikeChance = 0.1 // 只剩10%概率
      }
      if (Math.random() < strikeChance) {
        // 惩罚递增
        const baseLoss = 1000
        const knowledgeLoss = baseLoss * (1 + 0.2 * civilizationLevel.value)
        resources.value.knowledge = Math.max(0, resources.value.knowledge - knowledgeLoss)
        Object.values(technologies.value).forEach(tech => {
          if (tech.unlocked) {
            tech.efficiency *= Math.exp(-0.05 * civilizationLevel.value)
          }
        })
        events.value.unshift({
          timestamp: Date.now(),
          title: '降维打击',
          description: `由于坐标暴露过高，文明遭受降维打击，损失${Math.round(knowledgeLoss)}知识，科技效率下降！`,
          type: 'strike'
        })
      } else if (civilizationLevel.value > darkForestLevel) {
        events.value.unshift({
          timestamp: Date.now(),
          title: '黑暗森林突破',
          description: '你的文明已超越黑暗森林，降维打击对你无效！',
          type: 'strike'
        })
      }

      // 更新文明等级
      updateCivilizationLevel()

      // 事件触发和倒计时
      triggerRandomEvent()
      updateEvent()
      autoUpgradeBuildings()
    }

    const addEvent = event => {
      events.value.unshift(event)
      if (events.value.length > 20) {
        events.value.length = 20
      }
    }

    const updateCivilizationLevel = () => {
      const newLevel = Math.floor(Math.log10(resources.value.knowledge + 1))
      if (newLevel > civilizationLevel.value) {
        civilizationLevel.value = newLevel
        // 奖励：所有科技效率提升
        Object.values(technologies.value).forEach(tech => {
          if (tech.unlocked) tech.efficiency *= 1.05
        })
        addEvent({
          timestamp: Date.now(),
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
          timestamp: Date.now(),
          title: '文明退化',
          description: '文明等级下降，科技效率降低！',
          type: 'punish'
        })
      }
    }

    const buildStructure = buildingName => {
      const building = buildings.value[buildingName]
      if (!building || !building.unlocked || !canAfford(building.cost)) return

      // 检查是否属于当前熵减阶段
      if (building.entropyStage && building.entropyStage !== currentEntropyStage.value) {
        return // 只能建造当前阶段的建筑
      }

      Object.entries(building.cost).forEach(([resource, amount]) => {
        resources.value[resource] -= amount
      })
      building.count++

      // 更新成本（基于当前数量）
      const baseCosts = {
        atomicSorter: { matter: 10, energy: 5 },
        molecularCooler: { matter: 100, energy: 50 },
        stellarExtinguisher: { matter: 1000, energy: 500, darkMatter: 10 },
        blackholeDecompressor: { matter: 10000, energy: 5000, darkMatter: 100, antiMatter: 50 },
        energyMaterializer: { matter: 100000, energy: 50000, darkMatter: 500, antiMatter: 200 },
        universalUnifier: { matter: 1000000, energy: 500000, darkMatter: 1000, antiMatter: 500, nanoMaterial: 100 },
        quantumComputer: { matter: 1000, energy: 500, quantumBits: 10 },
        spacetimePortal: { matter: 100000, energy: 50000, darkMatter: 100 },
        lowPotentialTrap: { matter: 200, energy: 100 },
        quantumDecoherenceSuppressor: { matter: 300, energy: 200 },
        brownianCaptureNet: { matter: 150, energy: 80 },
        stealthGenerator: { matter: 2000, energy: 1000 }
      }

      if (baseCosts[buildingName]) {
        building.cost = Object.fromEntries(
          Object.entries(baseCosts[buildingName]).map(([resource, amount]) => [
            resource,
            Math.floor(amount * Math.pow(1.15, building.count))
          ])
        )
      }
    }

    const unlockTechnology = techName => {
      const tech = technologies.value[techName]
      if (!tech.unlocked && canAfford(getTechCost(techName)) && canUnlockTech(techName)) {
        tech.unlocked = true
        tech.level = 1
        // 扣除资源
        const cost = getTechCost(techName)
        Object.entries(cost).forEach(([resource, amount]) => {
          resources.value[resource] -= amount
        })
        // 解锁新建筑
        unlockBuildingByTech(techName)
      }
    }

    const getTechCost = techName => {
      const costs = {
        fire: { energy: 10, matter: 5 },
        agriculture: { energy: 50, matter: 20 },
        metallurgy: { energy: 200, matter: 100 },
        mining: { energy: 400, matter: 300 },
        electricity: { energy: 1000, matter: 500 },
        nuclear: { energy: 5000, matter: 2000, knowledge: 100 },
        quantum: { energy: 20000, matter: 10000, knowledge: 1000 },
        spacetime: { energy: 100000, matter: 50000, knowledge: 10000, darkMatter: 50 },
        vacuum: { energy: 500000, matter: 200000, knowledge: 100000, darkMatter: 500 },
        eco: { energy: 800, matter: 400, knowledge: 50 },
        gene: { energy: 2000, matter: 1000, knowledge: 200 },
        deepSpace: { energy: 100000, matter: 50000, knowledge: 10000, darkMatter: 50 },
        ai: { energy: 20000, matter: 10000, knowledge: 1000, quantumBits: 50 },
        trade: { energy: 1000, matter: 500, knowledge: 50 },
        blackhole: { energy: 500000, matter: 200000, knowledge: 100000, darkMatter: 500 },
        stealthAlgorithm: { energy: 1000, matter: 500, knowledge: 50 }
      }
      return costs[techName] || {}
    }

    const saveCivilizationGenes = () => {
      if (resources.value.energy >= 1000 && resources.value.knowledge >= 100) {
        resources.value.energy -= 1000
        resources.value.knowledge -= 100
        resources.value.civilizationGenes++
        // 保存关键技术效率
        Object.values(technologies.value).forEach(tech => {
          if (tech.unlocked) {
            tech.efficiency = Math.max(tech.efficiency, 0.1) // 防止效率归零
          }
        })
      }
    }

    // 建筑升级方法
    const upgradeBuilding = buildingName => {
      const building = buildings.value[buildingName]
      if (canAfford(building.upgradeCost)) {
        Object.entries(building.upgradeCost).forEach(([resource, amount]) => {
          resources.value[resource] -= amount
        })
        building.level++
        building.production = Math.max(1, Math.ceil(building.production * 1.5))
        // 升级消耗递增
        building.upgradeCost = Object.fromEntries(
          Object.entries(building.upgradeCost).map(([resource, amount]) => [resource, Math.floor(amount * 1.7)])
        )
      }
    }

    // 解锁新建筑逻辑扩展
    const unlockBuildingByTech = techName => {
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
        stealthAlgorithm: 'stealthGenerator'
      }
      const buildingName = techToBuilding[techName]
      if (buildingName && buildings.value[buildingName]) {
        buildings.value[buildingName].unlocked = true
      }
    }

    // 判断科技是否可解锁
    const canUnlockTech = name => {
      const tech = technologies.value[name]
      if (tech.unlocked) return false
      if (!tech.prerequisites || tech.prerequisites.length === 0) return true
      return tech.prerequisites.every(prereq => technologies.value[prereq].unlocked)
    }

    // 时代分支系统
    const eraBranches = {
      industrial: [
        { key: 'mechanization', name: '机械化', desc: '机械产出+30%，解锁机械工厂' },
        { key: 'electrification', name: '电气化', desc: '能量产出+30%，解锁电站' }
      ],
      info: [
        { key: 'ai', name: '人工智能', desc: 'AI相关科技与建筑开放' },
        { key: 'eco', name: '生态优先', desc: '生态科技与建筑开放' }
      ]
    }
    const selectedBranch = ref({})

    // 进入新时代时弹窗选择分支
    const branchChoiceRequired = computed(() => {
      const era = eras.find(e => e.key === currentEra.value)
      return era && eraBranches[era.key] && !selectedBranch.value[era.key]
    })

    // 分支影响科技和建筑解锁
    const isBranchUnlocked = branchKey => {
      const era = eras.find(e => e.key === currentEra.value)
      return selectedBranch.value[era?.key] === branchKey
    }

    return {
      // 状态
      gameTime,
      civilizationLevel,
      entropyReductionRate,
      universeEntropyRate,
      coordinateExposure,
      concealmentAbility,
      resources,
      technologies,
      buildings,
      universeState,
      tripleStarDeviation,
      reaperThreat,
      events,
      activeEvent,
      eventBonus,
      traits,
      selectedTrait,
      getTraitBonus,
      eras,
      currentEra,
      currentEraName,
      // 熵减系统
      entropyReductionStages,
      currentEntropyStage,
      // 计算属性
      civilizationSurvival,
      canAfford,
      totalProduction,
      // 方法
      updateGame,
      buildStructure,
      unlockTechnology,
      saveCivilizationGenes,
      upgradeBuilding,
      canUnlockTech,
      eraBranches,
      selectedBranch,
      branchChoiceRequired,
      isBranchUnlocked,
      // 熵减方法
      performEntropyReduction,
      getEntropyReductionBonus,
      getCurrentStageTech,
      completeEntropyStage,
      unlockEntropyStage
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
