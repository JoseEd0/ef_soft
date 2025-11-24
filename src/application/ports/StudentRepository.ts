import { Student } from '../../domain/entities/Student';

/**
 * Repositorio para gestionar la persistencia de estudiantes
 * Puerto del patrón Hexagonal - define el contrato que deben cumplir los adaptadores
 */
export interface StudentRepository {
  /**
   * Busca un estudiante por su identificador
   * @returns Student si existe, null si no existe
   */
  findById(studentId: string): Promise<Student | null>;

  /**
   * Guarda o actualiza un estudiante
   */
  save(student: Student): Promise<void>;

  /**
   * Elimina un estudiante del repositorio
   */
  delete(studentId: string): Promise<void>;

  /**
   * Obtiene todos los estudiantes
   */
  findAll(): Promise<Student[]>;
}
