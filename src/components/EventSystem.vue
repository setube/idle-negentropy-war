<template>
  <div class="event-system">
    <el-card class="event-log" shadow="never">
      <template #header>
        <div class="card-header">
          <span>当前事件</span>
        </div>
      </template>
      <div v-if="gameStore.activeEvent" class="active-event">
        <h4>{{ gameStore.activeEvent.title }}</h4>
        <p>{{ gameStore.activeEvent.description }}</p>
        <p>剩余时间: {{ gameStore.activeEvent.remaining }} 秒</p>
      </div>
      <div v-else class="active-event">
        <p>当前无活跃事件</p>
      </div>
    </el-card>
    <el-card class="event-log" shadow="never">
      <template #header>
        <div class="card-header">
          <span>历史事件</span>
        </div>
      </template>
      <div class="event-list">
        <div v-for="event in gameStore.events" :key="event.timestamp" class="event-item">
          <div class="event-time">{{ formatTime(event.timestamp) }}</div>
          <div class="event-content">
            <h4>{{ event.title }}</h4>
            <p>{{ event.description }}</p>
          </div>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup>
  import { useGameStore } from '../stores/gameStore'
  const gameStore = useGameStore()

  const formatTime = timestamp => {
    const date = new Date(timestamp)
    return date.toLocaleString()
  }
</script>

<style scoped>
  .event-system {
    max-width: 400px;
    margin: 0 auto;
    padding: 10px;
  }
  .event-log {
    margin-bottom: 20px;
  }
  .active-event {
    padding: 10px;
    background: rgba(64, 158, 255, 0.08);
    border-radius: 6px;
    margin-bottom: 10px;
  }
  .event-list {
    max-height: 300px;
    overflow-y: auto;
  }
  .event-item {
    padding: 8px;
    border-bottom: 1px solid #eee;
  }
  .event-time {
    font-size: 0.8em;
    color: #888;
  }
  .event-content h4 {
    margin: 0 0 4px 0;
    color: #409eff;
  }
</style>
