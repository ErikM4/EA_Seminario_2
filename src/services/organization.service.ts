import { OrganizationModel, IOrganization } from '../models/organization.model.js';

// ============================================================
// REPOSITORIO de "Organization"
// ============================================================
// Un repositorio agrupa el acceso a una colección de MongoDB en
// funciones pequeñas y con un único propósito. Todas reciben lo
// que necesitan por parámetro (nunca leen variables globales) y
// devuelven una Promise: son fáciles de leer, de testear y de
// reutilizar desde cualquiera de los 3 ejemplos de esta carpeta.
// ============================================================

type NewOrganization = Pick<IOrganization, 'name' | 'country'>;

export const seedOrganizations = (organizations: ReadonlyArray<NewOrganization>) =>
  OrganizationModel.insertMany(organizations);

export const deleteAllOrganizations = async (): Promise<number> => {
  const { deletedCount } = await OrganizationModel.deleteMany({});
  return deletedCount ?? 0;
};

export const findOrganizationById = (id: unknown) => OrganizationModel.findById(id).lean();
