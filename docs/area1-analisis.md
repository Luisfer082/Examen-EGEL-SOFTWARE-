# Área 1 · Análisis de sistemas de software

> **Cómo la preguntan:** casi todo es *escenario → identifica el concepto*. Te dan un caso corto y preguntan qué tipo de requisito es, qué técnica de elicitación conviene, o qué factibilidad está en riesgo. La clave es dominar las **palabras gatillo** de cada concepto.

---

## 1. Tipos de requisitos

| Si el enunciado dice... | Es un requisito... |
|---|---|
| "el sistema debe **permitir/registrar/calcular/generar**" | **Funcional** (qué hace) |
| tiempo de respuesta, usuarios concurrentes, disponibilidad % | **No funcional · rendimiento/disponibilidad** |
| cifrado, contraseñas, roles, accesos | **No funcional · seguridad** |
| "fácil de aprender", accesibilidad | **No funcional · usabilidad** |
| leyes, normas, reglas propias del negocio (ej. cálculo de IVA) | **De dominio** |
| navegador soportado, resolución, formato de reportes | **De interfaz / restricción** |

**Trampa clásica:** un requisito que suena a función pero mide calidad ("debe responder en 2 s") es **no funcional**. Fíjate si describe *qué hace* (funcional) o *qué tan bien lo hace* (no funcional).

**Buen requisito = verificable:** medible, no ambiguo, sin adjetivos subjetivos ("rápido", "amigable", "eficiente" = mal redactado). En el reactivo, la opción correcta casi siempre trae **números**.

## 2. Técnicas de elicitación — escenario → técnica

| Escenario | Técnica correcta |
|---|---|
| Muchos usuarios, dispersos, poco tiempo/presupuesto | **Cuestionario / encuesta** |
| Pocos expertos clave, temas complejos o sensibles | **Entrevista** |
| El usuario "no sabe explicar" lo que hace, o dice una cosa y hace otra | **Observación directa (etnografía)** |
| Requisitos vagos; el usuario necesita "ver algo" para decidir | **Prototipado** |
| Resolver conflictos entre stakeholders, generar consenso | **Taller / JAD / lluvia de ideas** |
| Ya existe un sistema o documentación previa | **Análisis de documentos** |

## 3. Casos de uso

- **Actor primario:** inicia el caso de uso y recibe el valor. **Secundario:** participa/apoya (ej. sistema externo de pagos).
- **«include»:** comportamiento **obligatorio** que se reutiliza siempre (ej. "validar sesión"). Piensa: *siempre pasa*.
- **«extend»:** comportamiento **opcional/condicional** (ej. "aplicar cupón"). Piensa: *a veces pasa*.
- El caso de uso describe **interacción actor-sistema para lograr un objetivo**, no detalles de implementación.

## 4. Historias de usuario

- Formato: **Como** `<rol>` **quiero** `<funcionalidad>` **para** `<beneficio>`.
- **INVEST:** **I**ndependiente, **N**egociable, **V**aliosa, **E**stimable, **S**mall (pequeña), **T**esteable.
- Criterios de aceptación = condiciones concretas para dar por terminada la historia (base de las pruebas de aceptación).

## 5. Priorización MoSCoW

| Categoría | Significado |
|---|---|
| **M**ust | Indispensable; sin esto la entrega fracasa |
| **S**hould | Importante, pero se puede liberar sin ello |
| **C**ould | Deseable si hay tiempo/recursos |
| **W**on't | Fuera del alcance de esta entrega (explícitamente) |

## 6. Factibilidades — dónde truena el proyecto

| Señal en el escenario | Factibilidad comprometida |
|---|---|
| No existe la tecnología / el equipo no la domina | **Técnica** |
| Costo > beneficio, no hay presupuesto | **Económica** |
| Los usuarios se resisten, no lo usarían, choca con la operación | **Operativa** |
| Viola leyes, privacidad de datos, licencias | **Legal / normativa** |
| No alcanza el tiempo para la fecha requerida | **De calendario** |

## 7. Documentos y artefactos

- **SRS (especificación de requisitos):** describe QUÉ hará el sistema; acuerdo/contrato entre cliente y equipo. Referencia clásica: IEEE 830.
- **Matriz de trazabilidad:** vincula requisito ↔ diseño ↔ código ↔ prueba. Sirve para verificar **cobertura** y analizar **impacto de cambios**.
- **Diagrama de contexto (DFD nivel 0):** el sistema como **una sola caja** + entidades externas + flujos de datos. Si el reactivo menciona "procesos internos detallados", NO es el de contexto.
- **Control de cambios:** todo cambio se **registra → se analiza impacto → lo aprueba una autoridad (comité/CCB)**. Nunca "se implementa de inmediato" ni "se rechaza porque ya se firmó".

## 8. Distractores favoritos del CENEVAL en esta área

1. Confundir requisito no funcional con funcional (te ponen un verbo de acción junto a una métrica).
2. Ofrecerte "entrevistas" cuando el escenario grita volumen/dispersión (→ encuesta).
3. Confundir include/extend (memoriza: include = siempre, extend = opcional).
4. Factibilidad operativa disfrazada de "resistencia al cambio" o "falta de capacitación".
5. La opción de "aceptar el cambio de inmediato para tener contento al cliente" — **siempre es incorrecta**; la respuesta es el proceso formal.

---

## 🃏 Tarjetas de memorización (Área 1)

```
P: ¿Requisito funcional vs no funcional?
R: Funcional = QUÉ hace el sistema. No funcional = QUÉ TAN BIEN lo hace (calidad, restricciones).

P: ¿Qué significa INVEST?
R: Independiente, Negociable, Valiosa, Estimable, Small, Testeable.

P: ¿Qué significa MoSCoW?
R: Must (indispensable), Should (importante), Could (deseable), Won't (fuera de alcance).

P: ¿«include» vs «extend» en casos de uso?
R: include = comportamiento obligatorio, siempre se ejecuta. extend = opcional/condicional.

P: ¿Actor primario?
R: Quien inicia el caso de uso y obtiene el valor/objetivo.

P: ¿Qué es la SRS y qué norma la referencia?
R: Especificación de Requisitos de Software; comportamiento esperado del sistema; IEEE 830.

P: ¿Para qué sirve la matriz de trazabilidad?
R: Vincular requisitos con diseño, código y pruebas; verificar cobertura y analizar impacto de cambios.

P: Formato de historia de usuario
R: Como <rol> quiero <funcionalidad> para <beneficio>.

P: ¿Diagrama de contexto?
R: DFD nivel 0: el sistema como un solo proceso + entidades externas + flujos de datos.

P: 5 factibilidades
R: Técnica, económica, operativa, legal y de calendario.

P: Resistencia de usuarios a adoptar el sistema → ¿qué factibilidad?
R: Operativa.

P: Técnica de elicitación para cientos de usuarios dispersos
R: Cuestionario/encuesta.

P: El usuario no sabe explicar su proceso → técnica
R: Observación directa.

P: Requisitos vagos, el cliente necesita "ver algo" → técnica
R: Prototipado.

P: ¿Quién aprueba un cambio de requisitos a mitad de proyecto?
R: El comité de control de cambios (CCB), tras análisis de impacto formal.

P: 3 características de un requisito bien redactado
R: Verificable/medible, no ambiguo, completo (sin adjetivos subjetivos).
```
