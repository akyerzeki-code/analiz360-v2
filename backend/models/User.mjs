// models/User.mjs
import crypto from "crypto";

export default class UserDB {
  constructor() {
    this.users = []; // Şimdilik JSON bellek sistemi
  }

  // Yeni kullanıcı oluştur
  createUser({ email, username, password, provider, providerId }) {
    const exists = this.users.find(u => u.email === email);

    if (exists) {
      return { ok: false, message: "Bu e-posta zaten kayıtlı!" };
    }

    const newUser = {
      id: crypto.randomUUID(),
      email,
      username,
      password,       // Google kullanıcılarında null olacak
      provider,       // "google" veya "local"
      providerId,     // Google kullanıcılarında Google ID
      createdAt: Date.now()
    };

    this.users.push(newUser);

    return { ok: true, user: newUser };
  }

  // Email’den kullanıcı bul
  findByEmail(email) {
    return this.users.find(u => u.email === email);
  }

  // Google ID’den kullanıcı bul
  findByProviderId(providerId) {
    return this.users.find(u => u.providerId === providerId);
  }
}
