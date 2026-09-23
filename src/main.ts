import { connectDatabase, disconnectDatabase } from './config/db.js';
import { 
  createProject, 
  getProjectById, 
  updateProject, 
  deleteProject, 
  listAllProjects,
  deleteAllProjects 
} from './services/project.service.js';
import { findUserByName } from './services/user.service.js';

const run = async () => {
  try {
    await connectDatabase();
    console.log('Conectado a MongoDB'); 
    
    const creator1 = await findUserByName('Bill');
    const creator2 = await findUserByName('Peter');
    const creator3 = await findUserByName('Alice');

    if (!creator1) {
      throw new Error("No se ha encontrado el creador Bill");
    }
    if (!creator2) {
      throw new Error("No se ha encontrado el creador Peter");
    }
    if (!creator3) {
      throw new Error("No se ha encontrado el creador Alice");
    }



    console.log('\n--- 1. CREATE ---');

    const project1 = await createProject({
      name: 'Proyecto Arma X',
      status: 'active',
      creator: creator1._id
    });

    const project2 = await createProject({
      name: 'Proyecto salvación',
      status: 'active',
      creator: creator2._id
    });

    const project3 = await createProject({
      name: 'Operación bikini',
      status: 'active',
      creator: creator3._id
    });

    console.log('Proyectos creados:', project1, project2, project3);

    console.log('\n--- 2. GET BY ID ---');
    const ProjectByID = await getProjectById(project1._id);

    if (ProjectByID && ProjectByID.creator) {
      console.log(`Aquí tienes el proyecto "${ProjectByID.name}" creado por ${(ProjectByID.creator as any).name}:`, ProjectByID);
    }

    console.log('\n--- 3. UPDATE ---');
    const updatedProject = await updateProject(project1._id, { status: 'completed' });
    console.log(`Estado actualizado a: ${updatedProject?.status} para el proyecto: ${updatedProject?.name}`);

    console.log('\n--- 4. LIST ALL ---');
    const allProjects = await listAllProjects();
    console.log(`Hay un total de ${allProjects.length} proyectos:`, allProjects);

    console.log('\n--- 5. DELETE ---');
    await deleteProject(project1._id);
    console.log(`Proyecto "${project1.name}" eliminado correctamente.`);

    console.log('\n--- 6. DELETE ALL ---');
    const deletedCount = await deleteAllProjects();
    console.log(`Los ${deletedCount} proyectos restantes han sido eliminados.`);

  } catch (error) {
    console.error('\n Error de Mongoose:', error);
  } finally {
    await disconnectDatabase();
    console.log('\n Desconnecado de MongoDB');
  }
};

run();