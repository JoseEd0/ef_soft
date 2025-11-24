import { Student } from '../../domain/entities/Student';
import { StudentRepository } from '../../application/ports/StudentRepository';

/**
 * Implementación en memoria del repositorio de estudiantes
 * Adaptador del patrón Hexagonal - implementa el puerto StudentRepository
 * Útil para pruebas y desarrollo sin necesidad de base de datos real
 */
export class InMemoryStudentRepository implements StudentRepository {
  private readonly students: Map<string, Student>;

  constructor() {
    this.students = new Map();
  }

  /**
   * Busca un estudiante por su identificador
   */
  public async findById(studentId: string): Promise<Student | null> {
    const student = this.students.get(studentId);
    return student || null;
  }

  /**
   * Guarda o actualiza un estudiante
   */
  public async save(student: Student): Promise<void> {
    const studentId = student.getStudentId().getValue();
    this.students.set(studentId, student);
  }

  /**
   * Elimina un estudiante del repositorio
   */
  public async delete(studentId: string): Promise<void> {
    this.students.delete(studentId);
  }

  /**
   * Obtiene todos los estudiantes
   */
  public async findAll(): Promise<Student[]> {
    return Array.from(this.students.values());
  }

  /**
   * Limpia todos los estudiantes del repositorio (útil para pruebas)
   */
  public clear(): void {
    this.students.clear();
  }

  /**
   * Obtiene la cantidad de estudiantes almacenados
   */
  public count(): number {
    return this.students.size;
  }
}
