import { Schema, model, InferSchemaType, HydratedDocument } from 'mongoose';

// ============================================================
// MODELO "User" — FORMA MODERNA (Mongoose >= 6)
// ============================================================
// Pasos:
//   1. Definimos el Schema. Es la ÚNICA fuente de verdad.
//   2. Inferimos el tipo TypeScript a partir del propio Schema
//      con `InferSchemaType`. Ya no escribimos la interface a
//      mano: si mañana añades un campo al Schema, el tipo se
//      actualiza solo.
//   3. Exportamos el Model ya tipado. `HydratedDocument<T>` es el
//      tipo de un documento "vivo" (el que devuelven find/findOne
//      antes de aplicar .lean()): incluye los métodos de instancia
//      de Mongoose, como .save().
//
// Ventaja: una sola fuente de verdad -> imposible que el tipo y el
// Schema se desincronicen.
// Inconveniente: el tipo inferido es algo menos legible a simple
// vista que una interface escrita a mano (hay que fiarse del IDE).
// ============================================================

const userSchema = new Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  role: { type: String, enum: ['ADMIN', 'EDITOR', 'USER'] as const, default: 'USER' },
  organization: { type: Schema.Types.ObjectId, ref: 'Organization', required: true }
});

// Tipo "plano" inferido del Schema (sin métodos de instancia).
export type UserSchemaType = InferSchemaType<typeof userSchema>;

// Tipo de documento tal cual lo devuelve Mongoose (con métodos).
export type UserDocument = HydratedDocument<UserSchemaType>;

export const UserModel = model<UserSchemaType>('User', userSchema);
