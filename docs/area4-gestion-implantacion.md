# Área 4 · Gestión e implantación de sistemas

> **Cómo la preguntan:** puro *escenario → clasifica*. Tipos de prueba, tipos de mantenimiento, roles de Scrum, estrategias de riesgo, características de calidad ISO 25010. Es el área **más memorizable** de todas: las tablas de abajo son casi el examen completo.

---

## 1. Pruebas — tipo por escenario

**Por enfoque:**

| Escenario | Tipo |
|---|---|
| Se diseña con la especificación, SIN ver el código (entradas/salidas) | **Caja negra** |
| Se diseña conociendo la estructura interna del código (cobertura de rutas) | **Caja blanca** |

**Por nivel (orden ascendente):**

| Nivel | Qué valida | Quién |
|---|---|---|
| **Unitaria** | Una función/clase aislada | Desarrollador |
| **Integración** | Que los módulos funcionen JUNTOS (interfaces entre ellos) | Equipo |
| **De sistema** | El sistema completo contra los requisitos | Testers |
| **De aceptación (UAT)** | Que satisface las necesidades del CLIENTE en condiciones reales | Cliente/usuario |

**Especiales (distractores frecuentes):**

| Escenario | Tipo |
|---|---|
| Tras un cambio, re-ejecutar pruebas para verificar que nada se rompió | **Regresión** |
| Verificación rápida de que la build básica funciona antes de probar a fondo | **De humo (smoke)** |
| Comportamiento con la carga ESPERADA de usuarios | **De carga** |
| Llevar al sistema MÁS ALLÁ de sus límites hasta que falle | **De estrés** |
| Usuarios reales en ambiente controlado (interno) / en producción limitada | **Alfa / Beta** |

**Conceptos:** caso de prueba = entradas + condiciones + resultado esperado. **Verificación** = ¿construimos bien el producto? (contra especificación). **Validación** = ¿construimos el producto correcto? (contra necesidades del cliente).

## 2. Mantenimiento — los 4 tipos (pregunta segura)

| Motivo del cambio | Tipo |
|---|---|
| Corregir un **defecto/falla** reportado | **Correctivo** |
| El **entorno cambió**: nuevo SO, nueva versión de BD, nueva ley/norma | **Adaptativo** |
| **Mejorar** algo que ya funciona: rendimiento, nuevas funciones pedidas | **Perfectivo** |
| **Anticiparse**: refactorizar/documentar para prevenir problemas futuros | **Preventivo** |

Truco: correctivo = está ROTO · adaptativo = el MUNDO cambió · perfectivo = quieren MÁS/MEJOR · preventivo = ANTES de que truene.

## 3. Scrum (cae siempre)

**Roles:**

| Responsabilidad | Rol |
|---|---|
| Prioriza el Product Backlog, maximiza el VALOR, voz del cliente | **Product Owner** |
| Facilita el proceso, elimina impedimentos, protege al equipo | **Scrum Master** |
| Se autoorganiza y construye el incremento | **Developers** |

**Eventos (todos con duración fija = timebox):** Sprint (1-4 semanas, NUNCA se extiende) · Sprint Planning · Daily (15 min: qué hice, qué haré, impedimentos) · Sprint Review (mostrar el incremento a stakeholders) · Retrospectiva (mejorar el PROCESO del equipo).

**Artefactos:** Product Backlog (lo prioriza el PO) · Sprint Backlog · Incremento (+ Definition of Done).

**Reglas que preguntan:** historia no terminada al final del Sprint → **regresa al Product Backlog**. El Sprint no se alarga. La Review es del producto; la Retro es del proceso.

**Kanban vs Scrum:** Kanban = flujo continuo, limitar el trabajo en curso (WIP), sin iteraciones fijas.

## 4. Gestión de proyectos (PMBOK básico)

- **Triple restricción:** alcance – tiempo – costo (mover una afecta a las otras y a la calidad).
- **EDT/WBS:** descomposición jerárquica del trabajo en paquetes manejables.
- **Ruta crítica:** secuencia de actividades con **holgura cero**; determina la **duración mínima** del proyecto; un retraso ahí retrasa TODO.
- **Holgura:** tiempo que una actividad puede retrasarse sin afectar el fin del proyecto.
- **Diagrama de Gantt:** barras de actividades en el tiempo. **PERT/CPM:** red de dependencias entre actividades.
- **Estimación ágil:** puntos de historia (esfuerzo relativo, no horas) · **Planning Poker** = estimación por consenso, revelando a la vez para evitar el sesgo de anclaje.

## 5. Riesgos

- **Exposición al riesgo = probabilidad × impacto.**

| Acción del escenario | Estrategia |
|---|---|
| Eliminar la causa (cambiar de tecnología, quitar esa función) | **Evitar** |
| Reducir probabilidad o impacto (capacitar, documentar, respaldos, plan B) | **Mitigar** |
| Pasárselo a un tercero (seguro, outsourcing, cláusula contractual) | **Transferir** |
| Asumirlo y monitorearlo (impacto/probabilidad bajos) | **Aceptar** |

## 6. Calidad: ISO/IEC 25010 (características del producto)

Las 8: **funcionalidad (adecuación funcional), rendimiento, compatibilidad, usabilidad, fiabilidad, seguridad, mantenibilidad, portabilidad.**

