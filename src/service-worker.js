self.addEventListener('install', () => {
  console.log('Install')
  self.skipWaiting()
})

self.addEventListener('active', () => {
  console.log('active')
  self.clients.claim()
})

self.addEventListener('push', ev => {
  const data = ev.data.json()
  console.log({ data })

  ev.waitUntil(self.registration.showNotification('ChatApp', {
    body: data.text,
    icon: 'favicon.ico',
    vibrate: [300, 200, 300]
  }))
})

self.addEventListener('notificationclick', event => {
  event.notification.close()
  self.clients.openWindow('/')
})
