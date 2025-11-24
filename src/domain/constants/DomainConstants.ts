/**
 * Constantes del dominio del sistema CS-GradeCalculator
 * Estas constantes están alineadas con los RNF del proyecto
 */

/**
 * RNF01: Cantidad máxima de evaluaciones por estudiante
 */
export const MAX_EVALUATIONS_PER_STUDENT = 10;

/**
 * RNF02: Cantidad máxima de usuarios concurrentes soportados
 */
export const MAX_CONCURRENT_USERS = 50;

/**
 * RNF04: Tiempo máximo de cálculo en milisegundos
 */
export const MAX_CALCULATION_TIME_MS = 300;

/**
 * Porcentaje mínimo válido para el peso de una evaluación
 */
export const MIN_EVALUATION_WEIGHT_PERCENTAGE = 0;

/**
 * Porcentaje máximo válido para el peso de una evaluación
 */
export const MAX_EVALUATION_WEIGHT_PERCENTAGE = 100;

/**
 * Nota mínima válida en el sistema
 */
export const MIN_GRADE = 0;

/**
 * Nota máxima válida en el sistema
 */
export const MAX_GRADE = 20;

/**
 * Suma total de porcentajes que deben tener todas las evaluaciones
 */
export const TOTAL_WEIGHT_PERCENTAGE = 100;

/**
 * Precisión decimal para cálculos de notas
 */
export const GRADE_DECIMAL_PRECISION = 2;

/**
 * Tolerancia para comparación de suma de porcentajes
 */
export const WEIGHT_SUM_TOLERANCE = 0.01;

/**
 * Longitud mínima del ID de estudiante
 */
export const MIN_STUDENT_ID_LENGTH = 3;

/**
 * Longitud máxima del ID de estudiante
 */
export const MAX_STUDENT_ID_LENGTH = 50;

/**
 * Base decimal para conversiones numéricas
 */
export const DECIMAL_BASE = 10;
