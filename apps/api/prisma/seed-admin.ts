import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

const ADMIN_NOMBRE = process.env.ADMIN_NOMBRE ?? "Administrador";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? "admin@ues.mx";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "admin123";

const ESTUDIANTE_NOMBRE = process.env.ESTUDIANTE_NOMBRE ?? "Estudiante UES";
const ESTUDIANTE_EMAIL = process.env.ESTUDIANTE_EMAIL ?? "23020220069@ues.mx";
const ESTUDIANTE_PASSWORD = process.env.ESTUDIANTE_PASSWORD ?? "12345678";

async function main() {
  const adminPasswordHash = await hash(ADMIN_PASSWORD, 10);
  const admin = await prisma.usuario.upsert({
    where: { email: ADMIN_EMAIL },
    update: { nombre: ADMIN_NOMBRE, passwordHash: adminPasswordHash, rol: "STAFF" },
    create: { nombre: ADMIN_NOMBRE, email: ADMIN_EMAIL, passwordHash: adminPasswordHash, rol: "STAFF" },
  });
  console.log(`Usuario administrador listo: ${admin.email} (${admin.rol})`);

  const estudiantePasswordHash = await hash(ESTUDIANTE_PASSWORD, 10);
  const estudiante = await prisma.usuario.upsert({
    where: { email: ESTUDIANTE_EMAIL },
    update: { nombre: ESTUDIANTE_NOMBRE, passwordHash: estudiantePasswordHash, rol: "ESTUDIANTE" },
    create: {
      nombre: ESTUDIANTE_NOMBRE,
      email: ESTUDIANTE_EMAIL,
      passwordHash: estudiantePasswordHash,
      rol: "ESTUDIANTE",
      numeroExpediente: "2302022069",
      carrera: "Lic. en Entrenamiento Deportivo",
      nivelExperiencia: "INTERMEDIO",
      estadoRegistro: "APROBADO",
    },
  });
  console.log(`Usuario estudiante listo: ${estudiante.email} (${estudiante.rol})`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());