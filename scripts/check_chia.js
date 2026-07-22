const http = require('http');

http.get('http://localhost:3000/products', (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const imgTags = data.match(/<img[^>]*>/g);
    if (imgTags) {
      const chiaImg = imgTags.filter(tag => tag.includes('chia'));
      console.log('Chia image tags:', chiaImg);
    }
  });
});
