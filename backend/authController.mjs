import jwt from "jsonwebtoken";
import { findUserByEmail, createUser } from "./userStore.mjs";

const JWT_SECRET = "ANALIZ360_SUPER_SECRET_KEY"; // sonra .env’ye taşıyacağız

// Google login sonrası kullanılacak fonksiyon
export function handleSocialLogin(profile) {
  // profile: { email, name, picture, provider }

  // 1. Kullanıcı sistemde var mı?
  let user = findUserByEmail(profile.email);

  // 2. Yoksa otomatik kayıt et
  if (!user) {
    user = createUser({
      email: profile.email,
      name: profile.name,
      picture: profile.picture,
      provider: profile.provider
    });
  }

  // 3. Token üret
  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
      provider: user.provider
    },
    JWT_SECRET,
    { expiresIn: "7d" }
  );

  return { user, token };
}
