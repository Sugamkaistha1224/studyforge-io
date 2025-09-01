// Chrome Storage Utility Functions
class StorageManager {
  static async get(key) {
    try {
      const data = await chrome.storage.local.get(key);
      return key ? data[key] : data;
    } catch (error) {
      console.error('Storage get error:', error);
      return null;
    }
  }

  static async set(data) {
    try {
      await chrome.storage.local.set(data);
      return true;
    } catch (error) {
      console.error('Storage set error:', error);
      return false;
    }
  }

  static async remove(key) {
    try {
      await chrome.storage.local.remove(key);
      return true;
    } catch (error) {
      console.error('Storage remove error:', error);
      return false;
    }
  }
}