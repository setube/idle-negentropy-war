// 熵减进程
export default {
  // 第一阶段：微观熵减
  atomicOrdering: {
    name: '原子排序',
    description: '手动排列原子，建立有序结构',
    unlocked: true,
    progress: 0,
    maxProgress: 1000,
    efficiency: 0.1,
    cost: { energy: 0.5, matter: 0.5 },
    effect: '基础熵减，减缓局部热运动'
  },
  molecularCooling: {
    name: '分子冷却',
    description: '减缓分子热运动，降低系统温度',
    unlocked: false,
    progress: 0,
    maxProgress: 5000,
    efficiency: 0.5,
    cost: { energy: 2.5, matter: 1 },
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
    cost: { energy: 10, matter: 5, darkMatter: 1 },
    effect: '大规模熵减，控制恒星活动'
  },
  blackholeDecompression: {
    name: '黑洞解压',
    description: '解压黑洞，释放被压缩的信息',
    unlocked: false,
    progress: 0,
    maxProgress: 50000,
    efficiency: 5.0,
    cost: { energy: 100, matter: 50, darkMatter: 10, antiMatter: 5 },
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
    cost: { energy: 1000, matter: 100, darkMatter: 50, antiMatter: 20 },
    effect: '宇宙级熵减，能量有序化'
  },
  universalUnification: {
    name: '宇宙单一化',
    description: '将所有物质重新转化为氢，达到最低熵状态',
    unlocked: false,
    progress: 0,
    maxProgress: 1000000,
    efficiency: 50.0,
    cost: { energy: 10000, matter: 1000, darkMatter: 100, antiMatter: 50, nanoMaterial: 10 },
    effect: '终极熵减，宇宙回归原始状态'
  }
}