| Escenario | Característica |
|---|---|
| Intercambiar información/operar con otros sistemas | **Compatibilidad → interoperabilidad** |
| Facilidad de modificar/corregir el software | **Mantenibilidad** |
| Migrarlo a otro SO/plataforma | **Portabilidad** |
| Funcionar sin fallas durante un periodo (madurez, tolerancia a fallos) | **Fiabilidad** |
| Tiempo de respuesta, uso de recursos | **Rendimiento (eficiencia de desempeño)** |

**CMMI — niveles de madurez:** 1 Inicial (caótico) · 2 Gestionado · 3 Definido · 4 Gestionado cuantitativamente · 5 En optimización. (Nemotecnia: **I**nicial-**G**estionado-**D**efinido-**C**uantitativo-**O**ptimización.)

## 7. Implantación, despliegue y configuración

**Estrategias de conversión/implantación (clásica de CENEVAL):**

| Escenario | Estrategia |
|---|---|
| Apagar el viejo y prender el nuevo de golpe | **Directa (big bang)** — riesgosa |
| Viejo y nuevo operando A LA VEZ un tiempo, comparando resultados | **Paralela** — segura pero cara |
| Implantar primero en UNA sucursal/departamento como prueba | **Piloto** |
| Implantar módulo por módulo | **Por fases (escalonada)** |

**CI/CD:** integración continua = integrar y probar automáticamente cada cambio, varias veces al día. Entrega/despliegue continuo = automatizar hasta liberar. Detecta defectos temprano.

**Gestión de la configuración:** **línea base (baseline)** = conjunto aprobado y congelado; solo cambia con control formal de cambios. **Versionado semántico:** MAYOR.menor.parche (2.4.1) — mayor = cambios incompatibles; menor = funcionalidad compatible; parche = correcciones.

**Licencias:** GPL = copyleft, derivados deben ser libres · MIT/BSD/Apache = permisivas · propietaria = uso restringido por contrato.

**Capacitación y documentación de la implantación:** manual de usuario (operación) vs manual técnico (mantenimiento/instalación).

---

## 🃏 Tarjetas de memorización (Área 4)

```
P: Caja negra vs caja blanca
R: Negra = contra la especificación, sin ver código. Blanca = usando la estructura interna del código.

P: 4 niveles de prueba en orden
R: Unitaria → integración → sistema → aceptación.

P: ¿Quién realiza/valida las pruebas de aceptación?
R: El cliente/usuario final (UAT), en condiciones reales.

P: Re-ejecutar pruebas tras un cambio para ver que nada se rompió
R: Prueba de regresión.

P: Carga vs estrés
R: Carga = comportamiento con la demanda esperada. Estrés = llevarlo más allá del límite hasta fallar.

P: Verificación vs validación
R: Verificación = ¿lo construimos BIEN? (vs especificación). Validación = ¿construimos LO CORRECTO? (vs necesidad del cliente).

P: 4 tipos de mantenimiento
R: Correctivo (defectos), adaptativo (cambió el entorno), perfectivo (mejoras), preventivo (anticiparse).

P: Nueva versión del SO obliga a modificar el sistema → mantenimiento
R: Adaptativo.

P: ¿Quién prioriza el Product Backlog?
R: El Product Owner.

P: ¿Qué hace el Scrum Master?
R: Facilita el proceso y elimina impedimentos; NO asigna tareas ni prioriza el backlog.

P: Historia incompleta al terminar el Sprint → ¿qué pasa?
R: Regresa al Product Backlog para repriorizarse; el Sprint nunca se extiende.

P: Review vs Retrospectiva
R: Review = inspeccionar el PRODUCTO con stakeholders. Retrospectiva = mejorar el PROCESO del equipo.

P: 3 preguntas de la Daily
R: ¿Qué hice ayer? ¿Qué haré hoy? ¿Tengo impedimentos?

P: ¿Qué es la ruta crítica?
R: Secuencia de actividades con holgura cero que determina la duración mínima del proyecto.

P: Exposición al riesgo =
R: Probabilidad × impacto.

P: 4 estrategias ante riesgos
R: Evitar, mitigar, transferir, aceptar.

P: Contratar un seguro contra un riesgo → estrategia
R: Transferir.

P: Capacitar a un segundo experto para no depender de uno solo → estrategia
R: Mitigar.

P: 8 características de calidad ISO/IEC 25010
R: Adecuación funcional, rendimiento, compatibilidad, usabilidad, fiabilidad, seguridad, mantenibilidad, portabilidad.

P: Operar e intercambiar información con otros sistemas → característica
R: Interoperabilidad (dentro de compatibilidad).

P: 5 niveles de CMMI
R: Inicial, Gestionado, Definido, Gestionado cuantitativamente, En optimización.

P: Sistema viejo y nuevo operando al mismo tiempo → conversión
R: Paralela.

P: Implantar primero en una sola sucursal → conversión
R: Piloto.

P: ¿Qué es una línea base (baseline)?
R: Conjunto de elementos aprobado y congelado; solo cambia mediante control formal de cambios.

P: Versionado semántico 2.4.1
R: MAYOR(incompatible).menor(funcionalidad compatible).parche(correcciones).

P: ¿Qué es integración continua?
R: Integrar y probar automáticamente el código de todo el equipo varias veces al día.

P: Licencia GPL vs MIT
R: GPL = copyleft, los derivados deben ser libres. MIT = permisiva, permite uso propietario.
```
