# Área 2 · Diseño de sistemas de software

> **Cómo la preguntan:** dos formatos dominan: (1) *escenario → patrón/principio*, y (2) *"¿qué diagrama UML usarías para...?"*. También caen normalización y REST. Si dominas las tablas escenario→respuesta de abajo, esta área se vuelve puntos casi gratis.

---

## 1. Cohesión y acoplamiento (la pregunta más repetida)

- **Cohesión** = qué tan relacionadas están las tareas DENTRO de un módulo. **Quieres ALTA.**
- **Acoplamiento** = qué tanto depende un módulo DE OTROS. **Quieres BAJO.**
- Módulo que "hace de todo" / funciones sin relación → **baja cohesión**.
- Módulo que conoce detalles internos de otro / cambiar uno rompe al otro → **alto acoplamiento**.

## 2. Patrones de diseño — escenario → patrón

| Escenario gatillo | Patrón |
|---|---|
| "Una sola instancia, punto de acceso global" (conexión BD, logger, config) | **Singleton** |
| "Cuando X cambia, notificar automáticamente a varios suscriptores" | **Observer** |
| "Crear objetos sin especificar la clase concreta" / decidir en tiempo de ejecución qué crear | **Factory Method** |
| "Interfaz incompatible; hacer que dos sistemas trabajen juntos" (código legado, API externa) | **Adapter** |
| "Simplificar el acceso a un subsistema complejo con una interfaz única" | **Facade** |
| "Intercambiar algoritmos/comportamientos en tiempo de ejecución" (métodos de pago, ordenamientos) | **Strategy** |
| "Agregar responsabilidades a un objeto dinámicamente, sin herencia" | **Decorator** |
| "Construir un objeto complejo paso a paso" (muchos parámetros opcionales) | **Builder** |
| "Estructura de árbol; tratar igual a objetos individuales y a grupos" (carpetas/archivos) | **Composite** |

Categorías GoF: **creacionales** (Singleton, Factory, Builder, Prototype, Abstract Factory), **estructurales** (Adapter, Facade, Decorator, Composite, Proxy, Bridge), **de comportamiento** (Observer, Strategy, Command, Iterator, State, Template Method).

## 3. SOLID — escenario → principio

| Escenario gatillo | Principio |
|---|---|
| "La clase hace demasiadas cosas / más de una razón para cambiar" | **S** — Responsabilidad única (SRP) |
| "Agregar funcionalidad SIN modificar código existente" (extender con clases nuevas) | **O** — Abierto/cerrado (OCP) |
| "Una subclase debe poder sustituir a su clase base sin romper el programa" | **L** — Sustitución de Liskov (LSP) |
| "Interfaces gordas; clientes obligados a implementar métodos que no usan" | **I** — Segregación de interfaces (ISP) |
| "Depender de abstracciones (interfaces), no de clases concretas" | **D** — Inversión de dependencias (DIP) |

## 4. UML — ¿qué diagrama para qué?

| Necesitas mostrar... | Diagrama |
|---|---|
| Estructura estática: clases, atributos, métodos, relaciones | **Clases** |
| Mensajes entre objetos ORDENADOS EN EL TIEMPO | **Secuencia** |
| Funcionalidad desde la perspectiva del usuario (actores) | **Casos de uso** |
| Flujo de trabajo/proceso con decisiones y paralelismo | **Actividades** |
| Estados de UN objeto y sus transiciones (pedido: creado→pagado→enviado) | **Estados** |
| Organización física: nodos, servidores, dónde corre qué | **Despliegue** |
| Módulos/partes del sistema y sus interfaces | **Componentes** |

**Relaciones en diagrama de clases:**
- **Herencia/generalización:** "es un" (triángulo vacío).
- **Agregación:** "tiene un", las partes viven solas (rombo vacío). Ej.: equipo–jugadores.
- **Composición:** "tiene un", las partes MUEREN con el todo (rombo relleno). Ej.: casa–habitaciones.
- **Dependencia:** "usa a" temporalmente (flecha punteada).
- Multiplicidades: `1`, `0..1`, `*` o `0..*`, `1..*`.

## 5. Arquitecturas

| Característica clave | Arquitectura |
|---|---|
| Presentación / lógica de negocio / acceso a datos, separadas | **Capas (3 capas)** |
| Reglas de negocio ("no vender sin inventario") | → van en la **capa de lógica de negocio** |
| Servicios pequeños, independientes, despliegue y escalado por separado | **Microservicios** |
| Todo en un solo ejecutable/despliegue | **Monolito** |
| Componentes se comunican produciendo/consumiendo eventos, desacoplados | **Orientada a eventos** |
| Separar datos (Modelo), presentación (Vista) y entrada del usuario (Controlador) | **MVC** |

**MVC:** Modelo = datos y lógica · Vista = presentación (solo muestra) · **Controlador = recibe acciones del usuario, coordina modelo y vista**.

