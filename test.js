var http = require('http'), url = require("url"), path = require("path"), fs = require("fs");

http.createServer(function(request, response) {
    if (path.normalize(decodeURI(request.url)) !== decodeURI(request.url)) {
        response.statusCode = 403;
        response.end();
        return;
    }
	var uri = url.parse(request.url).pathname, filename = path.join(process.cwd(), uri);

	console.log(uri);

	var contentTypesByExtension = {
		'.html' : "text/html",
		'.css' : "text/css",
		'.js' : "text/javascript"
	};

	if (uri == "/post") {
		response.writeHead(200, {
			"Content-Type" : "application/json; profile=post.json"
		});
		response.write('{"author":"Geraint","title":"A New Post","content":["Here is some text.","Here is some more text."],"date":"2013-04-03T04:03:21-0400","postId":"2013-04-03T04:03:21-0400Geraint","comments":[{"author":"adsfasdf","message":"asdfasdfa","date":"2013-04-03T10:25:57-0400"},{"author":"Geraint","message":"Testing form support in the JSON Browser extension...","date":"2013-04-15T11:53:01-0400"},{"author":"Geraint","message":"It seems to work. :)","date":"2013-04-15T11:56:21-0400"},{"author":"Geraint","message":":)","date":"2013-04-15T11:56:48-0400"},{"author":"Geraint","message":"More testing...","date":"2013-04-15T11:59:57-0400"},{"author":"Geraint","message":"Seems to work. :)","date":"2013-04-15T12:02:52-0400"},{"author":"Geraint","message":"Yet more testing.","date":"2013-04-15T12:54:04-0400"},{"author":"Geraint","message":"test","date":"2013-04-15T12:57:27-0400"},{"author":"Geraint","message":"test","date":"2013-04-15T13:03:07-0400"},{"author":"Geraint","message":"test","date":"2013-04-15T13:03:54-0400"},{"author":"Geraint","message":"test","date":"2013-04-15T13:04:39-0400"},{"author":"Stefano Fago","message":"I think It\'s the right thing for RESTOne PAge Application Technology ;-P","date":"2013-04-17T06:35:31-0400"},{"author":"Mike","message":"Also testing","date":"2013-04-20T04:40:32-0400"},{"author":"Mike","message":"Test again","date":"2013-04-20T05:30:50-0400"},{"author":"Mike","message":"Testing again","date":"2013-04-20T05:44:57-0400"},{"author":"Mike","message":"again","date":"2013-04-20T20:36:32-0400"},{"author":"chenxm","message":"haha","date":"2013-04-22T06:10:29-0400"}]}');
		response.end();
	} else if (uri == "/blog.json") {
		response.writeHead(200, {
			"Content-Type" : "application/json; profile=index.json"
		});
		response.write('{"title":"The Jsonary Blog","page":0,"posts":[{"postId":"2013-04-03T04:03:21-0400Geraint","title":"A New Post","author":"Geraint","date":"2013-04-03T04:03:21-0400"},{"postId":"2013-01-15T14:54:33-0500Geraint","title":"Starting the blog API","author":"Geraint","date":"2013-01-15T14:54:33-0500"}]}');
		response.end();
	} else {

		fs.exists(filename, function(exists) {

			if (!exists) {
				response.writeHead(404, {
					"Content-Type" : "text/plain"
				});
				response.write("404 Not Found\n");
				response.end();
				return;
			}

			if (fs.statSync(filename).isDirectory())
				filename += '/index.html';

			fs.readFile(filename, "binary", function(err, file) {
				if (err) {
					response.writeHead(500, {
						"Content-Type" : "text/plain"
					});
					response.write(err + "\n");
					response.end();
					return;
				}

				var headers = {};
				var contentType = contentTypesByExtension[path.extname(filename)];
				contentType ? headers["Content-Type"] = contentType : headers["Content-Type"] = "text/plain";
				response.writeHead(200, headers);
				response.write(file, "binary");
				response.end();
			});
		});
	}
}).listen(3000); 
