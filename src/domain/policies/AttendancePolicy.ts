/**
 * Política de asistencia mínima requerida por el reglamento académico de UTEC
 * Define si un estudiante ha alcanzado la cantidad mínima de clases requeridas
 */
export class AttendancePolicy {
  private readonly hasReachedMinimumClasses: boolean;

  private constructor(hasReachedMinimumClasses: boolean) {
    this.hasReachedMinimumClasses = hasReachedMinimumClasses;
  }

  /**
   * Crea una política de asistencia
   * @param hasReachedMinimumClasses - True si el estudiante cumplió con la asistencia mínima
   */
  public static create(hasReachedMinimumClasses: boolean): AttendancePolicy {
    return new AttendancePolicy(hasReachedMinimumClasses);
  }

  /**
   * Verifica si el estudiante cumple con la asistencia mínima requerida
   */
  public meetsMinimumRequirement(): boolean {
    return this.hasReachedMinimumClasses;
  }

  /**
   * Obtiene el valor booleano de la política
   */
  public getValue(): boolean {
    return this.hasReachedMinimumClasses;
  }

  public toString(): string {
    return `AttendancePolicy(hasReachedMinimumClasses=${this.hasReachedMinimumClasses})`;
  }
}
