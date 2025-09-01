// Common utilities for content scripts
// Shared functionality for video detection, watch tracking, and DOM manipulation

class LearningAssistant {
  constructor() {
    this.video = null;
    this.watchTracker = null;
    this.transcriptObserver = null;
    this.settings = {};
    this.currentCourse = null;
    this.currentLecture = null;
    
    this.init();
  }

  async init() {
    console.log('Learning Assistant: Initializing common functionality');
    
    // Load settings
    await this.loadSettings();
    
    // Setup hotkeys
    this.setupHotkeys();
    
    // Find and setup video
    await this.findAndSetupVideo();
    
    // Setup transcript detection
    this.setupTranscriptDetection();
    
    // Extract course/lecture info
    this.extractCourseInfo();
  }

  async loadSettings() {
    try {
      const data = await chrome.storage.local.get('settings');
      this.settings = data.settings || {};
    } catch (error) {
      console.error('Error loading settings:', error);
    }
  }

  // Video detection with fallback strategies
  async findVideo() {
    // Strategy 1: Direct video element
    let video = document.querySelector('video');
    if (video && video.duration) {
      return video;
    }

    // Strategy 2: Look in common player containers
    const playerSelectors = [
      '[data-testid*="video"]',
      '[class*="player"]',
      '[class*="video"]',
      'iframe[src*="player"]'
    ];

    for (const selector of playerSelectors) {
      const container = document.querySelector(selector);
      if (container) {
        video = container.querySelector('video');
        if (video && video.duration) {
          return video;
        }
      }
    }

    // Strategy 3: Wait for video to appear
    return new Promise((resolve, reject) => {
      const observer = new MutationObserver((mutations, obs) => {
        video = document.querySelector('video');
        if (video && video.duration) {
          obs.disconnect();
          resolve(video);
        }
      });

      observer.observe(document, { 
        childList: true, 
        subtree: true 
      });

      // Timeout after 15 seconds
      setTimeout(() => {
        observer.disconnect();
        reject(new Error('Video not found within timeout'));
      }, 15000);
    });
  }

  async findAndSetupVideo() {
    try {
      this.video = await this.findVideo();
      console.log('Video found:', this.video);
      
      if (this.video) {
        this.setupWatchTracker();
        this.addVideoControls();
      }
    } catch (error) {
      console.warn('Could not find video:', error);
    }
  }

  setupWatchTracker() {
    if (!this.video) return;

    const tracker = new WatchTracker(this.video, this.onWatchComplete.bind(this));
    this.watchTracker = tracker;
  }

  onWatchComplete() {
    console.log('Video watch completed - eligible for next');
    this.showNextLectureButton();
  }

  showNextLectureButton() {
    // Remove existing button if present
    const existingBtn = document.getElementById('la-next-lecture-btn');
    if (existingBtn) existingBtn.remove();

    // Create floating "Next Lecture" button
    const button = document.createElement('div');
    button.id = 'la-next-lecture-btn';
    button.innerHTML = `
      <div class="la-next-btn-content">
        <div class="la-next-btn-icon">▶</div>
        <div class="la-next-btn-text">Go to Next Lecture</div>
      </div>
    `;
    
    // Add styles
    const style = document.createElement('style');
    style.textContent = `
      #la-next-lecture-btn {
        position: fixed;
        bottom: 20px;
        right: 20px;
        z-index: 10000;
        cursor: pointer;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        animation: la-fade-in 0.5s ease-out;
      }
      
      .la-next-btn-content {
        background: linear-gradient(135deg, #7b61ff, #00d4ff);
        color: white;
        padding: 12px 20px;
        border-radius: 16px;
        display: flex;
        align-items: center;
        gap: 8px;
        box-shadow: 0 8px 32px rgba(123, 97, 255, 0.3);
        backdrop-filter: blur(12px);
        border: 1px solid rgba(255, 255, 255, 0.1);
        transition: all 0.3s ease;
      }
      
      .la-next-btn-content:hover {
        transform: translateY(-2px);
        box-shadow: 0 12px 40px rgba(123, 97, 255, 0.4);
      }
      
      .la-next-btn-icon {
        font-size: 14px;
      }
      
      .la-next-btn-text {
        font-weight: 600;
        font-size: 14px;
      }
      
      @keyframes la-fade-in {
        from {
          opacity: 0;
          transform: translateY(10px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
    `;
    
    document.head.appendChild(style);
    document.body.appendChild(button);
    
    // Handle click
    button.addEventListener('click', () => {
      this.goToNextLecture();
      button.remove();
    });
  }

