## Prompt 1

**Modelo:** Opus 5.5   
**Herramienta:** Claude Code

Tiempo : 6 mins

```
Vamos a crear una matriz de trazabilidad de este proyecto por escenarios y casos concretos definidos en el fichero de la ruta @flowsync-ai4devs-202609-seniors-1\openspec\specs\tasks\spec.md
De este fichero solamente vamos a trabajar el requisito "Lo que cada tarea muestra de su responsable" y debes ir escenario por escenario
verificando si el requisito está cubierto por los tests. 
El requisito debe mostrarse de cuantos escenarios se compone y cuantos tiene cubiertos, para ello vas a usar un formato tipo Scenarios en el requisito 'N' · Cubiertos:'x' donde 'x' se escribe al terminar de comprobar
El fichero que vas a usar para guardar esta matriz estará en @docs/verificacion/afm.md cuyo formato será una fila por escenario y cuatro columnas.
Cada fila debe describir el escenario indicando los siguientes puntos:
1. que se espera y la situacion actual. Debe caber en un linea
2. que test lo cubre unicamente con su nombre exacto de fichero (no linea vacia). Si es vacio no se pone
3. El estado actual de cobertura con estos 3 valores ("Cubierto","No cubierto","No lo sé")
4. Si el estado es "No lo sé", añadir el motivo de por qué falta. Es decir, si no está o si lo que se comprueba no es lo que se espera. Indaga en ello.
Por cada test que falte con estado "No cubierto", crea el test en backend/tests/functional/tasks/ siguiendo el estilo de los que existen actualmente en la carpeta backend/tests/functional/tasks/auth/, creando un test por escenario si fuera necesario bajo la premisa anterior.
```

**Qué salió:** (opcional, una línea) funcionó a la primera



## Prompt 2

**Modelo:** Opus 5.5   
**Herramienta:** Claude Code

Tiempo : 2 mins

```
Al final del fichero de @docs/verificacion/afm.md vamos a añadir estos tres puntos:
1. cuantos escenarios se creia que estaban vs a los que realmente estaban
2. indica si habia algún escenario que no se supiese si faltaba un test o una regla en el spec.
3. Algo que el escenario no definia y se tuvo que decidir al escribir el test. Algo especifico, un limite, un valor o un dato con sus casuisticas (si viene vacio, mal, o se intenta inyectar para saltar seguridad)
```

**Qué salió:** (opcional, una línea) funcionó a la primera
