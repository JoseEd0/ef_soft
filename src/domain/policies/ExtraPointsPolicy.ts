/**
 * Política de puntos extra basada en el acuerdo colectivo de profesores
 * Define si los docentes están de acuerdo en otorgar puntos extra a estudiantes
 * que cumplen ciertos criterios académicos
 */
export class ExtraPointsPolicy {
  private readonly allYearsTeachers: boolean;

  private constructor(allYearsTeachers: boolean) {
    this.allYearsTeachers = allYearsTeachers;
  }

  /**
   * Crea una política de puntos extra
   * @param allYearsTeachers - True si todos los docentes están de acuerdo en otorgar puntos extra
   */
  public static create(allYearsTeachers: boolean): ExtraPointsPolicy {
    return new ExtraPointsPolicy(allYearsTeachers);
  }

  /**
   * Verifica si la política permite otorgar puntos extra
   */
  public allowsExtraPoints(): boolean {
    return this.allYearsTeachers;
  }

  /**
   * Obtiene el valor booleano de la política
   */
  public getValue(): boolean {
    return this.allYearsTeachers;
  }

  public toString(): string {
    return `ExtraPointsPolicy(allYearsTeachers=${this.allYearsTeachers})`;
  }
}
