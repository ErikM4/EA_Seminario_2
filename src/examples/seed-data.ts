import type { Types } from 'mongoose';

// ============================================================
// DATOS DE PRUEBA (seed)
// ============================================================
// Datos puros, sin lógica: se comparten entre los 3 ejemplos
// para que la única diferencia real entre ellos sea el ESTILO
// asíncrono usado (async/await simple, Promesas encadenadas o
// async/await + composición), no los datos ni las operaciones.
// ============================================================

export const organizationsSeed = [
  { name: 'Initech', country: 'USA' },
  { name: 'Umbrella Corp', country: 'UK' }
] as const;

type OrgWithId = { _id: Types.ObjectId; name: string };

/**
 * Función PURA: a partir de las organizaciones ya insertadas (con
 * su _id real asignado por MongoDB), construye la lista de
 * usuarios a sembrar. No accede a la base de datos, no imprime
 * nada ni depende de nada externo: mismos argumentos, mismo
 * resultado, siempre.
 */
export const buildUsersSeed = (organizations: ReadonlyArray<OrgWithId>) => {
  const idOf = (name: string): Types.ObjectId => {
    const found = organizations.find((org) => org.name === name);
    if (!found) {
      throw new Error(`Seed inválido: no existe la organización "${name}"`);
    }
    return found._id;
  };

  return [
    { name: 'Bill', email: 'bill@initech.com', role: 'ADMIN' as const, organization: idOf('Initech') },
    { name: 'Peter', email: 'peter@initech.com', role: 'USER' as const, organization: idOf('Initech') },
    { name: 'Alice', email: 'alice@umbrella.com', role: 'EDITOR' as const, organization: idOf('Umbrella Corp') }
  ];
};
