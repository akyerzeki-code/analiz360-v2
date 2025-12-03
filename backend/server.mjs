import express from "express";
import axios from "axios";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

// Path ayarları
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

// ------------------------------
// PRIVACY POLICY & DATA DELETION
// ------------------------------
app.get("/privacy-policy", (req, res) => {
  res.sendFile(path.join(__dirname, "privacy-policy.html"));
});

app.get("/data-deletion", (req, res) => {
  res.sendFile(path.join(__dirname, "data-deletion.html"));
});

// ------------------------------
// GOOGLE LOGIN
// ------------------------------
app.get("/auth/google/login", (req, res) => {
  const redirectURI = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.GOOGLE_CLIENT_ID}&redirect_uri=${encodeURIComponent(
    process.env.GOOGLE_REDIRECT_URI
  )}&response_type=code&scope=profile%20email`;

  res.redirect(redirectURI);
});

app.get("/auth/google/callback", async (req, res) => {
  try {
    const code = req.query.code;
    if (!code) return res.send("Google code bulunamadı!");

    // TOKEN ALMA
    const tokenRes = await axios.post(
      "https://oauth2.googleapis.com/token",
      {
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: process.env.GOOGLE_REDIRECT_URI,
        grant_type: "authorization_code",
        code,
      }
    );

    const access_token = tokenRes.data.access_token;

    // USER BILGISI
    const userRes = await axios.get(
      "https://www.googleapis.com/oauth2/v2/userinfo",
      { headers: { Authorization: `Bearer ${access_token}` } }
    );

    const user = userRes.data;

    // Popup'a geri mesaj gönder
    res.send(`
      <script>
        window.opener.postMessage(
          {
            ok: true,
            token: "${access_token}",
            user: ${JSON.stringify(user)}
          },
          "*"
        );
        window.close();
      </script>
    `);
  } catch (err) {
    console.error(err);
    res.send("Google Login ERROR!");
  }
});

// ------------------------------
// FACEBOOK LOGIN
// ------------------------------
app.get("/auth/facebook/login", (req, res) => {
  const fbUrl = `https://www.facebook.com/v19.0/dialog/oauth?client_id=${process.env.FACEBOOK_CLIENT_ID}&redirect_uri=${encodeURIComponent(
    process.env.FACEBOOK_REDIRECT_URI
  )}&response_type=code&scope=email,public_profile`;

  console.log("FACEBOOK LOGIN URL:", fbUrl);
  res.redirect(fbUrl);
});

app.get("/auth/facebook/callback", async (req, res) => {
  try {
    const code = req.query.code;
    if (!code) return res.send("Facebook code bulunamadı!");

    // TOKEN AL
    const tokenRes = await axios.get(
      `https://graph.facebook.com/v19.0/oauth/access_token`, {
        params: {
          client_id: process.env.FACEBOOK_CLIENT_ID,
          client_secret: process.env.FACEBOOK_CLIENT_SECRET,
          redirect_uri: process.env.FACEBOOK_REDIRECT_URI,
          code,
        },
      }
    );

    const access_token = tokenRes.data.access_token;

    // USER BİLGİSİ
    const userRes = await axios.get(
      `https://graph.facebook.com/me?fields=id,name,email,picture&access_token=${access_token}`
    );

    const user = userRes.data;

    res.send(`
      <script>
        window.opener.postMessage(
          {
            ok: true,
            token: "${access_token}",
            user: ${JSON.stringify(user)}
          },
          "*"
        );
        window.close();
      </script>
    `);
  } catch (err) {
    console.error(err.response?.data || err);
    res.send("Facebook Login ERROR!");
  }
});

// ------------------------------
// SERVER START
// ------------------------------
const PORT = process.env.PORT || 3001;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Backend çalışıyor: PORT ${PORT}`);

  console.log("GOOGLE REDIRECT:", process.env.GOOGLE_REDIRECT_URI);

  console.log("FACEBOOK LOGIN URL:");
  console.log(
    `https://www.facebook.com/v19.0/dialog/oauth?client_id=${process.env.FACEBOOK_CLIENT_ID}&redirect_uri=${process.env.FACEBOOK_REDIRECT_URI}&response_type=code&scope=email,public_profile`
  );
});
