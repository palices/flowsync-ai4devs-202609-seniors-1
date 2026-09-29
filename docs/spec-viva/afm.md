# Spec viva — FlowSync

Estudio del comportamiento observable del sistema tal y como está hoy. Solo describe qué hace el sistema de cara a quien lo usa o lo consume, no cómo está construido.

---

# Capability: Registro de cuenta

## Purpose

Permite a una persona sin cuenta crear una en el sistema aportando un email y una contraseña, quedando autenticada de inmediato tras el alta.

## Requirements

### Requirement: Alta con credenciales válidas

El sistema SHALL crear una cuenta nueva cuando se aporten un email no registrado, una contraseña válida y su confirmación coincidente, y SHALL devolver los datos públicos de la cuenta junto con una credencial de acceso utilizable de inmediato.

#### Scenario: Alta correcta

- **WHEN** alguien solicita el alta con un email aún no registrado, una contraseña de entre 8 y 32 caracteres y una confirmación idéntica
- **THEN** el sistema crea la cuenta, devuelve sus datos públicos (identificador, nombre, email, iniciales y fechas de creación y actualización) junto con una credencial de acceso, y la persona queda con sesión iniciada sin necesidad de volver a autenticarse

#### Scenario: Alta sin nombre completo

- **WHEN** alguien solicita el alta dejando el nombre completo vacío
- **THEN** el sistema acepta el alta y la cuenta queda registrada sin nombre

### Requirement: Rechazo de emails ya registrados

El sistema SHALL rechazar un alta cuyo email ya pertenezca a otra cuenta y SHALL NOT crear una segunda cuenta con ese email.

#### Scenario: Email duplicado

- **WHEN** alguien solicita el alta con un email que ya tiene cuenta
- **THEN** el sistema rechaza la operación, no crea ninguna cuenta y comunica que ese email ya está registrado, invitando a iniciar sesión en su lugar

### Requirement: Validación de los datos de alta

El sistema SHALL rechazar el alta cuando el email no tenga formato válido o supere los 254 caracteres, cuando la contraseña no tenga entre 8 y 32 caracteres, o cuando la confirmación no coincida con la contraseña.

#### Scenario: Email con formato inválido

- **WHEN** alguien solicita el alta con un email mal formado
- **THEN** el sistema rechaza la operación y señala el campo del email indicando que la dirección no es válida

#### Scenario: Contraseña demasiado corta

- **WHEN** alguien solicita el alta con una contraseña de menos de 8 caracteres
- **THEN** el sistema rechaza la operación y señala el campo de la contraseña indicando la longitud mínima exigida

#### Scenario: Confirmación que no coincide

- **WHEN** alguien solicita el alta con una confirmación distinta de la contraseña
- **THEN** el sistema rechaza la operación y avisa de que las contraseñas no coinciden, sin llegar a crear la cuenta

### Requirement: Comprobación previa en pantalla

La pantalla de registro SHALL detectar en el propio navegador que la contraseña y su confirmación no coinciden y SHALL evitar el envío al servidor en ese caso, manteniendo la validación del servidor como la definitiva.

#### Scenario: Confirmación distinta detectada antes de enviar

- **WHEN** la persona envía el formulario de registro con contraseña y confirmación distintas
- **THEN** la pantalla muestra el aviso junto al campo de confirmación y no realiza ninguna llamada al servidor

---

# Capability: Inicio de sesión

## Purpose

Permite a una persona con cuenta existente autenticarse con su email y contraseña y obtener una credencial de acceso para operar como usuaria identificada.

## Requirements

### Requirement: Autenticación con credenciales correctas

El sistema SHALL autenticar a quien aporte el email y la contraseña de una cuenta existente, y SHALL devolver sus datos públicos junto con una credencial de acceso nueva.

#### Scenario: Credenciales válidas

- **WHEN** alguien inicia sesión con el email y la contraseña correctos de una cuenta existente
- **THEN** el sistema devuelve los datos públicos de la cuenta y una credencial de acceso, y la persona pasa a estar autenticada

#### Scenario: Varias sesiones simultáneas

- **WHEN** una misma cuenta inicia sesión de nuevo teniendo ya una sesión abierta
- **THEN** el sistema emite una credencial adicional y ambas sesiones siguen siendo válidas por separado

### Requirement: Rechazo de credenciales incorrectas

