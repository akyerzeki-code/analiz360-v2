import { useEffect } from "react";
import "./Register.css";

export default function Register() {

  // Google + Facebook Listener
  useEffect(() => {
    function handleSocialMessage(event) {
      if (!event.data) return;

      console.log("Sosyal mesaj geldi:", event.data);

      if (event.data.ok === true && event.data.token) {
        localStorage.setItem("token", event.data.token);
        localStorage.setItem("user", JSON.stringify(event.data.user));

        window.location.href = "/bulten";
      }
    }

    window.addEventListener("message", handleSocialMessage);

    return () => window.removeEventListener("message", handleSocialMessage);
  }, []);


  // Google popup
  const handleGoogleLogin = () => {
    const popup = window.open(
      "http://localhost:3001/auth/google/login",
      "googleLogin",
      "width=500,height=600"
    );
    if (!popup) alert("Popup engellendi, izin ver!");
  };


  // Facebook popup
  const handleFacebookLogin = () => {
    const popup = window.open(
      "http://localhost:3001/auth/facebook/login",
      "facebookLogin",
      "width=500,height=600"
    );
    if (!popup) alert("Popup engellendi, izin ver!");
  };


  return (
    <div className="auth-container">
      <div className="auth-card">

        {/* Logo */}
        <img src="/ZERA-logo.png" className="auth-logo" />

        <h1 className="auth-title">ANALİZ360</h1>
        <p className="auth-subtitle">Yeni Hesap Oluştur</p>

        {/* FORM */}
        <form className="auth-form">
          <input type="text" className="auth-input" placeholder="Kullanıcı Adı" />
          <input type="email" className="auth-input" placeholder="E-posta" />
          <input type="password" className="auth-input" placeholder="Şifre" />
        </form>

        {/* Kayıt Ol */}
        <button className="auth-button">Kayıt Ol</button>

        {/* Sosyal */}
        <p className="social-text">Sosyal Medya ile Kayıt Ol</p>

        {/* Sosyal ikonlar */}
        <div className="social-icons">
          <img
            src="/icons/google.svg"
            className="social-icon"
            onClick={handleGoogleLogin}
          />

          <img
            src="/icons/facebook.svg"
            className="social-icon"
            onClick={handleFacebookLogin}
          />

          <img
            src="/icons/x.svg"
            className="social-icon"
          />
        </div>

        {/* Apple */}
        <div className="apple-box">
          <img src="/icons/apple.svg" className="apple-icon" />
          <p className="apple-text">Yakında Apple Store'da</p>
        </div>

        {/* Giriş linki */}
        <div className="login-link">
          <a href="/login">Hesabın var mı? Giriş Yap</a>
        </div>

      </div>
    </div>
  );
}
