import { GradeCalculator } from '../../infrastructure/facades/GradeCalculator';
import { InMemoryStudentRepository } from '../../infrastructure/repositories/InMemoryStudentRepository';
import {
  MaxEvaluationsExceededException,
  InvalidWeightSumException,
  NoEvaluationsException,
} from '../../domain/exceptions/DomainExceptions';

describe('GradeCalculator Integration Tests - CU001 Register Evaluation', () => {
  let gradeCalculator: GradeCalculator;
  let repository: InMemoryStudentRepository;

  beforeEach(() => {
    repository = new InMemoryStudentRepository();
    gradeCalculator = new GradeCalculator(repository);
  });

  describe('shouldRegisterEvaluationSuccessfully', () => {
    it('should register single evaluation for new student', async () => {
      await gradeCalculator.registerEvaluation('U202012345', 16, 40);

      const student = await repository.findById('U202012345');
      expect(student).not.toBeNull();
      expect(student!.getEvaluations().length).toBe(1);
    });

    it('should register multiple evaluations for same student', async () => {
      await gradeCalculator.registerEvaluation('U202012345', 16, 40);
      await gradeCalculator.registerEvaluation('U202012345', 14, 30);
      await gradeCalculator.registerEvaluation('U202012345', 18, 30);

      const student = await repository.findById('U202012345');
      expect(student!.getEvaluations().length).toBe(3);
    });

    it('should register evaluation with decimal values', async () => {
      await gradeCalculator.registerEvaluation('U202012345', 15.75, 33.33);

      const student = await repository.findById('U202012345');
      const evaluations = student!.getEvaluations();
      expect(evaluations[0].getGrade().getValue()).toBe(15.75);
    });
  });

  describe('shouldRejectInvalidEvaluations', () => {
    it('should reject evaluation exceeding maximum evaluations limit', async () => {
      for (let i = 0; i < 10; i++) {
        await gradeCalculator.registerEvaluation('U202012345', 15, 10);
      }

      await expect(gradeCalculator.registerEvaluation('U202012345', 15, 10)).rejects.toThrow(
        MaxEvaluationsExceededException
      );
    });

    it('should reject evaluation with invalid grade above maximum', async () => {
      await expect(gradeCalculator.registerEvaluation('U202012345', 25, 50)).rejects.toThrow();
    });

    it('should reject evaluation with invalid grade below minimum', async () => {
      await expect(gradeCalculator.registerEvaluation('U202012345', -5, 50)).rejects.toThrow();
    });

    it('should reject evaluation with invalid weight above maximum', async () => {
      await expect(gradeCalculator.registerEvaluation('U202012345', 15, 150)).rejects.toThrow();
    });
  });
});

describe('GradeCalculator Integration Tests - CU002 and CU003 Policies', () => {
  let gradeCalculator: GradeCalculator;
  let repository: InMemoryStudentRepository;

  beforeEach(() => {
    repository = new InMemoryStudentRepository();
    gradeCalculator = new GradeCalculator(repository);
  });

  describe('shouldUpdateAttendancePolicySuccessfully', () => {
    it('should update attendance policy for new student', async () => {
      await gradeCalculator.updateAttendance('U202012345', true);

      const student = await repository.findById('U202012345');
      expect(student!.getAttendancePolicy().getValue()).toBe(true);
    });

    it('should update attendance policy for existing student', async () => {
      await gradeCalculator.registerEvaluation('U202012345', 16, 50);
      await gradeCalculator.updateAttendance('U202012345', true);

      const student = await repository.findById('U202012345');
      expect(student!.getAttendancePolicy().getValue()).toBe(true);
    });

    it('should change attendance policy value', async () => {
      await gradeCalculator.updateAttendance('U202012345', true);
      await gradeCalculator.updateAttendance('U202012345', false);

      const student = await repository.findById('U202012345');
      expect(student!.getAttendancePolicy().getValue()).toBe(false);
    });
  });

  describe('shouldUpdateExtraPointsPolicySuccessfully', () => {
    it('should update extra points policy for new student', async () => {
      await gradeCalculator.updateExtraPointsPolicy('U202012345', true);

      const student = await repository.findById('U202012345');
      expect(student!.getExtraPointsPolicy().getValue()).toBe(true);
    });

    it('should update extra points policy for existing student', async () => {
      await gradeCalculator.registerEvaluation('U202012345', 16, 50);
      await gradeCalculator.updateExtraPointsPolicy('U202012345', true);

      const student = await repository.findById('U202012345');
      expect(student!.getExtraPointsPolicy().getValue()).toBe(true);
    });
  });
});

