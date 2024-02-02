const jwt = require('jsonwebtoken');

const checkTokenExpiration = (req, res, next) => {
  // Lấy token từ header
  const token = req.header('Authorization');

  // Kiểm tra xem token có tồn tại không
  if (!token) {
    return res.status(401).json({ message: 'Không có token được cung cấp.' });
  }

  try {
    // Giải mã token
    const decoded = jwt.verify(token.replace('Bearer ', ''), 'your-secret-key');

    // Kiểm tra xem token có hết hạn hay không
    if (decoded.exp < Date.now() / 1000) {
      return res.status(401).json({ message: 'Token đã hết hạn.' });
    }

    // Gắn thông tin người dùng vào request
    req.user = decoded;
    next();
  } catch (error) {
    console.log("🚀 ~ checkTokenExpiration ~ error:", error);
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Token không hợp lệ.' });
    } else {
      return res.status(500).json({ message: 'Đã xảy ra lỗi trong quá trình xác thực token.' });
    }
  }
};

module.exports = checkTokenExpiration;
