const bcrypt = require("bcryptjs");

const password = "nam123"; // Thay 'yourpassword' bằng mật khẩu bạn muốn mã hóa
bcrypt.hash(password, 10, (err, hash) => {
  if (err) {
    console.error("Lỗi khi mã hóa mật khẩu:", err);
    return;
  }
  console.log("Mật khẩu đã mã hóa:", hash);
});
