'use strict';

var http = require('http'),
    request = require('request'),
    qs = require('qs'),
    async = require('async'),
    CLIENT_ID = 'a93507c87feb3c261f7e',
    CLIENT_SECRET = 'f64076b69e26263c96182f6b113ca94f98ce7a09',
    authUrl = 'https://github.com/login/oauth/authorize?' + qs.stringify({
        client_id: CLIENT_ID
    });

http.createServer(function(req, res) {
    switch(req.url.split('?')[0]) {
    case '/':
        res.end('<html><body><a href="' + authUrl + '">oauth2</a></body></html>');
        break;
    case '/github-callback':
        async.waterfall([
            function(next) {
                request('https://github.com/login/oauth/access_token', {
                    method: 'POST',
                    form: {
                        client_id: CLIENT_ID,
                        client_secret: CLIENT_SECRET,
                        code: qs.parse(req.url.split('?')[1]).code
                    }
                }, next);
            },
            function(r, body, next) {
                var accessToken = qs.parse(body).access_token,
                    result = accessToken ? 'SUCCESS' : 'FAIL';

                res.end(
                    '<html><body>' +
                    '<h1>' + result + '</h1>' +
                    '<h2>access_token</h2><p>' + accessToken + '</p>' +
                    '<h2>headers</h2><p>' + JSON.stringify(req.headers) + '</p>' +
                    '<h2>body</h2><p>' + body + '</p>' +
                    '</body></html>'
                );
            }
        ]);
        break;
    default:
        res.writeHead(404);
        res.end('not found');
        break;
    }
}).listen(8080);
