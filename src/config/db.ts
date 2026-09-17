import mongoose from 'mongoose';

// ============================================================
// CONEXIÓN A LA BASE DE DATOS
// ============================================================
// Aislamos la conexión en su propio módulo porque es la parte
// más "impura" de toda la aplicación (toca el mundo exterior:
// abre un socket de red hacia MongoDB). Mantenerla separada de
// los modelos y de la lógica de negocio permite que el resto del
// código razone solo en términos de datos y funciones, sin
// preocuparse de cómo ni cuándo se abre la conexión.
// ============================================================

const DEFAULT_URI = 'mongodb://127.0.0.1:27017/ea_mongoose';

export const connectDatabase = (uri: string = DEFAULT_URI): Promise<typeof mongoose> =>
  mongoose.connect(uri);

export const disconnectDatabase = (): Promise<void> => mongoose.disconnect();
