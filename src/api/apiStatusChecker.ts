// API Status Checker for ChangeClothesAI
export interface ApiStatus {
  isWorking: boolean;
  status: string;
  lastChecked: Date;
  error?: string;
}

export async function checkApiStatus(): Promise<ApiStatus> {
  try {
    console.log('Checking ChangeClothesAI API status...');
    
    // Try a simple GET request to see if the service is responding
    const response = await fetch('https://changeclothesai.online/api/health', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });
    
    if (response.ok) {
      return {
        isWorking: true,
        status: 'Service is responding',
        lastChecked: new Date(),
      };
    } else {
      return {
        isWorking: false,
        status: `Service responded with ${response.status}`,
        lastChecked: new Date(),
        error: `HTTP ${response.status}: ${response.statusText}`,
      };
    }
  } catch (error) {
    return {
      isWorking: false,
      status: 'Service is not responding',
      lastChecked: new Date(),
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

// Test with a simple request to see if the API accepts requests
export async function testApiWithSimpleRequest(): Promise<ApiStatus> {
  try {
    console.log('Testing API with simple request...');
    
    // Create a minimal test request
    const formData = new FormData();
    formData.append('modelImg', 'https://persistent.changeclothesai.online/change-clothes-ai/assets/examples/person-tab/women/003.jpg');
    formData.append('garmentImg', 'https://persistent.changeclothesai.online/change-clothes-ai/assets/examples/garment-tab/dresses/04-01.jpg');
    formData.append('category', 'dresses');
    
    const response = await fetch('https://changeclothesai.online/api/openapi/change-clothes-ai', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcHBpZCI6ImFwcF9kNmE1ODNlMyIsImlhdCI6MTc1NTU5Mjk1NX0.Do6F2y_Jvgn1j_3OzI6jc1Zlzxp6Cin_3oNrob88wCA',
      },
      body: formData,
    });
    
    const data = await response.json();
    
    if (data.code === 200) {
      return {
        isWorking: true,
        status: 'API is working correctly',
        lastChecked: new Date(),
      };
    } else if (data.code === 500) {
      return {
        isWorking: false,
        status: 'API is experiencing internal errors',
        lastChecked: new Date(),
        error: `API Error ${data.code}: ${data.msg || 'Internal server error'}`,
      };
    } else {
      return {
        isWorking: false,
        status: 'API returned an error',
        lastChecked: new Date(),
        error: `API Error ${data.code}: ${data.msg || 'Unknown error'}`,
      };
    }
  } catch (error) {
    return {
      isWorking: false,
      status: 'API is not responding',
      lastChecked: new Date(),
      error: error instanceof Error ? error.message : 'Network error',
    };
  }
}

// Get current API status
export async function getApiStatus(): Promise<ApiStatus> {
  // Try the health check first
  const healthStatus = await checkApiStatus();
  
  if (!healthStatus.isWorking) {
    return healthStatus;
  }
  
  // If health check passes, try a real request
  return await testApiWithSimpleRequest();
}
