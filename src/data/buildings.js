// 建筑数据
export default {
  // 基础建筑
  atomicSorter: {
    name: '原子排序器',
    count: 1,
    level: 1,
    add: true,
    outputs: { coordinateExposure: 0.05, energy: 0.1, matter: 0.1, knowledge: 0.001 },
    cost: { matter: 10, energy: 5, knowledge: 0.01 },
    upgradeCost: { matter: 20, energy: 10, knowledge: 0.02 },
    unlocked: true,
    entropyStage: 'atomicOrdering'
  },
  molecularCooler: {
    name: '分子冷却器',
    count: 0,
    level: 0,
    add: true,
    outputs: { coordinateExposure: 0.1, energy: 0.2, matter: 0.2, knowledge: 0.002 },
    cost: { matter: 100, energy: 50, knowledge: 0.1 },
    upgradeCost: { matter: 200, energy: 100, knowledge: 0.1 },
    unlocked: false,
    entropyStage: 'molecularCooling'
  },
  // 恒星建筑
  stellarExtinguisher: {
    name: '恒星熄灭器',
    count: 0,
    level: 0,
    add: true,
    outputs: { coordinateExposure: 0.05, energy: 1, matter: 1, darkMatter: 0.1, knowledge: 0.005 },
    cost: { matter: 100, energy: 50, darkMatter: 10, knowledge: 5 },
    upgradeCost: { matter: 200, energy: 100, darkMatter: 20, knowledge: 10 },
    unlocked: false,
    entropyStage: 'stellarExtinction'
  },
  // 黑洞建筑
  blackholeDecompressor: {
    name: '黑洞解压器',
    count: 0,
    level: 0,
    add: true,
    outputs: { coordinateExposure: 0.05, energy: 5, matter: 5, antiMatter: 0.1, knowledge: 0.005 },
    cost: { matter: 100, energy: 50, darkMatter: 10, antiMatter: 5, knowledge: 1 },
    upgradeCost: { matter: 200, energy: 100, darkMatter: 20, antiMatter: 10, knowledge: 1 },
    unlocked: false,
    entropyStage: 'blackholeDecompression'
  },
  // 宇宙建筑
  energyMaterializer: {
    name: '能量物质化器',
    count: 0,
    level: 0,
    add: true,
    outputs: { coordinateExposure: 0.05, energy: 25, matter: 25, nanoMaterial: 7.5, knowledge: 0.1 },
    cost: { matter: 10000, energy: 5000, darkMatter: 50, antiMatter: 20, knowledge: 100 },
    upgradeCost: { matter: 20000, energy: 10000, darkMatter: 100, antiMatter: 40, knowledge: 200 },
    unlocked: false,
    entropyStage: 'energyMaterialization'
  },
  universalUnifier: {
    name: '宇宙单一化器',
    count: 0,
    level: 0,
    add: true,
    outputs: { coordinateExposure: 0.5, energy: 100, matter: 100, knowledge: 0.005 },
    cost: { matter: 10000, energy: 5000, darkMatter: 100, antiMatter: 50, nanoMaterial: 10, knowledge: 5 },
    upgradeCost: { matter: 20000, energy: 10000, darkMatter: 200, antiMatter: 100, nanoMaterial: 20, knowledge: 10 },
    unlocked: false,
    entropyStage: 'universalUnification'
  },
  quantumComputer: {
    name: '量子计算机',
    count: 0,
    level: 0,
    add: true,
    outputs: { coordinateExposure: 0.5, quantumBits: 0.01, knowledge: 0.005 },
    cost: { matter: 500, energy: 250, quantumBits: 5, knowledge: 5 },
    upgradeCost: { matter: 1000, energy: 500, quantumBits: 10, knowledge: 10 },
    unlocked: false,
    entropyStage: 'molecularCooling'
  },
  spacetimePortal: {
    name: '时空传送门',
    count: 0,
    level: 0,
    add: true,
    outputs: { coordinateExposure: 1, darkMatter: 0.01, knowledge: 0.005 },
    cost: { matter: 5000, energy: 2500, quantumBits: 5, darkMatter: 5, knowledge: 5 },
    upgradeCost: { matter: 10000, energy: 5000, quantumBits: 10, darkMatter: 10, knowledge: 10 },
    unlocked: false,
    entropyStage: 'blackholeDecompression'
  },
  lowPotentialTrap: {
    name: '低势能陷阱',
    count: 0,
    level: 0,
    add: true,
    outputs: { coordinateExposure: 0.05, energy: 2.5, matter: 1, knowledge: 0.001 },
    cost: { matter: 20, energy: 10, knowledge: 1 },
    upgradeCost: { matter: 40, energy: 20, knowledge: 1 },
    unlocked: false,
    entropyStage: 'molecularCooling'
  },
  quantumDecoherenceSuppressor: {
    name: '量子退相干抑制器',
    count: 0,
    level: 0,
    add: true,
    outputs: { coordinateExposure: 0.5, quantumBits: 0.5, energy: -20, knowledge: 0.001 },
    cost: { matter: 30, energy: 20, quantumBits: 50, knowledge: 25 },
    upgradeCost: { matter: 60, energy: 40, quantumBits: 100, knowledge: 50 },
    unlocked: false,
    entropyStage: 'molecularCooling'
  },
  brownianCaptureNet: {
    name: '布朗运动捕获网',
    count: 0,
    level: 0,
    add: true,
    outputs: { coordinateExposure: 0.1, bioOrder: 0.001, knowledge: 0.001 },
    cost: { matter: 15, energy: 8, knowledge: 1 },
    upgradeCost: { matter: 30, energy: 16, knowledge: 2 },
    unlocked: false,
    entropyStage: 'molecularCooling'
  },
  stealthGenerator: {
    name: '隐匿发生器',
    count: 0,
    level: 0,
    add: true,
    outputs: { coordinateExposure: -0.25, knowledge: 0.001 },
    cost: { matter: 200, energy: 100, knowledge: 1 },
    upgradeCost: { matter: 400, energy: 200, knowledge: 2 },
    unlocked: false,
    entropyStage: 'stellarExtinction'
  },
  antiMatterSynthesizer: {
    name: '反物质合成器',
    count: 0,
    level: 0,
    add: true,
    outputs: { coordinateExposure: 0.5, antiMatter: 0.5, knowledge: 0.025 },
    cost: { energy: 5000, darkMatter: 100, antiMatter: 25, knowledge: 25 },
    upgradeCost: { energy: 10000, darkMatter: 200, antiMatter: 50, knowledge: 50 },
    unlocked: false,
    entropyStage: 'blackholeDecompression'
  },
  darkMatterCollector: {
    name: '暗物质收集器',
    count: 0,
    level: 0,
    add: true,
    outputs: { coordinateExposure: 0.5, darkMatter: 0.5, knowledge: 0.025 },
    cost: { matter: 500, energy: 200, darkMatter: 50, knowledge: 25 },
    upgradeCost: { matter: 1000, energy: 400, darkMatter: 50, knowledge: 50 },
    unlocked: false,
    entropyStage: 'stellarExtinction'
  },
  aotoumRealityPerforator: {
    name: '奥陶姆现实透孔仪',
    count: 0,
    level: 0,
    add: true,
    outputs: { coordinateExposure: 1, knowledge: 0.1 },
    cost: { energy: 10000, knowledge: 200, matter: 5000 },
    upgradeCost: { energy: 20000, knowledge: 400, matter: 10000 },
    unlocked: false,
    entropyStage: 'energyMaterialization'
  },
  crystalDefectRepairer: {
    name: '晶体缺陷修仪',
    count: 0,
    level: 0,
    add: true,
    outputs: { coordinateExposure: 1.5, nanoMaterial: 1.5, knowledge: 0.1 },
    cost: { nanoMaterial: 100, knowledge: 100, energy: 2000 },
    upgradeCost: { nanoMaterial: 200, knowledge: 200, energy: 4000 },
    unlocked: false,
    entropyStage: 'energyMaterialization'
  },
  bioEntropyStabilizer: {
    name: '生物熵稳定舱',
    count: 0,
    level: 0,
    add: true,
    outputs: { coordinateExposure: 0.05, bioOrder: 0.01, knowledge: 0.5 },
    cost: { energy: 5000, knowledge: 2000, bioOrder: 50 },
    upgradeCost: { energy: 10000, knowledge: 4000, bioOrder: 100 },
    unlocked: false,
    entropyStage: 'energyMaterialization'
  },
  orbitalOptimizer: {
    name: '行星轨道优化器',
    count: 0,
    level: 0,
    add: true,
    outputs: { coordinateExposure: -0.5, knowledge: 0.1 },
    cost: { energy: 8000, matter: 3000, knowledge: 100 },
    upgradeCost: { matter: 16000, energy: 6000, knowledge: 200 },
    unlocked: false,
    entropyStage: 'energyMaterialization'
  },
  nanoFactory: {
    name: '纳米工厂',
    count: 0,
    level: 0,
    add: true,
    outputs: { coordinateExposure: 0.05, nanoMaterial: 0.1, knowledge: 0.005 },
    cost: { matter: 200, energy: 100, nanoMaterial: 10, knowledge: 5 },
    upgradeCost: { matter: 400, energy: 200, nanoMaterial: 20, knowledge: 10 },
    unlocked: false,
    entropyStage: 'molecularCooling'
  }
}