describe('GradeCalculator Integration Tests - CU004 Calculate Final Grade', () => {
  let gradeCalculator: GradeCalculator;
  let repository: InMemoryStudentRepository;

  beforeEach(() => {
    repository = new InMemoryStudentRepository();
    gradeCalculator = new GradeCalculator(repository);
  });

  describe('shouldCalculateFinalGradeSuccessfully', () => {
    it('should calculate final grade for student with valid evaluations', async () => {
      await gradeCalculator.registerEvaluation('U202012345', 16, 60);
      await gradeCalculator.registerEvaluation('U202012345', 14, 40);

      const finalGrade = await gradeCalculator.calculateFinalGrade('U202012345');
      expect(finalGrade).toBe(15.2);
    });

    it('should calculate final grade with attendance and extra points', async () => {
      await gradeCalculator.registerEvaluation('U202012345', 16, 50);
      await gradeCalculator.registerEvaluation('U202012345', 14, 50);
      await gradeCalculator.updateAttendance('U202012345', true);
      await gradeCalculator.updateExtraPointsPolicy('U202012345', true);

      const finalGrade = await gradeCalculator.calculateFinalGrade('U202012345');
      expect(finalGrade).toBe(15);
    });

    it('should calculate final grade without attendance', async () => {
      await gradeCalculator.registerEvaluation('U202012345', 16, 50);
      await gradeCalculator.registerEvaluation('U202012345', 14, 50);
      await gradeCalculator.updateAttendance('U202012345', false);

      const finalGrade = await gradeCalculator.calculateFinalGrade('U202012345');
      expect(finalGrade).toBe(15);
    });
  });

  describe('shouldRejectInvalidCalculations', () => {
    it('should reject calculation without evaluations', async () => {
      await gradeCalculator.updateAttendance('U202012345', true);

      await expect(gradeCalculator.calculateFinalGrade('U202012345')).rejects.toThrow(
        NoEvaluationsException
      );
    });

    it('should reject calculation with invalid weight sum', async () => {
      await gradeCalculator.registerEvaluation('U202012345', 16, 40);
      await gradeCalculator.registerEvaluation('U202012345', 14, 40);

      await expect(gradeCalculator.calculateFinalGrade('U202012345')).rejects.toThrow(
        InvalidWeightSumException
      );
    });

    it('should reject calculation for non-existent student', async () => {
      await expect(gradeCalculator.calculateFinalGrade('NONEXISTENT')).rejects.toThrow();
    });
  });
});

describe('GradeCalculator Integration Tests - CU005 Get Calculation Detail', () => {
  let gradeCalculator: GradeCalculator;
  let repository: InMemoryStudentRepository;

  beforeEach(() => {
    repository = new InMemoryStudentRepository();
    gradeCalculator = new GradeCalculator(repository);
  });

  describe('shouldReturnCompleteCalculationDetail', () => {
    it('should return detail with all evaluation information', async () => {
      await gradeCalculator.registerEvaluation('U202012345', 16, 60);
      await gradeCalculator.registerEvaluation('U202012345', 14, 40);
      await gradeCalculator.updateAttendance('U202012345', true);
      await gradeCalculator.updateExtraPointsPolicy('U202012345', true);

      const detail = await gradeCalculator.getCalculationDetail('U202012345');

      expect(detail.studentId).toBe('U202012345');
      expect(detail.evaluations.length).toBe(2);
      expect(detail.evaluations[0].grade).toBe(16);
      expect(detail.evaluations[0].weight).toBe(60);
      expect(detail.evaluations[0].contribution).toBe(9.6);
      expect(detail.baseGrade).toBe(15.2);
      expect(detail.hasReachedMinimumClasses).toBe(true);
      expect(detail.allYearsTeachers).toBe(true);
      expect(detail.canReceiveExtraPoints).toBe(true);
      expect(detail.finalGrade).toBe(15.2);
    });

    it('should return detail showing cannot receive extra points', async () => {
      await gradeCalculator.registerEvaluation('U202012345', 16, 50);
      await gradeCalculator.registerEvaluation('U202012345', 14, 50);
      await gradeCalculator.updateAttendance('U202012345', false);
      await gradeCalculator.updateExtraPointsPolicy('U202012345', true);

      const detail = await gradeCalculator.getCalculationDetail('U202012345');

      expect(detail.canReceiveExtraPoints).toBe(false);
    });
  });
});
