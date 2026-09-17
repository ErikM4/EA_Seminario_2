import { Schema, model, Types } from 'mongoose';

// ============================================================
// MODELO "Organization" — FORMA TRADICIONAL
// ============================================================
// Pasos (los que se han usado siempre con Mongoose + TypeScript):
//   1. Escribimos a mano una interface con la forma del documento.
//   2. Creamos el Schema indicándole esa interface como genérico,
//      para que TypeScript valide que el Schema es coherente con
//      ella (mismos campos, mismos tipos).
//   3. Creamos el Model a partir del Schema.
//
// Ventaja: muy explícito, fácil de leer para quien empieza.
// Inconveniente: hay DOS fuentes de verdad (la interface y el
// Schema). Si añades un campo al Schema y olvidas añadirlo a la
// interface (o al revés), TypeScript no te avisa del todo.
// ============================================================

export interface IOrganization {
  _id: Types.ObjectId;
  name: string;
  country: string;
}

const organizationSchema = new Schema<IOrganization>({
  name: { type: String, required: true, trim: true },
  country: { type: String, required: true, trim: true }
});

export const OrganizationModel = model<IOrganization>('Organization', organizationSchema);
