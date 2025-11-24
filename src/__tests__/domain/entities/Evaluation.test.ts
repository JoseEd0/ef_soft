import { Evaluation } from '../../../domain/entities/Evaluation';
import { InvalidValueObjectException } from '../../../domain/exceptions/DomainExceptions';

describe('Evaluation Entity', () => {
  describe('shouldCreateValidEvaluation', () => {
    it('should create evaluation with valid grade and weight', () => {
      const evaluation = Evaluation.create(15, 40);
      expect(evaluation.getGrade().getValue()).toBe(15);
      expect(evaluation.getWeightPercentage().getValue()).toBe(40);
    });

    it('should create evaluation with minimum values', () => {
      const evaluation = Evaluation.create(0, 0);
      expect(evaluation.getGrade().getValue()).toBe(0);
      expect(evaluation.getWeightPercentage().getValue()).toBe(0);
    });

    it('should create evaluation with maximum values', () => {
      const evaluation = Evaluation.create(20, 100);
      expect(evaluation.getGrade().getValue()).toBe(20);
      expect(evaluation.getWeightPercentage().getValue()).toBe(100);
    });

    it('should create evaluation with decimal values', () => {
      const evaluation = Evaluation.create(15.75, 33.33);
      expect(evaluation.getGrade().getValue()).toBe(15.75);
      expect(evaluation.getWeightPercentage().getValue()).toBe(33.33);
    });
  });

  describe('shouldFailForInvalidEvaluation', () => {
    it('should throw exception when grade is invalid', () => {
      expect(() => Evaluation.create(25, 40)).toThrow(InvalidValueObjectException);
    });

    it('should throw exception when weight is invalid', () => {
      expect(() => Evaluation.create(15, 150)).toThrow(InvalidValueObjectException);
    });

    it('should throw exception when both are invalid', () => {
      expect(() => Evaluation.create(-5, -10)).toThrow(InvalidValueObjectException);
    });
  });

  describe('shouldCalculateWeightedContributionCorrectly', () => {
    it('should calculate contribution for 40% weight', () => {
      const evaluation = Evaluation.create(15, 40);
      expect(evaluation.calculateWeightedContribution()).toBe(6);
    });

    it('should calculate contribution for 100% weight', () => {
      const evaluation = Evaluation.create(20, 100);
      expect(evaluation.calculateWeightedContribution()).toBe(20);
    });

    it('should calculate contribution for 0% weight', () => {
      const evaluation = Evaluation.create(15, 0);
      expect(evaluation.calculateWeightedContribution()).toBe(0);
    });

    it('should calculate contribution with decimal values', () => {
      const evaluation = Evaluation.create(16, 25);
      expect(evaluation.calculateWeightedContribution()).toBe(4);
    });

    it('should calculate contribution with complex decimal values', () => {
      const evaluation = Evaluation.create(17.5, 30);
      expect(evaluation.calculateWeightedContribution()).toBe(5.25);
    });
  });

  describe('shouldReturnCorrectString', () => {
    it('should return formatted string representation', () => {
      const evaluation = Evaluation.create(15, 40);
      const result = evaluation.toString();
      expect(result).toContain('15.00');
      expect(result).toContain('40%');
    });
  });
});
