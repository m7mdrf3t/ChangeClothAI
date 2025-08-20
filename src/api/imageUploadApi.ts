// Image upload service using Cloudinary
export interface ImageUploadResponse {
  success: boolean;
  url?: string;
  error?: string;
}

// Helper function to convert file to base64 (needed for Cloudinary)
function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
}

// Upload to Cloudinary to get external URLs
export async function uploadToCloudinary(file: File): Promise<ImageUploadResponse> {
  try {
    console.log('Uploading to Cloudinary...');
    
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
      console.log('✅ Cloudinary upload successful');
      return {
        success: true,
        url: data.secure_url
      };
    } else {
      console.log('❌ Cloudinary upload failed:', data.error);
      return {
        success: false,
        error: data.error?.message || 'Failed to upload to Cloudinary'
      };
    }
  } catch (error) {
    console.log('❌ Cloudinary upload error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Cloudinary upload failed'
    };
  }
}

// Main upload function - only uses Cloudinary
export async function uploadImage(file: File): Promise<ImageUploadResponse> {
  console.log(`Uploading image: ${file.name} (${file.size} bytes)`);
  
  // Only use Cloudinary
  return await uploadToCloudinary(file);
}
