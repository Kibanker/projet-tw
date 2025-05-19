async function testLocalApi() {
  try {
    const response = await fetch('http://localhost:3002/api/logements');
    
    if (!response.ok) {
      console.error('Error response:', await response.text());
      return;
    }
    
    const data = await response.json();
    console.log('API Response:', JSON.stringify(data, null, 2));
    
    if (Array.isArray(data)) {
      console.log(`\nFound ${data.length} logements`);
      if (data.length > 0) {
        console.log('First logement:', JSON.stringify(data[0], null, 2));
      }
    } else if (data && typeof data === 'object') {
      console.log('Response is an object. Keys:', Object.keys(data));
      if (data.data && Array.isArray(data.data)) {
        console.log(`\nFound ${data.data.length} logements in data property`);
      }
    }
  } catch (error) {
    console.error('Error testing local API:', error);
  }
}

testLocalApi();
