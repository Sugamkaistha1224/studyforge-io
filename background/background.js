// Background service worker for Learning Assistant Extension
// Handles alarms, notifications, and global state management

// Store for active study sessions
let studySessions = {};

// Initialize extension
chrome.runtime.onInstalled.addListener(async () => {
  console.log('Learning Assistant Extension installed');
  
  // Initialize storage with default settings
  const defaultSettings = {
    hotkeys: {
      playPause: 'Alt+P',
      seekForward: 'Alt+ArrowRight',
      seekBackward: 'Alt+ArrowLeft',
      addNote: 'Ctrl+M'
    },
    maxPlaybackRate: 2.0,
    dailyBudgetMins: 120,
    sessionLengthMins: 30,
    completionThreshold: 0.96
  };
  
  try {
    const existingSettings = await chrome.storage.local.get('settings');
    if (!existingSettings.settings) {
      await chrome.storage.local.set({ settings: defaultSettings });
    }
  } catch (error) {
    console.error('Error initializing settings:', error);
  }
});

// Handle study session alarms
chrome.alarms.onAlarm.addListener(async (alarm) => {
  if (alarm.name.startsWith('study:')) {
    const sessionId = alarm.name.split(':')[1];
    
    try {
      // Get session details from storage
      const data = await chrome.storage.local.get('planner:schedule');
      const schedule = data['planner:schedule'] || [];
      const session = schedule.find(s => s.sessionId === sessionId);
      
      if (session) {
        // Create notification
        chrome.notifications.create(sessionId, {
          type: 'basic',
          iconUrl: 'assets/icons/icon128.png',
          title: '📚 Study Time!',
          message: `Time for: ${session.title}\nCourse: ${session.course}`,
          buttons: [
            { title: 'Open Course' },
            { title: 'Reschedule' }
          ],
          requireInteraction: true
        });
        
        // Store notification for handling clicks
        studySessions[sessionId] = session;
      }
    } catch (error) {
      console.error('Error handling study alarm:', error);
    }
  }
});

// Handle notification button clicks
chrome.notifications.onButtonClicked.addListener(async (notificationId, buttonIndex) => {
  const session = studySessions[notificationId];
  
  if (session) {
    if (buttonIndex === 0) {
      // Open Course button clicked
      try {
        // Try to find existing tab or create new one
        const url = session.url || getDefaultCourseUrl(session.course);
        
        chrome.tabs.create({
          url: url,
          active: true
        });
        
        // Update session as started
        await updateSessionStatus(session.sessionId, 'started');
        
      } catch (error) {
        console.error('Error opening course:', error);
      }
    } else if (buttonIndex === 1) {
      // Reschedule button clicked - open options page
      chrome.tabs.create({
        url: chrome.runtime.getURL('ui/options.html') + '#planner'
      });
    }
  }
  
  // Clear the notification
  chrome.notifications.clear(notificationId);
  delete studySessions[notificationId];
});

// Handle notification clicks (without button)
chrome.notifications.onClicked.addListener(async (notificationId) => {
  const session = studySessions[notificationId];
  
  if (session) {
    // Default action is to open the course
    try {
      const url = session.url || getDefaultCourseUrl(session.course);
      chrome.tabs.create({
        url: url,
        active: true
      });
      
      await updateSessionStatus(session.sessionId, 'started');
    } catch (error) {
      console.error('Error opening course:', error);
    }
  }
  
  chrome.notifications.clear(notificationId);
  delete studySessions[notificationId];
});

// Helper function to get default course URLs
function getDefaultCourseUrl(courseName) {
  // Return appropriate platform URL based on course name or platform
  if (courseName.toLowerCase().includes('coursera')) {
    return 'https://www.coursera.org/';
  } else if (courseName.toLowerCase().includes('linkedin')) {
    return 'https://www.linkedin.com/learning/';
  }
  return 'https://www.coursera.org/'; // Default
}

// Helper function to update session status
async function updateSessionStatus(sessionId, status) {
  try {
    const data = await chrome.storage.local.get('planner:schedule');
    const schedule = data['planner:schedule'] || [];
    
    const sessionIndex = schedule.findIndex(s => s.sessionId === sessionId);
    if (sessionIndex !== -1) {
      schedule[sessionIndex].status = status;
      schedule[sessionIndex].lastUpdated = new Date().toISOString();
      
      await chrome.storage.local.set({ 'planner:schedule': schedule });
    }
  } catch (error) {
    console.error('Error updating session status:', error);
  }
}

// Handle messages from content scripts and popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  switch (message.type) {
    case 'GET_TAB_INFO':
      sendResponse({
        tabId: sender.tab?.id,
        url: sender.tab?.url,
        title: sender.tab?.title
      });
      break;
      
    case 'TRACK_PROGRESS':
      handleProgressTracking(message.data, sender.tab);
      break;
      
    case 'SCHEDULE_STUDY_SESSION':
      scheduleStudySession(message.data);
      break;
      
    default:
      console.log('Unknown message type:', message.type);
  }
});

// Progress tracking handler
async function handleProgressTracking(progressData, tab) {
  try {
    const courseId = extractCourseId(tab.url);
    const key = `progress:${courseId}`;
    
    const data = await chrome.storage.local.get(key);
    const progress = data[key] || { lectures: {} };
    
    // Update lecture progress
    progress.lectures[progressData.lectureId] = {
      ...progress.lectures[progressData.lectureId],
      watchedTime: progressData.watchedTime,
      duration: progressData.duration,
      completed: progressData.completed,
      lastWatchedAt: new Date().toISOString()
    };
    
    await chrome.storage.local.set({ [key]: progress });
  } catch (error) {
    console.error('Error tracking progress:', error);
  }
}

// Schedule study session
async function scheduleStudySession(sessionData) {
  try {
    const alarmName = `study:${sessionData.sessionId}`;
    
    // Create Chrome alarm
    chrome.alarms.create(alarmName, {
      when: new Date(sessionData.scheduledTime).getTime()
    });
    
    console.log(`Scheduled study session: ${alarmName} at ${sessionData.scheduledTime}`);
  } catch (error) {
    console.error('Error scheduling study session:', error);
  }
}

// Helper function to extract course ID from URL
function extractCourseId(url) {
  if (url.includes('coursera.org')) {
    const match = url.match(/\/learn\/([^\/]+)/);
    return match ? `coursera:${match[1]}` : 'coursera:unknown';
  } else if (url.includes('linkedin.com/learning')) {
    const match = url.match(/\/learning\/([^\/]+)/);
    return match ? `linkedin:${match[1]}` : 'linkedin:unknown';
  }
  return 'unknown';
}