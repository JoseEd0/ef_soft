import { Student } from '../../domain/entities/Student';
import { StudentRepository } from '../ports/StudentRepository';

/**
 * DTO para la solicitud de actualización de política de puntos extra
 */
export interface UpdateExtraPointsPolicyRequest {
  studentId: string;
  allYearsTeachers: boolean;
}

/**
 * DTO para la respuesta del caso de uso
 */
export interface UpdateExtraPointsPolicyResponse {
  success: boolean;
  message: string;
  studentId: string;
  allYearsTeachers: boolean;
}

/**
 * RF03: Caso de uso para registrar la política de puntos extra
 * Como docente podré registrar para el curso académico, si los docentes del curso
 * están de acuerdo en otorgar puntos extra a los estudiantes que cumplen ciertos criterios
 */
export class UpdateExtraPointsPolicyUseCase {
  constructor(private readonly studentRepository: StudentRepository) {}

  /**
   * Ejecuta el caso de uso de actualización de política de puntos extra
   */
  public async execute(
    request: UpdateExtraPointsPolicyRequest
  ): Promise<UpdateExtraPointsPolicyResponse> {
    const { studentId, allYearsTeachers } = request;

    // Buscar el estudiante
    const existingStudent = await this.studentRepository.findById(studentId);

    let student: Student;
    if (existingStudent) {
      // Actualizar la política de puntos extra
      existingStudent.updateExtraPointsPolicy(allYearsTeachers);
      student = existingStudent;
    } else {
      // Si no existe, crear uno nuevo
      student = Student.create(studentId, false, allYearsTeachers);
    }

    // Persistir los cambios
    await this.studentRepository.save(student);

    return {
      success: true,
      message: 'Extra points policy updated successfully',
      studentId: student.getStudentId().getValue(),
      allYearsTeachers: student.getExtraPointsPolicy().getValue(),
    };
  }
}
