# L0 — Mindset (escrito por el equipo, sin IA)

> Este archivo se guarda y **no se reescribe**: el 30 nov se compara con el retro. La IA no escribe ninguna parte de este documento.

Fecha en que se escribió: 2026-11-19

## Nuestra opinión honesta sobre la IA para programar hoy

### Opiniones individuales

- **Jose Alberto Noperi Beltran:** Considero que la IA es una herramienta sumamente útil hoy en día, especialmente porque acelera muchísimo la resolución de errores y el desarrollo de funcionalidades que antes tomaban horas buscando en foros. Me ayuda bastante a generar estructuras base e ideas para organizar mejor el código. Sin embargo, me ha fallado varias veces cuando no tiene suficiente contexto del proyecto o de la arquitectura; por eso nunca confío ciegamente en lo que entrega y siempre reviso tanto las instrucciones que le doy como el código resultante antes de integrarlo.

- **Julian Enrique Vizcarra Perez:** Para mí, la utilidad principal de la IA está en la velocidad que nos da para tirar código y destrabar problemas técnicos puntuales sin perder tanto tiempo. Aun así, tengo claro que se equivoca con frecuencia si se le pide algo muy abierto o sin contexto claro. No se puede aceptar su salida sin probarla, porque depender demasiado de ella sin entender qué está haciendo termina provocando errores de compilación o cambios que rompen otras partes del sistema.

- **Paulino Antonio Manzano Segura:** Coincido en que es un gran apoyo para programar más rápido y explorar alternativas de solución, pero la veo como un asistente y no como un reemplazo del desarrollador. Cuando le falta contexto del repositorio suele inventar cosas o dar respuestas incompletas, así que siempre es necesario validar y ajustar lo que genera. Usada con criterio, sube bastante el rendimiento, pero confiarse de más es garantía de terminar corrigiendo fallos innecesarios.

### Postura conjunta del equipo

Los tres estamos totalmente de acuerdo y conscientes del papel que debe tener la IA en nuestro proyecto: es una herramienta que aumenta mucho la productividad del equipo al ayudarnos a diagnosticar errores rápidamente, proponer estructuras y acelerar la escritura de código, siempre y cuando se utilice de manera responsable. Coincidimos en que nunca debemos confiar ciegamente en el código generado; siempre revisamos y probamos cada cambio antes de darlo por bueno, ya que depender sin supervisión de la IA termina generando errores de compilación, pérdida de control sobre el proyecto y tiempo perdido depurando fallos evitables.

## Hipótesis del experimento

"With our framework, the agent will take slightly more time upfront to plan and define acceptance criteria, but will produce fewer compilation and logic errors, require fewer rework corrections, and deliver higher code quality that strictly meets the acceptance criteria compared to vibe coding."

*Explicación de nuestra predicción:* Aunque al principio toma un poco más de tiempo redactar el issue, los criterios de aceptación y las pruebas antes de implementar (Run B), ese esfuerzo inicial no se compara con el tiempo que ahorraremos después al evitar correcciones repetitivas. Esperamos que, al darle al agente contexto real del proyecto, reglas claras y límites definidos, cometa muchos menos errores y se apegue mejor a lo pedido que usando una IA externa o sin estructura (Run A / *vibe coding*).

## Reevaluación (30 nov)

Qué cambió: [COMPLETAR POR EL EQUIPO — SIN IA — solo el 30 nov, después del retro]

Qué no cambió: [COMPLETAR POR EL EQUIPO — SIN IA — solo el 30 nov, después del retro]

## Investigación L0 (opcional, sí puede apoyarse en fuentes)

Un caso real de incidente o problema de seguridad por código generado con IA, y un caso real de ganancia de productividad reportada. Qué hizo distinto cada equipo:

- **Incidente / problema de seguridad en código generado con IA (Packages Hallucination / Slopsquatting):** En investigaciones recientes sobre seguridad en asistentes de código con IA (como el estudio *We Have a Package for You! A Comprehensive Analysis of Package Hallucinations by Code Generating LLMs* de Spracklen et al., analizado en reportes de seguridad de software), se documentó que los modelos de lenguaje frecuentemente inventan nombres de paquetes o dependencias que no existen en registros como npm o PyPI. Atacantes aprovecharon este comportamiento publicando paquetes maliciosos con esos mismos nombres inventados para que, cuando un desarrollador o agente instalara la dependencia sin verificarla, ejecutara código malicioso en su entorno.
  - **Qué hicieron distinto / medida preventiva:** Los equipos que mitigaron este riesgo dejaron de instalar dependencias sugeridas por la IA de forma automática y establecieron como regla obligatoria que una persona verifique manualmente que cada paquete exista, tenga mantenimiento activo y coincida exactamente con su nombre oficial antes de aceptarlo en el proyecto (regla que también adoptamos en nuestro framework).
  - **Enlace verificado:** https://arxiv.org/abs/2406.10279

- **Caso real de ganancia de productividad reportada (Estudio controlado de GitHub Copilot en desarrollo de tareas):** En el estudio empírico realizado por investigadores de GitHub y Microsoft (*The Impact of AI on Developer Productivity: Evidence from GitHub Copilot*, Peng et al.), un grupo de desarrolladores implementó un servidor HTTP en JavaScript; quienes utilizaron asistencia de IA completaron la tarea un **55.8 % más rápido** en promedio que el grupo que programó sin IA, manteniendo además una tasa de éxito ligeramente superior en las pruebas automatizadas.
  - **Qué hicieron distinto / medida preventiva:** El éxito en la productividad no vino de dejar que la IA escribiera todo sin supervisión, sino de trabajar sobre una especificación concreta con criterios de evaluación claros (pruebas automatizadas que validaban si la solución realmente funcionaba) y con desarrolladores revisando y ajustando el código paso a paso en lugar de aceptar sugerencias a ciegas.
  - **Enlace verificado:** https://arxiv.org/abs/2302.06590