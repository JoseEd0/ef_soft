import { StudentRepository } from '../ports/StudentRepository';
import { CalculationDetail } from '../../domain/entities/Student';

/**
 * DTO para la solicitud de visualización del detalle del cálculo
 */
export interface GetCalculationDetailRequest {
  studentId: string;
}

/**
 * DTO para la respuesta del caso de uso
 */
export interface GetCalculationDetailResponse {
  success: boolean;
  message: string;
  detail: CalculationDetail;
}

/**
 * RF05: Caso de uso para visualizar el detalle del cálculo de nota final
 * Como docente podré visualizar el detalle del cálculo: promedio ponderado,
 * penalización por inasistencias y puntos extra aplicados
 */
export class GetCalculationDetailUseCase {
  constructor(private readonly studentRepository: StudentRepository) {}

  /**
   * Ejecuta el caso de uso de obtención del detalle del cálculo
   */
  public async execute(
    request: GetCalculationDetailRequest
  ): Promise<GetCalculationDetailResponse> {
    const { studentId } = request;

    // Buscar el estudiante
    const student = await this.studentRepository.findById(studentId);

    if (!student) {
      throw new Error(`Student with ID ${studentId} not found`);
    }

    // Obtener el detalle completo del cálculo
    const detail = student.getCalculationDetail();

    return {
      success: true,
      message: 'Calculation detail retrieved successfully',
      detail,
    };
  }
}
