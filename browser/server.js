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
  <style>
body div $myid{
  width: 100px;
  background-color:#ff5000;
}
  </style>
  <meta charset="UTF-8"></meta>
  <meta name="viewport" content="width=device-width"></meta>
  <title>Document</title>
</head>
<body>
<span>123123</span>
</body>
</html>
  `);
});

server.listen(8088);
