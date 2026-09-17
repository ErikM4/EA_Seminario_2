import { Types } from 'mongoose';
import { UserModel, UserSchemaType } from '../models/user.model.js';

// ============================================================
// REPOSITORIO de "User"
// ============================================================
// Igual que el de Organization: funciones pequeñas, sin estado
// propio, que envuelven las llamadas a Mongoose. Aquí viven
// también las demos de POPULATE (equivalente a un JOIN) y de
// AGGREGATION PIPELINE.
// ============================================================

type NewUser = Pick<UserSchemaType, 'name' | 'email' | 'role' | 'organization'>;

export const seedUsers = (users: ReadonlyArray<NewUser>) => UserModel.insertMany(users);

export const deleteAllUsers = async (): Promise<number> => {
  const { deletedCount } = await UserModel.deleteMany({});
  return deletedCount ?? 0;
};

// --- CRUD básico ---
export const findUserById = (id: Types.ObjectId | string) => UserModel.findById(id);

export const findUserByName = (name: string) => UserModel.findOne({ name });

// select(): pedimos solo los campos que nos interesan.
// lean(): devuelve un objeto JS plano en vez de un Documento de
// Mongoose. Es preferible cuando solo vamos a LEER datos, porque
// nos ahorramos el coste de construir un documento completo con
// todos sus métodos (.save(), getters, etc.).
export const findUserSummaryByName = (name: string) =>
  UserModel.findOne({ name }).select('name email').lean();

// --- POPULATE ---
// populate('organization') sustituye el ObjectId guardado en el
// campo "organization" por el documento completo al que apunta.
// Es el equivalente en Mongoose a un JOIN en SQL.
export const findUserWithOrganization = (name: string) =>
  UserModel.findOne({ name }).populate('organization').lean();

// --- AGGREGATION PIPELINE ---
// Igual que populate, pero a nivel de agregación: $lookup es el
// "JOIN" del pipeline. Aquí, además, agrupamos y contamos.
export const aggregateUsersByOrganization = () =>
  UserModel.aggregate([
    // 1. Filtramos: nos quedamos solo con roles "reales".
    { $match: { role: { $ne: 'GUEST' } } },
    // 2. Agrupamos por organización y contamos usuarios.
    { $group: { _id: '$organization', totalUsers: { $sum: 1 } } },
    // 3. $lookup = el JOIN del mundo de las agregaciones.
    {
      $lookup: {
        from: 'organizations', // nombre real de la colección en Mongo
        localField: '_id',
        foreignField: '_id',
        as: 'orgInfo'
      }
    },
    // 4. Proyectamos solo lo que queremos mostrar.
    {
      $project: {
        _id: 0,
        organizationName: { $arrayElemAt: ['$orgInfo.name', 0] },
        totalUsers: 1
      }
    }
  ]);
