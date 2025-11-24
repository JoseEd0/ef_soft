import { InvalidValueObjectException } from '../exceptions/DomainExceptions';
import {
  MIN_STUDENT_ID_LENGTH,
  MAX_STUDENT_ID_LENGTH,
} from '../constants/DomainConstants';

/**
 * Value Object que representa el identificador único de un estudiante
 */
export class StudentId {
  private readonly value: string;

  private constructor(value: string) {
    this.value = value;
  }

  /**
   * Crea una instancia de StudentId validando el formato
   */
  public static create(value: string): StudentId {
    if (!value || value.trim().length === 0) {
      throw new InvalidValueObjectException('StudentId', 'cannot be empty');
    }

    const trimmedValue = value.trim();

    if (trimmedValue.length < MIN_STUDENT_ID_LENGTH || trimmedValue.length > MAX_STUDENT_ID_LENGTH) {
      throw new InvalidValueObjectException('StudentId', `must be between ${MIN_STUDENT_ID_LENGTH} and ${MAX_STUDENT_ID_LENGTH} characters`);
    }

    return new StudentId(trimmedValue);
  }

  /**
   * Obtiene el valor del identificador
   */
  public getValue(): string {
    return this.value;
  }

  /**
   * Compara dos identificadores por igualdad
   */
  public equals(other: StudentId): boolean {
    return this.value === other.value;
  }

  public toString(): string {
    return this.value;
  }
}
