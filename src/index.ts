/**
 * Punto de entrada principal del sistema CS-GradeCalculator
 */

export { GradeCalculator } from './infrastructure/facades/GradeCalculator';
export { InMemoryStudentRepository } from './infrastructure/repositories/InMemoryStudentRepository';

// Exportar excepciones del dominio para manejo de errores
export {
  DomainException,
  InvalidValueObjectException,
  MaxEvaluationsExceededException,
  InvalidWeightSumException,
  NoEvaluationsException,
} from './domain/exceptions/DomainExceptions';

// Exportar constantes del dominio
export {
  MAX_EVALUATIONS_PER_STUDENT,
  MAX_CONCURRENT_USERS,
  MAX_CALCULATION_TIME_MS,
  MIN_GRADE,
  MAX_GRADE,
} from './domain/constants/DomainConstants';

// Exportar tipos útiles
export type { CalculationDetail } from './domain/entities/Student';
