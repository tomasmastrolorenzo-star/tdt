const https = require('https');

const key = 'b3f8d26681msh591240419c64bfbp149aedjsn0b86a8fd85b2';
const host = 'instagram-scraper-stable-api.p.rapidapi.com';
const username = 'instagram';

const endpoints = [
    '/ig/info_username', // From standard search
    '/get_ig_user_info.php', // Guess
    '/ig/get_info.php'
];

endpoints.forEach(path => {
    // Try GET
    const options = {
        hostname: host,
        path: `${path}?user=${username}`,
        method: 'GET',
        headers: {
            'x-rapidapi-key': key,
            'x-rapidapi-host': host
        }
    };

    https.request(options, res => {
        console.log(`GET ${path} (param user) -> ${res.statusCode}`);
        if (res.statusCode === 200) {
            res.on('data', d => console.log(d.toString().substring(0, 100)));
        }
    }).on('error', e => { }).end();

    // Try POST with username_or_url params
    const postData = `username_or_url=${username}`;
    const optionsPost = {
        hostname: host,
        path: path,
        method: 'POST',
        headers: {
            'x-rapidapi-key': key,
            'x-rapidapi-host': host,
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': postData.length
        }
    };

    const req = https.request(optionsPost, res => {
        console.log(`POST ${path} -> ${res.statusCode}`);
        if (res.statusCode === 200) {
            res.on('data', d => console.log(d.toString().substring(0, 100)));
        }
    });
    req.on('error', e => { });
    req.write(postData);
    req.end();
});
