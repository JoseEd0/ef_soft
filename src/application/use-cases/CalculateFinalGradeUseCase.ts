import { StudentRepository } from '../ports/StudentRepository';

/**
 * DTO para la solicitud de cálculo de nota final
 */
export interface CalculateFinalGradeRequest {
  studentId: string;
}

/**
 * DTO para la respuesta del caso de uso
 */
export interface CalculateFinalGradeResponse {
  success: boolean;
  message: string;
  studentId: string;
  finalGrade: number;
  calculationTimeMs: number;
}

/**
 * RF04: Caso de uso para calcular la nota final de un estudiante
 * Como docente podré calcular la nota final de un estudiante,
 * considerando evaluaciones, asistencia mínima y políticas de puntos extra
 * 
 * RNF04: El cálculo debe completarse en menos de 300ms
 */
export class CalculateFinalGradeUseCase {
  constructor(private readonly studentRepository: StudentRepository) {}

  /**
   * Ejecuta el caso de uso de cálculo de nota final
   */
  public async execute(request: CalculateFinalGradeRequest): Promise<CalculateFinalGradeResponse> {
    const { studentId } = request;

    // RNF04: Medir tiempo de cálculo
    const startTime = Date.now();

    // Buscar el estudiante
    const student = await this.studentRepository.findById(studentId);

    if (!student) {
      throw new Error(`Student with ID ${studentId} not found`);
    }

    // Calcular la nota final (puede lanzar excepciones de validación)
    const finalGrade = student.calculateFinalGrade();

    const endTime = Date.now();
    const calculationTimeMs = endTime - startTime;

    return {
      success: true,
      message: 'Final grade calculated successfully',
      studentId: student.getStudentId().getValue(),
      finalGrade,
      calculationTimeMs,
    };
  }
}
