// 无限递归成就类型配置
export default [
  // 资源类成就
  {
    id: 'energy_achievement',
    name: '能量大师',
    desc: '累计获得能量',
    type: 'resource',
    resource: ['energy'],
    baseTarget: 100,
    targetMultiplier: 10,
    baseReward: 10,
    rewardMultiplier: 2,
    reward: { energy: 10 }
  },
  {
    id: 'matter_achievement',
    name: '物质富翁',
    desc: '累计获得物质',
    type: 'resource',
    resource: ['matter'],
    baseTarget: 100,
    targetMultiplier: 10,
    baseReward: 10,
    rewardMultiplier: 2,
    reward: { matter: 10 }
  },
  {
    id: 'knowledge_achievement',
    name: '知识渊博',
    desc: '累计获得知识',
    type: 'resource',
    resource: ['knowledge'],
    baseTarget: 100,
    targetMultiplier: 10,
    baseReward: 10,
    rewardMultiplier: 2,
    reward: { knowledge: 10 }
  },
  {
    id: 'darkMatter_achievement',
    name: '暗物质猎手',
    desc: '累计获得暗物质',
    type: 'resource',
    resource: ['darkMatter'],
    baseTarget: 100,
    targetMultiplier: 10,
    baseReward: 10,
    rewardMultiplier: 2,
    reward: { darkMatter: 10 }
  },
  {
    id: 'antiMatter_achievement',
    name: '反物质专家',
    desc: '累计获得反物质',
    type: 'resource',
    resource: ['antiMatter'],
    baseTarget: 100,
    targetMultiplier: 10,
    baseReward: 10,
    rewardMultiplier: 2,
    reward: { antiMatter: 10 }
  },
  {
    id: 'nanoMaterial_achievement',
    name: '纳米材料大师',
    desc: '累计获得纳米材料',
    type: 'resource',
    resource: ['nanoMaterial'],
    baseTarget: 100,
    targetMultiplier: 10,
    baseReward: 10,
    rewardMultiplier: 2,
    reward: { nanoMaterial: 10 }
  },
  {
    id: 'quantumBits_achievement',
    name: '量子比特大师',
    desc: '累计获得量子比特',
    type: 'resource',
    resource: ['quantumBits'],
    baseTarget: 100,
    targetMultiplier: 10,
    baseReward: 10,
    rewardMultiplier: 2,
    reward: { quantumBits: 10 }
  },
  {
    id: 'bioOrder_achievement',
    name: '生物有序度大师',
    desc: '累计获得生物有序度',
    type: 'resource',
    resource: ['bioOrder'],
    baseTarget: 100,
    targetMultiplier: 10,
    baseReward: 10,
    rewardMultiplier: 2,
    reward: { bioOrder: 10 }
  },
  // 建筑类成就
  {
    id: 'build_atomicSorter',
    name: '原子排序器建造者',
    desc: '累计建造原子排序器',
    type: 'building',
    resource: ['energy'],
    building: 'atomicSorter',
    baseTarget: 10,
    targetMultiplier: 2,
    baseReward: 5,
    rewardMultiplier: 2,
    reward: { energy: 5 }
  },
  {
    id: 'build_molecularCooler',
    name: '分子冷却器建造者',
    desc: '累计建造分子冷却器',
    type: 'building',
    resource: ['energy'],
    building: 'molecularCooler',
    baseTarget: 10,
    targetMultiplier: 2,
    baseReward: 5,
    rewardMultiplier: 2,
    reward: { energy: 5 }
  },
  {
    id: 'build_stellarExtinguisher',
    name: '恒星熄灭器建造者',
    desc: '累计建造恒星熄灭器',
    type: 'building',
    resource: ['energy'],
    building: 'stellarExtinguisher',
    baseTarget: 10,
    targetMultiplier: 2,
    baseReward: 5,
    rewardMultiplier: 2,
    reward: { energy: 5 }
  },
  {
    id: 'build_blackholeDecompressor',
    name: '黑洞解压器建造者',
    desc: '累计建造黑洞解压器',
    type: 'building',
    resource: ['energy'],
    building: 'blackholeDecompressor',
    baseTarget: 10,
    targetMultiplier: 2,
    baseReward: 5,
    rewardMultiplier: 2,
    reward: { energy: 5 }
  },
  {
    id: 'build_energyMaterializer',
    name: '能量物质化器建造者',
    desc: '累计建造能量物质化器',
    type: 'building',
    resource: ['energy'],
    building: 'energyMaterializer',
    baseTarget: 10,
    targetMultiplier: 2,
    baseReward: 5,
    rewardMultiplier: 2,
    reward: { energy: 5 }
  },
  {
    id: 'build_universalUnifier',
    name: '宇宙单一化器建造者',
    desc: '累计建造宇宙单一化器',
    type: 'building',
    resource: ['energy'],
    building: 'universalUnifier',
    baseTarget: 10,
    targetMultiplier: 2,
    baseReward: 5,
    rewardMultiplier: 2,
    reward: { energy: 5 }
  },
  {
    id: 'build_quantumComputer',
    name: '量子计算机建造者',
    desc: '累计建造量子计算机',
    type: 'building',
    resource: ['quantumBits'],
    building: 'quantumComputer',
    baseTarget: 10,
    targetMultiplier: 2,
    baseReward: 5,
    rewardMultiplier: 2,
    reward: { quantumBits: 5 }
  },
  {
    id: 'build_spacetimePortal',
    name: '时空传送门建造者',
    desc: '累计建造时空传送门',
    type: 'building',
    resource: ['energy'],
    building: 'spacetimePortal',
    baseTarget: 10,
    targetMultiplier: 2,
    baseReward: 5,
    rewardMultiplier: 2,
    reward: { energy: 5 }
  },
  {
    id: 'build_lowPotentialTrap',
    name: '低势能陷阱建造者',
    desc: '累计建造低势能陷阱',
    type: 'building',
    resource: ['energy'],
    building: 'lowPotentialTrap',
    baseTarget: 10,
    targetMultiplier: 2,
    baseReward: 5,
    rewardMultiplier: 2,
    reward: { energy: 5 }
  },
  {
    id: 'build_quantumDecoherenceSuppressor',
    name: '量子退相干抑制器建造者',
    desc: '累计建造量子退相干抑制器',
    type: 'building',
    resource: ['quantumBits'],
    building: 'quantumDecoherenceSuppressor',
    baseTarget: 10,
    targetMultiplier: 2,
    baseReward: 5,
    rewardMultiplier: 2,
    reward: { quantumBits: 5 }
  },
  {
    id: 'build_brownianCaptureNet',
    name: '布朗运动捕获网建造者',
    desc: '累计建造布朗运动捕获网',
    type: 'building',
    resource: ['energy'],
    building: 'brownianCaptureNet',
    baseTarget: 10,
    targetMultiplier: 2,
    baseReward: 5,
    rewardMultiplier: 2,
    reward: { energy: 5 }
  },
  {
    id: 'build_stealthGenerator',
    name: '隐匿发生器建造者',
    desc: '累计建造隐匿发生器',
    type: 'building',
    resource: ['energy'],
    building: 'stealthGenerator',
    baseTarget: 10,
    targetMultiplier: 2,
    baseReward: 5,
    rewardMultiplier: 2,
    reward: { energy: 5 }
  },
  {
    id: 'build_antiMatterSynthesizer',
    name: '反物质合成器建造者',
    desc: '累计建造反物质合成器',
    type: 'building',
    resource: ['antiMatter'],
    building: 'antiMatterSynthesizer',
    baseTarget: 10,
    targetMultiplier: 2,
    baseReward: 5,
    rewardMultiplier: 2,
    reward: { antiMatter: 5 }
  },
  {
    id: 'build_darkMatterCollector',
    name: '暗物质收集器建造者',
    desc: '累计建造暗物质收集器',
    type: 'building',
    resource: ['darkMatter'],
    building: 'darkMatterCollector',
    baseTarget: 10,
    targetMultiplier: 2,
    baseReward: 5,
    rewardMultiplier: 2,
    reward: { darkMatter: 5 }
  },
  {
    id: 'build_aotoumRealityPerforator',
    name: '奥陶姆现实透孔仪建造者',
    desc: '累计建造奥陶姆现实透孔仪',
    type: 'building',
    resource: ['nanoMaterial'],
    building: 'aotoumRealityPerforator',
    baseTarget: 10,
    targetMultiplier: 2,
    baseReward: 5,
    rewardMultiplier: 2,
    reward: { nanoMaterial: 5 }
  },
  {
    id: 'build_crystalDefectRepairer',
    name: '晶体缺陷修仪建造者',
    desc: '累计建造晶体缺陷修仪',
    type: 'building',
    resource: ['nanoMaterial'],
    building: 'crystalDefectRepairer',
    baseTarget: 10,
    targetMultiplier: 2,
    baseReward: 5,
    rewardMultiplier: 2,
    reward: { nanoMaterial: 5 }
  },
  {
    id: 'build_bioEntropyStabilizer',
    name: '生物熵稳定舱建造者',
    desc: '累计建造生物熵稳定舱',
    type: 'building',
    resource: ['bioOrder'],
    building: 'bioEntropyStabilizer',
    baseTarget: 10,
    targetMultiplier: 2,
    baseReward: 5,
    rewardMultiplier: 2,
    reward: { bioOrder: 5 }
  },
  {
    id: 'build_orbitalOptimizer',
    name: '行星轨道优化器建造者',
    desc: '累计建造行星轨道优化器',
    type: 'building',
    resource: ['energy'],
    building: 'orbitalOptimizer',
    baseTarget: 10,
    targetMultiplier: 2,
    baseReward: 5,
    rewardMultiplier: 2,
    reward: { energy: 5 }
  },
  {
    id: 'build_nanoFactory',
    name: '纳米工厂建造者',
    desc: '累计建造纳米工厂',
    type: 'building',
    resource: ['nanoMaterial'],
    building: 'nanoFactory',
    baseTarget: 10,
    targetMultiplier: 2,
    baseReward: 5,
    rewardMultiplier: 2,
    reward: { nanoMaterial: 5 }
  },
  // 科技类成就
  {
    id: 'unlock_atomicManipulation',
    name: '原子操控解锁者',
    desc: '解锁科技：原子操控',
    type: 'tech',
    tech: 'atomicManipulation',
    baseReward: 20,
    reward: { knowledge: 20 },
    once: true
  },
  {
    id: 'unlock_thermalControl',
    name: '热控先锋',
    desc: '解锁科技：热控制',
    type: 'tech',
    tech: 'thermalControl',
    baseReward: 20,
    reward: { energy: 20, knowledge: 20 },
    once: true
  },
  {
    id: 'unlock_stellarEngineering',
    name: '恒星工程师',
    desc: '解锁科技：恒星工程',
    type: 'tech',
    tech: 'stellarEngineering',
    baseReward: 20,
    reward: { energy: 20, knowledge: 20 },
    once: true
  },
  {
    id: 'unlock_blackholePhysics',
    name: '黑洞物理学家',
    desc: '解锁科技：黑洞物理',
    type: 'tech',
    tech: 'blackholePhysics',
    baseReward: 20,
    reward: { darkMatter: 10, knowledge: 10 },
    once: true
  },
  {
    id: 'unlock_energyConversion',
    name: '能量转化大师',
    desc: '解锁科技：能量转化',
    type: 'tech',
    tech: 'energyConversion',
    baseReward: 20,
    reward: { energy: 20, knowledge: 20 },
    once: true
  },
  {
    id: 'unlock_universalTheory',
    name: '宇宙理论家',
    desc: '解锁科技：宇宙理论',
    type: 'tech',
    tech: 'universalTheory',
    baseReward: 20,
    reward: { energy: 20, knowledge: 20 },
    once: true
  },
  {
    id: 'unlock_quantumComputing',
    name: '量子计算先锋',
    desc: '解锁科技：量子计算',
    type: 'tech',
    tech: 'quantumComputing',
    baseReward: 20,
    reward: { knowledge: 20 },
    once: true
  },
  {
    id: 'unlock_spacetimeManipulation',
    name: '时空操控者',
    desc: '解锁科技：时空操控',
    type: 'tech',
    tech: 'spacetimeManipulation',
    baseReward: 20,
    reward: { energy: 20, knowledge: 20 },
    once: true
  },
  {
    id: 'unlock_lowPotentialTrapTech',
    name: '低势能陷阱专家',
    desc: '解锁科技：低势能陷阱',
    type: 'tech',
    tech: 'lowPotentialTrapTech',
    baseReward: 20,
    reward: { energy: 20, knowledge: 20 },
    once: true
  },
  {
    id: 'unlock_quantumDecoherenceTech',
    name: '量子退相干专家',
    desc: '解锁科技：量子退相干',
    type: 'tech',
    tech: 'quantumDecoherenceTech',
    baseReward: 20,
    reward: { quantumBits: 10, knowledge: 10 },
    once: true
  },
  {
    id: 'unlock_brownianCaptureTech',
    name: '布朗捕获专家',
    desc: '解锁科技：布朗运动捕获',
    type: 'tech',
    tech: 'brownianCaptureTech',
    baseReward: 20,
    reward: { energy: 20, knowledge: 20 },
    once: true
  },
  {
    id: 'unlock_stealthAlgorithm',
    name: '隐匿算法大师',
    desc: '解锁科技：隐匿算法',
    type: 'tech',
    tech: 'stealthAlgorithm',
    baseReward: 20,
    reward: { energy: 20, knowledge: 20 },
    once: true
  },
  {
    id: 'unlock_darkMatterExtraction',
    name: '暗物质提取专家',
    desc: '解锁科技：暗物质提取',
    type: 'tech',
    tech: 'darkMatterExtraction',
    baseReward: 20,
    reward: { darkMatter: 10, knowledge: 10 },
    once: true
  },
  {
    id: 'unlock_antiMatterSynthesis',
    name: '反物质合成专家',
    desc: '解锁科技：反物质合成',
    type: 'tech',
    tech: 'antiMatterSynthesis',
    baseReward: 20,
    reward: { antiMatter: 10, knowledge: 10 },
    once: true
  },
  {
    id: 'unlock_nanoManufacturing',
    name: '纳米制造专家',
    desc: '解锁科技：纳米制造',
    type: 'tech',
    tech: 'nanoManufacturing',
    baseReward: 20,
    reward: { nanoMaterial: 10, knowledge: 10 },
    once: true
  },
  // 熵减阶段成就
  {
    id: 'entropy_atomicOrdering',
    name: '原子排序突破',
    desc: '完成熵减阶段：原子排序',
    type: 'entropyStage',
    entropyStage: 'atomicOrdering',
    baseReward: 50,
    reward: { energy: 50, matter: 50 },
    once: true
  },
  {
    id: 'entropy_molecularCooling',
    name: '分子冷却突破',
    desc: '完成熵减阶段：分子冷却',
    type: 'entropyStage',
    entropyStage: 'molecularCooling',
    baseReward: 50,
    reward: { energy: 100, matter: 100 },
    once: true
  },
  {
    id: 'entropy_stellarExtinction',
    name: '恒星熄灭突破',
    desc: '完成熵减阶段：恒星熄灭',
    type: 'entropyStage',
    entropyStage: 'stellarExtinction',
    baseReward: 50,
    reward: { energy: 200, matter: 200, darkMatter: 20 },
    once: true
  },
  {
    id: 'entropy_blackholeDecompression',
    name: '黑洞解压突破',
    desc: '完成熵减阶段：黑洞解压',
    type: 'entropyStage',
    entropyStage: 'blackholeDecompression',
    baseReward: 50,
    reward: { energy: 500, matter: 500, darkMatter: 50, antiMatter: 10 },
    once: true
  },
  {
    id: 'entropy_energyMaterialization',
    name: '能量物质化突破',
    desc: '完成熵减阶段：能量物质化',
    type: 'entropyStage',
    entropyStage: 'energyMaterialization',
    baseReward: 50,
    reward: { energy: 1000, matter: 1000, nanoMaterial: 100 },
    once: true
  },
  {
    id: 'entropy_universalUnification',
    name: '宇宙单一化突破',
    desc: '完成熵减阶段：宇宙单一化',
    type: 'entropyStage',
    entropyStage: 'universalUnification',
    baseReward: 50,
    reward: { energy: 5000, matter: 5000, nanoMaterial: 500 },
    once: true
  },
  // 复合条件成就
  {
    id: 'compound_energy_quantumComputing',
    name: '能量与量子',
    desc: '拥有10.00A能量并解锁量子计算科技',
    type: 'compound',
    conditions: [
      { type: 'resource', resource: 'energy', target: 10000 },
      { type: 'tech', tech: 'quantumComputing' }
    ],
    reward: { energy: 2000, quantumBits: 100, knowledge: 200 },
    once: true
  },
  {
    id: 'compound_darkMatter_darkMatterCollector',
    name: '暗物质大亨',
    desc: '拥有500.000暗物质并建造10.000个暗物质收集器',
    type: 'compound',
    conditions: [
      { type: 'resource', resource: 'darkMatter', target: 500 },
      { type: 'building', building: 'darkMatterCollector', target: 10 }
    ],
    reward: { darkMatter: 200, energy: 500 },
    once: true
  },
  {
    id: 'compound_nanoFactory_nanoManufacturing',
    name: '纳米工业先锋',
    desc: '建造10.000个纳米工厂并解锁纳米制造科技',
    type: 'compound',
    conditions: [
      { type: 'building', building: 'nanoFactory', target: 10 },
      { type: 'tech', tech: 'nanoManufacturing' }
    ],
    reward: { nanoMaterial: 200, knowledge: 100 },
    once: true
  },
  {
    id: 'compound_blackholeDecompression_antiMatterSynthesis',
    name: '黑洞与反物质',
    desc: '完成黑洞解压阶段并解锁反物质合成科技',
    type: 'compound',
    conditions: [
      { type: 'entropyStage', entropyStage: 'blackholeDecompression' },
      { type: 'tech', tech: 'antiMatterSynthesis' }
    ],
    reward: { antiMatter: 200, darkMatter: 100, knowledge: 200 },
    once: true
  },
  {
    id: 'compound_knowledge_quantumComputer_quantumComputing',
    name: '知识量子突破',
    desc: '拥有10.00A知识，建造5个量子计算机，并解锁量子计算科技',
    type: 'compound',
    conditions: [
      { type: 'resource', resource: 'knowledge', target: 10000 },
      { type: 'building', building: 'quantumComputer', target: 5 },
      { type: 'tech', tech: 'quantumComputing' }
    ],
    reward: { knowledge: 2000, quantumBits: 200 },
    once: true
  },
  {
    id: 'compound_antiMatter_energyMaterialization',
    name: '反物质能量化',
    desc: '拥有1.00A反物质并完成能量物质化阶段',
    type: 'compound',
    conditions: [
      { type: 'resource', resource: 'antiMatter', target: 1000 },
      { type: 'entropyStage', entropyStage: 'energyMaterialization' }
    ],
    reward: { antiMatter: 500, energy: 2000, nanoMaterial: 200 },
    once: true
  },
  {
    id: 'compound_allTech_allStage',
    name: '终极文明',
    desc: '解锁所有科技并完成所有熵减阶段',
    type: 'compound',
    conditions: [{ type: 'allTech' }, { type: 'allEntropyStage' }],
    reward: { energy: 10000, matter: 10000, knowledge: 5000, darkMatter: 2000, antiMatter: 1000, nanoMaterial: 1000 },
    unlock: { building: 'universalUnifier' },
    once: true
  }
]
