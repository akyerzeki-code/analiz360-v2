// Geçici kullanıcı veri deposu
let users = []; 
// örnek obje: { id, email, name, picture, provider, createdAt }

export function findUserByEmail(email) {
  return users.find(u => u.email === email);
}

export function createUser(data) {
  const newUser = {
    id: users.length + 1,
    email: data.email,
    name: data.name,
    picture: data.picture || null,
    provider: data.provider || "local",
    createdAt: new Date()
  };
  users.push(newUser);
  return newUser;
}

export function getAllUsers() {
  return users;
}
