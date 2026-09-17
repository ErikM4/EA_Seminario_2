// ============================================================
// Utilidades de Programación Funcional
// ============================================================
// pipeAsync permite construir un flujo de trabajo como una
// COMPOSICIÓN de funciones puras (o casi puras) en vez de una
// secuencia imperativa de instrucciones sueltas.
//
// pipeAsync(a, b, c)(x)  equivale a  c(await b(await a(x)))
//
// Cada "paso" recibe el resultado del anterior y devuelve un
// resultado nuevo: nunca se muta el valor de entrada. Esto hace
// que el orden de ejecución sea explícito y que cada paso se
// pueda leer, probar y reordenar de forma independiente.
// ============================================================

type AsyncStep<T> = (value: T) => Promise<T>;

export const pipeAsync = <T>(...steps: ReadonlyArray<AsyncStep<T>>) => (
  input: T
): Promise<T> =>
  steps.reduce<Promise<T>>((acc, step) => acc.then(step), Promise.resolve(input));
