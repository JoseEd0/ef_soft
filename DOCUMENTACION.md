# Documentación Técnica - CS-GradeCalculator

## 1. Problema Resuelto

### Contexto
Sistema para docentes de UTEC que permite calcular la nota final de estudiantes considerando:
- Evaluaciones ponderadas (cada una con nota y peso porcentual)
- Asistencia mínima requerida por reglamento
- Política de puntos extra acordada colectivamente por docentes

### Requerimientos Implementados

#### Requerimientos Funcionales (RF)
- **RF01**: Registrar evaluaciones con nota obtenida y peso porcentual
- **RF02**: Registrar si el estudiante cumplió asistencia mínima (`hasReachedMinimumClasses`)
- **RF03**: Consultar política de puntos extra del curso (`allYearsTeachers`)
- **RF04**: Calcular nota final considerando evaluaciones, asistencia y políticas
- **RF05**: Visualizar detalle completo del cálculo (promedio ponderado, penalizaciones, puntos extra)

#### Requerimientos No Funcionales (RNF)
- **RNF01**: Máximo 10 evaluaciones por estudiante
- **RNF02**: Soportar hasta 50 usuarios concurrentes
- **RNF03**: Cálculo determinista (mismos datos = misma nota)
- **RNF04**: Tiempo de cálculo menor a 300ms

---

## 2. Arquitectura Utilizada

### Arquitectura Hexagonal (Ports & Adapters)

**Justificación**: Se eligió esta arquitectura porque:
1. **Separación de responsabilidades**: La lógica de negocio está aislada de la infraestructura
2. **Testabilidad**: Cada capa puede probarse independientemente
3. **Mantenibilidad**: Cambios en infraestructura no afectan el dominio
4. **Escalabilidad**: Fácil agregar nuevos adaptadores (REST API, base de datos real)

### Estructura de Capas

```
┌─────────────────────────────────────────┐
│      INFRASTRUCTURE (Adaptadores)       │
│  - Facades: GradeCalculator             │
│  - Repositories: InMemoryStudentRepo    │
└────────────┬────────────────────────────┘
             │ implements
┌────────────▼────────────────────────────┐
│      APPLICATION (Casos de Uso)         │
│  - Use Cases (RF01-RF05)                │
│  - Ports (Interfaces)                   │
└────────────┬────────────────────────────┘
             │ uses
┌────────────▼────────────────────────────┐
│      DOMAIN (Lógica de Negocio)         │
│  - Entities: Student, Evaluation        │
│  - Value Objects: Grade, WeightPerc.    │
│  - Policies: Attendance, ExtraPoints    │
└─────────────────────────────────────────┘
```

---

## 3. Patrones de Diseño Implementados

### 3.1 Domain-Driven Design (DDD)

#### Aggregate Root
- **Student**: Agregado raíz que controla el acceso a todas las evaluaciones
- Garantiza invariantes del dominio (suma de pesos = 100%, máx 10 evaluaciones)

#### Value Objects
- **Grade**: Encapsula nota [0-20] con validaciones
- **WeightPercentage**: Encapsula peso porcentual [0-100]
- **StudentId**: Encapsula identificador único del estudiante

**Ventaja**: Validaciones centralizadas, inmutabilidad, expresividad del código

#### Entities
- **Evaluation**: Entidad que representa una evaluación individual
- **Student**: Entidad raíz que agrupa evaluaciones y políticas

#### Policies
- **AttendancePolicy**: Encapsula regla de asistencia mínima
- **ExtraPointsPolicy**: Encapsula política de puntos extra

**Ventaja**: Reglas de negocio explícitas y reutilizables

### 3.2 Repository Pattern

```typescript
interface StudentRepository {
  findById(studentId: string): Promise<Student | null>;
  save(student: Student): Promise<void>;
  delete(studentId: string): Promise<void>;
  findAll(): Promise<Student[]>;
}
```

**Ventaja**: Abstrae la persistencia, permite cambiar implementación sin afectar casos de uso

