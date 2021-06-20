self.addEventListener('install', () => {
  self.skipWaiting()
})

self.addEventListener('active', () => {
  self.clients.claim()
})

self.addEventListener('push', ev => {
  const data = ev.data.json()

  ev.waitUntil(sendNotificationOnlyIfNotFocused(data))
})

self.addEventListener('notificationclick', event => {
  event.notification.close()
  self.clients.openWindow('/')
})

async function sendNotificationOnlyIfNotFocused (data) {
  const windowClients = await self.clients.matchAll({ type: 'window', includeUncontrolled: true })

  let clientIsVisible = false
  for (var i = 0; i < windowClients.length; i++) {
    const windowClient = windowClients[i]

    if (windowClient.url.includes('http://127.0.0.1:5500/') && windowClient.visibilityState === 'visible') {
      clientIsVisible = true
      break
    }
  }

  if (!clientIsVisible) {
    self.registration.showNotification('ChatApp', {
      body: data.text,
      icon: 'favicon.ico',
      vibrate: [300, 200, 300]
    })
  }
}
