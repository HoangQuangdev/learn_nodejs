const express = require("express");
const bodyParser = require("body-parser");
const { connectSql } = require("./src/config/connectDB");
const router = require("./src/routes/userRoutes");
const app = express();
const port = 3000;
const subAPIV1 = "/test/api/v1";
const path = require("path");
const cors = require('cors');

const uploadsDir = path.join(__dirname, "uploads");

async function startServer() {
  try {
    await connectSql();
    console.log("Connected to SQL database successfully");

    app.use(cors());
    app.use(express.static(path.join(__dirname, "public")));

    // Middleware để xử lý yêu cầu đến API
    app.use(subAPIV1, (req, res, next) => {
      // Kiểm tra xem yêu cầu có đến từ trình duyệt không
      console.log(req.headers['user-agent']);
      if (!req.headers['user-agent'].includes('Mozilla')) {
        // Nếu không phải từ trình duyệt, tiếp tục xử lý yêu cầu API
        return next();
      }
      // Nếu là yêu cầu từ trình duyệt, gửi lại trang HTML thông báo
      res.sendFile(path.join(__dirname, 'public', 'error.html'));
    });;

    // Sử dụng bodyParser để phân tích dữ liệu đầu vào
    app.use(bodyParser.json()); // cho dữ liệu dạng JSON
    app.use(bodyParser.urlencoded({ extended: true })); // cho dữ liệu từ URL encoded form

    // Sử dụng routes từ file userRoutes.js
    app.use(subAPIV1, router);

    // Route để phục vụ các tệp ảnh
    app.use(subAPIV1 + "/uploads", express.static(uploadsDir));

    app.listen(port, () => {
      console.log(`Server is running at http://localhost:${port}`);
    });
  } catch (error) {
    console.error("Error starting server:", error);
  }
}

startServer();
