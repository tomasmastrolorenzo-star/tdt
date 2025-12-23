const https = require('https');

const key = 'b3f8d26681msh591240419c64bfbp149aedjsn0b86a8fd85b2';
const host = 'instagram-scraper-stable-api.p.rapidapi.com';
const username = 'instagram'; // test with a known user

const paths = [
    '/ig/info_username',
    '/ig/user_info',
    '/user/info'
];

paths.forEach(path => {
    const options = {
        hostname: host,
        path: `${path}?user=${username}`, // Try 'user' param
        method: 'GET',
        headers: {
            'x-rapidapi-key': key,
            'x-rapidapi-host': host
        }
    };

    const req = https.request(options, res => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
            console.log(`PATH: ${path} (param: user) -> Status: ${res.statusCode}`);
            if (res.statusCode === 200) console.log(data.substring(0, 100));
        });
    });
    req.on('error', e => console.error(e.message));
    req.end();

    // Try 'username' param
    const options2 = { ...options, path: `${path}?username=${username}` };
    const req2 = https.request(options2, res => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
            console.log(`PATH: ${path} (param: username) -> Status: ${res.statusCode}`);
            if (res.statusCode === 200) console.log(data.substring(0, 100));
        });
    });
    req2.end();
});
