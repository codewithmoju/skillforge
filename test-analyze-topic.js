const fetch = require('node-fetch');

async function testAnalyzeTopic() {
    try {
        const response = await fetch('http://localhost:3000/api/courses/analyze-topic', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ topic: 'Machine Learning' })
        });

        if (!response.ok) {
            console.error(`API Error: ${response.status} ${response.statusText}`);
            const text = await response.text();
            console.error('Response body:', text);
            return;
        }

        const data = await response.json();
        console.log('API Success:', JSON.stringify(data, null, 2));
    } catch (error) {
        console.error('Fetch failed:', error);
    }
}

testAnalyzeTopic();
