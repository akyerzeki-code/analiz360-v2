import "./Login.css";
import { useState } from "react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
  }

  return (
    <div className="auth-container">
      <div className="auth-card">

        <img src="/ZERA-logo.png" className="auth-logo" />

        <h1 className="auth-title">ANALİZ360</h1>
        <p className="auth-subtitle">Akıllı Tahmin Motoru</p>

        <p className="login-subtitle">Hesabına Giriş Yap</p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="E-posta"
            className="auth-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Şifre"
            className="auth-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button type="submit" className="auth-button">
            Giriş Yap
          </button>
        </form>

        <div className="login-link">
          <a href="/register">Hesabın yok mu? Kayıt Ol</a>
        </div>

      </div>
    </div>
  );
}
