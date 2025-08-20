import { ChangeClothesRequest, ChangeClothesResponse } from '../types';

export async function callChangeClothesApi(
  request: ChangeClothesRequest,
  apiKey: string
): Promise<ChangeClothesResponse> {
  
  console.log('=== DEBUG: Starting API call ===');
  console.log('Request object:', request);
  console.log('API Key present:', !!apiKey);
  
  // Validate inputs
  if (typeof request.modelImg !== 'string') {
    throw new Error('Model image must be a URL string');
  }
  if (typeof request.garmentImg !== 'string') {
    throw new Error('Garment image must be a URL string');
  }

  // Log the URLs to check if they're valid
  console.log('Model Image URL:', request.modelImg);
  console.log('Garment Image URL:', request.garmentImg);
  console.log('Category:', request.category);
  
  // Check if URLs are actually accessible
  console.log('Model Image URL length:', request.modelImg.length);
  console.log('Garment Image URL length:', request.garmentImg.length);
  console.log('Model Image starts with:', request.modelImg.substring(0, 50));
  console.log('Garment Image starts with:', request.garmentImg.substring(0, 50));

  // Create FormData exactly like your working test
  const formData = new FormData();
  formData.append('modelImg', request.modelImg);
  formData.append('garmentImg', request.garmentImg);
  formData.append('category', request.category);
  
  if (request.garmentDesc && request.garmentDesc.trim() !== '') {
    formData.append('garmentDesc', request.garmentDesc);
    console.log('Added garment description:', request.garmentDesc);
  }

  // Debug: Log all FormData entries
  console.log('=== FormData contents ===');
  Array.from(formData.entries()).forEach(pair => {
    console.log(pair[0] + ':', typeof pair[1] === 'string' ? pair[1].substring(0, 100) + '...' : pair[1]);
  });

  const apiEndpoint = '/api/openapi/change-clothes-ai';
  
  try {
    console.log('Making request to:', apiEndpoint);
    
    const response = await fetch(apiEndpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        // Don't set Content-Type - let browser handle it for FormData
      },
      body: formData,
    });

    console.log('=== Response received ===');
    console.log('Status:', response.status);
    console.log('Status text:', response.statusText);
    console.log('Headers:', Object.fromEntries(response.headers.entries()));

    // Get response text first
    const responseText = await response.text();
    console.log('Raw response text:', responseText);

    let data;
    try {
      data = JSON.parse(responseText);
      console.log('Parsed response data:', data);
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      console.error('Response was:', responseText);
      throw new Error(`Invalid JSON response: ${responseText.substring(0, 100)}`);
    }

    // Log the specific error details
    if (data.code !== 200) {
      console.error('=== API Error Details ===');
      console.error('Error code:', data.code);
      console.error('Error message:', data.msg);
      console.error('Full error data:', data);
      
      // The {} in "Try on exception: {}" suggests empty error details
      if (data.code === 20001) {
        console.error('This is a "Try on exception" - likely an issue with the image URLs or format');
      }
    }

    if (!response.ok) {
      throw new Error(`HTTP Error ${response.status}: ${data.msg || responseText.substring(0, 100)}`);
    }

    if (data.code !== 200) {
      throw new Error(`API Error ${data.code}: ${data.msg || 'Unknown error'}`);
    }

    if (!data.data) {
      throw new Error('Missing data field in API response');
    }

    return { 
      resultImgUrl: data.data.resultImgUrl, 
      maskImgUrl: data.data.maskImgUrl, 
      error: null 
    };

  } catch (error) {
    console.error('=== Final Error ===');
    console.error('Error type:', typeof error);
  
    return { 
      resultImgUrl: null, 
      maskImgUrl: null, 
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    };
  }
}