## Prompt 1

**Modelo:** Opus 5  
**Herramienta:** Claude Code

**Tiempo: 3m 21s**

```
vamos a crear una spec del proyecto actual en la siguiente ruta @docs/spec-viva/afm.md.Crearemos cada capability encontrada con un formato específico dentro de este fichero. Arriba un ##Purpose con una o dos frase para describir esta capability.
Debajo ##Requirements y colgando de él ###Requierement: en los que el sistema debe (SHALL) hacer algo.
Bajo cada requisito ponemos al menos un #### Scenario: con dos secciones WHEN y THEN. 
Todo en castellano salvo las mayúsculas de la RFC. Nada de ADDED, REMOVED o MODIFIED ya que esto es un estudio del proyecto. Solo se debe estudiar el comportamiento observable, es decir, sin nombre de clases, rutas y/o nombre de ficheros.No tocar el código, ni arreglar fixes al elaborar esta spec.
```

**Qué salió:** creó la spec correctament con el formato especificado y cumpliendo los requisitos a la primera.