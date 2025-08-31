// Service Worker for CareerBoost PWA
const CACHE_NAME = 'careerboost-v1.0.0';
const urlsToCache = [
  '/',
  '/index.html',
  '/style.css',
  '/script.js',
  '/manifest.json',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css',
  'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap'
];

// Install event - cache resources
self.addEventListener('install', event => {
  console.log('Service Worker: Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Service Worker: Caching files');
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        console.log('Service Worker: Cached all files successfully');
        return self.skipWaiting();
      })
      .catch(err => {
        console.error('Service Worker: Cache failed', err);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  console.log('Service Worker: Activating...');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Service Worker: Deleting old cache', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('Service Worker: Activated successfully');
      return self.clients.claim();
    })
  );
});

// Fetch event - serve cached content when offline
self.addEventListener('fetch', event => {
  console.log('Service Worker: Fetching', event.request.url);
  
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Return cached version or fetch from network
        if (response) {
          console.log('Service Worker: Serving from cache', event.request.url);
          return response;
        }
        
        return fetch(event.request).then(response => {
          // Check if we received a valid response
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }
          
          // Clone the response
          const responseToCache = response.clone();
          
          caches.open(CACHE_NAME)
            .then(cache => {
              cache.put(event.request, responseToCache);
            });
          
          return response;
        }).catch(() => {
          // Return offline page for navigation requests
          if (event.request.destination === 'document') {
            return caches.match('/index.html');
          }
        });
      })
  );
});

// Background sync for form submissions
self.addEventListener('sync', event => {
  console.log('Service Worker: Background sync', event.tag);
  
  if (event.tag === 'resume-sync') {
    event.waitUntil(syncResumeData());
  }
  
  if (event.tag === 'job-application-sync') {
    event.waitUntil(syncJobApplications());
  }
});

// Push notification handling
self.addEventListener('push', event => {
  console.log('Service Worker: Push received', event);
  
  const options = {
    body: event.data ? event.data.text() : 'New career opportunity available!',
    icon: '/icons/icon-192.png',
    badge: '/icons/badge-72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'View Jobs',
        icon: '/icons/explore-icon.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/icons/close-icon.png'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification('CareerBoost', options)
  );
});

// Notification click handling
self.addEventListener('notificationclick', event => {
  console.log('Service Worker: Notification clicked', event);
  
  event.notification.close();
  
  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/#jobs')
    );
  } else if (event.action === 'close') {
    // Just close the notification
    return;
  } else {
    // Default action - open the app
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Message handling from main thread
self.addEventListener('message', event => {
  console.log('Service Worker: Message received', event.data);
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CACHE_RESUME') {
    cacheResumeData(event.data.resumeData);
  }
});

// Helper functions
async function syncResumeData() {
  try {
    // Get stored resume data from IndexedDB
    const resumeData = await getStoredResumeData();
    
    if (resumeData && resumeData.length > 0) {
      // Send to server when online
      const response = await fetch('/api/sync-resume', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(resumeData)
      });
      
      if (response.ok) {
        // Clear local storage after successful sync
        await clearStoredResumeData();
        console.log('Service Worker: Resume data synced successfully');
      }
    }
  } catch (error) {
    console.error('Service Worker: Resume sync failed', error);
  }
}

async function syncJobApplications() {
  try {
    // Get stored job applications from IndexedDB
    const applications = await getStoredJobApplications();
    
    if (applications && applications.length > 0) {
      // Send to server when online
      const response = await fetch('/api/sync-applications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(applications)
      });
      
      if (response.ok) {
        // Clear local storage after successful sync
        await clearStoredJobApplications();
        console.log('Service Worker: Job applications synced successfully');
      }
    }
  } catch (error) {
    console.error('Service Worker: Job applications sync failed', error);
  }
}

async function cacheResumeData(resumeData) {
  try {
    // Store resume data in IndexedDB for offline access
    const db = await openDB();
    const transaction = db.transaction(['resumes'], 'readwrite');
    const store = transaction.objectStore('resumes');
    
    await store.put({
      id: 'current-resume',
      data: resumeData,
      timestamp: Date.now()
    });
    
    console.log('Service Worker: Resume data cached successfully');
  } catch (error) {
    console.error('Service Worker: Failed to cache resume data', error);
  }
}

// IndexedDB helpers
function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('CareerBoostDB', 1);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    
    request.onupgradeneeded = event => {
      const db = event.target.result;
      
      if (!db.objectStoreNames.contains('resumes')) {
        db.createObjectStore('resumes', { keyPath: 'id' });
      }
      
      if (!db.objectStoreNames.contains('applications')) {
        db.createObjectStore('applications', { keyPath: 'id', autoIncrement: true });
      }
    };
  });
}

async function getStoredResumeData() {
  try {
    const db = await openDB();
    const transaction = db.transaction(['resumes'], 'readonly');
    const store = transaction.objectStore('resumes');
    const result = await store.get('current-resume');
    
    return result ? result.data : null;
  } catch (error) {
    console.error('Service Worker: Failed to get stored resume data', error);
    return null;
  }
}

async function clearStoredResumeData() {
  try {
    const db = await openDB();
    const transaction = db.transaction(['resumes'], 'readwrite');
    const store = transaction.objectStore('resumes');
    await store.delete('current-resume');
  } catch (error) {
    console.error('Service Worker: Failed to clear stored resume data', error);
  }
}

async function getStoredJobApplications() {
  try {
    const db = await openDB();
    const transaction = db.transaction(['applications'], 'readonly');
    const store = transaction.objectStore('applications');
    const result = await store.getAll();
    
    return result || [];
  } catch (error) {
    console.error('Service Worker: Failed to get stored job applications', error);
    return [];
  }
}

async function clearStoredJobApplications() {
  try {
    const db = await openDB();
    const transaction = db.transaction(['applications'], 'readwrite');
    const store = transaction.objectStore('applications');
    await store.clear();
  } catch (error) {
    console.error('Service Worker: Failed to clear stored job applications', error);
  }
}

// Periodic background sync for job updates
self.addEventListener('periodicsync', event => {
  if (event.tag === 'job-updates') {
    event.waitUntil(fetchJobUpdates());
  }
});

async function fetchJobUpdates() {
  try {
    const response = await fetch('/api/job-updates');
    const jobs = await response.json();
    
    // Show notification if new jobs are available
    if (jobs && jobs.length > 0) {
      self.registration.showNotification('New Job Opportunities!', {
        body: `${jobs.length} new jobs matching your profile`,
        icon: '/icons/icon-192.png',
        tag: 'job-updates'
      });
    }
  } catch (error) {
    console.error('Service Worker: Failed to fetch job updates', error);
  }
}