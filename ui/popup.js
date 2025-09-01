// Learning Assistant Popup JavaScript
// Handles popup UI interactions, data display, and communication with content scripts

class PopupManager {
  constructor() {
    this.currentTab = null;
    this.courseData = null;
    this.progressData = null;
    
    this.init();
  }

  async init() {
    console.log('Popup: Initializing...');
    
    // Get current tab
    await this.getCurrentTab();
    
    // Setup event listeners
    this.setupEventListeners();
    
    // Load and display data
    await this.loadData();
    
    // Start real-time updates
    this.startRealTimeUpdates();
  }

  async getCurrentTab() {
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      this.currentTab = tab;
      
      // Check if tab is supported
      const isSupported = this.isSupportedSite(tab.url);
      this.updateStatusIndicator(isSupported);
      
    } catch (error) {
      console.error('Error getting current tab:', error);
    }
  }

  isSupportedSite(url) {
    return url && (
      url.includes('coursera.org') || 
      url.includes('linkedin.com/learning')
    );
  }

  updateStatusIndicator(isActive) {
    const indicator = document.getElementById('statusIndicator');
    const statusText = document.getElementById('statusText');
    const statusDot = indicator.querySelector('.la-status-dot');
    
    if (isActive) {
      statusText.textContent = 'Active';
      statusDot.style.background = '#00d4ff';
      statusDot.style.boxShadow = '0 0 8px rgba(0, 212, 255, 0.6)';
    } else {
      statusText.textContent = 'Inactive';
      statusDot.style.background = '#666';
      statusDot.style.boxShadow = 'none';
    }
  }

  setupEventListeners() {
    // Video controls
    document.getElementById('playPauseBtn').addEventListener('click', () => {
      this.sendMessageToTab({ type: 'TOGGLE_PLAY_PAUSE' });
    });

    document.getElementById('seekBackBtn').addEventListener('click', () => {
      this.sendMessageToTab({ type: 'SEEK', seconds: -10 });
    });

    document.getElementById('seekForwardBtn').addEventListener('click', () => {
      this.sendMessageToTab({ type: 'SEEK', seconds: 10 });
    });

    // Quick actions
    document.getElementById('openPanelBtn').addEventListener('click', () => {
      this.openStudyPanel();
    });

    document.getElementById('generateQuizBtn').addEventListener('click', () => {
      this.generateQuiz();
    });

    document.getElementById('exportDataBtn').addEventListener('click', () => {
      this.exportData();
    });

    document.getElementById('createPlanBtn').addEventListener('click', () => {
      this.openOptionsPage('planner');
    });

    document.getElementById('viewFullPlan').addEventListener('click', () => {
      this.openOptionsPage('planner');
    });

    document.getElementById('viewAllNotes').addEventListener('click', () => {
      this.openOptionsPage('notes');
    });

    // Footer actions
    document.getElementById('settingsBtn').addEventListener('click', () => {
      this.openOptionsPage();
    });

    document.getElementById('helpBtn').addEventListener('click', () => {
      this.openHelpPage();
    });
  }

  async sendMessageToTab(message) {
    if (!this.currentTab) return;

    try {
      await chrome.tabs.sendMessage(this.currentTab.id, message);
    } catch (error) {
      console.error('Error sending message to tab:', error);
    }
  }

  async loadData() {
    try {
      // Show loading
      this.showLoading(true);

      // Load course data
      await this.loadCourseData();
      
      // Load statistics
      await this.loadStatistics();
      
      // Load study plan
      await this.loadStudyPlan();
      
      // Load recent notes
      await this.loadRecentNotes();

      // Hide loading
      this.showLoading(false);
      
    } catch (error) {
      console.error('Error loading data:', error);
      this.showLoading(false);
    }
  }

  async loadCourseData() {
    if (!this.isSupportedSite(this.currentTab?.url)) {
      return;
    }

    try {
      // Get course info from current tab
      const response = await this.sendMessageToTab({ type: 'GET_COURSE_INFO' });
      
      if (response && response.courseInfo) {
        this.displayCourseInfo(response.courseInfo);
      }
    } catch (error) {
      console.error('Error loading course data:', error);
    }
  }

  displayCourseInfo(courseInfo) {
    const courseInfoContainer = document.getElementById('courseInfo');
    
    courseInfoContainer.innerHTML = `
      <div class="la-course-card">
        <div class="la-course-icon">
          ${courseInfo.platform === 'coursera' ? '🎓' : '💼'}
        </div>
        <div class="la-course-details">
          <h4>${this.truncateText(courseInfo.title, 50)}</h4>
          <p>${courseInfo.platform === 'coursera' ? 'Coursera' : 'LinkedIn Learning'}</p>
          ${courseInfo.currentLecture ? `<p class="la-current-lecture">📍 ${this.truncateText(courseInfo.currentLecture.title, 40)}</p>` : ''}
        </div>
      </div>
    `;
  }

  async loadStatistics() {
    try {
      // Get all progress data
      const data = await chrome.storage.local.get(null);
      
      let totalWatchTime = 0;
      let totalNotes = 0;
      let quizScores = [];

      // Process progress data
      Object.keys(data).forEach(key => {
        if (key.startsWith('progress:')) {
          const progress = data[key];
          if (progress.lectures) {
            Object.values(progress.lectures).forEach(lecture => {
              totalWatchTime += lecture.watchedTime || 0;
            });
          }
        } else if (key.startsWith('notes:')) {
          const notes = data[key];
          Object.values(notes).forEach(lectureNotes => {
            totalNotes += lectureNotes.length || 0;
          });
        } else if (key.startsWith('quizzes:')) {
          const quizzes = data[key];
          Object.values(quizzes).forEach(lectureQuizzes => {
            if (lectureQuizzes.results) {
              quizScores = quizScores.concat(lectureQuizzes.results);
            }
          });
        }
      });

      // Update UI
      this.updateStatistics(totalWatchTime, totalNotes, quizScores);
      
    } catch (error) {
      console.error('Error loading statistics:', error);
    }
  }

  updateStatistics(totalWatchTime, totalNotes, quizScores) {
    // Watch time
    const hours = Math.floor(totalWatchTime / 3600);
    const minutes = Math.floor((totalWatchTime % 3600) / 60);
    document.getElementById('totalWatchTime').textContent = `${hours}h ${minutes}m`;

    // Notes count
    document.getElementById('totalNotes').textContent = totalNotes.toString();

    // Quiz average
    let avgScore = 'N/A';
    if (quizScores.length > 0) {
      const avg = quizScores.reduce((sum, score) => sum + score, 0) / quizScores.length;
      avgScore = `${Math.round(avg)}%`;
    }
    document.getElementById('quizScore').textContent = avgScore;
  }

  async loadStudyPlan() {
    try {
      const data = await chrome.storage.local.get('planner:schedule');
      const schedule = data['planner:schedule'] || [];
      
      // Filter today's sessions
      const today = new Date().toDateString();
      const todaySessions = schedule.filter(session => {
        const sessionDate = new Date(session.scheduledTime).toDateString();
        return sessionDate === today && session.status !== 'completed';
      });

      this.displayStudyPlan(todaySessions);
      
    } catch (error) {
      console.error('Error loading study plan:', error);
    }
  }

  displayStudyPlan(sessions) {
    const plannerContent = document.getElementById('plannerContent');
    
    if (sessions.length === 0) {
      plannerContent.innerHTML = `
        <div class="la-empty-state">
          <div class="la-empty-icon">📅</div>
          <p>No study sessions planned for today</p>
          <button class="la-btn la-btn-primary" id="createPlanBtn">Create Plan</button>
        </div>
      `;
      
      // Re-attach event listener
      document.getElementById('createPlanBtn').addEventListener('click', () => {
        this.openOptionsPage('planner');
      });
      return;
    }

    const sessionsHtml = sessions.slice(0, 3).map(session => {
      const time = new Date(session.scheduledTime).toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit' 
      });
      
      return `
        <div class="la-study-item" onclick="openStudySession('${session.sessionId}')">
          <div class="la-study-time">${time}</div>
          <div class="la-study-content">
            <h5>${this.truncateText(session.title, 35)}</h5>
            <p>${session.course} • ${session.duration}min</p>
          </div>
        </div>
      `;
    }).join('');

    plannerContent.innerHTML = sessionsHtml;
  }

  async loadRecentNotes() {
    try {
      const data = await chrome.storage.local.get(null);
      const allNotes = [];

      // Collect all notes
      Object.keys(data).forEach(key => {
        if (key.startsWith('notes:')) {
          const courseNotes = data[key];
          Object.keys(courseNotes).forEach(lectureId => {
            const lectureNotes = courseNotes[lectureId];
            lectureNotes.forEach(note => {
              allNotes.push({
                ...note,
                courseId: key.replace('notes:', ''),
                lectureId: lectureId
              });
            });
          });
        }
      });

      // Sort by creation date
      allNotes.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      
      this.displayRecentNotes(allNotes.slice(0, 3));
      
    } catch (error) {
      console.error('Error loading recent notes:', error);
    }
  }

  displayRecentNotes(notes) {
    const notesList = document.getElementById('notesList');
    
    if (notes.length === 0) {
      notesList.innerHTML = `
        <div class="la-empty-state">
          <div class="la-empty-icon">📝</div>
          <p>No notes yet</p>
          <p class="la-hint">Press Ctrl+M while watching to add notes</p>
        </div>
      `;
      return;
    }

    const notesHtml = notes.map(note => {
      const createdAt = new Date(note.createdAt);
      const timeStr = this.formatTime(note.timestamp);
      const dateStr = createdAt.toLocaleDateString();
      
      return `
        <div class="la-note-item" onclick="openNote('${note.id}')">
          <div class="la-note-header">
            <span class="la-note-time">📍 ${timeStr}</span>
            <span class="la-note-date">${dateStr}</span>
          </div>
          <div class="la-note-content">${note.text}</div>
        </div>
      `;
    }).join('');

    notesList.innerHTML = notesHtml;
  }

  startRealTimeUpdates() {
    // Update video progress if on supported site
    if (this.isSupportedSite(this.currentTab?.url)) {
      setInterval(() => {
        this.updateVideoProgress();
      }, 1000);
    }
  }

  async updateVideoProgress() {
    try {
      const response = await this.sendMessageToTab({ type: 'GET_VIDEO_PROGRESS' });
      
      if (response && response.progress) {
        const { currentTime, duration, progress } = response.progress;
        
        // Update progress bar
        const progressFill = document.getElementById('progressFill');
        progressFill.style.width = `${progress * 100}%`;
        
        // Update time display
        document.getElementById('currentTime').textContent = this.formatTime(currentTime);
        document.getElementById('duration').textContent = this.formatTime(duration);
      }
    } catch (error) {
      // Silently fail - video might not be available
    }
  }

  async openStudyPanel() {
    if (!this.isSupportedSite(this.currentTab?.url)) {
      this.showToast('Please visit a Coursera or LinkedIn Learning page first', 'warning');
      return;
    }

    try {
      await this.sendMessageToTab({ type: 'OPEN_STUDY_PANEL' });
      window.close(); // Close popup
    } catch (error) {
      console.error('Error opening study panel:', error);
    }
  }

  async generateQuiz() {
    if (!this.isSupportedSite(this.currentTab?.url)) {
      this.showToast('Please visit a Coursera or LinkedIn Learning page first', 'warning');
      return;
    }

    try {
      this.showLoading(true);
      await this.sendMessageToTab({ type: 'GENERATE_QUIZ' });
      this.showLoading(false);
      window.close(); // Close popup
    } catch (error) {
      console.error('Error generating quiz:', error);
      this.showLoading(false);
    }
  }

  async exportData() {
    try {
      this.showLoading(true);
      
      // Get all data from storage
      const data = await chrome.storage.local.get(null);
      
      // Filter relevant data
      const exportData = {
        notes: {},
        progress: {},
        quizzes: {},
        settings: data.settings || {},
        exportedAt: new Date().toISOString()
      };

      Object.keys(data).forEach(key => {
        if (key.startsWith('notes:')) {
          exportData.notes[key] = data[key];
        } else if (key.startsWith('progress:')) {
          exportData.progress[key] = data[key];
        } else if (key.startsWith('quizzes:')) {
          exportData.quizzes[key] = data[key];
        }
      });

      // Create and download file
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { 
        type: 'application/json' 
      });
      const url = URL.createObjectURL(blob);
      
      const filename = `learning-assistant-data-${new Date().toISOString().split('T')[0]}.json`;
      
      await chrome.downloads.download({
        url: url,
        filename: filename,
        saveAs: true
      });

      this.showLoading(false);
      this.showToast('Data exported successfully!', 'success');
      
    } catch (error) {
      console.error('Error exporting data:', error);
      this.showLoading(false);
      this.showToast('Failed to export data', 'error');
    }
  }

  openOptionsPage(section = '') {
    const url = chrome.runtime.getURL('ui/options.html') + (section ? `#${section}` : '');
    chrome.tabs.create({ url: url });
    window.close();
  }

  openHelpPage() {
    chrome.tabs.create({ url: 'https://sugam-portfolio-cv.vercel.app/' });
    window.close();
  }

  showLoading(show) {
    const overlay = document.getElementById('loadingOverlay');
    overlay.classList.toggle('show', show);
  }

  showToast(message, type = 'info') {
    // Create toast element
    const toast = document.createElement('div');
    toast.className = `la-toast la-toast-${type}`;
    toast.textContent = message;
    
    // Add styles
    toast.style.cssText = `
      position: fixed;
      top: 20px;
      left: 50%;
      transform: translateX(-50%);
      background: rgba(11, 18, 38, 0.95);
      color: white;
      padding: 12px 20px;
      border-radius: 12px;
      font-size: 12px;
      font-weight: 600;
      z-index: 1001;
      backdrop-filter: blur(8px);
      border: 1px solid rgba(123, 97, 255, 0.3);
      animation: slideIn 0.3s ease-out;
      font-family: inherit;
    `;
    
    if (type === 'success') {
      toast.style.borderColor = 'rgba(0, 212, 255, 0.5)';
    } else if (type === 'error') {
      toast.style.borderColor = 'rgba(255, 59, 48, 0.5)';
    } else if (type === 'warning') {
      toast.style.borderColor = 'rgba(255, 204, 0, 0.5)';
    }
    
    document.body.appendChild(toast);
    
    // Auto remove
    setTimeout(() => {
      toast.style.animation = 'slideIn 0.3s ease-out reverse';
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }

  formatTime(seconds) {
    if (!seconds || isNaN(seconds)) return '0:00';
    
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  truncateText(text, maxLength) {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  }
}

// Global functions for onclick handlers
window.openStudySession = function(sessionId) {
  console.log('Opening study session:', sessionId);
  // Implementation for opening specific study session
};

window.openNote = function(noteId) {
  console.log('Opening note:', noteId);
  // Implementation for opening specific note
};

// Initialize popup when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new PopupManager();
});