import express from "express";
import axios from "axios";
import dotenv from "dotenv";

// .env dosyasını kesin doğru yoldan yükle
dotenv.config({
  path: "/data/data/com.termux/files/home/analiz360-v2/backend/.env"
});

import userDBClass from "../../models/User.mjs";

// UserDB instance
const UserDB = new userDBClass();

const router = express.Router();

// ENV değişkenleri
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const GOOGLE_REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI;

// DEBUG LOGS – burada görmek zorundayız!
console.log("DEBUG — GOOGLE_CLIENT_ID =", GOOGLE_CLIENT_ID);
console.log("DEBUG — GOOGLE_REDIRECT_URI =", GOOGLE_REDIRECT_URI);
console.log("DEBUG — GOOGLE_CLIENT_SECRET =", GOOGLE_CLIENT_SECRET ? "OK" : "EMPTY");

// Google Login URL
router.get("/login", (req, res) => {
  const googleAuthURL =
    "https://accounts.google.com/o/oauth2/v2/auth?" +
    new URLSearchParams({
      client_id: GOOGLE_CLIENT_ID,
      redirect_uri: GOOGLE_REDIRECT_URI,
      response_type: "code",
      scope: "email profile",
      access_type: "online",
      prompt: "select_account"
    });

  console.log("GOOGLE LOGIN URL:", googleAuthURL);

  res.redirect(googleAuthURL);
});

// GOOGLE CALLBACK
router.get("/callback", async (req, res) => {
  const code = req.query.code;
  if (!code) return res.send("Google code alınamadı!");

  try {
    // TOKEN
    const tokenRes = await axios.post(
      "https://oauth2.googleapis.com/token",
      {
        code,
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        redirect_uri: GOOGLE_REDIRECT_URI,
        grant_type: "authorization_code"
      },
      { headers: { "Content-Type": "application/json" } }
    );

    const accessToken = tokenRes.data.access_token;

    // GOOGLE USER INFO
    const userInfo = await axios.get(
      "https://www.googleapis.com/oauth2/v2/userinfo",
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );

    const googleUser = userInfo.data;

    let user = UserDB.findByEmail(googleUser.email);

    if (!user) {
      user = UserDB.createUser({
        username: googleUser.name,
        email: googleUser.email,
        password: null,
        provider: "google",
        photo: googleUser.picture
      });
    }

    const token = "token_" + user.id + "_" + Date.now();

    // FRONTEND'E MESAJ GÖNDER
    return res.send(`
      <script>
        window.opener.postMessage(
          ${JSON.stringify({
            ok: true,
            token,
            user
          })},
          "*"
        );
        window.close();
      </script>
    `);

  } catch (err) {
    console.error("Google callback error:", err.response?.data || err);
    return res.send("Google doğrulama sırasında hata oluştu.");
  }
});

export default router;
