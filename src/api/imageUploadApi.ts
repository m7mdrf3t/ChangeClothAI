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

// Method 1: Use Cloudinary API to get external URLs (most reliable)
export async function uploadToCloudinary(file: File): Promise<ImageUploadResponse> {
  try {
    console.log('Attempting Cloudinary upload...');
    
    // Convert file to base64 for Cloudinary
    const base64 = await fileToBase64(file);
    const base64Data = base64.split(',')[1]; // Remove data URL prefix
    
    const formData = new FormData();
    formData.append('file', `data:${file.type};base64,${base64Data}`);
    formData.append('api_key', 'vR23n80zCWJvj1fAmISaR_QkEI0');
    formData.append('upload_preset', 'ml_default'); // Use default upload preset
    
    const response = await fetch('https://api.cloudinary.com/v1_1/demo/image/upload', {
      method: 'POST',
      body: formData,
    });
    
    console.log('Cloudinary response status:', response.status);
    const data = await response.json();
    console.log('Cloudinary response data:', data);
    
    if (data.secure_url) {
      return {
        success: true,
        url: data.secure_url
      };
    } else {
      console.log('Cloudinary upload failed:', data.error);
      return {
        success: false,
        error: data.error?.message || 'Failed to upload to Cloudinary'
      };
    }
  } catch (error) {
    console.log('Cloudinary upload error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Cloudinary upload failed'
    };
  }
}

// Method 2: Use a simple image hosting service
export async function uploadToSimpleHost(file: File): Promise<ImageUploadResponse> {
  try {
    console.log('Attempting file.io upload...');
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await fetch('https://file.io', {
      method: 'POST',
      body: formData,
    });
    
    console.log('file.io response status:', response.status);
    const data = await response.json();
    console.log('file.io response data:', data);
    
    if (data.success) {
      return {
        success: true,
        url: data.link
      };
    } else {
      console.log('file.io upload failed:', data.error);
      return {
        success: false,
        error: 'Failed to upload to file.io'
      };
    }
  } catch (error) {
    console.log('file.io upload error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'File.io upload failed'
    };
  }
}

// Method 3: Create a temporary URL from base64 (temporary solution)
export async function createTempUrl(file: File): Promise<ImageUploadResponse> {
  try {
    console.log('Creating temporary URL from base64...');
    // Check file size (limit to 5MB for base64)
    if (file.size > 5 * 1024 * 1024) {
      return {
        success: false,
        error: 'File too large for base64 conversion (max 5MB)'
      };
    }
    
    const base64 = await fileToBase64(file);
    
    // Create a temporary URL that the API can access
    // For now, let's use a data URL but with a different approach
    const tempUrl = `data:${file.type};base64,${base64.split(',')[1]}`;
    
    console.log('Created temporary URL:', tempUrl.substring(0, 50) + '...');
    return {
      success: true,
      url: tempUrl
    };
  } catch (error) {
    console.log('Temp URL creation error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create temporary URL'
    };
  }
}

// Main upload function that tries multiple services
export async function uploadImage(file: File): Promise<ImageUploadResponse> {
  console.log(`Uploading image: ${file.name} (${file.size} bytes)`);
  
  // Try Cloudinary first (external URL - most reliable)
  console.log('Trying Cloudinary...');
  const cloudinaryResult = await uploadToCloudinary(file);
  if (cloudinaryResult.success) {
    console.log('✅ Cloudinary upload successful');
    return cloudinaryResult;
  }
  
  // Try file.io as backup
  console.log('Trying file.io...');
  const fileIoResult = await uploadToSimpleHost(file);
  if (fileIoResult.success) {
    console.log('✅ File.io upload successful');
    return fileIoResult;
  }
  
  // Fallback to temporary URL creation
  console.log('Trying temporary URL creation...');
  const tempUrlResult = await createTempUrl(file);
  if (tempUrlResult.success) {
    console.log('✅ Temporary URL creation successful');
    return tempUrlResult;
  }
  
  // All methods failed
  console.log('❌ All upload methods failed');
  return {
    success: false,
    error: 'All upload methods failed. Please try a smaller image or check your internet connection.'
  };
}