**Microservicios — ojo:** su ventaja es despliegue/escalado independiente y tolerancia a fallos parciales. Sus DESVENTAJAS (que usan como distractor): mayor complejidad operativa, transacciones distribuidas difíciles, latencia de red.

## 6. Normalización de bases de datos

| Problema en la tabla | Viola |
|---|---|
| Grupos repetidos / valores multivaluados en una celda (tel1, tel2, tel3) | **1FN** — valores atómicos |
| Atributo depende de SOLO UNA PARTE de una llave primaria compuesta (dependencia parcial) | **2FN** |
| Atributo depende de otro atributo NO llave (dependencia transitiva: id→depto→nombre_depto) | **3FN** |

Regla nemotécnica: *"la llave, toda la llave y nada más que la llave"* (1FN, 2FN, 3FN).

**Modelo ER:** entidad = cosa del negocio; atributo; relación con cardinalidad (1:1, 1:N, N:M). Una relación **N:M se resuelve con una tabla intermedia**.

## 7. Diseño de APIs REST

| Acción | Método | Nota |
|---|---|---|
| Consultar recurso | **GET** | Seguro e idempotente |
| Crear recurso | **POST** | NO idempotente |
| Reemplazar recurso completo | **PUT** | Idempotente |
| Modificar parcialmente | **PATCH** | |
| Eliminar | **DELETE** | Idempotente |

Códigos HTTP estrella: **200** OK · **201** Creado · **400** petición inválida · **401** no autenticado · **403** sin permiso · **404** no existe · **500** error del servidor.

Recursos = **sustantivos en la URI** (`/clientes/15/pedidos`), nunca verbos.

## 8. Usabilidad — heurísticas de Nielsen (las 5 más preguntadas)

| Escenario | Heurística |
|---|---|
| Barra de progreso, spinner, "guardando..." | **Visibilidad del estado del sistema** |
| Confirmar antes de borrar, deshabilitar opciones inválidas | **Prevención de errores** |
| Mensaje de error claro que dice cómo corregir | **Ayudar a reconocer y recuperarse de errores** |
| Botón "deshacer", salir de un flujo | **Control y libertad del usuario** |
| Menús visibles en vez de comandos que hay que recordar | **Reconocimiento antes que recuerdo** |

---

## 🃏 Tarjetas de memorización (Área 2)

```
P: ¿Qué se busca en cohesión y acoplamiento?
R: Alta cohesión, bajo acoplamiento.

P: Única instancia global de una clase → patrón
R: Singleton.

P: Notificar automáticamente a varios objetos cuando algo cambia → patrón
R: Observer.

P: Hacer compatibles dos interfaces que no lo son → patrón
R: Adapter.

P: Interfaz simple para un subsistema complejo → patrón
R: Facade.

P: Intercambiar algoritmos en tiempo de ejecución → patrón
R: Strategy.

P: Crear objetos sin acoplar a la clase concreta → patrón
R: Factory Method.

P: SOLID: extender sin modificar código existente
R: O — Principio abierto/cerrado (OCP).

P: SOLID: una clase, una sola razón para cambiar
R: S — Responsabilidad única (SRP).

P: SOLID: depender de abstracciones, no de concretos
R: D — Inversión de dependencias (DIP).

P: SOLID: la subclase sustituye a la base sin romper nada
R: L — Sustitución de Liskov (LSP).

P: Diagrama UML de mensajes ordenados en el tiempo
R: Diagrama de secuencia.

P: Diagrama UML de los estados de un objeto
R: Diagrama de estados (máquina de estados).

P: Diagrama UML de dónde se instala físicamente el software
R: Diagrama de despliegue.

P: Agregación vs composición
R: Agregación = partes independientes (rombo vacío). Composición = partes mueren con el todo (rombo relleno).

P: Dependencia parcial de llave compuesta → viola
R: 2FN.

P: Dependencia transitiva (atributo depende de otro no llave) → viola
R: 3FN.

P: Valores no atómicos / grupos repetidos → viola
R: 1FN.

P: Relación N:M en modelo relacional → ¿cómo se implementa?
R: Con una tabla intermedia (asociativa).

P: Método HTTP para reemplazar un recurso completo
R: PUT (idempotente).

P: Método HTTP para crear un recurso
R: POST (no idempotente).

P: Código HTTP 201 / 403 / 404
R: 201 = creado; 403 = prohibido (sin permiso); 404 = no encontrado.

P: ¿Dónde van las reglas de negocio en 3 capas?
R: En la capa de lógica de negocio (capa intermedia).

P: MVC: ¿quién recibe las acciones del usuario?
R: El controlador.

P: Barra de progreso → heurística de Nielsen
R: Visibilidad del estado del sistema.

P: 3 categorías de patrones GoF
R: Creacionales, estructurales y de comportamiento.
```
