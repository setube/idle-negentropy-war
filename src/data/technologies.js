// 科技静态数据，仅包含静态属性，不含动态状态
export default {
  // 基础科技 - 支持原子级熵减
  atomicManipulation: {
    unlocked: true,
    efficiency: 1,
    prerequisites: [],
    cost: { energy: 10, matter: 5 },
    group: '基础科技',
    effect: '解锁原子排序能力',
    entropyStage: 'atomicOrdering'
  },
  thermalControl: {
    group: '热控制',
    effect: '通过精确控制分子热运动，降低系统温度，为更高阶有序度打下基础。',
    unlocked: false,
    efficiency: 1.2,
    cost: { energy: 50, matter: 20, knowledge: 10 },
    entropyStage: 'molecularCooling',
    prerequisites: ['atomicManipulation']
  },
  // 恒星科技 - 支持恒星级熵减
  stellarEngineering: {
    unlocked: false,
    efficiency: 1,
    cost: { energy: 200, matter: 100, knowledge: 50 },
    prerequisites: ['thermalControl'],
    group: '恒星科技',
    effect: '解锁恒星熄灭能力',
    entropyStage: 'stellarExtinction'
  },
  // 黑洞科技 - 支持黑洞级熵减
  blackholePhysics: {
    unlocked: false,
    efficiency: 1,
    cost: { energy: 1000, matter: 500, knowledge: 200, darkMatter: 10 },
    prerequisites: ['stellarEngineering'],
    group: '黑洞科技',
    effect: '解锁黑洞解压能力',
    entropyStage: 'blackholeDecompression'
  },
  // 宇宙科技 - 支持宇宙级熵减
  energyConversion: {
    unlocked: false,
    efficiency: 1,
    cost: { energy: 5000, matter: 2000, knowledge: 1000, darkMatter: 100 },
    prerequisites: ['blackholePhysics'],
    group: '宇宙科技',
    effect: '解锁能量物质化能力',
    entropyStage: 'energyMaterialization'
  },
  universalTheory: {
    unlocked: false,
    efficiency: 1,
    cost: { energy: 20000, matter: 10000, knowledge: 5000, darkMatter: 500, antiMatter: 100 },
    prerequisites: ['energyConversion'],
    group: '宇宙科技',
    effect: '解锁宇宙单一化能力',
    entropyStage: 'universalUnification'
  },
  quantumComputing: {
    unlocked: false,
    efficiency: 1,
    cost: { energy: 100, matter: 50, knowledge: 20 },
    prerequisites: ['thermalControl'],
    group: '高等科技',
    effect: '提升熵减计算效率',
    entropyStage: 'molecularCooling'
  },
  spacetimeManipulation: {
    unlocked: false,
    efficiency: 1,
    cost: { energy: 2000, matter: 1000, knowledge: 500, darkMatter: 50 },
    prerequisites: ['stellarEngineering'],
    group: '宇宙科技',
    effect: '提升时空操控能力',
    entropyStage: 'universalUnification'
  },
  lowPotentialTrapTech: {
    unlocked: false,
    efficiency: 1,
    cost: { energy: 500, matter: 200, knowledge: 100 },
    prerequisites: ['thermalControl'],
    group: '分子冷却科技',
    effect: '解锁低势能陷阱',
    entropyStage: 'molecularCooling'
  },
  quantumDecoherenceTech: {
    unlocked: false,
    efficiency: 1,
    cost: { energy: 1000, matter: 500, knowledge: 200 },
    prerequisites: ['thermalControl'],
    group: '分子冷却科技',
    effect: '解锁量子退相干抑制器',
    entropyStage: 'molecularCooling'
  },
  brownianCaptureTech: {
    unlocked: false,
    efficiency: 1,
    cost: { energy: 2000, matter: 1000, knowledge: 500 },
    prerequisites: ['thermalControl'],
    group: '分子冷却科技',
    effect: '解锁布朗运动捕获网',
    entropyStage: 'molecularCooling'
  },
  // 新科技
  stealthAlgorithm: {
    unlocked: false,
    efficiency: 1,
    cost: { energy: 5000, matter: 2000, knowledge: 1000 },
    prerequisites: ['stellarEngineering'],
    group: '隐匿科技',
    effect: '解锁隐匿发生器，降低暴露值增长速率',
    entropyStage: 'stellarExtinction'
  },
  darkMatterExtraction: {
    group: '暗物质提取',
    effect: '提升暗物质收集器的产出效率。',
    unlocked: false,
    efficiency: 1.5, // 产出提升倍率
    cost: { energy: 5000, matter: 2000, knowledge: 10000 },
    entropyStage: 'stellarExtinction'
  },
  antiMatterSynthesis: {
    group: '反物质合成',
    effect: '提升反物质合成器的产出效率。',
    unlocked: false,
    efficiency: 2, // 产出提升倍率
    cost: { knowledge: 20000, energy: 100000, darkMatter: 10000 },
    entropyStage: 'blackholeDecompression',
    prerequisites: ['blackholePhysics']
  },
  nanoManufacturing: {
    group: '纳米制造',
    effect: '提升纳米工厂的产出效率。',
    unlocked: false,
    efficiency: 2, // 产出提升倍率
    cost: { knowledge: 5000, energy: 5000, matter: 2000 },
    entropyStage: 'molecularCooling',
    prerequisites: ['thermalControl']
  }
}
