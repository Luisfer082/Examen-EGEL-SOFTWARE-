# Área 3 · Desarrollo de sistemas de software ⚠️ PRIORIDAD

> **Cómo la preguntan:** es el área donde más gente truena a nivel nacional. Mezcla teoría (POO, estructuras de datos, complejidad) con **reactivos de leer código/pseudocódigo y SQL**. Aquí no basta memorizar: hay que practicar trazando código a mano. Aun así, hay mucho memorizable que cae directo.

---

## 1. Estructuras de datos — escenario → estructura

| Escenario gatillo | Estructura |
|---|---|
| Deshacer (undo), historial de navegación "atrás", evaluación de expresiones, llamadas recursivas | **Pila (LIFO)** |
| Fila de impresión, turnos, procesamiento en orden de llegada | **Cola (FIFO)** |
| Atención por prioridad (urgencias, planificador de procesos) | **Cola de prioridad / heap** |
| Búsqueda por clave en tiempo casi constante O(1) | **Tabla hash / diccionario** |
| Datos jerárquicos (carpetas, organigrama), búsqueda ordenada eficiente | **Árbol (binario de búsqueda)** |
| Relaciones muchos-a-muchos: rutas, redes sociales, mapas | **Grafo** |
| Inserciones/eliminaciones frecuentes en medio, tamaño variable | **Lista ligada** |
| Acceso directo por índice, tamaño fijo | **Arreglo** |

## 2. Complejidad (Big-O) — memoriza esta tabla

| Algoritmo/operación | Complejidad |
|---|---|
| Acceso por índice en arreglo | O(1) |
| Búsqueda/inserción promedio en tabla hash | O(1) |
| **Búsqueda binaria** (requiere arreglo **ordenado**) | **O(log n)** |
| Búsqueda lineal / recorrer un arreglo | O(n) |
| Merge sort, quicksort (promedio), heapsort | O(n log n) |
| Burbuja, inserción, selección; dos ciclos anidados | O(n²) |

Truco para reactivos de "¿cuál es la complejidad de este código?": **cuenta los ciclos anidados sobre n**. 1 ciclo = O(n); 2 anidados = O(n²); ciclo que divide a la mitad = O(log n).

## 3. POO — los 4 pilares (caen SIEMPRE)

| Concepto | Definición gatillo | Ejemplo típico del reactivo |
|---|---|---|
| **Encapsulamiento** | Ocultar el estado interno; atributos privados + getters/setters | "atributos private y métodos de acceso" |
| **Herencia** | Una clase adquiere atributos/métodos de otra ("es un") | Perro hereda de Animal |
| **Polimorfismo** | Mismo mensaje, comportamiento distinto según la clase | calcularArea() en Círculo vs Cuadrado |
| **Abstracción** | Modelar solo lo esencial, ocultando detalles | Clase abstracta / interfaz |

Extras que preguntan:
- **Sobrecarga (overloading):** mismo nombre de método, **distintos parámetros**, misma clase.
- **Sobrescritura (overriding):** la subclase **redefine** un método heredado (base del polimorfismo).
- **Clase abstracta:** no se instancia; puede tener métodos con y sin implementación. **Interfaz:** solo contrato (métodos sin implementación); una clase puede implementar varias.
- **Constructor:** método que se ejecuta al crear el objeto para inicializarlo.

## 4. SQL — el clásico del área

**JOINs:**

| Quiero... | JOIN |
|---|---|
| Solo las filas que coinciden en AMBAS tablas | **INNER JOIN** |
| TODAS las filas de la izquierda + coincidencias (o NULL) | **LEFT JOIN** |
| TODAS las de la derecha + coincidencias | **RIGHT JOIN** |
| Todo de ambas tablas | **FULL OUTER JOIN** |

Reactivo típico: "clientes que NO tienen pedidos" → `LEFT JOIN ... WHERE pedidos.id IS NULL`.

**Agregación:**
- `WHERE` filtra **filas** (antes de agrupar) · `HAVING` filtra **grupos** (después de agregar).
- Funciones: `COUNT, SUM, AVG, MIN, MAX`. Todo lo del `SELECT` que no sea agregado debe ir en el `GROUP BY`.
- Orden de escritura: `SELECT → FROM → JOIN → WHERE → GROUP BY → HAVING → ORDER BY`.

**Categorías de sentencias:**

| Categoría | Sentencias |
|---|---|
| **DDL** (estructura) | CREATE, ALTER, DROP, TRUNCATE |
| **DML** (datos) | SELECT, INSERT, UPDATE, DELETE |
| **DCL** (permisos) | GRANT, REVOKE |
| **TCL** (transacciones) | COMMIT, ROLLBACK |

**Transacciones ACID:** **A**tomicidad (todo o nada), **C**onsistencia, **I** (aislamiento), **D**urabilidad.

**Llaves:** primaria = identifica de forma única, no nula; foránea = referencia a la primaria de otra tabla (integridad referencial); índice = acelera consultas (pero hace más lentas las escrituras).

## 5. Git / control de versiones

