import User from '#models/user'
import Task from '#models/task'
import { test } from '@japa/runner'
import testUtils from '@adonisjs/core/services/test_utils'

/**
 * La tarea no filtra datos de cuenta. Cubre el scenario homónimo del requisito
 * «Lo que cada tarea muestra de su responsable» de `openspec/specs/tasks/spec.md`.
 *
 * Una tarea se lee por tres caminos (`GET /tasks/:id`, `GET /tasks` y la
 * respuesta de `POST /tasks`), y cada uno serializa con su propio transformer:
 * por eso se comprueba en los tres, no solo en uno.
 */
test.group('Tasks | la tarea no filtra datos de cuenta', (group) => {
  group.each.setup(() => testUtils.db().withGlobalTransaction())

  const today = '2026-10-05'

  async function sesion(client: any, fullName: string | null, email = 'ada@example.com') {
    const user = await User.create({ fullName, email, password: 'secreto123' })

    const response = await client.post('/api/v1/auth/login').json({ email, password: 'secreto123' })

    return { user, token: response.body().data.token as string }
  }

  test('una tarea suelta no expone el email ni datos de acceso de su responsable', async ({
    client,
    assert,
  }) => {
    const { user, token } = await sesion(client, 'Ada Lovelace')
    const task = await Task.create({
      title: 'Revisar el informe',
      status: 'pending',
      assigneeId: user.id,
    })

    const response = await client
      .get(`/api/v1/tasks/${task.id}`)
      .qs({ today })
      .header('Authorization', `Bearer ${token}`)

    response.assertStatus(200)
    // Lista cerrada y no solo «sin email»: cualquier dato que se cuele después
    // también es un dato de cuenta que la tarea no debe llevar.
    assert.sameMembers(Object.keys(response.body().data.assignee), ['id', 'fullName', 'initials'])
  })

  test('las tareas de la lista no exponen el email ni datos de acceso de su responsable', async ({
    client,
    assert,
  }) => {
    const { user, token } = await sesion(client, 'Ada Lovelace')
    await Task.create({ title: 'Revisar el informe', status: 'pending', assigneeId: user.id })

    const response = await client.get('/api/v1/tasks').header('Authorization', `Bearer ${token}`)

    response.assertStatus(200)

    const [tarea] = response.body().data as any[]
    assert.sameMembers(Object.keys(tarea.assignee), ['id', 'fullName', 'initials'])
  })

  test('la tarea recién creada no expone el email ni datos de acceso de su responsable', async ({
    client,
    assert,
  }) => {
    const { token } = await sesion(client, 'Ada Lovelace')

    const response = await client
      .post('/api/v1/tasks')
      .json({ title: 'Revisar el informe' })
      .header('Authorization', `Bearer ${token}`)

    response.assertStatus(201)
    assert.sameMembers(Object.keys((response.body().data as any).assignee), [
      'id',
      'fullName',
      'initials',
    ])
  })
})
