import { Schema, model, Types, HydratedDocument } from 'mongoose';

export interface Project {
  name: string;
  status: 'active' | 'completed';
  creator: Types.ObjectId;
}

export type ProjectDocument = HydratedDocument<Project>;

const projectSchema = new Schema<Project>({
  name: { type: String, required: true },
  status: { type: String, enum: ['active', 'completed'], default: 'active' },
  creator: { type: Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

export const ProjectModel = model<Project>('Project', projectSchema);