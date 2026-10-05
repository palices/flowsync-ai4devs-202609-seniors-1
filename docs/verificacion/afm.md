# Matriz de trazabilidad — tasks

Fuente: `openspec/specs/tasks/spec.md`. Tests en `backend/tests/functional/tasks/`.

## Requirement: Lo que cada tarea muestra de su responsable

Scenarios en el requisito 3 · Cubiertos: 3


| Escenario (esperado · situación actual)                                                                                                                                                                                              | Test                               | Estado   | Motivo |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------- | -------- | ------ |
| Responsable identificable: `assignee` trae nombre "Ada Lovelace" e iniciales "AL" · se cumple en tarea suelta y lista (verde)                                                                                                        | `assignee_identifiable.spec.ts`    | Cubierto |        |
| La tarea no filtra datos de cuenta: `assignee` sin email ni datos de acceso · solo `GET /tasks/:id` cumple; `GET /tasks` y `POST /tasks` exponen `email`, `createdAt`, `updatedAt` vía `UserTransformer` en `TaskTransformer` (rojo) | `assignee_no_account_data.spec.ts` | Cubierto |        |
| Responsable sin nombre: `fullName` nulo e iniciales presentes · se cumple, `fullName: null`, `initials: "AE"` en suelta y lista (verde)                                                                                              | `assignee_without_name.spec.ts`    | Cubierto |        |


## Parte B

### 1. Escenarios que se creían cubiertos vs. los que realmente lo estaban

- Se creía: 3 de 3. Existe `TaskAssigneeTransformer`, dedicado a que el responsable salga solo con nombre e iniciales, y su comentario dice «Nada más». El código da a entender que el requisito está resuelto.
- Realmente: 0 de 3. La capability `tasks` no tenía ningún test.
- Tras crear los tests: 3 de 3 cubiertos, pero solo 2 de 3 se cumplen. `TaskAssigneeTransformer` solo lo usa `GET /tasks/:id`. La lista y el alta siguen con `UserTransformer`, que expone el email. El transformer dedicado daba una falsa sensación de cumplimiento.

### 2. Escenario donde no se sabía si faltaba un test o una regla en la spec

Sí: «La tarea no filtra datos de cuenta».

- **Qué datos se permiten:** el requisito dice que solo se muestran nombre e iniciales y ningún otro dato de la cuenta. Sin embargo, la API devuelve también el `id` del responsable, y ni el escenario ni el requisito dicen si eso está permitido. El test lo acepta (`id`, `fullName`, `initials`). Si la regla es literal, el `id` incumple la spec. Si no lo es, a la spec le falta permitirlo de forma explícita.
- **Qué es un «dato de acceso»:** el escenario no lo define. ¿Cuentan las fechas de la cuenta (`createdAt`, `updatedAt`)? El test las trata como prohibidas porque el requisito habla de «ningún otro dato».
- **Qué respuestas cubre:** el escenario dice «suelta o dentro de la lista», pero no menciona la respuesta de `POST /tasks`, que también devuelve la tarea. Por coherencia con el requisito, que habla de «cada tarea», se incluyó en el test. Es justo donde falla.

### 3. Lo que el escenario no definía y se decidió al escribir el test

**Las iniciales del responsable sin nombre** (`assignee_without_name.spec.ts`).

- **Valor:** el escenario solo dice que las iniciales «siguen llegando», sin decir de dónde salen. Se fijó el valor exacto `"AE"` para `ada@example.com`, que es lo que hace `User.initials`: primera letra de la parte local y primera letra del dominio. Efecto: esas iniciales revelan dos letras del email, algo que choca con el espíritu del escenario anterior. Se deja anotado.
- **Vacío:** `null` está probado. La cadena vacía `""` no lo está: `signupValidator` acepta `fullName` sin `trim()` ni `minLength()`. Con `""` las iniciales saldrían del email igual que con `null`, pero `fullName` llegaría como `""` y no como `null`, lo que contradice el «su nombre llega nulo» del escenario.
- **Mal formado:** un nombre con espacios al principio, por ejemplo `" Ada Lovelace"`, se parte con `split(' ')` y da una primera palabra vacía. Las iniciales salen como cadena vacía `""`, lo que incumple que «sus iniciales siguen llegando». No está probado.
- **Inyección:** `fullName` no tiene límite de longitud ni filtro de contenido. Un `<script>` llegaría tal cual dentro de `assignee.fullName`, y escaparlo queda en manos del frontend. Intentar saltarse la regla del responsable enviando `assigneeId` en `POST /tasks` lo cubre otro requisito («No se admite fijar responsable ni estado al crear»), fuera de esta matriz.

