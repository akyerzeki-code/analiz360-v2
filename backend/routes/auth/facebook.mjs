import express from "express";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config({
  path: "/data/data/com.termux/files/home/analiz360-v2/backend/.env",
});

import userDBClass from "../../models/User.mjs";

const UserDB = new userDBClass();
const router = express.Router();

// ENV DOĞRU İSİMLER
const FACEBOOK_CLIENT_ID = process.env.FACEBOOK_CLIENT_ID;
const FACEBOOK_CLIENT_SECRET = process.env.FACEBOOK_CLIENT_SECRET;
const FACEBOOK_REDIRECT_URI = process.env.FACEBOOK_REDIRECT_URI;

console.log("DEBUG FACEBOOK:", {
  FACEBOOK_CLIENT_ID,
  FACEBOOK_CLIENT_SECRET: FACEBOOK_CLIENT_SECRET ? "OK" : "YOK",
  FACEBOOK_REDIRECT_URI,
});

// 1. LOGIN URL
router.get("/login", (req, res) => {
  const fbAuthURL =
    "https://www.facebook.com/v19.0/dialog/oauth?" +
    new URLSearchParams({
      client_id: FACEBOOK_CLIENT_ID,
      redirect_uri: FACEBOOK_REDIRECT_URI,
      response_type: "code",
      scope: "email,public_profile",
    });

  console.log("FACEBOOK LOGIN URL:", fbAuthURL);

  return res.redirect(fbAuthURL);
});

// 2. CALLBACK
router.get("/callback", async (req, res) => {
  const code = req.query.code;
  if (!code) return res.send("Facebook code alınamadı!");

  try {
    // ACCESS TOKEN
    const tokenRes = await axios.get(
      "https://graph.facebook.com/v19.0/oauth/access_token",
      {
        params: {
          client_id: FACEBOOK_CLIENT_ID,
          client_secret: FACEBOOK_CLIENT_SECRET,
          redirect_uri: FACEBOOK_REDIRECT_URI,
          code,
        },
      }
    );

    const accessToken = tokenRes.data.access_token;

    // USER INFO
    const userInfoRes = await axios.get(
      "https://graph.facebook.com/me?fields=id,name,email,picture.type(large)",
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );

    const fbUser = userInfoRes.data;

    // DB'YE BAK
    let user = UserDB.findByEmail(fbUser.email);

    if (!user) {
      user = UserDB.createUser({
        username: fbUser.name,
        email: fbUser.email,
        provider: "facebook",
        password: null,
        photo: fbUser.picture?.data?.url || null,
      });
    }

    const token = "token_" + user.id + "_" + Date.now();

    return res.send(`
      <script>
        window.opener.postMessage(
          ${JSON.stringify({
            ok: true,
            token,
            user,
          })},
          "*"
        );
        window.close();
      </script>
    `);
  } catch (err) {
    console.error("Facebook callback error:", err.response?.data || err);
    return res.send("Facebook doğrulama sırasında hata oluştu.");
  }
});

export default router;
