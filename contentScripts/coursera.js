// Coursera-specific content script
// Handles Coursera platform integration for video detection, transcript parsing, and navigation

class CourseraIntegration {
  constructor() {
    this.platform = 'coursera';
    this.transcriptContainer = null;
    this.nextLectureButton = null;
    
    this.init();
  }

  init() {
    console.log('Coursera Integration: Initializing...');
    
    // Wait for page to load
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => this.setup());
    } else {
      this.setup();
    }
  }

  setup() {
    // Enhance video detection for Coursera
    this.enhanceVideoDetection();
    
    // Setup transcript parsing
    this.setupTranscriptParsing();
    
    // Setup navigation enhancement
    this.setupNavigation();
    
    // Listen for next lecture requests
    window.addEventListener('la-next-lecture', () => this.navigateToNext());
  }

  enhanceVideoDetection() {
    // Coursera-specific video selectors
    const courseraVideoSelectors = [
      'video[data-testid="lecture-video"]',
      'video.vjs-tech',
      '.video-player video',
      '[data-track-component="lecture_video"] video',
      '.rc-VideoPlayer video'
    ];

    // Override the common video detection
    const originalFindVideo = window.LearningAssistant?.prototype?.findVideo;
    if (originalFindVideo) {
      window.LearningAssistant.prototype.findVideo = async function() {
        // Try Coursera-specific selectors first
        for (const selector of courseraVideoSelectors) {
          const video = document.querySelector(selector);
          if (video && video.duration) {
            return video;
          }
        }
        
        // Fall back to original method
        return originalFindVideo.call(this);
      };
    }
  }

  setupTranscriptParsing() {
    // Look for Coursera transcript containers
    const transcriptSelectors = [
      '[data-testid="transcript-container"]',
      '.rc-Transcript',
      '.transcript-container',
      '[class*="transcript"]',
      '.cc-transcript'
    ];

    let transcriptFound = false;
    
    for (const selector of transcriptSelectors) {
      const container = document.querySelector(selector);
      if (container) {
        this.transcriptContainer = container;
        this.enhanceTranscript(container);
        transcriptFound = true;
        break;
      }
    }

    if (!transcriptFound) {
      // Set up observer to wait for transcript
      const observer = new MutationObserver((mutations) => {
        for (const selector of transcriptSelectors) {
          const container = document.querySelector(selector);
          if (container) {
            this.transcriptContainer = container;
            this.enhanceTranscript(container);
            observer.disconnect();
            return;
          }
        }
      });

      observer.observe(document, {
        childList: true,
        subtree: true
      });
    }
  }

  enhanceTranscript(container) {
    console.log('Enhancing Coursera transcript:', container);

    // Add click-to-seek functionality
    container.addEventListener('click', (e) => {
      const transcriptLine = e.target.closest('[data-timestamp], .transcript-line, .rc-TranscriptLine');
      if (transcriptLine) {
        const timestamp = this.extractTimestamp(transcriptLine);
        if (timestamp !== null) {
          this.seekToTimestamp(timestamp);
        }
      }
    });

    // Enhance transcript lines with hover effects
    const style = document.createElement('style');
    style.textContent = `
      .rc-TranscriptLine:hover,
      .transcript-line:hover,
      [data-timestamp]:hover {
        background-color: rgba(123, 97, 255, 0.1) !important;
        cursor: pointer !important;
        border-radius: 4px !important;
      }
      
      .la-active-transcript {
        background-color: rgba(0, 212, 255, 0.2) !important;
        border-left: 3px solid #00d4ff !important;
        padding-left: 8px !important;
        border-radius: 0 4px 4px 0 !important;
      }
    `;
    document.head.appendChild(style);

    // Set up real-time sync with video
    this.setupTranscriptSync();
  }

  extractTimestamp(element) {
    // Try different timestamp formats used by Coursera
    const timeAttr = element.getAttribute('data-timestamp') ||
                    element.getAttribute('data-start') ||
                    element.getAttribute('data-time');
                    
    if (timeAttr) {
      return parseFloat(timeAttr);
    }

    // Try to parse from text content (format: [mm:ss])
    const timeText = element.textContent.match(/\[(\d+):(\d+)\]/);
    if (timeText) {
      return parseInt(timeText[1]) * 60 + parseInt(timeText[2]);
    }

    // Look for time in child elements
    const timeElement = element.querySelector('[data-timestamp], .timestamp, .time');
    if (timeElement) {
      const time = timeElement.getAttribute('data-timestamp') || timeElement.textContent;
      if (time) {
        const match = time.match(/(\d+):(\d+)/);
        if (match) {
          return parseInt(match[1]) * 60 + parseInt(match[2]);
        }
        return parseFloat(time);
      }
    }

    return null;
  }

  seekToTimestamp(timestamp) {
    const video = document.querySelector('video');
    if (video) {
      video.currentTime = timestamp;
      
      // Show seeking feedback
      this.showSeekFeedback(timestamp);
    }
  }

  showSeekFeedback(timestamp) {
    const feedback = document.createElement('div');
    feedback.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: rgba(11, 18, 38, 0.9);
      color: white;
      padding: 12px 20px;
      border-radius: 12px;
      font-size: 16px;
      font-weight: 600;
      z-index: 10000;
      backdrop-filter: blur(8px);
      border: 1px solid rgba(0, 212, 255, 0.5);
      box-shadow: 0 8px 32px rgba(0, 212, 255, 0.3);
      animation: la-seek-fade 0.5s ease-out;
    `;
    
    feedback.innerHTML = `⏭ Seeking to ${this.formatTime(timestamp)}`;
    
    const style = document.createElement('style');
    style.textContent = `
      @keyframes la-seek-fade {
        0% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
        50% { opacity: 1; transform: translate(-50%, -50%) scale(1.05); }
        100% { opacity: 0; transform: translate(-50%, -50%) scale(1); }
      }
    `;
    
    document.head.appendChild(style);
    document.body.appendChild(feedback);
    
    setTimeout(() => feedback.remove(), 500);
  }

  formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  setupTranscriptSync() {
    const video = document.querySelector('video');
    if (!video || !this.transcriptContainer) return;

    // Sync transcript highlight with video progress
    video.addEventListener('timeupdate', () => {
      this.syncTranscriptHighlight(video.currentTime);
    });
  }

  syncTranscriptHighlight(currentTime) {
    if (!this.transcriptContainer) return;

    const transcriptLines = this.transcriptContainer.querySelectorAll(
      '[data-timestamp], .transcript-line, .rc-TranscriptLine'
    );

    let activeFound = false;

    transcriptLines.forEach(line => {
      const timestamp = this.extractTimestamp(line);
      
      if (timestamp !== null) {
        // Check if this line should be active (within 2 seconds)
        const isActive = Math.abs(timestamp - currentTime) < 2 && !activeFound;
        
        if (isActive) {
          line.classList.add('la-active-transcript');
          activeFound = true;
          
          // Scroll line into view
          line.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
          });
        } else {
          line.classList.remove('la-active-transcript');
        }
      }
    });
  }

  setupNavigation() {
    // Find next lecture button patterns in Coursera
    this.nextLectureSelectors = [
      '[data-testid="next-lecture-button"]',
      '.rc-NextButton',
      'button[aria-label*="next"]',
      'button[aria-label*="Next"]',
      '.next-lecture',
      '.lecture-next',
      'a[href*="lecture"][href*="next"]'
    ];
  }

  navigateToNext() {
    console.log('Coursera: Attempting to navigate to next lecture');

    // Try to find and click next button
    for (const selector of this.nextLectureSelectors) {
      const button = document.querySelector(selector);
      if (button && !button.disabled) {
        console.log('Found next button:', button);
        button.click();
        this.showNavigationFeedback('Next lecture loaded');
        return;
      }
    }

    // Alternative: Look for navigation menu
    this.navigateViaMenu();
  }

  navigateViaMenu() {
    // Look for course outline/menu
    const menuSelectors = [
      '.rc-WeekTabsContent',
      '.course-outline',
      '.lecture-list',
      '[data-testid="course-outline"]'
    ];

    for (const selector of menuSelectors) {
      const menu = document.querySelector(selector);
      if (menu) {
        // Find current lecture and next one
        const currentLecture = menu.querySelector('.active, [aria-current="page"]');
        if (currentLecture) {
          const nextLecture = this.findNextLectureInMenu(currentLecture);
          if (nextLecture) {
            nextLecture.click();
            this.showNavigationFeedback('Next lecture loaded');
            return;
          }
        }
      }
    }

    // If no automatic navigation found, show manual guidance
    this.showNavigationGuidance();
  }

  findNextLectureInMenu(currentElement) {
    // Try to find the next sibling that's a lecture link
    let next = currentElement.nextElementSibling;
    
    while (next) {
      if (this.isLectureLink(next)) {
        return next;
      }
      
      // Look inside the next element
      const lectureLink = next.querySelector('a, button');
      if (lectureLink && this.isLectureLink(lectureLink)) {
        return lectureLink;
      }
      
      next = next.nextElementSibling;
    }

    // Try parent's next sibling (different week/module)
    const parent = currentElement.closest('.week, .module, .section');
    if (parent) {
      const nextParent = parent.nextElementSibling;
      if (nextParent) {
        const firstLecture = nextParent.querySelector('a, button');
        if (firstLecture && this.isLectureLink(firstLecture)) {
          return firstLecture;
        }
      }
    }

    return null;
  }

  isLectureLink(element) {
    const href = element.href || '';
    const text = element.textContent.toLowerCase();
    const ariaLabel = element.getAttribute('aria-label') || '';
    
    return (
      href.includes('/lecture/') ||
      href.includes('/learn/') ||
      text.includes('lecture') ||
      text.includes('video') ||
      ariaLabel.includes('lecture') ||
      element.hasAttribute('data-lecture-id')
    );
  }

  showNavigationFeedback(message) {
    const feedback = document.createElement('div');
    feedback.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: linear-gradient(135deg, #7b61ff, #00d4ff);
      color: white;
      padding: 12px 20px;
      border-radius: 12px;
      font-size: 14px;
      font-weight: 600;
      z-index: 10000;
      backdrop-filter: blur(8px);
      box-shadow: 0 8px 32px rgba(123, 97, 255, 0.3);
      animation: la-nav-slide-in 0.5s ease-out;
    `;
    
    feedback.innerHTML = `✓ ${message}`;
    
    const style = document.createElement('style');
    style.textContent = `
      @keyframes la-nav-slide-in {
        from {
          opacity: 0;
          transform: translateX(100px);
        }
        to {
          opacity: 1;
          transform: translateX(0);
        }
      }
    `;
    
    document.head.appendChild(style);
    document.body.appendChild(feedback);
    
    setTimeout(() => {
      feedback.style.animation = 'la-nav-slide-in 0.3s ease-out reverse';
      setTimeout(() => feedback.remove(), 300);
    }, 3000);
  }

  showNavigationGuidance() {
    const guidance = document.createElement('div');
    guidance.style.cssText = `
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: rgba(11, 18, 38, 0.95);
      color: white;
      padding: 20px;
      border-radius: 16px;
      font-size: 14px;
      z-index: 10000;
      backdrop-filter: blur(12px);
      border: 1px solid rgba(123, 97, 255, 0.3);
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
      max-width: 300px;
      text-align: center;
      animation: la-guidance-fade-in 0.3s ease-out;
    `;
    
    guidance.innerHTML = `
      <div style="margin-bottom: 12px; font-size: 24px;">🎓</div>
      <div style="font-weight: 600; margin-bottom: 8px;">Great job!</div>
      <div style="color: #ccc; line-height: 1.4;">
        You've completed this lecture. Navigate to the next one using the course menu or player controls.
      </div>
      <button onclick="this.parentElement.remove()" style="
        background: linear-gradient(135deg, #7b61ff, #00d4ff);
        color: white;
        border: none;
        padding: 8px 16px;
        border-radius: 8px;
        font-size: 12px;
        font-weight: 600;
        cursor: pointer;
        margin-top: 12px;
      ">Got it!</button>
    `;
    
    const style = document.createElement('style');
    style.textContent = `
      @keyframes la-guidance-fade-in {
        from {
          opacity: 0;
          transform: translate(-50%, -50%) scale(0.9);
        }
        to {
          opacity: 1;
          transform: translate(-50%, -50%) scale(1);
        }
      }
    `;
    
    document.head.appendChild(style);
    document.body.appendChild(guidance);
    
    // Auto remove after 10 seconds
    setTimeout(() => {
      if (guidance.parentElement) {
        guidance.remove();
      }
    }, 10000);
  }

  // Enhanced course info extraction
  getCourseInfo() {
    const url = window.location.href;
    const courseMatch = url.match(/\/learn\/([^\/]+)/);
    const courseSlug = courseMatch ? courseMatch[1] : 'unknown';
    
    // Try to get course title from page
    const titleElement = document.querySelector(
      'h1, .course-title, [data-testid="course-title"], .rc-CourseTitle'
    );
    const courseTitle = titleElement ? titleElement.textContent.trim() : document.title;
    
    // Try to get lecture info
    const lectureElement = document.querySelector(
      '.lecture-title, [data-testid="lecture-title"], .rc-LectureTitle'
    );
    const lectureTitle = lectureElement ? lectureElement.textContent.trim() : 'Unknown Lecture';
    
    return {
      platform: 'coursera',
      id: courseSlug,
      title: courseTitle,
      currentLecture: {
        title: lectureTitle,
        url: window.location.href
      },
      url: window.location.href
    };
  }
}

// Initialize Coursera integration
const courseraIntegration = new CourseraIntegration();