El sistema SHALL rechazar el inicio de sesión cuando el email no corresponda a ninguna cuenta o la contraseña no sea la de esa cuenta, y SHALL NOT revelar cuál de los dos datos es el erróneo.

#### Scenario: Contraseña incorrecta

- **WHEN** alguien inicia sesión con un email existente y una contraseña equivocada
- **THEN** el sistema rechaza el intento y comunica un único mensaje indicando que el email o la contraseña no son correctos

#### Scenario: Email no registrado

- **WHEN** alguien inicia sesión con un email que no tiene cuenta
- **THEN** el sistema rechaza el intento con el mismo mensaje genérico, sin indicar que la cuenta no existe

### Requirement: Validación del formato de entrada

El sistema SHALL rechazar el intento de inicio de sesión cuando el email no tenga formato válido o supere los 254 caracteres, sin llegar a comprobar la contraseña.

#### Scenario: Email mal formado

- **WHEN** alguien intenta iniciar sesión con un email mal formado
- **THEN** el sistema rechaza el intento señalando el campo del email, sin verificar credenciales

---

# Capability: Cierre de sesión

## Purpose

Permite a una persona autenticada terminar su sesión, invalidando la credencial con la que está operando sin afectar a sus otras sesiones abiertas.

## Requirements

### Requirement: Invalidación de la credencial en uso

El sistema SHALL invalidar la credencial con la que se solicita el cierre de sesión, de modo que deje de dar acceso a operaciones que requieran autenticación.

#### Scenario: Cierre de sesión con sesión activa

- **WHEN** una persona autenticada solicita cerrar sesión
- **THEN** el sistema confirma el cierre e invalida esa credencial

#### Scenario: Reutilización de la credencial cerrada

- **WHEN** se intenta consultar información protegida con una credencial ya cerrada
- **THEN** el sistema rechaza la petición por falta de autenticación

#### Scenario: Otras sesiones de la misma cuenta

- **WHEN** una cuenta con dos sesiones abiertas cierra una de ellas
- **THEN** la otra sesión sigue siendo válida y puede seguir operando

### Requirement: Cierre local incondicional

La aplicación SHALL dejar a la persona desconectada en su navegador aunque la invalidación en el servidor falle, descartando la credencial guardada localmente.

#### Scenario: Servidor no disponible al cerrar sesión

- **WHEN** la persona pulsa cerrar sesión y el servidor no responde o rechaza la petición
- **THEN** la aplicación descarta igualmente la credencial guardada y lleva a la persona a la pantalla de inicio de sesión

---

# Capability: Consulta del perfil propio

## Purpose

Permite a una persona autenticada recuperar y ver los datos públicos de su propia cuenta.

## Requirements

### Requirement: Datos del perfil para sesión válida

El sistema SHALL devolver, a quien presente una credencial válida, los datos públicos de la cuenta asociada a esa credencial: identificador, nombre completo, email, iniciales y fechas de creación y última actualización.

#### Scenario: Consulta con sesión válida

- **WHEN** una persona autenticada consulta su perfil
- **THEN** el sistema devuelve los datos públicos de su propia cuenta

### Requirement: No exposición de datos sensibles

El sistema SHALL NOT incluir la contraseña, ni ningún dato derivado de ella, en las respuestas que describen una cuenta.

#### Scenario: Respuesta de perfil o de autenticación

- **WHEN** el sistema devuelve los datos de una cuenta en cualquier operación (alta, inicio de sesión o consulta de perfil)
- **THEN** la respuesta contiene solo los datos públicos y nunca la contraseña ni su versión cifrada

### Requirement: Iniciales derivadas del nombre o del email

El sistema SHALL calcular unas iniciales en mayúsculas para cada cuenta, a partir del nombre completo cuando exista y del email en caso contrario.

#### Scenario: Cuenta con nombre y apellido

- **WHEN** la cuenta tiene un nombre completo con al menos dos palabras
- **THEN** las iniciales son la primera letra de las dos primeras palabras, en mayúsculas

#### Scenario: Cuenta sin nombre completo

- **WHEN** la cuenta no tiene nombre completo
- **THEN** las iniciales se derivan de las dos primeras letras de la parte local del email, en mayúsculas

### Requirement: Presentación del perfil

La pantalla de perfil SHALL mostrar las iniciales, el nombre, el email y la fecha de alta de la cuenta, con la fecha formateada en castellano, y SHALL indicar explícitamente cuando la cuenta no tiene nombre.

