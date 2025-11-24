/**
 * Excepciones personalizadas del dominio
 */

/**
 * Clase base para todas las excepciones del dominio
 */
export abstract class DomainException extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

/**
 * Excepción lanzada cuando un valor de objeto no es válido
 */
export class InvalidValueObjectException extends DomainException {
  constructor(field: string, reason: string) {
    super(`Invalid ${field}: ${reason}`);
  }
}

/**
 * Excepción lanzada cuando se excede el límite de evaluaciones (RNF01)
 */
export class MaxEvaluationsExceededException extends DomainException {
  constructor(limit: number) {
    super(`Cannot exceed ${limit} evaluations per student`);
  }
}

/**
 * Excepción lanzada cuando la suma de pesos no es válida
 */
export class InvalidWeightSumException extends DomainException {
  constructor(currentSum: number, expectedSum: number) {
    super(`Weight sum is ${currentSum}%, expected ${expectedSum}%`);
  }
}

/**
 * Excepción lanzada cuando no hay evaluaciones registradas
 */
export class NoEvaluationsException extends DomainException {
  constructor() {
    super('Cannot calculate final grade without evaluations');
  }
}
