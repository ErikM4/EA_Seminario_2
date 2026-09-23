import { Schema, model, Types, HydratedDocument } from 'mongoose';

// 1. Interfície de dades d'entrada (sense _id obligatori)
export interface Project {
  name: string;
  status: 'active' | 'completed';
  creator: Types.ObjectId;
}

// 2. Tipus del document guardat (inclou _id generat per Mongoose)
export type ProjectDocument = HydratedDocument<Project>;

// 3. Esquema
const projectSchema = new Schema<Project>({
  name: { type: String, required: true },
  status: { type: String, enum: ['active', 'completed'], default: 'active' },
  creator: { type: Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

export const ProjectModel = model<Project>('Project', projectSchema);