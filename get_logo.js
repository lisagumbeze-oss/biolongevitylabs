const https = require('https');

https.get('https://biolongevitylabs.com', (resp) => {
    let data = '';
    resp.on('data', (chunk) => { data += chunk; });
    resp.on('end', () => {
        const matches = data.match(/src="([^"]*?logo[^"]*?)"/gi);
        if (matches) {
            console.log(matches.join('\n'));
        } else {
            console.log('No logo found');
        }
    });
}).on("error", (err) => {
    console.log("Error: " + err.message);
});
