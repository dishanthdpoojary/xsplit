/**
 * OCR Service Client
 * Communicates with the local ocr-service Node.js server (port 3000).
 *
 * To use:
 *  1. Clone dishanthdpoojary/ocr-service and run `node server.js`
 *  2. The server listens on http://localhost:3000
 *  3. Call scanReceipt(file) with a File object from an <input type="file">
 */

const OCR_SERVICE_URL = import.meta.env.VITE_OCR_SERVICE_URL || 'http://localhost:3000';

/**
 * Sends a receipt image to the OCR service and returns parsed data.
 * @param {File} imageFile - A File or Blob from an <input type="file"> or drag-and-drop
 * @returns {Promise<{ success: boolean, data?: { merchant, total, items }, error?: string }>}
 */
export const scanReceipt = async (imageFile) => {
  if (!imageFile) {
    return { success: false, error: 'No image file provided.' };
  }

  const formData = new FormData();
  formData.append('image', imageFile);

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30000); // 30 second timeout

    const response = await fetch(`${OCR_SERVICE_URL}/scan`, {
      method: 'POST',
      body: formData,
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!response.ok) {
      const errBody = await response.json().catch(() => ({}));
      return { success: false, error: errBody.error || `Server error: ${response.status}` };
    }

    const data = await response.json();
    return { success: true, data };
  } catch (err) {
    if (err.name === 'AbortError') {
      return { success: false, error: 'OCR request timed out. Make sure the OCR server is running.' };
    }
    if (err.message.includes('Failed to fetch') || err.message.includes('NetworkError')) {
      return {
        success: false,
        error: 'Cannot connect to OCR server. Make sure it is running: cd ocr-service && node server.js',
      };
    }
    return { success: false, error: err.message };
  }
};
