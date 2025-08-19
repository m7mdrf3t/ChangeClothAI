import { ChangeClothesRequest, ChangeClothesResponse } from '../types';

export async function callChangeClothesApi(
  request: ChangeClothesRequest,
  apiKey: string
): Promise<ChangeClothesResponse> {
  const formData = new FormData();
  
  // Add model image
  if (typeof request.modelImg === 'string') {
    // If it's a URL or base64, we need to convert it to a file
    if (request.modelImg.startsWith('http')) {
      // It's a URL, fetch and convert to file
      try {
        const response = await fetch(request.modelImg);
        const blob = await response.blob();
        const file = new File([blob], 'model.jpg', { type: blob.type });
        formData.append('modelImg', file);
      } catch (error) {
        throw new Error('Failed to fetch model image from URL');
      }
    } else {
      // It's base64, convert to file
      try {
        const response = await fetch(request.modelImg);
        const blob = await response.blob();
        const file = new File([blob], 'model.jpg', { type: blob.type });
        formData.append('modelImg', file);
      } catch (error) {
        throw new Error('Failed to convert base64 model image to file');
      }
    }
  } else {
    // It's already a File
    formData.append('modelImg', request.modelImg);
  }

  // Add garment image
  if (typeof request.garmentImg === 'string') {
    // If it's a URL or base64, we need to convert it to a file
    if (request.garmentImg.startsWith('http')) {
      // It's a URL, fetch and convert to file
      try {
        const response = await fetch(request.garmentImg);
        const blob = await response.blob();
        const file = new File([blob], 'garment.jpg', { type: blob.type });
        formData.append('garmentImg', file);
      } catch (error) {
        throw new Error('Failed to fetch garment image from URL');
      }
    } else {
      // It's base64, convert to file
      try {
        const response = await fetch(request.garmentImg);
        const blob = await response.blob();
        const file = new File([blob], 'garment.jpg', { type: blob.type });
        formData.append('garmentImg', file);
      } catch (error) {
        throw new Error('Failed to convert base64 garment image to file');
      }
    }
  } else {
    // It's already a File
    formData.append('garmentImg', request.garmentImg);
  }

  // Add category
  formData.append('category', request.category);

  // Add garment description if provided
  if (request.garmentDesc && request.garmentDesc.trim() !== '') {
    formData.append('garmentDesc', request.garmentDesc);
  }

  const apiEndpoint = 'https://changeclothesai.online/api/openapi/change-clothes-ai';
  
  try {
    const response = await fetch(apiEndpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Accept': 'application/json',
        'Origin': window.location.origin,
      },
      mode: 'cors',
      credentials: 'omit',
      body: formData,
    });

    if (!response.ok) {
      let errorMessage = `HTTP error ${response.status}`;
      try {
        const errorData = await response.json();
        errorMessage += `: ${errorData.msg || 'Unknown error'}`;
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

    if (!data || !data.data) {
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
