import { Types } from 'mongoose';
import { OrganizationModel, IOrganization } from '../models/organization.model.js';

// ============================================================
// SERVICE de "Organization"
// ============================================================
// Un service agrupa el acceso a una colección de MongoDB en
// funciones pequeñas y con un único propósito. Todas reciben lo
// que necesitan por parámetro (nunca leen variables globales) y
// devuelven una Promise: son fáciles de leer, de testear y de
// reutilizar desde cualquiera de los 3 ejemplos de esta carpeta.
//
// Es la capa pensada para crecer hacia una API: el día de mañana,
// un controller (src/controllers/organization.controller.ts)
// llamaría a estas mismas funciones desde una route Express, sin
// tener que tocar nada de este archivo.
//
// Tipado estricto: cada función declara explícitamente su tipo de
// retorno (`Promise<...>`), derivado de `IOrganization`, en vez de
// dejar que TypeScript lo infiera de la llamada a Mongoose. Así la
// firma documenta el contrato por sí sola, sin tener que "seguir"
// la llamada hasta el modelo para saber qué devuelve.
// ============================================================

type NewOrganization = Pick<IOrganization, 'name' | 'country'>;

export const seedOrganizations = async (
  organizations: ReadonlyArray<NewOrganization>
): Promise<IOrganization[]> => OrganizationModel.insertMany(organizations);

export const deleteAllOrganizations = async (): Promise<number> => {
  const { deletedCount } = await OrganizationModel.deleteMany({});
  return deletedCount ?? 0;
};

export const findOrganizationById = async (
  id: Types.ObjectId | string
): Promise<IOrganization | null> => OrganizationModel.findById(id).lean();
