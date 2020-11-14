/**
 * 简易浏览器客户端
 */

/**
 * 头部格式
 * POST / HTTP/1.1
 * Host: 127.0.0.1
 * Content-Type: application/x-www-form-urlencoded
 *
 * name=jonny
 */
const net = require("net");
const parser = require("./parser")
class Request {
  // method + url + port + path
  // body k:v
  // headers
  constructor(options) {
    const {
      method = "GET",
      host,
      port = 80,
      body = {},
      headers = {},
      path = "/",
    } = options;
    this.method = method;
    this.host = host;
    this.body = body;
    this.port = port;
    this.path = path;
    this.headers = headers;
    if (!this.headers["Content-Type"]) {
      this.headers["Content-Type"] = "application/x-www-form-urlencoded";
    }
    switch (this.headers["Content-Type"]) {
      case "application/json":
        this.bodyText = JSON.stringify(this.body);
        break;
      case "application/x-www-form-urlencoded":
        this.bodyText = Object.keys(this.body)
          .map((key) => `${key}=${encodeURIComponent(this.body[key])}`)
          .join("&");
        break;
    }
    this.headers["Content-Length"] = this.bodyText.length;
  }
  toString() {
    return `${this.method} ${this.path} HTTP/1.1\r
${Object.keys(this.headers)
  .map((key) => `${key}: ${this.headers[key]}`)
  .join("\r\n")}\r
\r
${this.bodyText}`;
  }
  open(method, url) {}
  send(connection) {
    return new Promise((resolve, reject) => {
      const parser = new ResponseParser();
      if (!connection) {
        // 如果没有客户端连接就新建一个
        connection = net.createConnection(
          {
            host: this.host,
            port: this.port,
          },
          () => {
            connection.write(this.toString());
          }
        );
      } else {
        connection.write(this.toString());
      }
      // 接收到数据触发的事件可能是 Buffer / String
      connection.on("data", (data) => {
        /**
         * 会分多次发data 沾包问题
         * 例如：网卡满了、服务端已经接收过一个(IP)包了、当一个buffer超过限制的时候也会断开传
         * 因为TCP(data)是一个流数据，所以断在哪里是无所谓的
         */
        parser.receive(data.toString());
        if (parser.isFinished) {
          // return parser.response
          resolve(parser.response);
        }
        connection.end();
      });
      // connection.on("end", () => {
      //   resolve("已从服务器断开");
      // });
      connection.on("error", (err) => {
        reject(err);
        connection.end();
      });
    });
  }
}

class Response {}
class ResponseParser {
  constructor() {
    this.WAITING_STATUS_LINE = 0;
    this.WAITING_STATUS_LINE_END = 1;
    this.WAITING_HEADER_NAME = 2;
    this.WAITING_HEADER_SPACE = 3;
    this.WAITING_HEADER_VALUE = 4;
    this.WAITING_HEADER_VALUE_END = 5;
    this.WAITING_HEADER_BLOCK_END = 6;
    this.WAITING_BODY = 7;

    this.current = this.WAITING_STATUS_LINE;
    this.statusLine = "";
    this.headers = {};
    this.headerName = "";
    this.headerValue = "";
    this.bodyParser = null;
  }

  get isFinished() {
    return this.bodyParser && this.bodyParser.isFinish;
  }
  get response() {
    this.statusLine.match(/HTTP\/1.1 ([0-9]+) ([\s\S]+)/);
    return {
      statusCode: RegExp.$1,
      statusText: RegExp.$2,
      headers: this.headers,
      body: this.bodyParser.content.join(""),
    };
  }
  // 字符流的处理
  receive(string) {
    for (let i = 0; i < string.length; i++) {
      this.receiveChar(string.charAt(i));
    }
  }
  // 每个字符串做解析
  receiveChar(char) {
    // statusLine
    if (this.current === this.WAITING_STATUS_LINE) {
      if (char === "\r") {
        this.current = this.WAITING_STATUS_LINE_END;
      } else {
        this.statusLine += char;
      }
    } else if (this.current === this.WAITING_STATUS_LINE_END) {
      if (char === "\n") {
        this.current = this.WAITING_HEADER_NAME;
      }
    } else if (this.current === this.WAITING_HEADER_NAME) {
      if (char === ":") {
        this.current = this.WAITING_HEADER_SPACE;
      } else if (char === "\r") {
        this.current = this.WAITING_HEADER_BLOCK_END;
        if (this.headers["Transfer-Encoding"] === "chunked") {
          this.bodyParser = new TrunkedBodyParser();
        }
      } else {
        this.headerName += char;
      }
    } else if (this.current === this.WAITING_HEADER_SPACE) {
      if (char === " ") {
        this.current = this.WAITING_HEADER_VALUE;
      }
    } else if (this.current === this.WAITING_HEADER_VALUE) {
      if (char === "\r") {
        this.current = this.WAITING_HEADER_VALUE_END;
        this.headers[this.headerName] = this.headerValue;
        this.headerName = "";
        this.headerValue = "";
      } else {
        this.headerValue += char;
      }
    } else if (this.current === this.WAITING_HEADER_VALUE_END) {
      if (char === "\n") {
        this.current = this.WAITING_HEADER_NAME;
      }
    } else if (this.current === this.WAITING_HEADER_BLOCK_END) {
      if (char === "\n") {
        this.current = this.WAITING_BODY;
      }
    } else if (this.current === this.WAITING_BODY) {
      this.bodyParser.receiveChar(char);
    }
  }
}
class TrunkedBodyParser {
  constructor() {
    this.WAITING_LENGTH = 0;
    this.WAITING_LENGTH_LINE_END = 1;
    this.READING_TRUNK = 2;
    this.WAITING_NEW_LINE = 3;
    this.WAITING_NEW_LINE_END = 4;
    this.isFinish = false;
    this.length = 0;
    this.content = [];

    this.current = this.WAITING_LENGTH;
  }
  receiveChar(char) {
    // console.log(JSON.stringify(char))
    if (this.current === this.WAITING_LENGTH) {
      if (char === "\r") {
        if (this.length === 0) {
          // console.log(this.content);
          this.isFinish = true;
        }
        this.current = this.WAITING_LENGTH_LINE_END;
      } else {
        // 如果是10进制的话，发长一点的html就会有问题, 所以采用16进制
        this.length *= 16;
        this.length += parseInt(char, 16);
      }
    } else if (this.current === this.WAITING_LENGTH_LINE_END) {
      if (char === "\n") {
        this.current = this.READING_TRUNK;
      }
    } else if (this.current == this.READING_TRUNK) {
      this.content.push(char);
      this.length--;
      if (this.length === 0) {
        this.current = this.WAITING_NEW_LINE;
      }
    } else if (this.current == this.WAITING_NEW_LINE) {
      if (char == "\r") {
        this.current = this.WAITING_NEW_LINE_END;
      }
    } else if (this.current == this.WAITING_NEW_LINE_END) {
      if (char == "\n") {
        this.current = this.WAITING_LENGTH;
      }
    }
  }
}
void (async function () {
  const request = new Request({
    method: "POST",
    port: 8088,
    host: "127.0.0.1",
    path: "/",
    headers: {
      ["jjj"]: "333",
    },
    body: {
      name: "jonny",
    },
  });
  let response = await request.send();
  // console.log(response.body, "123123")
  let dom = parser.parseHTML(response.body);
})();
