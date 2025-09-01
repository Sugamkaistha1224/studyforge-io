// Learning Assistant Options Page JavaScript
class OptionsManager {
  constructor() {
    this.currentSection = 'dashboard';
    this.init();
  }

  async init() {
    this.setupNavigation();
    this.setupEventListeners();
    await this.loadSettings();
    this.loadDashboardData();
  }

  setupNavigation() {
    const navItems = document.querySelectorAll('.la-nav-item');
    navItems.forEach(item => {
      item.addEventListener('click', () => {
        const section = item.dataset.section;
        this.switchSection(section);
      });
    });

    // Handle URL hash
    const hash = window.location.hash.substring(1);
    if (hash) {
      this.switchSection(hash);
    }
  }

  switchSection(sectionName) {
    // Update navigation
    document.querySelectorAll('.la-nav-item').forEach(item => {
      item.classList.toggle('active', item.dataset.section === sectionName);
    });

    // Update sections
    document.querySelectorAll('.la-section').forEach(section => {
      section.classList.toggle('active', section.id === `section-${sectionName}`);
    });

    this.currentSection = sectionName;
    window.location.hash = sectionName;
  }

  setupEventListeners() {
    // CSV Upload
    const csvInput = document.getElementById('csvFileInput');
    const uploadArea = document.getElementById('csvUploadArea');
    
    uploadArea.addEventListener('click', () => csvInput.click());
    csvInput.addEventListener('change', (e) => this.handleCSVUpload(e.target.files[0]));

    // Settings
    document.getElementById('saveSettings').addEventListener('click', () => this.saveSettings());
    document.getElementById('resetSettings').addEventListener('click', () => this.resetSettings());

    // Export functions
    document.getElementById('exportAll').addEventListener('click', () => this.exportAllData());
  }

  async handleCSVUpload(file) {
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const csv = e.target.result;
        const parsed = Papa.parse(csv, { header: true });
        this.processScheduleData(parsed.data);
      } catch (error) {
        this.showToast('Error parsing CSV file', 'error');
      }
    };
    reader.readAsText(file);
  }

  processScheduleData(data) {
    // Generate schedule using Earliest-Deadline-First algorithm
    const sessions = [];
    data.forEach((row, index) => {
      if (row.course && row.title && row.est_minutes && row.deadline) {
        sessions.push({
          sessionId: `session-${Date.now()}-${index}`,
          course: row.course,
          title: row.title,
          duration: parseInt(row.est_minutes),
          deadline: new Date(row.deadline),
          status: 'scheduled'
        });
      }
    });

    // Sort by deadline
    sessions.sort((a, b) => a.deadline - b.deadline);
    
    this.displaySchedulePreview(sessions);
  }

  displaySchedulePreview(sessions) {
    const preview = document.getElementById('schedulePreview');
    const totalSessions = sessions.length;
    const totalHours = sessions.reduce((sum, s) => sum + s.duration, 0) / 60;
    
    document.getElementById('totalSessions').textContent = totalSessions;
    document.getElementById('totalHours').textContent = totalHours.toFixed(1);
    
    preview.style.display = 'block';
  }

  async loadSettings() {
    try {
      const data = await chrome.storage.local.get('settings');
      const settings = data.settings || {};
      
      // Load form values
      document.getElementById('maxPlaybackRate').value = settings.maxPlaybackRate || 2.0;
      document.getElementById('completionThreshold').value = settings.completionThreshold || 0.96;
      document.getElementById('dailyBudget').value = settings.dailyBudgetMins || 120;
      document.getElementById('sessionLength').value = settings.sessionLengthMins || 30;
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  }

  async saveSettings() {
    try {
      const settings = {
        maxPlaybackRate: parseFloat(document.getElementById('maxPlaybackRate').value),
        completionThreshold: parseFloat(document.getElementById('completionThreshold').value),
        dailyBudgetMins: parseInt(document.getElementById('dailyBudget').value),
        sessionLengthMins: parseInt(document.getElementById('sessionLength').value),
        hotkeys: {
          playPause: 'Alt+P',
          seekForward: 'Alt+ArrowRight',
          seekBackward: 'Alt+ArrowLeft',
          addNote: 'Ctrl+M'
        }
      };

      await chrome.storage.local.set({ settings });
      this.showToast('Settings saved successfully!', 'success');
    } catch (error) {
      console.error('Error saving settings:', error);
      this.showToast('Failed to save settings', 'error');
    }
  }

  async loadDashboardData() {
    try {
      const data = await chrome.storage.local.get(null);
      let totalTime = 0, totalNotes = 0, totalCourses = 0;

      Object.keys(data).forEach(key => {
        if (key.startsWith('progress:')) {
          totalCourses++;
          const progress = data[key];
          if (progress.lectures) {
            Object.values(progress.lectures).forEach(lecture => {
              totalTime += lecture.watchedTime || 0;
            });
          }
        } else if (key.startsWith('notes:')) {
          const notes = data[key];
          Object.values(notes).forEach(lectureNotes => {
            totalNotes += lectureNotes.length || 0;
          });
        }
      });

      const hours = Math.floor(totalTime / 3600);
      const minutes = Math.floor((totalTime % 3600) / 60);
      
      document.getElementById('dashTotalTime').textContent = `${hours}h ${minutes}m`;
      document.getElementById('dashTotalCourses').textContent = totalCourses;
      document.getElementById('dashTotalNotes').textContent = totalNotes;
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    }
  }

  async exportAllData() {
    try {
      const data = await chrome.storage.local.get(null);
      const exportData = {
        notes: {},
        progress: {},
        settings: data.settings || {},
        exportedAt: new Date().toISOString()
      };

      Object.keys(data).forEach(key => {
        if (key.startsWith('notes:') || key.startsWith('progress:')) {
          exportData[key.startsWith('notes:') ? 'notes' : 'progress'][key] = data[key];
        }
      });

      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `learning-assistant-backup-${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      
      this.showToast('Data exported successfully!', 'success');
    } catch (error) {
      this.showToast('Failed to export data', 'error');
    }
  }

  showToast(message, type = 'info') {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `la-toast ${type}`;
    toast.textContent = message;
    
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
  }
}

document.addEventListener('DOMContentLoaded', () => new OptionsManager());