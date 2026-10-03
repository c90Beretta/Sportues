import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

const ADMIN_NOMBRE = process.env.ADMIN_NOMBRE ?? "Administrador";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? "admin@ues.mx";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "admin123";

// Alumnos de prueba simulados en el padrón de la UES.
const ALUMNOS_PADRON = [
  { numeroExpediente: "23020220069", nombre: "José Alberto Noperi Beltrán", carrera: "Lic. en Entrenamiento Deportivo" },
  { numeroExpediente: "23020220073", nombre: "Isidro Paz Garcia", carrera: "Ing. Software" },
];

async function main() {
  const adminPasswordHash = await hash(ADMIN_PASSWORD, 10);
  const admin = await prisma.usuario.upsert({
    where: { email: ADMIN_EMAIL },
    update: { nombre: ADMIN_NOMBRE, passwordHash: adminPasswordHash, rol: "STAFF" },
    create: { nombre: ADMIN_NOMBRE, email: ADMIN_EMAIL, passwordHash: adminPasswordHash, rol: "STAFF" },
  });
  console.log(`Usuario administrador listo: ${admin.email} (${admin.rol})`);

  for (const alumno of ALUMNOS_PADRON) {
    await prisma.padronUES.upsert({
      where: { numeroExpediente: alumno.numeroExpediente },
      update: {},
      create: alumno,
    });
    console.log(`Registro en PadronUES listo: ${alumno.numeroExpediente} (${alumno.nombre})`);
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());