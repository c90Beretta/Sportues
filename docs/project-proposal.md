# Project Proposal — Sportues

## Problema y solución en 30 segundos

Los gimnasios pequeños suelen llevar asistencias, membresías y rutinas en hojas de cálculo o mensajes dispersos. Esto dificulta saber quién tiene una membresía vigente, qué rutina debe seguir cada estudiante y cuándo asistió. Sportues centraliza esa operación: el personal administra estudiantes, membresías, ejercicios y rutinas; cada estudiante consulta su rutina y registra su asistencia desde una aplicación pública.

## Usuarios objetivo

- **Personal del gimnasio (STAFF):** registra estudiantes, administra membresías, crea ejercicios y asigna rutinas.
- **Estudiantes:** inician sesión, consultan su rutina y registran su asistencia.

## Entidad primaria: Usuario

| Campo | Tipo | Reglas |
| --- | --- | --- |
| `id` | UUID | Identificador único generado por el sistema. |
| `nombre` | Texto | Obligatorio. |
| `email` | Texto | Obligatorio, formato de correo y único. |
| `passwordHash` | Texto | Obligatorio; nunca se expone al cliente. |
| `rol` | Texto | `ESTUDIANTE` o `STAFF`; obligatorio. |
| `membresiaId` | UUID opcional | Referencia a la membresía activa. |
| `createdAt` | Fecha/hora | Generado al crear el registro. |
| `updatedAt` | Fecha/hora | Actualizado automáticamente al modificar el registro. |

## Entidad relacionada: Membresia (1:N)

Una **Membresia** puede estar asociada a muchos **Usuario**s; un usuario tiene cero o una membresía activa. La membresía contiene `id`, `nombre`, `descripcion`, `precio`, `duracionDias` y `createdAt`. La relación permite al staff clasificar estudiantes por plan sin duplicar los datos del plan para cada persona.

## Alcance inicial

1. Autenticación separada para staff y estudiantes mediante JWT y cookies HTTP-only.
2. Gestión de estudiantes, asistencias, ejercicios y rutinas desde el panel de administración.
3. Consulta de rutina y registro de asistencia en la aplicación pública.
4. Persistencia en PostgreSQL mediante Prisma.

## Fuera de alcance inicial

- Cobro en línea.
- Notificaciones push o mensajería.
- Integración con dispositivos de control de acceso.
