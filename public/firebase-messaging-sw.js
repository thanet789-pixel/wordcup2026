// public/firebase-messaging-sw.js

// Listen to incoming Web Push notifications from server
self.addEventListener('push', function(event) {
  console.log('[Service Worker] Push notification event received.');
  
  let data = {};
  if (event.data) {
    try {
      data = event.data.json();
    } catch (e) {
      data = { 
        title: 'ฟุตบอลโลก 2026 ⚽', 
        body: event.data.text() 
      };
    }
  }

  const title = data.title || 'อัปเดตสกอร์สดบอลโลก! ⚽';
  const options = {
    body: data.body || 'มีเหตุการณ์สำคัญเกิดขึ้นในการแข่งขันที่คุณติดตาม',
    icon: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=192&h=192&fit=crop',
    badge: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=192&h=192&fit=crop',
    vibrate: [200, 100, 200, 100, 200],
    data: {
      url: data.url || '/home'
    },
    actions: [
      { action: 'open_url', title: 'ดูผลการแข่งสด 🔴' }
    ]
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

// Handle notification click routing
self.addEventListener('notificationclick', function(event) {
  console.log('[Service Worker] Notification click received.');
  
  event.notification.close();
  
  const targetUrl = event.notification.data?.url || '/home';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(function(windowClients) {
      // If a window is already open, focus it and redirect
      for (var i = 0; i < windowClients.length; i++) {
        var client = windowClients[i];
        if (client.url.indexOf(targetUrl) !== -1 && 'focus' in client) {
          return client.focus();
        }
      }
      // Otherwise, open a new tab/window
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});
