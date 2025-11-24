import { Student } from '../../domain/entities/Student';
import { StudentRepository } from '../ports/StudentRepository';

/**
 * DTO para la solicitud de registro de evaluación
 */
export interface RegisterEvaluationRequest {
  studentId: string;
  grade: number;
  weightPercentage: number;
}

/**
 * DTO para la respuesta del caso de uso
 */
export interface RegisterEvaluationResponse {
  success: boolean;
  message: string;
  studentId: string;
  totalEvaluations: number;
}

/**
 * RF01: Caso de uso para registrar una evaluación de un estudiante
 * Como docente podré registrar las evaluaciones de un estudiante,
 * indicando para cada una la nota obtenida y su porcentaje de peso sobre la nota final
 */
export class RegisterEvaluationUseCase {
  constructor(private readonly studentRepository: StudentRepository) {}

  /**
   * Ejecuta el caso de uso de registro de evaluación
   */
  public async execute(request: RegisterEvaluationRequest): Promise<RegisterEvaluationResponse> {
    const { studentId, grade, weightPercentage } = request;

    // Buscar el estudiante en el repositorio
    const existingStudent = await this.studentRepository.findById(studentId);

    // Si no existe, crear uno nuevo con políticas por defecto
    const student = existingStudent ?? Student.create(studentId, false, false);

    // Registrar la evaluación (puede lanzar excepciones de validación)
    student.addEvaluation(grade, weightPercentage);

    // Persistir los cambios
    await this.studentRepository.save(student);

    return {
      success: true,
      message: 'Evaluation registered successfully',
      studentId: student.getStudentId().getValue(),
      totalEvaluations: student.getEvaluations().length,
    };
  }
}
