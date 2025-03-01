---
title: 跨域资源共享(CORS)详解
summary: 跨域资源共享(CORS)详解
tags: [CORS]
abbrlink: 7e0d272d
date: 2024-09-17 00:08:17
---

**CORS（Cross-Origin Resource Sharing，跨域资源共享）** 是一种浏览器安全机制，允许或限制从不同来源（域名、协议或端口）加载资源的网页进行交互。它解决了浏览器的同源策略（Same-Origin Policy, SOP）限制，允许受控的跨域请求，以保护用户数据的安全。

### 背景

浏览器的**同源策略** 规定，网页只能访问与其自身同源（即相同域名、协议和端口）的资源，防止恶意网站获取其他域的数据。这虽然有效提升了安全性，但限制了现代 Web 应用中常见的跨域交互需求，如 API 请求、跨域文件加载等。
CORS 允许在安全的情况下进行跨域请求，提供了一种松散的跨源资源访问机制，使得服务器可以指定哪些外部源可以访问其资源。

### CORS 的基本原理

1. **简单请求（Simple Request）** ：
   当浏览器向不同来源的服务器发出跨域请求时，如果满足一定条件，这个请求被称为**简单请求** 。例如，GET 或 POST 请求，且请求头为`Content-Type: text/plain`，这些请求可以直接发送。**响应头** ：
   服务器通过在响应头中设置**CORS 相关的头** ，告知浏览器是否允许这个跨域请求。**重要的 CORS 响应头** ：

- `Access-Control-Allow-Origin`: 指定允许哪些来源访问资源。可以是具体的域名，也可以是`*`（表示允许任何来源）。

```http
Access-Control-Allow-Origin: https://example.com
```

**请求示例** ：

```http
GET /api/data HTTP/1.1
Origin: https://client.com
```

**响应示例** ：

```http
HTTP/1.1 200 OK
Access-Control-Allow-Origin: https://client.com
Content-Type: application/json
```

2. **预检请求（Preflight Request）** ：
   对于某些类型的请求，如使用了自定义的请求头，或者使用了非 GET/POST/HEAD 等方法，浏览器会在实际请求之前发送一个**预检请求** （`OPTIONS`请求），以确保目标服务器允许该请求。**预检请求示例** ：

```http
OPTIONS /api/data HTTP/1.1
Origin: https://client.com
Access-Control-Request-Method: POST
Access-Control-Request-Headers: Content-Type
```

**预检响应示例** ：

```http
HTTP/1.1 200 OK
Access-Control-Allow-Origin: https://client.com
Access-Control-Allow-Methods: POST, GET, OPTIONS
Access-Control-Allow-Headers: Content-Type
Access-Control-Max-Age: 86400
```

- `Access-Control-Allow-Methods`: 指定允许的 HTTP 方法，如`GET`、`POST`等。

- `Access-Control-Allow-Headers`: 允许使用的自定义请求头。

- `Access-Control-Max-Age`: 指定预检请求的结果可以缓存多长时间，减少后续预检请求的次数。

3. **响应头解释** ：

- `Access-Control-Allow-Origin`: 允许的跨域源。

- `Access-Control-Allow-Methods`: 允许的 HTTP 请求方法。

- `Access-Control-Allow-Headers`: 允许的请求头字段。

- `Access-Control-Allow-Credentials`: 是否允许发送凭证（如 Cookies、HTTP 认证等）。值为`true`时，浏览器允许客户端发送和接收凭证。

```http
Access-Control-Allow-Credentials: true
```

### CORS 的工作流程

1. **浏览器发起请求** ：
   当浏览器发起跨域请求时，会在请求头中添加`Origin`字段，指示请求的来源。

2. **服务器检查请求** ：
   服务器接收到请求后，根据自身配置检查`Origin`，并决定是否允许该请求。如果允许，服务器会在响应头中返回相应的 CORS 头信息。

3. **浏览器处理响应** ：
   浏览器根据服务器返回的`Access-Control-Allow-Origin`等 CORS 头信息，决定是否允许页面访问返回的数据。如果服务器没有正确设置这些头，浏览器将阻止请求并抛出 CORS 错误。

### CORS 示例

1. **简单请求** ：
   前端 JavaScript 代码：

```javascript
fetch("https://api.example.com/data", {
  method: "GET",
  credentials: "include", // 发送凭证，如Cookie
})
  .then((response) => response.json())
  .then((data) => console.log(data))
  .catch((error) => console.error("Error:", error));
```

假设 `api.example.com` 设置了 CORS 响应头：

```http
Access-Control-Allow-Origin: https://client.com
Access-Control-Allow-Credentials: true
```

2. **预检请求** ：
   当请求使用了非简单的 HTTP 方法（如`PUT`或`DELETE`），或自定义请求头（如`Authorization`），浏览器会首先发送预检请求：

```http
OPTIONS /api/data HTTP/1.1
Origin: https://client.com
Access-Control-Request-Method: PUT
```

服务器响应：

```http
HTTP/1.1 200 OK
Access-Control-Allow-Origin: https://client.com
Access-Control-Allow-Methods: PUT, GET, OPTIONS
Access-Control-Allow-Headers: Authorization
```

### 如何配置 CORS

1. **Node.js/Express** ：
   使用`cors`中间件：

```javascript
const express = require("express");
const cors = require("cors");
const app = express();

app.use(
  cors({
    origin: "https://client.com", // 允许的来源
    credentials: true, // 允许发送Cookies
  })
);

app.get("/api/data", (req, res) => {
  res.json({ message: "Hello World!" });
});

app.listen(3000);
```

2. **Nginx** ：
   可以通过 Nginx 配置 CORS 响应头：

```nginx
server {
    location /api/ {
        add_header 'Access-Control-Allow-Origin' 'https://client.com';
        add_header 'Access-Control-Allow-Credentials' 'true';
        add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS';
        add_header 'Access-Control-Allow-Headers' 'Authorization, Content-Type';
    }
}
```

### 常见问题

- **CORS 错误** ：当浏览器禁止跨域请求时，会抛出 CORS 错误。这通常是因为服务器没有正确配置 CORS 响应头，或者浏览器不允许请求中的某些操作（如发送凭证）。

- **如何调试** ：可以通过浏览器的开发者工具查看请求和响应头，检查`Access-Control-Allow-*`相关头信息是否正确配置。

### 总结

CORS 是为了解决同源策略下的跨域资源请求问题的浏览器机制。它通过一系列的 HTTP 请求头，让服务器控制哪些来源可以访问其资源，并规定了如何安全地进行跨域请求。在实现跨域请求时，确保服务器配置正确的 CORS 响应头是关键。
