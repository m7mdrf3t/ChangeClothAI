import { ChangeClothesRequest, ChangeClothesResponse } from '../types';

export async function callChangeClothesApi(
  request: ChangeClothesRequest,
  apiKey: string
): Promise<ChangeClothesResponse> {
  const formData = new FormData();
  
  // Add model image - handle both URLs and base64
  if (typeof request.modelImg === 'string') {
    if (request.modelImg.startsWith('data:')) {
      // It's a base64 data URL, convert to file
      try {
        const response = await fetch(request.modelImg);
        const blob = await response.blob();
        const file = new File([blob], 'model.jpg', { type: blob.type });
        formData.append('modelImg', file);
      } catch (error) {
        throw new Error('Failed to convert base64 model image to file');
      }
    } else {
      // It's a regular URL
      formData.append('modelImg', request.modelImg);
    }
  } else {
    throw new Error('Model image must be a URL string');
  }

  // Add garment image - handle both URLs and base64
  if (typeof request.garmentImg === 'string') {
    if (request.garmentImg.startsWith('data:')) {
      // It's a base64 data URL, convert to file
      try {
        const response = await fetch(request.garmentImg);
        const blob = await response.blob();
        const file = new File([blob], 'garment.jpg', { type: blob.type });
        formData.append('garmentImg', file);
      } catch (error) {
        throw new Error('Failed to convert base64 garment image to file');
      }
    } else {
      // It's a regular URL
      formData.append('garmentImg', request.garmentImg);
    }
  } else {
    throw new Error('Garment image must be a URL string');
  }

  // Add category
  formData.append('category', request.category);

  // Add garment description if provided
  if (request.garmentDesc && request.garmentDesc.trim() !== '') {
    formData.append('garmentDesc', request.garmentDesc);
  }

  // Call API directly (bypass proxy)
  const apiEndpoint = 'https://changeclothesai.online/api/openapi/change-clothes-ai';
  
  try {
    const response = await fetch(apiEndpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcHBpZCI6ImFwcF9kNmE1ODNlMyIsImlhdCI6MTc1NTU5Mjk1NX0.Do6F2y_Jvgn1j_3OzI6jc1Zlzxp6Cin_3oNrob88wCA`,
        // Minimal headers - exactly like the working curl command
      },
      body: formData,
    });

    if (!response.ok) {
      let errorMessage = `HTTP error ${response.status}`;
      try {
        const errorData = await response.json();
        // Check if it's an API error with code
        if (errorData.code && errorData.code !== 200) {
          errorMessage = `API Error ${errorData.code}: ${errorData.msg || 'Unknown error'}`;
        } else {
          errorMessage += `: ${errorData.msg || 'Unknown error'}`;
        }
      } catch (parseError) {
        // If we can't parse JSON, try to get text
        try {
          const errorText = await response.text();
          errorMessage += `: ${errorText.substring(0, 200)}`;
        } catch (textError) {
          errorMessage += ': Unable to read error details';
        }
      }
      throw new Error(errorMessage);
    }

    let data;
    try {
      data = await response.json();
    } catch (parseError) {
      console.error('Failed to parse response as JSON:', parseError);
      throw new Error('Invalid response format from server');
    }

    // Check API response code
    if (data.code !== 200) {
      throw new Error(`API Error ${data.code}: ${data.msg || 'Unknown error'}`);
    }

    if (!data.data) {
      throw new Error('Unexpected response format from server');
    }

    return { 
      resultImgUrl: data.data.resultImgUrl, 
      maskImgUrl: data.data.maskImgUrl, 
      error: null 
    };

  } catch (error) {
    console.error('Error changing clothes:', error);
    
    // Handle CORS errors specifically
    if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
      return {
        resultImgUrl: null,
        maskImgUrl: null,
        error: 'CORS Error: Unable to connect to the API. This might be due to browser security restrictions. Please try using a CORS-enabled browser extension or contact the API provider.'
      };
    }
    
    return { 
      resultImgUrl: null, 
      maskImgUrl: null, 
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    };
  }
}