#### Scenario: Perfil de una cuenta sin nombre

- **WHEN** una persona sin nombre completo abre su perfil
- **THEN** la pantalla muestra un texto que indica la ausencia de nombre, junto con su email, sus iniciales y su fecha de alta en formato largo en castellano

---

# Capability: Protección de las operaciones y pantallas

## Purpose

Garantiza que solo quien presente una sesión válida acceda a la información y a las operaciones reservadas a personas autenticadas, y que la navegación lleve a cada persona a la pantalla que le corresponde según su estado de sesión.

## Requirements

### Requirement: Exigencia de credencial válida

El sistema SHALL rechazar toda petición a una operación protegida que no aporte una credencial válida, tanto si falta como si es inválida, está caducada o ha sido invalidada.

#### Scenario: Petición sin credencial

- **WHEN** se solicita una operación protegida sin aportar credencial
- **THEN** el sistema rechaza la petición por falta de autenticación y no ejecuta la operación

#### Scenario: Petición con credencial inválida

- **WHEN** se solicita una operación protegida con una credencial inexistente o manipulada
- **THEN** el sistema rechaza la petición por falta de autenticación

### Requirement: Aislamiento entre cuentas

El sistema SHALL resolver siempre la cuenta a partir de la credencial presentada, de modo que una sesión SHALL NOT poder leer ni operar sobre los datos de otra cuenta.

#### Scenario: Credencial de otra cuenta

- **WHEN** se consulta el perfil presentando la credencial de una cuenta distinta
- **THEN** el sistema devuelve los datos de la cuenta dueña de esa credencial y de ninguna otra

### Requirement: Acceso a pantallas privadas

La aplicación SHALL impedir el acceso a las pantallas privadas sin sesión, redirigiendo a la pantalla de inicio de sesión.

#### Scenario: Pantalla privada sin sesión

- **WHEN** alguien sin sesión intenta abrir una pantalla privada
- **THEN** la aplicación lo lleva a la pantalla de inicio de sesión, sustituyendo la entrada en el historial para que el botón atrás no devuelva a la pantalla privada

### Requirement: Pantallas públicas con sesión activa

La aplicación SHALL redirigir al perfil a quien, teniendo sesión activa, intente abrir las pantallas de inicio de sesión o de registro.

#### Scenario: Persona autenticada abre el inicio de sesión

- **WHEN** alguien con sesión activa abre la pantalla de inicio de sesión o la de registro
- **THEN** la aplicación lo redirige a su perfil

### Requirement: Destino por defecto

La aplicación SHALL dirigir al perfil cualquier dirección desconocida, aplicándose después las reglas de acceso según el estado de la sesión.

#### Scenario: Dirección inexistente

- **WHEN** alguien abre una dirección que no corresponde a ninguna pantalla
- **THEN** la aplicación lo lleva al perfil si tiene sesión, o a la pantalla de inicio de sesión si no la tiene

---

# Capability: Persistencia y rehidratación de la sesión

## Purpose

Mantiene la sesión abierta entre recargas y visitas del navegador, comprobando contra el servidor que la credencial guardada sigue siendo válida antes de dar la sesión por buena.

## Requirements

### Requirement: Conservación de la credencial

La aplicación SHALL guardar de forma persistente en el navegador la credencial obtenida al registrarse o iniciar sesión, y SHALL descartarla al cerrar sesión.

#### Scenario: Recarga de la página tras iniciar sesión

- **WHEN** una persona con sesión iniciada recarga la página o vuelve más tarde en el mismo navegador
- **THEN** la aplicación recupera la credencial guardada sin pedir de nuevo las credenciales

### Requirement: Validación de la credencial guardada al arrancar

La aplicación SHALL comprobar contra el servidor la credencial guardada antes de considerar la sesión activa, y SHALL NOT redirigir mientras esa comprobación esté en curso.

#### Scenario: Comprobación en curso

- **WHEN** la aplicación arranca con una credencial guardada y aún no ha recibido respuesta del servidor
- **THEN** muestra un indicador de carga a pantalla completa y no expulsa a la persona de la pantalla privada

#### Scenario: Credencial guardada todavía válida

- **WHEN** el servidor reconoce la credencial guardada
- **THEN** la sesión queda activa con los datos de perfil recibidos

