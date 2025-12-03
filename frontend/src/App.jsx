import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Bulten from "./pages/Bulten.jsx";
import SocialSuccess from "./pages/SocialSuccess.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Varsayılan giriş */}
        <Route path="/" element={<Login />} />

        {/* Normal kullanıcı login */}
        <Route path="/login" element={<Login />} />

        {/* Normal kullanıcı kayıt */}
        <Route path="/register" element={<Register />} />

        {/* Google login sonrası yönlendirme */}
        <Route path="/social-success" element={<SocialSuccess />} />

        {/* Ana Sayfa (Bülten) */}
        <Route path="/bulten" element={<Bulten />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
