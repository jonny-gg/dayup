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
  res.end("OK");
});

server.listen(8088);
