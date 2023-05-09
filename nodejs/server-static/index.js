const http = require('http');
const path = require('path');
const fs = require('fs');

const DIR_ROOT = path.join(__dirname, '../../html');

const server = http.createServer( (req, res) => {

    let filePath = path.join(DIR_ROOT, req.url === '/' ? 'index.html' : req.url);

    let extname = path.extname(filePath);
    let contentType = 'text/html';
    switch(extname) {
        case '.js':
            contentType = 'text/javascript';
            break;
        case '.mjs':
            contentType = 'text/javascript';
            break;
        case '.css':
            contentType = 'text/css';
            break;
        case '.json':
            contentType = 'application/json';
            break;
        case '.png':
            contentType = 'image/png';
            break;
        case '.jpg':
            contentType = 'image/jpg';
            break;
    }
    if(contentType == 'text/html' && extname == '') {
        filePath += '.html'
    }
    fs.readFile(filePath, (err, content) => {
        if (err) {
            if(err.code == 'ENOENT') {
                fs.readFile(path.join(__dirname, 'public', '404.html'), (err,content) => {
                    res.writeHead(404, { 'Content-Type': 'text/html' });
                    res.end(content, 'utf8');
                })
            } else {
                res.writeHead(500);
                res.end(`Server error: ${err.code}`);
            }
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf8');
        }
    });
});

const PORT = process.argv[2] || process.env.PORT || 3000;

server.listen(PORT, () => { 
    console.log(`Server running on Port: ${PORT}`);
})