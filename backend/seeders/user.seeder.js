const mongoose = require("mongoose");
const User = require("../models/User");
const Auth = require("../models/Auth");
const usersData = require("../data/users");
const authsData = require("../data/auths");
const {
  connectToDatabase,
  disconnectFromDatabase,
} = require("../config/database");

async function seedUsers() {
  try {
    await connectToDatabase();
    console.log("Iniciando seeder de usuarios desde archivos de datos...");

    console.log("Limpiando datos existentes...");
    await User.deleteMany({});
    await Auth.deleteMany({});

    console.log("Creando usuarios...");

    for (const userData of usersData) {
      const user = new User({
        _id: new mongoose.Types.ObjectId(userData._id),
        firstname: userData.firstname,
        lastname: userData.lastname,
        email: userData.email,
        password: userData.password,
        address: userData.address,
        balance: userData.balance,
      });

      await user.save();
      console.log(`Usuario creado: ${user.email}`);
    }

    console.log(`\nSeeder de usuarios completado!`);
  } catch (error) {
    console.error("❌ Error en el seeder de usuarios:", error);
    throw error;
  } finally {
    await disconnectFromDatabase();
    console.log("Desconectado de la base de datos");
  }
}

async function seedAuth() {
  try {
    await connectToDatabase();
    console.log("Iniciando seeder de sesiones desde archivos de datos...");

    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log(
        "No hay usuarios en la base de datos. Ejecute primero el seeder de usuarios."
      );
      return;
    }

    console.log("Limpiando sesiones existentes...");
    await Auth.deleteMany({});

    console.log("Creando sesiones...");

    for (const authData of authsData) {
      const userExists = await User.findById(authData.user);
      if (!userExists) {
        console.log(
          `Usuario ${authData.user} no encontrado, saltando sesion ${authData._id}`
        );
        continue;
      }

      const auth = new Auth({
        _id: new mongoose.Types.ObjectId(authData._id),
        user: new mongoose.Types.ObjectId(authData.user),
        sessionToken: authData.sessionToken,
        isActive: authData.isActive,
        loginAt: authData.loginAt,
        expiresAt: authData.expiresAt,
      });

      await auth.save();

      const user = await User.findById(authData.user);
    }

    console.log(`\nSeeder de sesiones completado!`);
  } catch (error) {
    console.error("❌ Error en el seeder de sesiones:", error);
    throw error;
  } finally {
    await disconnectFromDatabase();
    console.log("Desconectado de la base de datos");
  }
}

async function seedAll() {
  try {
    console.log("Iniciando seeder completo...");
    await seedUsers();
    await seedAuth();
    console.log("\nSeeder completo finalizado exitosamente!");
  } catch (error) {
    console.error("Error en el seeder completo:", error);
    process.exit(1);
  }
}

if (require.main === module) {
  const command = process.argv[2];
  switch (command) {
    case "users":
      console.log("Ejecutando seeder de usuarios unicamente...");
      seedUsers();
      break;
    case "sessions":
    case "auth":
      console.log("Ejecutando seeder de sesiones unicamente...");
      seedAuth();
      break;
    case "all":
    default:
      console.log("Ejecutando seeder completo (usuarios + sesiones)...");
      seedAll();
      break;
  }
}

module.exports = { seedUsers, seedAuth, seedAll };
