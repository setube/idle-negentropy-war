// gameClock.worker.js
let running = false
let interval = 1000 // 1 tick = 1 秒

const loop = () => {
  if (!running) return
  self.postMessage('tick') // 固定 1 秒 1 tick
  setTimeout(loop, interval)
}

self.onmessage = ({ data }) => {
  switch (data?.type || data) {
    case 'start':
      running = true
      loop()
      break
    case 'pause':
      running = false
      break
    case 'setInterval':
      interval = data.interval
      break
  }
}
