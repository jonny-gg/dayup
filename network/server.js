/**
 * 简易服务端
 */
const http = require("http");

const server = http.createServer((req, res) => {
  console.log("request reiceved");
  console.log(req.headers)
  res.setHeader("Content-Type", "text/html");
  res.setHeader("x-foo", "123");
  res.writeHeader(200, { "Content-Type": "text/plain" });
  res.end(`<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
</head>
<body>
  <h1>hello world</h1>
</body>
</html>
  `);
});

server.listen(8088);
