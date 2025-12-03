import jwt from "jsonwebtoken";

// ACCESS TOKEN (15 dakika)
export function generateAccessToken(userId) {
  return jwt.sign(
    { userId },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: "15m" }
  );
}

// REFRESH TOKEN (30 gün)
export function generateRefreshToken(userId) {
  return jwt.sign(
    { userId },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: "30d" }
  );
}

// TOKEN DOĞRULAMA (Access Token için)
export function verifyAccessToken(token) {
  try {
    return jwt.verify(token, process.env.JWT_ACCESS_SECRET);
  } catch (err) {
    return null;
  }
}

// Refresh Token için doğrulama
export function verifyRefreshToken(token) {
  try {
    return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
  } catch (err) {
    return null;
  }
}