### 3.3 Facade Pattern

```typescript
class GradeCalculator {
  // Simplifica acceso a todos los casos de uso
  registerEvaluation()
  updateAttendance()
  updateExtraPointsPolicy()
  calculateFinalGrade()
  getCalculationDetail()
}
```

**Ventaja**: Interfaz simplificada para el cliente, oculta complejidad interna

### 3.4 Factory Method

```typescript
class Student {
  static create(studentId, hasReachedMinimumClasses, allYearsTeachers): Student
}
```

**Ventaja**: Controla creación de objetos complejos, garantiza validaciones

### 3.5 Strategy Pattern (Implícito)

Las políticas (`AttendancePolicy`, `ExtraPointsPolicy`) actúan como estrategias que pueden cambiar el comportamiento del cálculo de nota final.

---

## 4. Principios SOLID Aplicados

### Single Responsibility Principle (S)
- Cada clase tiene una única razón para cambiar
- `Grade`: solo maneja validación de notas
- `Evaluation`: solo representa una evaluación
- `Student`: solo agrupa evaluaciones y calcula nota final

### Open/Closed Principle (O)
- Abierto para extensión: Se pueden agregar nuevas políticas sin modificar `Student`
- Cerrado para modificación: Value Objects son inmutables

### Liskov Substitution Principle (L)
- `InMemoryStudentRepository` puede sustituirse por cualquier implementación de `StudentRepository`

### Interface Segregation Principle (I)
- `StudentRepository` define solo métodos necesarios
- No hay interfaces "gordas" con métodos no usados

### Dependency Inversion Principle (D)
- Casos de uso dependen de `StudentRepository` (abstracción)
- No dependen de `InMemoryStudentRepository` (implementación)

---

## 5. Decisiones de Diseño Clave

### 5.1 Variables del Dominio

Las variables siguen **exactamente** la nomenclatura del enunciado:

```typescript
hasReachedMinimumClasses: boolean  // RF02 - Asistencia mínima
allYearsTeachers: boolean          // RF03 - Política puntos extra
```

### 5.2 Sin Valores Mágicos

Todas las constantes están en `DomainConstants.ts`:

```typescript
MAX_EVALUATIONS_PER_STUDENT = 10  // RNF01
TOTAL_WEIGHT_PERCENTAGE = 100     
MIN_GRADE = 0
MAX_GRADE = 20
WEIGHT_SUM_TOLERANCE = 0.01
```

### 5.3 Validaciones Estrictas

- Nota final se calcula solo si:
  - Hay al menos 1 evaluación
  - La suma de pesos es exactamente 100% (±0.01 tolerancia)
- Lanza excepciones específicas para cada tipo de error

### 5.4 Cálculo Determinista (RNF03)

```typescript
public calculateFinalGrade(): number {
  // Siempre retorna el mismo resultado para mismos inputs
  // Sin efectos secundarios
  // Sin dependencias externas (fechas, random, etc.)
  return this.calculateBaseGrade();
}
```

### 5.5 Separación de Responsabilidades

```
Dominio     → Reglas de negocio puras
Application → Orquestación de casos de uso
Infrastructure → Detalles técnicos (persistencia, UI)
```

---

## 6. Flujo de Ejecución (Caso de Uso Principal)

### CU001: Calcular Nota Final del Estudiante

```
1. Docente → GradeCalculator.registerEvaluation(id, nota, peso)
   └─→ RegisterEvaluationUseCase
       └─→ StudentRepository.findById()
       └─→ Student.addEvaluation()
       └─→ StudentRepository.save()

2. Docente → GradeCalculator.updateAttendance(id, hasReachedMinimumClasses)
   └─→ UpdateAttendanceUseCase
       └─→ Student.updateAttendancePolicy()

3. Docente → GradeCalculator.updateExtraPointsPolicy(id, allYearsTeachers)
   └─→ UpdateExtraPointsPolicyUseCase
       └─→ Student.updateExtraPointsPolicy()

4. Docente → GradeCalculator.calculateFinalGrade(id)
   └─→ CalculateFinalGradeUseCase
       └─→ Student.calculateFinalGrade()
           ├─→ validateWeightSum() → Verifica suma = 100%
           └─→ calculateBaseGrade() → Σ(nota × peso)

5. Docente → GradeCalculator.getCalculationDetail(id)
   └─→ GetCalculationDetailUseCase
       └─→ Student.getCalculationDetail()
```

