import { Types } from 'mongoose';
import { ProjectModel, Project, ProjectDocument } from '../models/project.model.js';

// Create
export const createProject = async (data: Project): Promise<ProjectDocument> => {
  const newProject = new ProjectModel(data);
  return newProject.save();
};

// GetById
export const getProjectById = async (
  id: string | Types.ObjectId
): Promise<ProjectDocument | null> => ProjectModel.findById(id).populate('creator');

// Update
export const updateProject = async (
  id: string | Types.ObjectId,
  data: Partial<Project>
): Promise<ProjectDocument | null> => ProjectModel.findByIdAndUpdate(id, data, { new: true });

// Delete
export const deleteProject = async (
  id: string | Types.ObjectId
): Promise<ProjectDocument | null> => ProjectModel.findByIdAndDelete(id);

// Delete All
export const deleteAllProjects = async (): Promise<number> => {
  const { deletedCount } = await ProjectModel.deleteMany({});
  return deletedCount ?? 0;
};

// ListAll
export const listAllProjects = async (): Promise<(Project & { _id: Types.ObjectId })[]> => 
  ProjectModel.find().lean();