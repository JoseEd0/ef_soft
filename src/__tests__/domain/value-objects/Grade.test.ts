import { Grade } from '../../../domain/value-objects/Grade';
import { InvalidValueObjectException } from '../../../domain/exceptions/DomainExceptions';
import { MIN_GRADE, MAX_GRADE } from '../../../domain/constants/DomainConstants';

describe('Grade Value Object', () => {
  describe('shouldCreateValidGrade', () => {
    it('should create a grade with minimum valid value', () => {
      const grade = Grade.create(MIN_GRADE);
      expect(grade.getValue()).toBe(MIN_GRADE);
    });

    it('should create a grade with maximum valid value', () => {
      const grade = Grade.create(MAX_GRADE);
      expect(grade.getValue()).toBe(MAX_GRADE);
    });

    it('should create a grade with decimal value', () => {
      const gradeValue = 15.75;
      const grade = Grade.create(gradeValue);
      expect(grade.getValue()).toBe(gradeValue);
    });

    it('should create a grade with mid-range value', () => {
      const gradeValue = 10;
      const grade = Grade.create(gradeValue);
      expect(grade.getValue()).toBe(gradeValue);
    });
  });

  describe('shouldFailForInvalidGrade', () => {
    it('should throw exception when grade is below minimum', () => {
      expect(() => Grade.create(-1)).toThrow(InvalidValueObjectException);
      expect(() => Grade.create(-1)).toThrow('must be between 0 and 20');
    });

    it('should throw exception when grade is above maximum', () => {
      expect(() => Grade.create(21)).toThrow(InvalidValueObjectException);
      expect(() => Grade.create(21)).toThrow('must be between 0 and 20');
    });

    it('should throw exception when grade is not a finite number', () => {
      expect(() => Grade.create(Number.NaN)).toThrow(InvalidValueObjectException);
      expect(() => Grade.create(Number.NaN)).toThrow('must be a finite number');
    });

    it('should throw exception when grade is infinity', () => {
      expect(() => Grade.create(Infinity)).toThrow(InvalidValueObjectException);
    });

    it('should throw exception when grade is negative infinity', () => {
      expect(() => Grade.create(-Infinity)).toThrow(InvalidValueObjectException);
    });
  });

  describe('shouldRoundGradeCorrectly', () => {
    it('should round grade to two decimal places', () => {
      const grade = Grade.create(15.12345);
      expect(grade.getRoundedValue()).toBe(15.12);
    });

    it('should round grade up when needed', () => {
      const grade = Grade.create(15.126);
      expect(grade.getRoundedValue()).toBe(15.13);
    });

    it('should keep integer grades as is', () => {
      const grade = Grade.create(15);
      expect(grade.getRoundedValue()).toBe(15);
    });
  });

  describe('shouldCompareGradesCorrectly', () => {
    it('should return true when comparing equal grades', () => {
      const grade1 = Grade.create(15);
      const grade2 = Grade.create(15);
      expect(grade1.equals(grade2)).toBe(true);
    });

    it('should return false when comparing different grades', () => {
      const grade1 = Grade.create(15);
      const grade2 = Grade.create(16);
      expect(grade1.equals(grade2)).toBe(false);
    });
  });

  describe('shouldReturnCorrectString', () => {
    it('should return formatted string with two decimals', () => {
      const grade = Grade.create(15.5);
      expect(grade.toString()).toBe('15.50');
    });

    it('should return formatted string for integer', () => {
      const grade = Grade.create(20);
      expect(grade.toString()).toBe('20.00');
    });
  });
});
