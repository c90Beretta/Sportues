import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

const ADMIN_NOMBRE = process.env.ADMIN_NOMBRE ?? "Administrador";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL ?? "admin@gimnasio.local";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "admin123";

async function main() {
  const passwordHash = await hash(ADMIN_PASSWORD, 10);

  const usuario = await prisma.usuario.upsert({
    where: { email: ADMIN_EMAIL },
    update: { nombre: ADMIN_NOMBRE, passwordHash, rol: "STAFF" },
    create: { nombre: ADMIN_NOMBRE, email: ADMIN_EMAIL, passwordHash, rol: "STAFF" },
  });

  console.log(`Usuario administrador listo: ${usuario.email} (${usuario.rol})`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());