| Quiero... | Comando |
|---|---|
| Copiar un repo remoto | `git clone` |
| Preparar cambios | `git add` |
| Confirmar cambios locales | `git commit` |
| Subir al remoto | `git push` |
| Traer y fusionar del remoto | `git pull` |
| Crear rama Y cambiarse a ella | `git checkout -b rama` (o `git switch -c`) |
| Fusionar una rama en la actual | `git merge rama` |
| Ver estado / historial | `git status` / `git log` |

- **Conflicto de merge:** dos ramas modificaron las mismas líneas → se resuelve **manualmente** y se hace commit.
- **Pull request / merge request:** solicitud de integrar cambios, revisada por el equipo (code review).

## 6. Calidad de código y pruebas del desarrollador

- **TDD:** ciclo **rojo → verde → refactor** (1º prueba que falla, 2º código mínimo que la pasa, 3º refactorizar).
- **Prueba unitaria:** valida una unidad aislada (función/método); usa **asserts**; los colaboradores externos se sustituyen con **mocks/stubs**.
- **Refactorizar:** mejorar estructura interna **sin cambiar el comportamiento externo**.
- **Code smell:** señal de mal diseño (métodos kilométricos, código duplicado, clases dios).
- **Deuda técnica:** costo futuro de soluciones rápidas/mal hechas hoy.
- **Excepciones:** `try` (código riesgoso) → `catch` (manejo) → `finally` (**se ejecuta SIEMPRE**; para liberar recursos). Lanzar excepción = `throw`.
- **Recursión:** necesita **caso base** (condición de paro) + llamada recursiva que se acerque a él. Sin caso base → **stack overflow**.

## 7. Estrategia para reactivos de código/pseudocódigo

1. **Traza en papel**: haz tabla de variables y actualízala iteración por iteración. No lo hagas "de ojo".
2. Cuidado con los **límites del ciclo**: "desde 1 hasta n" ¿incluye n? (en pseudocódigo CENEVAL, sí suele incluirlo).
3. `mod` = residuo. `x mod 2 == 0` → par. `mod 10` → último dígito. `div/entre 10` → quita el último dígito.
4. En recursión, expande las llamadas como pila: f(3) → 3·f(2) → 3·2·f(1)...
5. Si dos opciones son casi iguales, revisa **±1** en el ciclo (error clásico de límites).
6. No te cases con un reactivo de código: si llevas 3+ min, márcalo con ⚑ y sigue.

---

## 🃏 Tarjetas de memorización (Área 3)

```
P: Pila vs cola
R: Pila = LIFO (último en entrar, primero en salir). Cola = FIFO (primero en entrar, primero en salir).

P: Estructura para "deshacer" (undo)
R: Pila.

P: Estructura para búsqueda por clave en O(1)
R: Tabla hash / diccionario.

P: Complejidad de la búsqueda binaria y su requisito
R: O(log n); el arreglo debe estar ORDENADO.

P: Complejidad de dos ciclos anidados sobre n
R: O(n²).

P: Complejidad de merge sort / quicksort promedio
R: O(n log n).

P: 4 pilares de la POO
R: Encapsulamiento, herencia, polimorfismo y abstracción.

P: Sobrecarga vs sobrescritura
R: Sobrecarga = mismo nombre, distintos parámetros (misma clase). Sobrescritura = la subclase redefine el método heredado.

P: Mismo mensaje, distinto comportamiento según la clase
R: Polimorfismo.

P: Atributos privados + getters/setters
R: Encapsulamiento.

P: Clase abstracta vs interfaz
R: Abstracta: no se instancia, puede tener implementación parcial. Interfaz: puro contrato; se pueden implementar varias.

P: JOIN que devuelve solo coincidencias de ambas tablas
R: INNER JOIN.

P: "Clientes SIN pedidos" en SQL
R: LEFT JOIN + WHERE columna_derecha IS NULL.

P: WHERE vs HAVING
R: WHERE filtra filas antes de agrupar; HAVING filtra grupos después de agregar.

P: ¿Qué sentencias son DDL?
R: CREATE, ALTER, DROP, TRUNCATE (definen estructura).

P: ¿Qué sentencias son DML?
R: SELECT, INSERT, UPDATE, DELETE (manipulan datos).

P: ¿Qué significa ACID?
R: Atomicidad, Consistencia, Aislamiento, Durabilidad.

P: Llave foránea → ¿qué garantiza?
R: Integridad referencial (referencia a la llave primaria de otra tabla).

P: Comando git para crear rama y cambiarse en un paso
R: git checkout -b rama (o git switch -c).

P: git pull equivale a...
R: git fetch + git merge (traer del remoto y fusionar).

P: Ciclo de TDD
R: Rojo (prueba que falla) → Verde (código mínimo que pasa) → Refactor.

P: ¿Qué es refactorizar?
R: Mejorar la estructura interna del código SIN cambiar su comportamiento externo.

P: Bloque finally
R: Se ejecuta siempre, haya o no excepción; se usa para liberar recursos.

P: ¿Qué necesita toda recursión?
R: Caso base (paro) + llamada que se acerque a él; sin caso base → stack overflow.

P: ¿Qué es un mock/stub?
R: Objeto falso que sustituye una dependencia real en pruebas unitarias.

P: x mod 2 == 0 significa...
R: x es par (mod = residuo de la división).
```
