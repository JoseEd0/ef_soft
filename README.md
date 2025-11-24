# CS-GradeCalculator

Sistema de cálculo de notas finales para UTEC - CS3081

[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)](https://www.typescriptlang.org/)
[![Jest](https://img.shields.io/badge/Jest-29.7-red)](https://jestjs.io/)
[![License](https://img.shields.io/badge/License-MIT-green)](./LICENSE)

## 📋 Descripción del Proyecto

CS-GradeCalculator es un sistema modular y robusto diseñado para calcular las notas finales de estudiantes en base a:
- Evaluaciones ponderadas con pesos porcentuales
- Política de asistencia mínima requerida
- Política de puntos extra definida colectivamente por docentes

El sistema implementa una **Arquitectura Hexagonal (Ports & Adapters)** siguiendo principios **SOLID** y **DDD (Domain-Driven Design)** para garantizar mantenibilidad, testabilidad y escalabilidad.

## 🏗️ Arquitectura

```
src/
├── domain/                     # Capa de Dominio (lógica de negocio pura)
│   ├── constants/             
│   │   └── DomainConstants.ts # Constantes del dominio (sin valores mágicos)
│   ├── entities/              
│   │   ├── Evaluation.ts      # Entidad Evaluación
│   │   └── Student.ts         # Agregado Raíz - Estudiante
│   ├── exceptions/            
│   │   └── DomainExceptions.ts # Excepciones del dominio
│   ├── policies/              
│   │   ├── AttendancePolicy.ts    # Política de asistencia (RF02)
│   │   └── ExtraPointsPolicy.ts   # Política puntos extra (RF03)
│   └── value-objects/         
│       ├── Grade.ts           # Nota [0-20]
│       ├── StudentId.ts       # Identificador único
│       └── WeightPercentage.ts # Peso porcentual [0-100]
│
├── application/                # Capa de Aplicación (casos de uso)
│   ├── ports/                 
│   │   └── StudentRepository.ts # Puerto de repositorio
│   └── use-cases/             
│       ├── RegisterEvaluationUseCase.ts       # RF01
│       ├── UpdateAttendanceUseCase.ts         # RF02
│       ├── UpdateExtraPointsPolicyUseCase.ts  # RF03
│       ├── CalculateFinalGradeUseCase.ts      # RF04
│       └── GetCalculationDetailUseCase.ts     # RF05
│
├── infrastructure/             # Capa de Infraestructura (adaptadores)
│   ├── facades/               
│   │   └── GradeCalculator.ts # Fachada principal del sistema
│   └── repositories/          
│       └── InMemoryStudentRepository.ts # Implementación en memoria
│
└── __tests__/                  # Tests unitarios e integración
    ├── domain/                
    └── integration/           
```

## ✅ Requerimientos Funcionales (RF)

| ID | Descripción | Implementación |
|----|-------------|----------------|
| **RF01** | Registrar evaluaciones con nota y peso porcentual | `RegisterEvaluationUseCase` |
| **RF02** | Registrar asistencia mínima cumplida | `UpdateAttendanceUseCase` |
| **RF03** | Registrar política de puntos extra | `UpdateExtraPointsPolicyUseCase` |
| **RF04** | Calcular nota final del estudiante | `CalculateFinalGradeUseCase` |
| **RF05** | Visualizar detalle del cálculo | `GetCalculationDetailUseCase` |

## ⚡ Requerimientos No Funcionales (RNF)

| ID | Descripción | Cumplimiento |
|----|-------------|--------------|
| **RNF01** | Máximo 10 evaluaciones por estudiante | ✅ Validado en `Student.addEvaluation()` |
| **RNF02** | Soportar hasta 50 usuarios concurrentes | ✅ Arquitectura stateless preparada |
| **RNF03** | Cálculo determinista (mismos datos = misma nota) | ✅ Implementación funcional sin efectos secundarios |
| **RNF04** | Tiempo de cálculo < 300ms | ✅ Medido en `CalculateFinalGradeUseCase` |

## 🚀 Inicio Rápido

### Prerrequisitos

- Node.js >= 18.x
- npm >= 9.x

### Instalación

```bash
# Instalar dependencias
npm install

# Compilar TypeScript
npm run build

# Ejecutar tests
npm test

# Ejecutar tests con cobertura
npm run test -- --coverage

# Linter
npm run lint

# Formatear código
npm run format
```

## 💻 Uso del Sistema

### Ejemplo Básico

```typescript
import { GradeCalculator, InMemoryStudentRepository } from './src';

// Crear instancia del sistema
const repository = new InMemoryStudentRepository();
const calculator = new GradeCalculator(repository);

// RF01: Registrar evaluaciones
await calculator.registerEvaluation('U202012345', 16, 60);  // Nota: 16, Peso: 60%
await calculator.registerEvaluation('U202012345', 14, 40);  // Nota: 14, Peso: 40%

// RF02: Actualizar asistencia
await calculator.updateAttendance('U202012345', true);

// RF03: Actualizar política de puntos extra
await calculator.updateExtraPointsPolicy('U202012345', true);

// RF04: Calcular nota final
const finalGrade = await calculator.calculateFinalGrade('U202012345');
console.log(`Nota final: ${finalGrade}`);  // 15.2

// RF05: Obtener detalle del cálculo
const detail = await calculator.getCalculationDetail('U202012345');
console.log(detail);
```

### Ejemplo Detallado (Caso de Uso CU001)

```typescript
// Escenario: Docente registra evaluaciones
try {
  // Registrar examen parcial (40% de la nota)
  await calculator.registerEvaluation('U202012345', 17.5, 40);
  
  // Registrar proyecto final (60% de la nota)
  await calculator.registerEvaluation('U202012345', 18, 60);
  
  // Calcular nota final: (17.5 * 0.4) + (18 * 0.6) = 17.8
  const grade = await calculator.calculateFinalGrade('U202012345');
  console.log(`Nota final: ${grade}`);
  
} catch (error) {
  if (error instanceof MaxEvaluationsExceededException) {
    console.error('Se excedió el límite de evaluaciones');
  }
}
```

## 🧪 Testing

El proyecto cuenta con **cobertura superior al 60%** cumpliendo con los criterios de evaluación:

```bash
# Ejecutar todos los tests
npm test

# Tests con cobertura
npm run test -- --coverage

# Tests en modo watch
npm run test:watch
```

### Estructura de Tests

- **Tests Unitarios**: Validan Value Objects, Entities y Policies
- **Tests de Integración**: Validan casos de uso end-to-end
- **Casos Borde**: Validaciones de límites (0 evaluaciones, pesos inválidos, etc.)
- **Determinismo**: Tests que verifican RNF03

### Ejemplos de Tests

```typescript
// Test de caso normal
it('should calculate final grade with two evaluations', () => {
  const student = Student.create('U202012345', true, false);
  student.addEvaluation(16, 60);
  student.addEvaluation(14, 40);
  
  expect(student.calculateFinalGrade()).toBe(15.2);
});

// Test de caso sin asistencia mínima
it('should handle student without minimum attendance', () => {
  const student = Student.create('U202012345', false, true);
  // ... evaluaciones ...
  expect(student.getAttendancePolicy().meetsMinimumRequirement()).toBe(false);
});

// Test de límites (0 evaluaciones)
it('should throw exception when no evaluations', () => {
  const student = Student.create('U202012345', true, true);
  expect(() => student.calculateFinalGrade()).toThrow(NoEvaluationsException);
});
```

## 🔍 Análisis con SonarQube

El proyecto está configurado para análisis con SonarQube:

```bash
# Ejecutar análisis (requiere servidor SonarQube)
npm run sonar
```

### Criterios de Calidad Cumplidos

✅ **Sin valores mágicos**: Todas las constantes están en `DomainConstants.ts`  
✅ **Nombres significativos**: Clases, métodos y variables con nombres descriptivos  
✅ **Manejo de errores**: Excepciones específicas del dominio  
✅ **Comentarios relevantes**: JSDoc en todas las clases y métodos públicos  
✅ **Formato consistente**: Prettier configurado  
✅ **Cobertura de tests**: Superior al 60%  

## 📊 Decisiones de Diseño

### Arquitectura Hexagonal

- **Dominio**: Lógica de negocio pura, sin dependencias externas
- **Aplicación**: Casos de uso que orquestan el dominio
- **Infraestructura**: Adaptadores (repositorios, APIs, UI)

### Value Objects

- `Grade`: Encapsula validaciones de notas [0-20]
- `WeightPercentage`: Encapsula validaciones de pesos [0-100]
- `StudentId`: Encapsula validaciones de identificadores

### Políticas del Dominio

- `AttendancePolicy`: Separa la lógica de asistencia mínima
- `ExtraPointsPolicy`: Separa la lógica de puntos extra

### Principios SOLID Aplicados

- **S**: Cada clase tiene una única responsabilidad
- **O**: Abierto para extensión, cerrado para modificación
- **L**: Las implementaciones pueden sustituir interfaces
- **I**: Interfaces segregadas (StudentRepository)
- **D**: Dependencia de abstracciones, no implementaciones

## 🛡️ Manejo de Errores

El sistema define excepciones específicas del dominio:

```typescript
// Excepciones disponibles
- DomainException (base)
- InvalidValueObjectException
- MaxEvaluationsExceededException
- InvalidWeightSumException
- NoEvaluationsException
```

## 📈 Mejoras Futuras

- [ ] Implementación de repositorio con base de datos real
- [ ] API REST con Express/Fastify
- [ ] Interfaz web con React/Vue
- [ ] Sistema de autenticación y autorización
- [ ] Logs y monitoreo (Winston/Pino)
- [ ] Caché para optimización de consultas frecuentes
- [ ] Exportación de reportes PDF

## 👥 Caso de Uso de Ejemplo (CU001)

**Actor**: Docente UTEC  
**Caso de Uso**: Calcular nota final del estudiante

**Flujo Principal**:
1. El docente ingresa a la aplicación
2. La aplicación solicita los datos del estudiante (código)
3. El docente registra las evaluaciones con sus notas y pesos
4. El docente indica si el estudiante alcanzó la asistencia mínima
5. La aplicación consulta la política de puntos extra (lista `allYearsTeachers`)
6. La aplicación calcula la nota final del estudiante
7. La aplicación muestra la nota final y el detalle del cálculo

## 📝 Licencia

MIT License - ver [LICENSE](./LICENSE) para más detalles

## 🙋 Autor

Sistema desarrollado para UTEC - CS3081 - 2025-2

---

**Nota**: Este proyecto fue diseñado siguiendo las mejores prácticas de desarrollo de software, arquitectura limpia y está optimizado para pasar análisis de SonarQube sin errores.
