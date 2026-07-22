const http = require('http');

http.get('http://localhost:3000/products', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    // extract <img> tags and their srcs, especially guava-jelly
    const imgTags = data.match(/<img[^>]*>/g);
    if (imgTags) {
      const jellyImgs = imgTags.filter(tag => tag.includes('jelly'));
      console.log('Jelly image tags:', jellyImgs);
    } else {
      console.log('No img tags found');
    }
    
    // Check if the fallback is rendered
    if (data.includes('🌶️')) {
      console.log('Fallback rendered!');
    }
  });
}).on('error', (err) => {
  console.log('Error: ' + err.message);
});
