import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function SocialSuccess() {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    const token = params.get("token");
    const email = params.get("email");
    const userId = params.get("userId");

    if (!token) {
      navigate("/login");
      return;
    }

    localStorage.setItem("auth_token", token);
    if (email) localStorage.setItem("auth_email", email);
    if (userId) localStorage.setItem("auth_userId", userId);

    setTimeout(() => {
      navigate("/bulten");
    }, 1000);
  }, [navigate]);

  return (
    <div
      style={{
        width: "100%",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        fontSize: "22px",
        background: "rgba(0,0,0,0.85)",
        color: "#fff",
        textAlign: "center",
      }}
    >
      Google hesabınız doğrulandı<br />
      Yönlendiriliyorsunuz...
    </div>
  );
}
