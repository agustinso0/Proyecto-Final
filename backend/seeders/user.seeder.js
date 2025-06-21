const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const users = require("../data/users");
const Auth = require("../models/Auth");
const auths = require("../data/auths");
const {
  connectToDatabase,
  disconnectFromDatabase,
} = require("../config/database");

async function seedUsers() {
  try {
    await connectToDatabase();

    await User.deleteMany({});
    await Auth.deleteMany({});

    for (let i = 0; i < auths.length; i++) {
      const hashedPassword = await bcrypt.hash(auths[i].password, 10);

      const authDoc = await Auth.create({
        username: auths[i].username,
        password: hashedPassword,
        token: auths[i].token || null,
      });

      await User.create({
        auth: authDoc._id,
        nombre: users[i].nombre,
        apellido: users[i].apellido,
        email: users[i].email,
        direccion: users[i].direccion,
        saldo: users[i].saldo,
      });
    }

    console.log("✅ Usuarios y Auth insertados correctamente");
  } catch (error) {
    console.error("❌ Error al insertar usuarios:", error);
  } finally {
    await disconnectFromDatabase();
  }
}

seedUsers();
