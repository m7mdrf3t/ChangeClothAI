import fetch from 'node-fetch';
import FormData from 'form-data';

async function testAPIKey() {
  console.log('Testing API Key Authentication...');
  
  // Test with the original hardcoded token
  const hardcodedToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcHBpZCI6ImFwcF9kNmE1ODNlMyIsImlhdCI6MTc1NTU5Mjk1NX0.Do6F2y_Jvgn1j_3OzI6jc1Zlzxp6Cin_3oNrob88wCA';
  
  const endpoint = 'https://changeclothesai.online/api/openapi/change-clothes-ai';
  
  try {
    const formData = new FormData();
    formData.append('test', 'test');
    
    console.log('Testing with hardcoded token...');
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${hardcodedToken}`,
        ...formData.getHeaders()
      },
      body: formData
    });
    
    console.log(`Response status: ${response.status}`);
    const responseText = await response.text();
    console.log('Response:', responseText);
    
    if (response.status === 200) {
      console.log('✅ Hardcoded token works!');
    } else {
      console.log('❌ Hardcoded token failed');
    }
    
  } catch (error) {
    console.log(`Error: ${error.message}`);
  }
}

testAPIKey().catch(console.error);
