import { Student } from '../../../domain/entities/Student';
import {
  MaxEvaluationsExceededException,
  InvalidWeightSumException,
  NoEvaluationsException,
} from '../../../domain/exceptions/DomainExceptions';
import { MAX_EVALUATIONS_PER_STUDENT } from '../../../domain/constants/DomainConstants';

describe('Student Entity - Final Grade Calculation', () => {
  describe('shouldCalculateNormalCase', () => {
    it('should calculate final grade with two evaluations summing 100%', () => {
      const student = Student.create('U202012345', true, false);
      student.addEvaluation(16, 60);
      student.addEvaluation(14, 40);

      const finalGrade = student.calculateFinalGrade();
      expect(finalGrade).toBe(15.2);
    });

    it('should calculate final grade with three equal weight evaluations', () => {
      const student = Student.create('U202012345', true, true);
      student.addEvaluation(15, 33.33);
      student.addEvaluation(18, 33.33);
      student.addEvaluation(12, 33.34);

      const finalGrade = student.calculateFinalGrade();
      expect(finalGrade).toBeCloseTo(15, 1);
    });

    it('should calculate final grade with perfect score', () => {
      const student = Student.create('U202012345', true, true);
      student.addEvaluation(20, 50);
      student.addEvaluation(20, 50);

      const finalGrade = student.calculateFinalGrade();
      expect(finalGrade).toBe(20);
    });

    it('should calculate final grade with minimum scores', () => {
      const student = Student.create('U202012345', false, false);
      student.addEvaluation(0, 50);
      student.addEvaluation(0, 50);

      const finalGrade = student.calculateFinalGrade();
      expect(finalGrade).toBe(0);
    });
  });

  describe('shouldHandleMinimumAttendanceCase', () => {
    it('should calculate grade when student does not meet minimum attendance', () => {
      const student = Student.create('U202012345', false, true);
      student.addEvaluation(16, 50);
      student.addEvaluation(14, 50);

      const finalGrade = student.calculateFinalGrade();
      expect(finalGrade).toBe(15);
    });

    it('should calculate grade when student meets minimum attendance', () => {
      const student = Student.create('U202012345', true, true);
      student.addEvaluation(16, 50);
      student.addEvaluation(14, 50);

      const finalGrade = student.calculateFinalGrade();
      expect(finalGrade).toBe(15);
    });
  });

  describe('shouldHandleExtraPointsPolicyCase', () => {
    it('should calculate grade when extra points policy is not allowed', () => {
      const student = Student.create('U202012345', true, false);
      student.addEvaluation(16, 50);
      student.addEvaluation(14, 50);

      const finalGrade = student.calculateFinalGrade();
      expect(finalGrade).toBe(15);
    });

    it('should calculate grade when extra points policy is allowed', () => {
      const student = Student.create('U202012345', true, true);
      student.addEvaluation(16, 50);
      student.addEvaluation(14, 50);

      const finalGrade = student.calculateFinalGrade();
      expect(finalGrade).toBe(15);
    });
  });

  describe('shouldHandleInvalidWeightSum', () => {
    it('should throw exception when weights sum less than 100%', () => {
      const student = Student.create('U202012345', true, true);
      student.addEvaluation(16, 40);
      student.addEvaluation(14, 40);

      expect(() => student.calculateFinalGrade()).toThrow(InvalidWeightSumException);
    });

    it('should throw exception when weights sum more than 100%', () => {
      const student = Student.create('U202012345', true, true);
      student.addEvaluation(16, 60);
      student.addEvaluation(14, 60);

      expect(() => student.calculateFinalGrade()).toThrow(InvalidWeightSumException);
    });
  });

  describe('shouldHandleNoEvaluations', () => {
    it('should throw exception when no evaluations registered', () => {
      const student = Student.create('U202012345', true, true);

      expect(() => student.calculateFinalGrade()).toThrow(NoEvaluationsException);
    });
  });

  describe('shouldHandleMaxEvaluationsLimit', () => {
    it('should allow adding evaluations up to the limit', () => {
      const student = Student.create('U202012345', true, true);
      const weightPerEvaluation = 100 / MAX_EVALUATIONS_PER_STUDENT;

      for (let i = 0; i < MAX_EVALUATIONS_PER_STUDENT; i++) {
        student.addEvaluation(15, weightPerEvaluation);
      }

      expect(student.getEvaluations().length).toBe(MAX_EVALUATIONS_PER_STUDENT);
    });

    it('should throw exception when exceeding max evaluations limit', () => {
      const student = Student.create('U202012345', true, true);

      for (let i = 0; i < MAX_EVALUATIONS_PER_STUDENT; i++) {
        student.addEvaluation(15, 10);
      }

      expect(() => student.addEvaluation(15, 10)).toThrow(MaxEvaluationsExceededException);
    });
  });

  describe('shouldHandleDeterministicCalculation', () => {
    it('should return same result for same input - RNF03', () => {
      const student1 = Student.create('U202012345', true, true);
      student1.addEvaluation(16, 60);
      student1.addEvaluation(14, 40);

      const student2 = Student.create('U202012345', true, true);
      student2.addEvaluation(16, 60);
      student2.addEvaluation(14, 40);

      expect(student1.calculateFinalGrade()).toBe(student2.calculateFinalGrade());
    });

    it('should return same result on multiple calls', () => {
      const student = Student.create('U202012345', true, true);
      student.addEvaluation(16, 60);
      student.addEvaluation(14, 40);

      const result1 = student.calculateFinalGrade();
      const result2 = student.calculateFinalGrade();
      const result3 = student.calculateFinalGrade();

      expect(result1).toBe(result2);
      expect(result2).toBe(result3);
    });
  });
});
