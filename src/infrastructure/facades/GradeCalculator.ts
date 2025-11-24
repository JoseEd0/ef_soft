import { StudentRepository } from '../../application/ports/StudentRepository';
import { RegisterEvaluationUseCase } from '../../application/use-cases/RegisterEvaluationUseCase';
import { UpdateAttendanceUseCase } from '../../application/use-cases/UpdateAttendanceUseCase';
import { UpdateExtraPointsPolicyUseCase } from '../../application/use-cases/UpdateExtraPointsPolicyUseCase';
import { CalculateFinalGradeUseCase } from '../../application/use-cases/CalculateFinalGradeUseCase';
import { GetCalculationDetailUseCase } from '../../application/use-cases/GetCalculationDetailUseCase';

/**
 * Fachada del sistema CS-GradeCalculator
 * Proporciona una interfaz simplificada para interactuar con todos los casos de uso
 */
export class GradeCalculator {
  private readonly registerEvaluationUseCase: RegisterEvaluationUseCase;
  private readonly updateAttendanceUseCase: UpdateAttendanceUseCase;
  private readonly updateExtraPointsPolicyUseCase: UpdateExtraPointsPolicyUseCase;
  private readonly calculateFinalGradeUseCase: CalculateFinalGradeUseCase;
  private readonly getCalculationDetailUseCase: GetCalculationDetailUseCase;

  constructor(studentRepository: StudentRepository) {
    this.registerEvaluationUseCase = new RegisterEvaluationUseCase(studentRepository);
    this.updateAttendanceUseCase = new UpdateAttendanceUseCase(studentRepository);
    this.updateExtraPointsPolicyUseCase = new UpdateExtraPointsPolicyUseCase(studentRepository);
    this.calculateFinalGradeUseCase = new CalculateFinalGradeUseCase(studentRepository);
    this.getCalculationDetailUseCase = new GetCalculationDetailUseCase(studentRepository);
  }

  /**
   * RF01: Registra una evaluación para un estudiante
   */
  public async registerEvaluation(
    studentId: string,
    grade: number,
    weightPercentage: number
  ): Promise<void> {
    await this.registerEvaluationUseCase.execute({
      studentId,
      grade,
      weightPercentage,
    });
  }

  /**
   * RF02: Actualiza la asistencia mínima de un estudiante
   */
  public async updateAttendance(
    studentId: string,
    hasReachedMinimumClasses: boolean
  ): Promise<void> {
    await this.updateAttendanceUseCase.execute({
      studentId,
      hasReachedMinimumClasses,
    });
  }

  /**
   * RF03: Actualiza la política de puntos extra
   */
  public async updateExtraPointsPolicy(
    studentId: string,
    allYearsTeachers: boolean
  ): Promise<void> {
    await this.updateExtraPointsPolicyUseCase.execute({
      studentId,
      allYearsTeachers,
    });
  }

  /**
   * RF04: Calcula la nota final de un estudiante
   */
  public async calculateFinalGrade(studentId: string): Promise<number> {
    const response = await this.calculateFinalGradeUseCase.execute({ studentId });
    return response.finalGrade;
  }

  /**
   * RF05: Obtiene el detalle completo del cálculo de nota final
   */
  public async getCalculationDetail(studentId: string): Promise<{
    studentId: string;
    evaluations: Array<{
      evaluationNumber: number;
      grade: number;
      weight: number;
      contribution: number;
    }>;
    baseGrade: number;
    hasReachedMinimumClasses: boolean;
    allYearsTeachers: boolean;
    canReceiveExtraPoints: boolean;
    finalGrade: number;
  }> {
    const response = await this.getCalculationDetailUseCase.execute({ studentId });
    return response.detail;
  }
}
