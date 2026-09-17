/**
 * ============================================================
 * EJEMPLO 3 — VERSIÓN ASYNC/AWAIT (idiomática y funcional)
 * ============================================================
 * Versión recomendada: async/await para la legibilidad,
 * try/catch/finally para el manejo de errores, y COMPOSICIÓN DE
 * FUNCIONES (pipeAsync) para expresar el demo como una tubería de
 * pasos en vez de una lista plana de instrucciones.
 *
 * Cada paso es una función pura en su firma: recibe un estado y
 * devuelve un estado NUEVO (nunca muta el que recibe), lo que
 * permite leer `runDemo` como una receta declarativa de arriba a
 * abajo.
 *
 * Ejecutar:  npm run example:async
 * ============================================================
 */
import { connectDatabase, disconnectDatabase } from '../config/db.js';
import { deleteAllOrganizations, seedOrganizations } from '../repositories/organization.repository.js';
import {
  aggregateUsersByOrganization,
  deleteAllUsers,
  findUserByName,
  findUserSummaryByName,
  findUserWithOrganization,
  seedUsers
} from '../repositories/user.repository.js';
import { buildUsersSeed, organizationsSeed } from './seed-data.js';
import { pipeAsync } from '../utils/functional.js';

// Estado que fluye por la tubería. Es de solo lectura (readonly):
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

// La "receta" completa, como composición de pasos.
const runDemo = pipeAsync(cleanDatabase, seedDatabase, runCrudDemo, runPopulateDemo, runAggregationDemo);

const main = async (): Promise<void> => {
  try {
    await connectDatabase();
    console.log('Conectado a MongoDB');

    const finalState = await runDemo(initialState);
    console.log(`\nResumen final: ${finalState.organizationsCount} organizaciones, ${finalState.usersCount} usuarios`);
  } catch (error) {
    console.error('Error en el ejemplo:', error);
  } finally {
    await disconnectDatabase();
    console.log('Desconectado de MongoDB');
  }
};

main();
