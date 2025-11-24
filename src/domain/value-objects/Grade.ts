import {
  MIN_GRADE,
  MAX_GRADE,
  GRADE_DECIMAL_PRECISION,
  DECIMAL_BASE,
} from '../constants/DomainConstants';
import { InvalidValueObjectException } from '../exceptions/DomainExceptions';

/**
 * Value Object que representa una nota en el sistema
 * Las notas deben estar en el rango [0, 20]
 */
export class Grade {
  private readonly value: number;

  private constructor(value: number) {
    this.value = value;
  }

  /**
   * Crea una instancia de Grade validando el rango permitido
   */
  public static create(value: number): Grade {
    if (!Number.isFinite(value)) {
      throw new InvalidValueObjectException('Grade', 'must be a finite number');
    }

    if (value < MIN_GRADE || value > MAX_GRADE) {
      throw new InvalidValueObjectException(
        'Grade',
        `must be between ${MIN_GRADE} and ${MAX_GRADE}`
      );
    }

    return new Grade(value);
  }

  /**
   * Obtiene el valor de la nota
   */
  public getValue(): number {
    return this.value;
  }

  /**
   * Obtiene el valor redondeado según la precisión definida
   */
  public getRoundedValue(): number {
    const multiplier = Math.pow(DECIMAL_BASE, GRADE_DECIMAL_PRECISION);
    return Math.round(this.value * multiplier) / multiplier;
  }

  /**
   * Compara dos notas por igualdad
   */
  public equals(other: Grade): boolean {
    return this.value === other.value;
  }

  public toString(): string {
    return this.getRoundedValue().toFixed(GRADE_DECIMAL_PRECISION);
  }
}
