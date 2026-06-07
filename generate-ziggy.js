const https = require('https');
const fs = require('fs');

const prompt = `Professional 2D cartoon character design sheet for ZIGGY - energetic middle-school ADHD superhero protagonist. 16:9 landscape layout, white studio background.

LAYOUT: Center full-body dynamic figure + top-left head variations (front, 3/4 left, 3/4 right) + top-right facial expressions (4 emotions: happy/excited, focused/determined, nervous/anxious, powerful/confident) + bottom-left action poses (running, jumping, thinking, celebrating) + bottom-right design specs.

CHARACTER: Middle-school age, warm peachy skin, short dark spiky hair with shine/movement, big bright expressive eyes with shine/sparkles. VIBRANT ORANGE (#FF8C00) hoodie/sweatshirt main piece, ELECTRIC BLUE (#00D8FF) trim on cuffs, zipper, pockets, hood. Dark pants, sneakers with blue accents. Posture shows constant motion, hopeful, brilliant energy.

STYLE: Clean bold cel-shading-friendly outlines, vibrant saturated colors, high contrast, flat color blocks with 1-2 highlight layers. Professional studio-quality 2D cartoon illustration matching Disney Channel / Cartoon Network professional standard. Clean crisp lines, consistent proportions, studio lighting. Conveys neurodivergent superpower, optimism, barely-contained energy. Zero generic AI aesthetic.`;

const requestData = JSON.stringify({
  model: "black-forest-labs/flux-1.1-pro",
  prompt: prompt,
  image_size: "1920x1080",
  num_outputs: 1,
  output_format: "png"
});

const options = {
  hostname: 'api.replicate.com',
  port: 443,
  path: '/v1/predictions',
  method: 'POST',
  headers: {
    'Authorization': `Token ${process.env.REPLICATE_API_TOKEN}`,
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(requestData)
  }
};

const req = https.request(options, (res) => {
  let data = '';
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    const response = JSON.parse(data);
    console.log(JSON.stringify(response, null, 2));
    
    if (response.id) {
      console.log(`\nPrediction ID: ${response.id}`);
      console.log(`Status: ${response.status}`);
      // Poll for completion
      pollPrediction(response.id);
    }
  });
});

req.on('error', (e) => {
  console.error(`Problem with request: ${e.message}`);
});

req.write(requestData);
req.end();

function pollPrediction(id) {
  const pollOptions = {
    hostname: 'api.replicate.com',
    port: 443,
    path: `/v1/predictions/${id}`,
    method: 'GET',
    headers: {
      'Authorization': `Token ${process.env.REPLICATE_API_TOKEN}`,
    }
  };

  const pollReq = https.request(pollOptions, (res) => {
    let data = '';
    
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      const response = JSON.parse(data);
      console.log(`Status: ${response.status}`);
      
      if (response.status === 'succeeded') {
        console.log('Prediction complete!');
        console.log('Output URLs:');
        response.output.forEach((url, i) => {
          console.log(`  [${i}] ${url}`);
          downloadImage(url, `ziggy-design-sheet.png`);
        });
      } else if (response.status === 'failed') {
        console.error('Prediction failed:', response.error);
      } else {
        console.log('Still processing... checking again in 5 seconds');
        setTimeout(() => pollPrediction(id), 5000);
      }
    });
  });

  pollReq.on('error', (e) => {
    console.error(`Problem with poll request: ${e.message}`);
  });

  pollReq.end();
}

function downloadImage(url, filename) {
  const fileStream = fs.createWriteStream(filename);
  https.get(url, (response) => {
    response.pipe(fileStream);
    fileStream.on('finish', () => {
      fileStream.close();
      console.log(`\nImage saved to: ${filename}`);
    });
  }).on('error', (err) => {
    fs.unlink(filename, () => {});
    console.error(err);
  });
}
