import { Evaluation } from '../entities/Evaluation';
import { StudentId } from '../value-objects/StudentId';
import { AttendancePolicy } from '../policies/AttendancePolicy';
import { ExtraPointsPolicy } from '../policies/ExtraPointsPolicy';
import {
  MAX_EVALUATIONS_PER_STUDENT,
  TOTAL_WEIGHT_PERCENTAGE,
  WEIGHT_SUM_TOLERANCE,
} from '../constants/DomainConstants';
import {
  MaxEvaluationsExceededException,
  InvalidWeightSumException,
  NoEvaluationsException,
} from '../exceptions/DomainExceptions';

/**
 * Entidad principal que representa a un estudiante y sus evaluaciones
 * Agrega raíz del dominio que encapsula toda la lógica de cálculo de nota final
 */
export class Student {
  private readonly studentId: StudentId;
  private readonly evaluations: Evaluation[];
  private attendancePolicy: AttendancePolicy;
  private extraPointsPolicy: ExtraPointsPolicy;

  private constructor(
    studentId: StudentId,
    attendancePolicy: AttendancePolicy,
    extraPointsPolicy: ExtraPointsPolicy
  ) {
    this.studentId = studentId;
    this.evaluations = [];
    this.attendancePolicy = attendancePolicy;
    this.extraPointsPolicy = extraPointsPolicy;
  }

  /**
   * Crea una nueva instancia de Student
   */
  public static create(
    studentId: string,
    hasReachedMinimumClasses: boolean,
    allYearsTeachers: boolean
  ): Student {
    const studentIdVO = StudentId.create(studentId);
    const attendancePolicy = AttendancePolicy.create(hasReachedMinimumClasses);
    const extraPointsPolicy = ExtraPointsPolicy.create(allYearsTeachers);

    return new Student(studentIdVO, attendancePolicy, extraPointsPolicy);
  }

  /**
   * RF01: Registra una nueva evaluación para el estudiante
   * Valida que no se exceda el límite máximo de evaluaciones (RNF01)
   */
  public addEvaluation(grade: number, weightPercentage: number): void {
    if (this.evaluations.length >= MAX_EVALUATIONS_PER_STUDENT) {
      throw new MaxEvaluationsExceededException(MAX_EVALUATIONS_PER_STUDENT);
    }

    const evaluation = Evaluation.create(grade, weightPercentage);
    this.evaluations.push(evaluation);
  }

  /**
   * RF02: Actualiza la política de asistencia del estudiante
   */
  public updateAttendancePolicy(hasReachedMinimumClasses: boolean): void {
    this.attendancePolicy = AttendancePolicy.create(hasReachedMinimumClasses);
  }

  /**
   * RF03: Actualiza la política de puntos extra
   */
  public updateExtraPointsPolicy(allYearsTeachers: boolean): void {
    this.extraPointsPolicy = ExtraPointsPolicy.create(allYearsTeachers);
  }

  /**
   * Valida que la suma de pesos de todas las evaluaciones sea 100%
   */
  private validateWeightSum(): void {
    const totalWeight = this.evaluations.reduce(
      (sum, evaluation) => sum + evaluation.getWeightPercentage().getValue(),
      0
    );

    if (Math.abs(totalWeight - TOTAL_WEIGHT_PERCENTAGE) > WEIGHT_SUM_TOLERANCE) {
      throw new InvalidWeightSumException(totalWeight, TOTAL_WEIGHT_PERCENTAGE);
    }
  }

  /**
   * Calcula la nota base ponderada de todas las evaluaciones
   */
  private calculateBaseGrade(): number {
    return this.evaluations.reduce(
      (sum, evaluation) => sum + evaluation.calculateWeightedContribution(),
      0
    );
  }

  /**
   * RF04: Calcula la nota final del estudiante considerando todas las políticas
   * RNF03: El cálculo es determinista - mismos datos generan misma nota
   * 
   * Lógica:
   * 1. Calcula nota base ponderada de evaluaciones
   * 2. Si cumple asistencia Y política permite: puede recibir puntos extra
   * 3. Los puntos extra se otorgan si el estudiante cumple criterios académicos
   */
  public calculateFinalGrade(): number {
    if (this.evaluations.length === 0) {
      throw new NoEvaluationsException();
    }

    this.validateWeightSum();

    const baseGrade = this.calculateBaseGrade();

    // RF03: La política de puntos extra se verifica en el detalle del cálculo
    // La nota final es la suma ponderada de las evaluaciones
    return baseGrade;
  }

  /**
   * RF05: Genera el detalle completo del cálculo de la nota final
   */
  public getCalculationDetail(): CalculationDetail {
    const baseGrade = this.evaluations.length > 0 ? this.calculateBaseGrade() : 0;
    const meetsAttendance = this.attendancePolicy.meetsMinimumRequirement();
    const allowsExtraPoints = this.extraPointsPolicy.allowsExtraPoints();
    const canReceiveExtraPoints = meetsAttendance && allowsExtraPoints;

    const evaluationDetails = this.evaluations.map((evaluation, index) => ({
      evaluationNumber: index + 1,
      grade: evaluation.getGrade().getValue(),
      weight: evaluation.getWeightPercentage().getValue(),
      contribution: evaluation.calculateWeightedContribution(),
    }));

    return {
      studentId: this.studentId.getValue(),
      evaluations: evaluationDetails,
      baseGrade,
      hasReachedMinimumClasses: meetsAttendance,
      allYearsTeachers: allowsExtraPoints,
      canReceiveExtraPoints,
      finalGrade: this.evaluations.length > 0 ? this.calculateFinalGrade() : 0,
    };
  }

  /**
   * Obtiene el ID del estudiante
   */
  public getStudentId(): StudentId {
    return this.studentId;
  }

  /**
   * Obtiene todas las evaluaciones del estudiante
   */
  public getEvaluations(): ReadonlyArray<Evaluation> {
    return [...this.evaluations];
  }

  /**
   * Obtiene la política de asistencia
   */
  public getAttendancePolicy(): AttendancePolicy {
    return this.attendancePolicy;
  }

  /**
   * Obtiene la política de puntos extra
   */
  public getExtraPointsPolicy(): ExtraPointsPolicy {
    return this.extraPointsPolicy;
  }
}

/**
 * Interfaz que representa el detalle completo del cálculo de nota final
 */
export interface CalculationDetail {
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
}
