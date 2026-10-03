-- CreateTable
CREATE TABLE "Usuario" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "rol" TEXT NOT NULL DEFAULT 'ESTUDIANTE',
    "numeroExpediente" TEXT,
    "carrera" TEXT,
    "nivelExperiencia" TEXT,
    "estadoRegistro" TEXT,
    "certificadoMedicoUrl" TEXT,
    "certificadoVigenteHasta" TIMESTAMP(3),
    "revisadoPorId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PadronUES" (
    "numeroExpediente" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "carrera" TEXT NOT NULL,

    CONSTRAINT "PadronUES_pkey" PRIMARY KEY ("numeroExpediente")
);

-- CreateTable
CREATE TABLE "CodigoVerificacion" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "codigo" TEXT NOT NULL,
    "expiraEn" TIMESTAMP(3) NOT NULL,
    "usado" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CodigoVerificacion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Equipo" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "categoria" TEXT,
    "cantidad" INTEGER NOT NULL DEFAULT 1,
    "ubicacion" TEXT,
    "estado" TEXT NOT NULL DEFAULT 'ACTIVA',
    "notaFueraDeServicio" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Equipo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NotaMantenimiento" (
    "id" TEXT NOT NULL,
    "equipoId" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "resuelta" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "NotaMantenimiento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Ejercicio" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT,
    "gruposMusculares" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "equipoId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Ejercicio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Rutina" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "origen" TEXT NOT NULL DEFAULT 'OFICIAL',
    "nivel" TEXT,
    "descripcion" TEXT,
    "gruposMusculares" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "creadaPorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Rutina_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RutinaEjercicio" (
    "rutinaId" TEXT NOT NULL,
    "ejercicioId" TEXT NOT NULL,
    "orden" INTEGER NOT NULL,
    "series" INTEGER NOT NULL,
    "repeticiones" INTEGER NOT NULL,
    "descansoSegundos" INTEGER,

    CONSTRAINT "RutinaEjercicio_pkey" PRIMARY KEY ("rutinaId","ejercicioId")
);

-- CreateTable
CREATE TABLE "TurnoEntrenador" (
    "id" TEXT NOT NULL,
    "entrenadorId" TEXT NOT NULL,
    "horaInicio" TEXT NOT NULL,
    "horaFin" TEXT NOT NULL,
    "diasSemana" TEXT[],

    CONSTRAINT "TurnoEntrenador_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Asistencia" (
    "id" TEXT NOT NULL,
    "estudianteId" TEXT NOT NULL,
    "entrenadorEnTurnoId" TEXT,
    "horaEntrada" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "horaSalida" TIMESTAMP(3),
    "cerradaAutomaticamente" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Asistencia_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TokenQRUsado" (
    "jti" TEXT NOT NULL,
    "usadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TokenQRUsado_pkey" PRIMARY KEY ("jti")
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_key" ON "Usuario"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_numeroExpediente_key" ON "Usuario"("numeroExpediente");

-- AddForeignKey
ALTER TABLE "Usuario" ADD CONSTRAINT "Usuario_revisadoPorId_fkey" FOREIGN KEY ("revisadoPorId") REFERENCES "Usuario"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NotaMantenimiento" ADD CONSTRAINT "NotaMantenimiento_equipoId_fkey" FOREIGN KEY ("equipoId") REFERENCES "Equipo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ejercicio" ADD CONSTRAINT "Ejercicio_equipoId_fkey" FOREIGN KEY ("equipoId") REFERENCES "Equipo"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Rutina" ADD CONSTRAINT "Rutina_creadaPorId_fkey" FOREIGN KEY ("creadaPorId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RutinaEjercicio" ADD CONSTRAINT "RutinaEjercicio_rutinaId_fkey" FOREIGN KEY ("rutinaId") REFERENCES "Rutina"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RutinaEjercicio" ADD CONSTRAINT "RutinaEjercicio_ejercicioId_fkey" FOREIGN KEY ("ejercicioId") REFERENCES "Ejercicio"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TurnoEntrenador" ADD CONSTRAINT "TurnoEntrenador_entrenadorId_fkey" FOREIGN KEY ("entrenadorId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Asistencia" ADD CONSTRAINT "Asistencia_estudianteId_fkey" FOREIGN KEY ("estudianteId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Asistencia" ADD CONSTRAINT "Asistencia_entrenadorEnTurnoId_fkey" FOREIGN KEY ("entrenadorEnTurnoId") REFERENCES "Usuario"("id") ON DELETE SET NULL ON UPDATE CASCADE;
