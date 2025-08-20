const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function testCurlEquivalent() {
  console.log('Testing curl-equivalent request...');
  
  const apiKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcHBpZCI6ImFwcF9kNmE1ODNlMyIsImlhdCI6MTc1NTU5Mjk1NX0.Do6F2y_Jvgn1j_3OzI6jc1Zlzxp6Cin_3oNrob88wCA';
  
  // URLs from the documentation
  const modelImgUrl = 'https://persistent.changeclothesai.online/change-clothes-ai/assets/examples/person-tab/women/003.jpg';
  const garmentImgUrl = 'https://persistent.changeclothesai.online/change-clothes-ai/assets/examples/garment-tab/dresses/04-01.jpg';
  
  const apiEndpoint = 'https://changeclothesai.online/api/openapi/change-clothes-ai';
  
  try {
    // Create FormData exactly like curl
    const formData = new FormData();
    formData.append('modelImg', modelImgUrl);
    formData.append('garmentImg', garmentImgUrl);
    formData.append('category', 'dresses');
    
    console.log('Sending request with:');
    console.log('- Model Image:', modelImgUrl);
    console.log('- Garment Image:', garmentImgUrl);
    console.log('- Category: dresses');
    console.log('- Headers: Authorization only');
    
    const response = await fetch(apiEndpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        // NO other headers - exactly like curl
      },
      body: formData,
    });
    
    console.log(`Response status: ${response.status}`);
    console.log('Response headers:', response.headers);
    
    const data = await response.json();
    console.log('Response data:', JSON.stringify(data, null, 2));
    
    if (data.code === 200) {
      console.log('✅ SUCCESS!');
      console.log('Result Image URL:', data.data.resultImgUrl);
      console.log('Mask Image URL:', data.data.maskImgUrl);
      console.log('Cache Hit:', data.data.cacheHit);
    } else {
      console.log('❌ API Error:', data.code, data.msg);
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

async function testAppEquivalent() {
  console.log('\nTesting app-equivalent request...');
  
  const apiKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcHBpZCI6ImFwcF9kNmE1ODNlMyIsImlhdCI6MTc1NTU5Mjk1NX0.Do6F2y_Jvgn1j_3OzI6jc1Zlzxp6Cin_3oNrob88wCA';
  
  // URLs from the documentation
  const modelImgUrl = 'https://persistent.changeclothesai.online/change-clothes-ai/assets/examples/person-tab/women/003.jpg';
  const garmentImgUrl = 'https://persistent.changeclothesai.online/change-clothes-ai/assets/examples/garment-tab/dresses/04-01.jpg';
  
  const apiEndpoint = 'https://changeclothesai.online/api/openapi/change-clothes-ai';
  
  try {
    // Create FormData like the app does
    const formData = new FormData();
    formData.append('modelImg', modelImgUrl);
    formData.append('garmentImg', garmentImgUrl);
    formData.append('category', 'dresses');
    
    console.log('Sending request with:');
    console.log('- Model Image:', modelImgUrl);
    console.log('- Garment Image:', garmentImgUrl);
    console.log('- Category: dresses');
    console.log('- Headers: Authorization + Accept + Origin');
    
    const response = await fetch(apiEndpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Accept': 'application/json',
        'Origin': 'https://changeclothai-production.up.railway.app',
      },
      body: formData,
    });
    
    console.log(`Response status: ${response.status}`);
    console.log('Response headers:', response.headers);
    
    const data = await response.json();
    console.log('Response data:', JSON.stringify(data, null, 2));
    
    if (data.code === 200) {
      console.log('✅ SUCCESS!');
      console.log('Result Image URL:', data.data.resultImgUrl);
      console.log('Mask Image URL:', data.data.maskImgUrl);
      console.log('Cache Hit:', data.data.cacheHit);
    } else {
      console.log('❌ API Error:', data.code, data.msg);
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Run both tests
async function runTests() {
  await testCurlEquivalent();
  await testAppEquivalent();
}

runTests().catch(console.error);
