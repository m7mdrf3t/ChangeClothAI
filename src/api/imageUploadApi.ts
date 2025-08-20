// Image upload service using free hosting services
export interface ImageUploadResponse {
  success: boolean;
  url?: string;
  error?: string;
}

// Helper function to convert file to base64
function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
}

// Method 1: Use a simple base64 approach (most reliable, no CORS issues)
export async function convertToDataURL(file: File): Promise<ImageUploadResponse> {
  try {
    // Check file size (limit to 5MB for base64)
    if (file.size > 5 * 1024 * 1024) {
      return {
        success: false,
        error: 'File too large for base64 conversion (max 5MB)'
      };
    }
    
    const base64 = await fileToBase64(file);
    return {
      success: true,
      url: base64
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to convert image'
    };
  }
}

// Method 2: Use Imgur API (free, no API key required for anonymous uploads)
export async function uploadToImgur(file: File): Promise<ImageUploadResponse> {
  try {
    const formData = new FormData();
    formData.append('image', file);
    
    const response = await fetch('https://api.imgur.com/3/image', {
      method: 'POST',
      headers: {
        'Authorization': 'Client-ID 546c25a59c58ad7', // Anonymous client ID
      },
      body: formData,
    });
    
    const data = await response.json();
    
    if (data.success) {
      return {
        success: true,
        url: data.data.link
      };
    } else {
      return {
        success: false,
        error: data.data?.error || 'Failed to upload to Imgur'
      };
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Imgur upload failed'
    };
  }
}

// Method 3: Use a simple image hosting service
export async function uploadToSimpleHost(file: File): Promise<ImageUploadResponse> {
  try {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await fetch('https://file.io', {
      method: 'POST',
      body: formData,
    });
    
    const data = await response.json();
    
    if (data.success) {
      return {
        success: true,
        url: data.link
      };
    } else {
      return {
        success: false,
        error: 'Failed to upload to file.io'
      };
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'File.io upload failed'
    };
  }
}

// Main upload function that tries multiple services
export async function uploadImage(file: File): Promise<ImageUploadResponse> {
  console.log(`Uploading image: ${file.name} (${file.size} bytes)`);
  
  // Try base64 first (most reliable, no CORS issues)
  console.log('Trying base64 conversion...');
  const base64Result = await convertToDataURL(file);
  if (base64Result.success) {
    console.log('✅ Base64 conversion successful');
    return base64Result;
  }
  
  // Try Imgur as backup
  console.log('Trying Imgur...');
  const imgurResult = await uploadToImgur(file);
  if (imgurResult.success) {
    console.log('✅ Imgur upload successful');
    return imgurResult;
  }
  
  // Try file.io as last resort
  console.log('Trying file.io...');
  const fileIoResult = await uploadToSimpleHost(file);
  if (fileIoResult.success) {
    console.log('✅ File.io upload successful');
    return fileIoResult;
  }
  
  // All methods failed
  console.log('❌ All upload methods failed');
  return {
    success: false,
    error: 'All upload methods failed. Please try a smaller image or check your internet connection.'
  };
}