### Requirement: Descarte de credenciales rechazadas

La aplicación SHALL descartar la credencial guardada cuando el servidor la rechace por no ser válida, dejando la sesión como anónima.

#### Scenario: Credencial caducada o invalidada

- **WHEN** el servidor rechaza por falta de autenticación la credencial guardada al arrancar
- **THEN** la aplicación la borra, deja la sesión como anónima y lleva a la pantalla de inicio de sesión

### Requirement: Conservación ante fallos ajenos a la credencial

La aplicación SHALL conservar la credencial guardada cuando el arranque falle por un problema de red o de servidor, para que un corte pasajero no cierre la sesión.

#### Scenario: Servidor caído al arrancar

- **WHEN** la aplicación arranca con una credencial guardada y no logra contactar con el servidor
- **THEN** trata la sesión como anónima en esta carga pero mantiene la credencial guardada, de modo que una recarga posterior con el servidor disponible restaure la sesión

### Requirement: Explicación de la sesión perdida

La aplicación SHALL explicar en la pantalla de inicio de sesión el motivo por el que una sesión previa dejó de estar activa.

#### Scenario: Llegada al inicio de sesión tras perder la sesión

- **WHEN** la persona acaba en la pantalla de inicio de sesión porque su sesión guardada no pudo restaurarse
- **THEN** la pantalla muestra un aviso con el motivo (sesión caducada o servidor no disponible), y ese aviso queda sustituido por el error del intento actual si el nuevo inicio de sesión también falla

---

# Capability: Comunicación de errores a quien usa la aplicación

## Purpose

Convierte cualquier fallo del servidor, de validación o de red en un mensaje comprensible en castellano, colocado donde corresponda: junto al campo culpable o como aviso general del formulario.

## Requirements

### Requirement: Mensajes en castellano y sin jerga técnica

La aplicación SHALL presentar todo error en castellano y en lenguaje comprensible, y SHALL NOT mostrar códigos de error, trazas ni identificadores internos.

#### Scenario: Error inesperado del servidor

- **WHEN** el servidor responde con un fallo no previsto
- **THEN** la aplicación muestra un aviso general indicando que algo ha ido mal y que se reintente en un momento

#### Scenario: Servidor inalcanzable

- **WHEN** no se puede contactar con el servidor
- **THEN** la aplicación avisa de que no se pudo conectar y sugiere comprobar que el servidor está arrancado

### Requirement: Errores de validación junto a su campo

La aplicación SHALL mostrar cada error de validación bajo el campo del formulario al que corresponde, asociándolo al campo también para lectores de pantalla.

#### Scenario: Varios campos inválidos

- **WHEN** el servidor rechaza el formulario señalando varios campos presentes en pantalla
- **THEN** cada campo muestra su propio mensaje y no se duplica ningún aviso general

#### Scenario: Error sobre un campo ausente de la pantalla

- **WHEN** el servidor señala un campo que el formulario en pantalla no muestra
- **THEN** la aplicación presenta ese mensaje como aviso general del formulario, para que nunca quede oculto

### Requirement: Estado de envío del formulario

La aplicación SHALL impedir envíos duplicados mientras una operación está en curso y SHALL indicar visualmente ese progreso, devolviendo el formulario a su estado normal cuando la operación termine, con éxito o con error.

#### Scenario: Envío en curso

- **WHEN** la persona envía un formulario de registro o de inicio de sesión
- **THEN** el botón de envío queda deshabilitado y su texto indica que la operación está en marcha

#### Scenario: Operación fallida

- **WHEN** la operación termina en error
- **THEN** el botón vuelve a estar disponible y los errores aparecen en su sitio, conservándose lo ya escrito en el formulario



## Parte B

1. ¿Cuántos requisitos escribió el agente y cuantos comprobados en el código?
   - Agente escribió 7 requisitos, en código yo veo 4
2. Las incoherencias que aparecieron al escribirla.
   - En las observables no se puede comprobar parte de la comprobación de errores, entre ellos :
     - Fallo de operación fallida
     - Error inesperado en el servidor por comunicación
     - Servicio inalcanzable
     - No cumple el tener 2 sesiones abiertas y cierras una, la otra cierra igualmente
3. Lo que no supiste decidir si era un bug o un contrato
   - Fallo con 2 sesiones activas. El sistema me cierra ambas cuando cierro una sola

