# Prompts

---

## Prompt 1

**Modelo:** Opus 5.5  
**Herramienta:** Claude Code

Tiempo: 4m 47s

```
Vamos a realizar una auditoria sobre las reglas del proceso definidas en el fichero CLAUDE.md y/o AGENTS.md bajo el titulo "Reglas de proceso" contra los 15 últimos commits del repo y el estado de los ficheros actuales del proyecto.
Para ello vamos a extraer las reglas del fichero anterior y crear una tabla en la que cada fila será una de dichas reglas resumida en una frase.
La tabla constará de 5 columnas :
   - "Qué pide la regla" : Resume el funcionamiento en una frase
   - "Qué revisó para comprobarla" : muestra el fichero o comando usado para esta comprobación
   - "Veredicto" : Solo tiene 3 valores posibles ("se cumple", "no se cumple", "no se puede comprobar con la información disponible")
   - "Evidencia" : Si se cumple, escríbela en una sola línea. Si no se cumple indica donde falla y si no se puede explicar, indica el motivo de la falta     de información.
   - "Que hacer con ella": Dada esta regla, elige una opción entre dejarla como está, borrarla o convertirla en una comprobación automática.
La tabla generada debes guardarla en @docs/auditoria/afm.md debajo la sección "Pre auditoría de las reglas de proceso" que es una sección creada y pensada para comparar con la auditoría que vas a crear bajo la sección "Auditoría de las reglas de proceso".
Recuerda que esto es una auditoría por tanto no se debe tocar, corregir, actualizar y/o eliminar ningún fichero.
```



**Qué salió:** (opcional, una línea) funcionó a la primera. Creó la tabla con las columnas correctas y lo que se pedía en cada caso.



## Prompt 2

**Modelo:** Sonnet  
**Herramienta:** Claude Code

Tiempo: 1m 38s

```
Debajo del fichero creado en  @docs/auditoria/afm.md añade estas tres líneas teniendo en cuenta mi sección de "Pre auditoría  de las reglas de proceso" y la sección de "Auditoría de las reglas de proceso" para responderlas.
  - La regla en la que más te equivocaste. Compara espectativa inicial con el veredicto de la auditoría.
  - Una regla que no se puede comprobar con la información disponible. Formula que habría que hacer para poder comprobarla, puede ser reformularla, convertirla en automática o aceptar que no deja evidencia clara.
  - La regla que eliminarías y el motivo. Puede ser por dos causas, una en el que la regla ya está garantizada por otra herramienta o una que nadie sigue y no aporta valor alguno. Elige uno de los casos y explícalo.
```



**Qué salió:** (opcional, una línea) funcionó a la primera. Y añadí algunas impresiones personales tras el trabajo del agente.