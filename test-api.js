import fetch from 'node-fetch';
import FormData from 'form-data';
import fs from 'fs';

async function testAPI() {
  console.log('Testing ChangeClothesAI API...');
  
  // Test different endpoints
  const endpoints = [
    'https://changeclothesai.online/api/openapi/change-clothes-ai',
    'https://changeclothesai.online/api/change-clothes-ai',
    'https://changeclothesai.online/change-clothes-ai',
    'https://changeclothesai.online/api/v1/change-clothes-ai'
  ];

  for (const endpoint of endpoints) {
    console.log(`\nTesting endpoint: ${endpoint}`);
    
    try {
      // Test OPTIONS request first
      const optionsResponse = await fetch(endpoint, {
        method: 'OPTIONS',
        headers: {
          'Origin': 'http://localhost:3000',
          'Access-Control-Request-Method': 'POST',
          'Access-Control-Request-Headers': 'Content-Type, Authorization'
        }
      });
      
      console.log(`OPTIONS response: ${optionsResponse.status}`);
      console.log('Allowed methods:', optionsResponse.headers.get('access-control-allow-methods'));
      
      // Test GET request
      const getResponse = await fetch(endpoint, {
        method: 'GET',
        headers: {
          'Authorization': 'Bearer test-token'
        }
      });
      
      console.log(`GET response: ${getResponse.status}`);
      
      // Test POST request
      const formData = new FormData();
      formData.append('test', 'test');
      
      const postResponse = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer test-token',
          ...formData.getHeaders()
        },
        body: formData
      });
      
      console.log(`POST response: ${postResponse.status}`);
      
      if (postResponse.status !== 405) {
        console.log('✅ This endpoint might work!');
        const responseText = await postResponse.text();
        console.log('Response:', responseText.substring(0, 200));
      }
      
    } catch (error) {
      console.log(`Error: ${error.message}`);
    }
  }
}

testAPI().catch(console.error);
