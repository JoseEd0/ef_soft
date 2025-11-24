import {
  MIN_EVALUATION_WEIGHT_PERCENTAGE,
  MAX_EVALUATION_WEIGHT_PERCENTAGE,
} from '../constants/DomainConstants';
import { InvalidValueObjectException } from '../exceptions/DomainExceptions';

/**
 * Value Object que representa el porcentaje de peso de una evaluación
 * El peso debe estar en el rango [0, 100]
 */
export class WeightPercentage {
  private readonly value: number;

  private constructor(value: number) {
    this.value = value;
  }

  /**
   * Crea una instancia de WeightPercentage validando el rango permitido
   */
  public static create(value: number): WeightPercentage {
    if (!Number.isFinite(value)) {
      throw new InvalidValueObjectException('WeightPercentage', 'must be a finite number');
    }

    if (value < MIN_EVALUATION_WEIGHT_PERCENTAGE || value > MAX_EVALUATION_WEIGHT_PERCENTAGE) {
      throw new InvalidValueObjectException(
        'WeightPercentage',
        `must be between ${MIN_EVALUATION_WEIGHT_PERCENTAGE} and ${MAX_EVALUATION_WEIGHT_PERCENTAGE}`
      );
    }

    return new WeightPercentage(value);
  }

  /**
   * Obtiene el valor del porcentaje
   */
  public getValue(): number {
    return this.value;
  }

  /**
   * Convierte el porcentaje a factor decimal (para multiplicación)
   */
  public toDecimalFactor(): number {
    return this.value / MAX_EVALUATION_WEIGHT_PERCENTAGE;
  }

  /**
   * Compara dos porcentajes por igualdad
   */
  public equals(other: WeightPercentage): boolean {
    return this.value === other.value;
  }

  public toString(): string {
    return `${this.value}%`;
  }
}
