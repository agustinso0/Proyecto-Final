// Inicializar replica set de MongoDB
try {
  // Verificar si el replica set ya está inicializado
  var status = rs.status();
  print("Replica set ya está inicializado");
} catch (e) {
  // El replica set no está inicializado, proceder a configurarlo
  print("Inicializando replica set...");

  var config = {
    _id: "rs0",
    members: [
      {
        _id: 0,
        host: "database:27017",
      },
    ],
  };

  rs.initiate(config);

  // Esperar a que el replica set esté listo
  var attempts = 0;
  var maxAttempts = 30;

  while (attempts < maxAttempts) {
    try {
      var status = rs.status();
      if (status.members[0].state === 1) {
        print("Replica set inicializado correctamente");
        break;
      }
    } catch (e) {
      // Continuar esperando
    }

    attempts++;
    sleep(1000); // Esperar 1 segundo
  }

  if (attempts >= maxAttempts) {
    print("Error: No se pudo inicializar el replica set en el tiempo esperado");
  }
}
