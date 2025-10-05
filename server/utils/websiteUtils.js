import axios from 'axios';

export async function checkWebsiteAccessibility(url) {
  const urlPattern = /^https?:\/\/.+/;
  if (!urlPattern.test(url)) {
    throw new Error('Invalid URL format. Please include http:// or https://');
  }

  let websiteTitle = 'Unknown';
  let isAccessible = false;
  let responseTime = 0;
  
  try {
    const startTime = Date.now();
    const response = await axios.get(url, { 
      timeout: 15000,
      headers: {
        'User-Agent': 'WebBaseline Pro Bot 1.0'
      },
      maxRedirects: 5
    });
    
    responseTime = Date.now() - startTime;
    isAccessible = response.status === 200;
    
    // Extract title from HTML
    const titleMatch = response.data.match(/<title[^>]*>([^<]+)<\/title>/i);
    if (titleMatch) {
      websiteTitle = titleMatch[1].trim().substring(0, 200);
    }
    
    console.log(`✅ Website accessible: ${url} (${responseTime}ms)`);
  } catch (error) {
    console.log(`❌ Website check failed: ${url} - ${error.message}`);
    responseTime = 15000;
  }

  return { isAccessible, responseTime, title: websiteTitle };
}