const { sql } = require("../config/connectDB");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require('path');
const fs = require('fs');

exports.getUsers = async (req, res) => {
  try {
    const request = new sql.Request();
    const result = await request.execute("SP_ACCOUNT_GET_ALL");
    result.recordset?.forEach(e => e.Token_Encrypt = e.Token_Encrypt instanceof Buffer ? e.Token_Encrypt.toString("hex") : e.Token_Encrypt);

    res.json({ data: result, token: req.user }); // Trả về kết quả của truy vấn dưới dạng JSON
  } catch (error) {
    console.error("Error querying data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
exports.Login = async (req, res) => {
  try {
    const { username, pass } = req.body;
    const request = new sql.Request();
    request.input("User_Name", sql.VarChar(100), username);
    request.input("Password", sql.VarChar(100), pass);
    request.input("Token_Device", sql.VarChar(100), "");
    const result = await request.execute("SP_ACCOUNT_LOGIN");
    if (result?.recordset[0]?.ERROR !== 0) {
      // Đăng nhập thành công - trả về thông tin người dùng
      const user = result.recordset[0];
      // Thêm trường mới Token_EncryptHex chứa chuỗi hexadecimals
      const token = jwt.sign({ userId: user.FullName }, "your-secret-key", {
        expiresIn: "1h",
      });
      user.Token_Encrypt = user?.Token_Encrypt?.toString("hex");
      // Trả về đối tượng user với trường Token_EncryptHex
      res.json({ success: true, user, token });
    } else {
      // Đăng nhập không thành công - trả về thông báo lỗi
      res.status(401).json({
        success: false,
        message: "Tên đăng nhập hoặc mật khẩu không chính xác.",
      });
    } // Trả về kết quả của truy vấn dưới dạng JSON
  } catch (error) {
    console.log("🚀 ~ router.post ~ error:", error);
  }
};

exports.upLoadImge = async (req, res) => {
  try {
      const uploadDir = path.join(__dirname, "uploads");
      if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir);
      }

      const storage = multer.diskStorage({
          destination: (req, file, cb) => {
              // Đường dẫn đến thư mục lưu trữ ảnh
              cb(null, "uploads/");
          },
          filename: (req, file, cb) => {
              // Tạo tên file mới bằng cách thêm timestamp vào tên file gốc
              const uniqueName = Date.now() + "-" + file.originalname;
              cb(null, uniqueName);
          },
      });

      // Khởi tạo middleware multer với cấu hình lưu trữ
      const upload = multer({ storage: storage }).single('file');

      upload(req, res, (err) => {
          if (err) {
              console.error("Error:", err);
              return res.status(500).json({ message: 'Internal server error' });
          }
          if ( !req.file ) return res.status(500).json({ message: 'File not Found' })
          // Trả về thông báo thành công cùng với tên file đã lưu
          res.status(200).json({
              message: 'File uploaded successfully',
              filename: req?.file?.filename // Trả về tên file đã lưu
          });
      });
  } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ message: 'Internal server error' });
  }
};
