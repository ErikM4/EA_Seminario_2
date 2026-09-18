/**
 * ============================================================
 * EJEMPLO 3 — VERSIÓN ASYNC/AWAIT (idiomática y funcional)
 * ============================================================
 * Versión recomendada: async/await para la legibilidad,
 * try/catch/finally para el manejo de errores, y una "receta" de
 * PASOS PUROS encadenados a mano en `main()`.
 *
 * Cada paso es una función pura en su firma: recibe un estado y
 * devuelve un estado NUEVO (nunca muta el que recibe). Llamarlos
 * directamente con `await`, uno detrás de otro, es preferible a
 * envolverlos en una utilidad de composición genérica (pipeAsync):
 * el flujo es igual de legible pero cada paso queda a un solo
 * `await` de distancia de sus vecinos, sin indirección extra ni
 * necesidad de saber cómo funciona el "pipe" por debajo.
 *
 * Ejecutar:  npm run example:async
 * ============================================================
 */
import { connectDatabase, disconnectDatabase } from '../config/db.js';
import { deleteAllOrganizations, seedOrganizations } from '../services/organization.service.js';
import {
  aggregateUsersByOrganization,
  deleteAllUsers,
  findUserByName,
  findUserSummaryByName,
  findUserWithOrganization,
  seedUsers
} from '../services/user.service.js';
import { buildUsersSeed, organizationsSeed } from './seed-data.js';

// Estado que fluye por la receta. Es de solo lectura (readonly):
// ningún paso puede mutarlo, solo puede devolver uno nuevo.
interface DemoState {
  readonly organizationsCount: number;
  readonly usersCount: number;
}

const initialState: DemoState = { organizationsCount: 0, usersCount: 0 };

const cleanDatabase = async (state: DemoState): Promise<DemoState> => {
  await Promise.all([deleteAllUsers(), deleteAllOrganizations()]);
  console.log('Base de datos limpiada');
  return state;
};

const seedDatabase = async (state: DemoState): Promise<DemoState> => {
  const organizations = await seedOrganizations(organizationsSeed);
  const users = await seedUsers(buildUsersSeed(organizations));
  console.log(`Insertadas ${organizations.length} organizaciones y ${users.length} usuarios`);
  // Spread: devolvemos un objeto NUEVO en vez de modificar "state".
  return { ...state, organizationsCount: organizations.length, usersCount: users.length };
};

const runCrudDemo = async (state: DemoState): Promise<DemoState> => {
  console.log('\n--- CRUD ---');
  const bill = await findUserByName('Bill');
  console.log('Usuario encontrado:', bill?.name, bill?.email);

  const billSummary = await findUserSummaryByName('Bill');
  console.log('Resumen (select + lean):', billSummary);
  return state;
};

const runPopulateDemo = async (state: DemoState): Promise<DemoState> => {
  console.log('\n--- POPULATE ---');
  const billWithOrg = await findUserWithOrganization('Bill');
  console.log('Usuario con organización:', billWithOrg);
  return state;
};

const runAggregationDemo = async (state: DemoState): Promise<DemoState> => {
  console.log('\n--- AGGREGATION PIPELINE ---');
  const stats = await aggregateUsersByOrganization();
  console.table(stats);
  return state;
};

const main = async (): Promise<void> => {
  try {
    await connectDatabase();
    console.log('Conectado a MongoDB');

    // Cada paso se llama directamente con `await`, encadenando el
    // estado a mano: mismo resultado que una composición genérica,
    // pero sin esconder el orden de ejecución detrás de una utilidad.
    let state = await cleanDatabase(initialState);
    state = await seedDatabase(state);
    state = await runCrudDemo(state);
    state = await runPopulateDemo(state);
    state = await runAggregationDemo(state);

    console.log(`\nResumen final: ${state.organizationsCount} organizaciones, ${state.usersCount} usuarios`);
  } catch (error) {
    console.error('Error en el ejemplo:', error);
  } finally {
    await disconnectDatabase();
    console.log('Desconectado de MongoDB');
  }
};

main();
