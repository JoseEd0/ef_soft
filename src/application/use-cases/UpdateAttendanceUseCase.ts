import { Student } from '../../domain/entities/Student';
import { StudentRepository } from '../ports/StudentRepository';

/**
 * DTO para la solicitud de actualización de asistencia
 */
export interface UpdateAttendanceRequest {
  studentId: string;
  hasReachedMinimumClasses: boolean;
}

/**
 * DTO para la respuesta del caso de uso
 */
export interface UpdateAttendanceResponse {
  success: boolean;
  message: string;
  studentId: string;
  hasReachedMinimumClasses: boolean;
}

/**
 * RF02: Caso de uso para registrar si un estudiante cumplió la asistencia mínima
 * Como docente podré registrar si el estudiante cumplió la asistencia mínima
 * requerida por el reglamento académico de UTEC
 */
export class UpdateAttendanceUseCase {
  constructor(private readonly studentRepository: StudentRepository) {}

  /**
   * Ejecuta el caso de uso de actualización de asistencia
   */
  public async execute(request: UpdateAttendanceRequest): Promise<UpdateAttendanceResponse> {
    const { studentId, hasReachedMinimumClasses } = request;

    // Buscar el estudiante
    const existingStudent = await this.studentRepository.findById(studentId);

    let student: Student;
    if (existingStudent) {
      // Actualizar la política de asistencia
      existingStudent.updateAttendancePolicy(hasReachedMinimumClasses);
      student = existingStudent;
    } else {
      // Si no existe, crear uno nuevo
      student = Student.create(studentId, hasReachedMinimumClasses, false);
    }

    // Persistir los cambios
    await this.studentRepository.save(student);

    return {
      success: true,
      message: 'Attendance policy updated successfully',
      studentId: student.getStudentId().getValue(),
      hasReachedMinimumClasses: student.getAttendancePolicy().getValue(),
    };
  }
}
