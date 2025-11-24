import { Grade } from '../value-objects/Grade';
import { WeightPercentage } from '../value-objects/WeightPercentage';
import { InvalidValueObjectException } from '../exceptions/DomainExceptions';

/**
 * Entidad que representa una evaluación individual de un estudiante
 * Cada evaluación tiene una nota obtenida y un peso porcentual sobre la nota final
 */
export class Evaluation {
  private readonly grade: Grade;
  private readonly weightPercentage: WeightPercentage;

  private constructor(grade: Grade, weightPercentage: WeightPercentage) {
    this.grade = grade;
    this.weightPercentage = weightPercentage;
  }

  /**
   * Crea una nueva evaluación validando los datos
   */
  public static create(grade: number, weightPercentage: number): Evaluation {
    try {
      const gradeVO = Grade.create(grade);
      const weightVO = WeightPercentage.create(weightPercentage);
      return new Evaluation(gradeVO, weightVO);
    } catch (error) {
      if (error instanceof InvalidValueObjectException) {
        throw error;
      }
      throw new InvalidValueObjectException('Evaluation', 'invalid parameters');
    }
  }

  /**
   * Obtiene la nota de la evaluación
   */
  public getGrade(): Grade {
    return this.grade;
  }

  /**
   * Obtiene el peso porcentual de la evaluación
   */
  public getWeightPercentage(): WeightPercentage {
    return this.weightPercentage;
  }

  /**
   * Calcula la contribución de esta evaluación a la nota final
   * Fórmula: nota * (peso / 100)
   */
  public calculateWeightedContribution(): number {
    return this.grade.getValue() * this.weightPercentage.toDecimalFactor();
  }

  public toString(): string {
    return `Evaluation(grade=${this.grade.toString()}, weight=${this.weightPercentage.toString()})`;
  }
}
