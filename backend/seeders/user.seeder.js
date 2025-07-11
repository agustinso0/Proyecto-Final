const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const usersData = require("../data/users");
const Auth = require("../models/Auth");
const authsData = require("../data/auths");
const {
  connectToDatabase,
  disconnectFromDatabase,
} = require("../config/database");

async function seedUsers() {
  try {
    await connectToDatabase();

    const users = usersData.map((v) => ({
      ...v,
      _id: new mongoose.Types.ObjectId(v._id),
    }));

    const auths = authsData.map((v) => ({
      ...v,
      _id: new mongoose.Types.ObjectId(v._id),
    }));

    await User.deleteMany({});
    await Auth.deleteMany({});

    for (let i = 0; i < auths.length; i++) {
      const authDoc = new Auth({
        _id: auths[i]._id,
        username: auths[i].username,
        password: auths[i].password,
        token: auths[i].token || null,
        isActive: true,
      });

      await authDoc.save();

      await User.create({
        auth: authDoc._id,
        firstname: users[i].firstname,
        lastname: users[i].lastname,
        email: users[i].email,
        address: users[i].address,
        balance: users[i].balance,
      });
    }

    console.log("Usuarios y Auth insertados correctamente");
  } catch (error) {
    console.error("Error al insertar usuarios:", error);
  } finally {
    await disconnectFromDatabase();
  }
}

seedUsers();