  goToNextLecture() {
    // Platform-specific logic will be implemented in coursera.js and linkedin-learning.js
    console.log('Navigating to next lecture...');
    
    // Send message to platform-specific script
    window.dispatchEvent(new CustomEvent('la-next-lecture'));
  }

  addVideoControls() {
    if (!this.video) return;

    // Add playback rate indicator
    const indicator = document.createElement('div');
    indicator.id = 'la-playback-indicator';
    indicator.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: rgba(11, 18, 38, 0.9);
      color: white;
      padding: 8px 12px;
      border-radius: 8px;
      font-size: 12px;
      font-weight: 600;
      z-index: 9999;
      backdrop-filter: blur(8px);
      border: 1px solid rgba(123, 97, 255, 0.3);
      opacity: 0;
      transition: opacity 0.3s ease;
    `;
    
    document.body.appendChild(indicator);
    
    // Update indicator when playback rate changes
    this.video.addEventListener('ratechange', () => {
      indicator.textContent = `${this.video.playbackRate}x`;
      indicator.style.opacity = '1';
      
      setTimeout(() => {
        indicator.style.opacity = '0';
      }, 2000);
    });
  }

  setupHotkeys() {
    document.addEventListener('keydown', (e) => {
      // Check if we should ignore this keypress (in input fields, etc.)
      if (this.shouldIgnoreKeypress(e)) return;

      const { altKey, ctrlKey, key } = e;
      
      // Alt + P: Play/Pause
      if (altKey && key === 'p') {
        e.preventDefault();
        this.togglePlayPause();
      }
      
      // Alt + Right Arrow: Seek forward 10s
      if (altKey && key === 'ArrowRight') {
        e.preventDefault();
        this.seekVideo(10);
      }
      
      // Alt + Left Arrow: Seek backward 10s
      if (altKey && key === 'ArrowLeft') {
        e.preventDefault();
        this.seekVideo(-10);
      }
      
      // Ctrl + M: Add note
      if (ctrlKey && key === 'm') {
        e.preventDefault();
        this.addNote();
      }
    });
  }

  shouldIgnoreKeypress(e) {
    const target = e.target;
    const tagName = target.tagName.toLowerCase();
    
    return (
      tagName === 'input' ||
      tagName === 'textarea' ||
      tagName === 'select' ||
      target.contentEditable === 'true' ||
      target.isContentEditable
    );
  }

  togglePlayPause() {
    if (!this.video) return;
    
    if (this.video.paused) {
      this.video.play();
    } else {
      this.video.pause();
    }
  }

  seekVideo(seconds) {
    if (!this.video) return;
    
    this.video.currentTime = Math.max(0, 
      Math.min(this.video.duration, this.video.currentTime + seconds)
    );
  }

  async addNote() {
    if (!this.video) return;
    
    const timestamp = this.video.currentTime;
    const transcriptText = this.getCurrentTranscriptText();
    
    // Show note input modal
    this.showNoteModal(timestamp, transcriptText);
  }

  getCurrentTranscriptText() {
    // This will be enhanced by platform-specific scripts
    const activeTranscriptLine = document.querySelector('.transcript-line.active, .caption.active, [aria-current="true"]');
    return activeTranscriptLine ? activeTranscriptLine.textContent.trim() : '';
  }

  showNoteModal(timestamp, transcriptText) {
    // Create modal
    const modal = document.createElement('div');
    modal.id = 'la-note-modal';
    modal.innerHTML = `
      <div class="la-modal-backdrop">
        <div class="la-modal-content">
          <div class="la-modal-header">
            <h3>Add Note</h3>
            <button class="la-modal-close">×</button>
          </div>
          <div class="la-modal-body">
            <div class="la-timestamp">
              📍 ${this.formatTime(timestamp)}
            </div>
            ${transcriptText ? `<div class="la-transcript-preview">"${transcriptText}"</div>` : ''}
            <textarea class="la-note-input" placeholder="Enter your note..." rows="4"></textarea>
          </div>
          <div class="la-modal-footer">
            <button class="la-btn-cancel">Cancel</button>
            <button class="la-btn-save">Save Note</button>
          </div>
        </div>
      </div>
    `;
    
    // Add styles
    const style = document.createElement('style');
    style.textContent = `
      #la-note-modal {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 10000;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      }
      
      .la-modal-backdrop {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(11, 18, 38, 0.8);
        backdrop-filter: blur(8px);
        display: flex;
        align-items: center;
        justify-content: center;
        animation: la-modal-fade-in 0.3s ease-out;
      }
      
      .la-modal-content {
        background: linear-gradient(135deg, rgba(11, 18, 38, 0.95), rgba(17, 25, 44, 0.95));
        border: 1px solid rgba(123, 97, 255, 0.3);
        border-radius: 16px;
        width: 90%;
        max-width: 500px;
        max-height: 90vh;
        overflow: hidden;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
        animation: la-modal-scale-in 0.3s ease-out;
      }
      
      .la-modal-header {
        padding: 20px;
        border-bottom: 1px solid rgba(123, 97, 255, 0.2);
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      
      .la-modal-header h3 {
        margin: 0;
        color: white;
        font-size: 18px;
        font-weight: 600;
      }
      
      .la-modal-close {
        background: none;
        border: none;
        color: #888;
        font-size: 24px;
        cursor: pointer;
        padding: 0;
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 8px;
        transition: all 0.2s ease;
      }
      
      .la-modal-close:hover {
        background: rgba(255, 255, 255, 0.1);
        color: white;
      }
      
      .la-modal-body {
        padding: 20px;
      }
      
      .la-timestamp {
        color: #7b61ff;
        font-size: 14px;
        font-weight: 600;
        margin-bottom: 12px;
      }
      
      .la-transcript-preview {
        background: rgba(123, 97, 255, 0.1);
        border: 1px solid rgba(123, 97, 255, 0.2);
        border-radius: 8px;
        padding: 12px;
        color: #ccc;
        font-style: italic;
        font-size: 14px;
        margin-bottom: 16px;
      }
      
      .la-note-input {
        width: 100%;
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(123, 97, 255, 0.3);
        border-radius: 8px;
        padding: 12px;
        color: white;
        font-size: 14px;
        font-family: inherit;
        resize: vertical;
        min-height: 100px;
      }
      
      .la-note-input:focus {
        outline: none;
        border-color: #7b61ff;
        box-shadow: 0 0 0 2px rgba(123, 97, 255, 0.2);
      }
      
      .la-note-input::placeholder {
        color: #666;
      }
      
      .la-modal-footer {
        padding: 20px;
        border-top: 1px solid rgba(123, 97, 255, 0.2);
        display: flex;
        gap: 12px;
        justify-content: flex-end;
      }
      
      .la-btn-cancel, .la-btn-save {
        padding: 10px 20px;
        border-radius: 8px;
        font-size: 14px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s ease;
        border: none;
      }
      
      .la-btn-cancel {
        background: rgba(255, 255, 255, 0.1);
        color: #ccc;
      }
      
      .la-btn-cancel:hover {
        background: rgba(255, 255, 255, 0.2);
        color: white;
      }
      
      .la-btn-save {
        background: linear-gradient(135deg, #7b61ff, #00d4ff);
        color: white;
      }
      
      .la-btn-save:hover {
        transform: translateY(-1px);
        box-shadow: 0 4px 20px rgba(123, 97, 255, 0.4);
      }
      
      @keyframes la-modal-fade-in {
        from { opacity: 0; }
        to { opacity: 1; }
      }
      
      @keyframes la-modal-scale-in {
        from { 
          opacity: 0;
          transform: scale(0.95) translateY(10px);
        }
        to { 
          opacity: 1;
          transform: scale(1) translateY(0);
        }
      }
    `;
    
    document.head.appendChild(style);
    document.body.appendChild(modal);
    
    // Focus on textarea
    const textarea = modal.querySelector('.la-note-input');
    textarea.focus();
    
    // Handle events
    modal.querySelector('.la-modal-close').addEventListener('click', () => this.closeNoteModal());
    modal.querySelector('.la-btn-cancel').addEventListener('click', () => this.closeNoteModal());
    modal.querySelector('.la-btn-save').addEventListener('click', () => this.saveNote(timestamp, transcriptText, textarea.value));
    
    // Close on backdrop click
    modal.querySelector('.la-modal-backdrop').addEventListener('click', (e) => {
      if (e.target === e.currentTarget) {
        this.closeNoteModal();
      }
    });
    
    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.closeNoteModal();
      }
    });
  }

  closeNoteModal() {
    const modal = document.getElementById('la-note-modal');
    if (modal) {
      modal.remove();
    }
  }

  async saveNote(timestamp, transcriptText, noteText) {
    if (!noteText.trim()) {
      this.closeNoteModal();
      return;
    }

    try {
      const courseId = this.getCurrentCourseId();
      const lectureId = this.getCurrentLectureId();
      
      const note = {
        id: Date.now().toString(),
        timestamp,
        transcriptText,
        text: noteText.trim(),
        createdAt: new Date().toISOString()
      };
      
      // Get existing notes
      const key = `notes:${courseId}`;
      const data = await chrome.storage.local.get(key);
      const courseNotes = data[key] || {};
      
      if (!courseNotes[lectureId]) {
        courseNotes[lectureId] = [];
      }
      
      courseNotes[lectureId].push(note);
      
      // Save to storage
      await chrome.storage.local.set({ [key]: courseNotes });
      
      console.log('Note saved:', note);
      this.closeNoteModal();
      
      // Show success feedback
      this.showToast('Note saved! 📝', 'success');
      
    } catch (error) {
      console.error('Error saving note:', error);
      this.showToast('Failed to save note', 'error');
    }
  }

  showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `la-toast la-toast-${type}`;
    toast.textContent = message;
    
    const style = document.createElement('style');
    style.textContent = `
      .la-toast {
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(11, 18, 38, 0.95);
        color: white;
        padding: 12px 20px;
        border-radius: 12px;
        font-size: 14px;
        font-weight: 600;
        z-index: 10001;
        backdrop-filter: blur(8px);
        border: 1px solid rgba(123, 97, 255, 0.3);
        animation: la-toast-slide-in 0.3s ease-out;
      }
      
      .la-toast-success {
        border-color: rgba(0, 212, 255, 0.5);
        box-shadow: 0 8px 32px rgba(0, 212, 255, 0.2);
      }
      
      .la-toast-error {
        border-color: rgba(255, 59, 48, 0.5);
        box-shadow: 0 8px 32px rgba(255, 59, 48, 0.2);
      }
      
      @keyframes la-toast-slide-in {
        from {
          opacity: 0;
          transform: translateX(-50%) translateY(-10px);
        }
        to {
          opacity: 1;
          transform: translateX(-50%) translateY(0);
        }
      }
    `;
    
    document.head.appendChild(style);
    document.body.appendChild(toast);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
      toast.style.animation = 'la-toast-slide-in 0.3s ease-out reverse';
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }

  formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  setupTranscriptDetection() {
    // Look for transcript containers
    const transcriptSelectors = [
      '[data-testid*="transcript"]',
      '[class*="transcript"]',
      '[class*="caption"]',
      '[class*="subtitle"]',
      '[role="complementary"]'
    ];
    
    // Set up observer for transcript changes
    this.transcriptObserver = new MutationObserver(() => {
      this.syncTranscriptHighlight();
    });
    
    // Start observing
    for (const selector of transcriptSelectors) {
      const container = document.querySelector(selector);
      if (container) {
        this.transcriptObserver.observe(container, {
          childList: true,
          subtree: true,
          characterData: true
        });
        break;
      }
    }
  }

  syncTranscriptHighlight() {
    if (!this.video) return;
    
    // This will be enhanced by platform-specific implementations
    const currentTime = this.video.currentTime;
    
    // Basic implementation - find active transcript line
    const transcriptLines = document.querySelectorAll(
      '.transcript-line, .caption-line, [data-time]'
    );
    
    transcriptLines.forEach(line => {
      const timeAttr = line.getAttribute('data-time') || 
                     line.getAttribute('data-start') ||
                     line.getAttribute('data-timestamp');
                     
      if (timeAttr) {
        const lineTime = parseFloat(timeAttr);
        if (Math.abs(lineTime - currentTime) < 2) {
          line.classList.add('la-active-transcript');
        } else {
          line.classList.remove('la-active-transcript');
        }
      }
    });
  }

  extractCourseInfo() {
    // Extract course and lecture information from URL and page content
    const url = window.location.href;
    
    if (url.includes('coursera.org')) {
      this.currentCourse = this.extractCourseraInfo(url);
    } else if (url.includes('linkedin.com/learning')) {
      this.currentCourse = this.extractLinkedInInfo(url);
    }
  }

  extractCourseraInfo(url) {
    const match = url.match(/\/learn\/([^\/]+)/);
    return {
      platform: 'coursera',
      id: match ? match[1] : 'unknown',
      title: document.title,
      url: url
    };
  }

  extractLinkedInInfo(url) {
    const match = url.match(/\/learning\/([^\/]+)/);
    return {
      platform: 'linkedin',
      id: match ? match[1] : 'unknown', 
      title: document.title,
      url: url
    };
  }

  getCurrentCourseId() {
    return this.currentCourse ? `${this.currentCourse.platform}:${this.currentCourse.id}` : 'unknown';
  }

  getCurrentLectureId() {
    // This should be implemented by platform-specific scripts
    // For now, use a basic implementation
    const url = window.location.href;
    const hash = window.location.hash;
    return hash || url.split('/').pop() || 'lecture-1';
  }
}

// Watch tracker class for video completion detection
class WatchTracker {
  constructor(video, onComplete) {
    this.video = video;
    this.onComplete = onComplete;
    this.watchedTime = 0;
    this.lastTime = 0;
    this.completed = false;
    this.threshold = 0.96; // 96% completion threshold
    
    this.setupTracking();
  }

  setupTracking() {
    // Set up intersection observer to check if video is in viewport
    this.intersectionObserver = new IntersectionObserver((entries) => {
      this.isInViewport = entries[0].intersectionRatio >= 0.5;
    }, { threshold: [0.5] });
    
    this.intersectionObserver.observe(this.video);

    // Track video progress
    this.video.addEventListener('timeupdate', () => {
      this.updateWatchTime();
    });

    this.video.addEventListener('loadedmetadata', () => {
      this.lastTime = this.video.currentTime;
    });
  }

  updateWatchTime() {
    const currentTime = this.video.currentTime;
    const dt = currentTime - this.lastTime;
    
    // Only count time if conditions are met
    if (this.shouldCountTime(dt)) {
      const playbackRate = Math.min(this.video.playbackRate, 2.0); // Cap at 2x
      this.watchedTime += dt * Math.min(playbackRate, 1.0); // Don't count extra for fast playback
    }
    
    this.lastTime = currentTime;
    
    // Check for completion
    if (!this.completed && this.video.duration && 
        this.watchedTime >= this.threshold * this.video.duration) {
      this.completed = true;
      this.onComplete();
    }
  }

  shouldCountTime(dt) {
    return (
      dt > 0 && dt < 5 && // Reasonable time delta (not seeking)
      document.visibilityState === 'visible' && // Tab is visible
      this.isInViewport && // Video is in viewport
      !this.video.muted && // Video is not muted
      !this.video.paused // Video is playing
    );
  }

  getProgress() {
    return {
      watchedTime: this.watchedTime,
      duration: this.video.duration,
      completion: this.video.duration ? this.watchedTime / this.video.duration : 0,
      completed: this.completed
    };
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new LearningAssistant();
  });
} else {
  new LearningAssistant();
}