---

## 7. Manejo de Errores

### Excepciones del Dominio

```typescript
DomainException (base)
├─ InvalidValueObjectException
├─ MaxEvaluationsExceededException  // RNF01
├─ InvalidWeightSumException
└─ NoEvaluationsException
```

### Estrategia
- Validación temprana en Value Objects
- Excepciones específicas y descriptivas
- Sin excepciones genéricas (`Error`, `Exception`)

---

## 8. Testing

### Estrategia de Pruebas

1. **Tests Unitarios**:
   - Value Objects: Validaciones de rango y formato
   - Entities: Lógica de negocio
   - Policies: Reglas de asistencia y puntos extra

2. **Tests de Integración**:
   - Casos de uso completos (RF01-RF05)
   - Flujo end-to-end

3. **Casos Borde**:
   - 0 evaluaciones → Error
   - Pesos suma ≠ 100% → Error
   - Más de 10 evaluaciones → Error
   - Notas fuera de rango → Error

### Cobertura
- **89.61%** de statements
- **91.17%** de branches
- **91 tests** ejecutándose exitosamente

---

## 9. Escalabilidad y Extensibilidad

### Fácil de Extender

1. **Nueva persistencia**: Implementar `StudentRepository`
   ```typescript
   class PostgresStudentRepository implements StudentRepository
   class MongoStudentRepository implements StudentRepository
   ```

2. **Nueva política**: Agregar clase en `domain/policies`
   ```typescript
   class BehaviorPolicy { ... }
   ```

3. **Nueva interfaz**: Crear adaptador en `infrastructure`
   ```typescript
   class RestApiController { ... }
   class GraphQLResolver { ... }
   ```

### Mantenible
- Lógica de negocio aislada en `domain/`
- Tests garantizan que los cambios no rompen funcionalidad
- Nomenclatura clara y consistente

---

## 10. Cumplimiento de Estándares

### Calidad de Código
- ✅ Sin valores mágicos
- ✅ Nombres significativos (no x1, dato, aux)
- ✅ Comentarios JSDoc en todas las clases públicas
- ✅ Manejo robusto de errores
- ✅ Formato consistente (Prettier)

### Linting
- ✅ 0 errores de ESLint
- ✅ 0 warnings
- ✅ Reglas estrictas de TypeScript

### Compilación
- ✅ 0 errores de compilación TypeScript
- ✅ Strict mode activado

---

## 11. Dependencias y Herramientas

### Runtime
- TypeScript 5.3.3
- Node.js >= 18.x

### Testing
- Jest 29.5.0
- ts-jest 29.1.0
- Cobertura > 89%

### Calidad
- ESLint 8.50.0
- Prettier 3.0.0
- SonarQube (análisis estático)

---

## 12. Conclusión

El sistema CS-GradeCalculator implementa una solución **robusta, mantenible y escalable** para el cálculo de notas finales, aplicando:

1. **Arquitectura Hexagonal**: Separación clara de responsabilidades
2. **DDD**: Modelado expresivo del dominio educativo
3. **SOLID**: Código flexible y extensible
4. **Patrones de Diseño**: Repository, Facade, Factory, Strategy
5. **Testing Exhaustivo**: 91 tests con 89.61% de cobertura

El diseño permite:
- Agregar nuevas reglas de cálculo sin modificar código existente
- Cambiar la persistencia sin afectar la lógica de negocio
- Testear cada componente de forma aislada
- Mantener el código a largo plazo con confianza
