import { StudentId } from '../../../domain/value-objects/StudentId';
import { InvalidValueObjectException } from '../../../domain/exceptions/DomainExceptions';

describe('StudentId Value Object', () => {
  describe('shouldCreateValidStudentId', () => {
    it('should create student id with alphanumeric code', () => {
      const studentId = StudentId.create('U202012345');
      expect(studentId.getValue()).toBe('U202012345');
    });

    it('should create student id with minimum length', () => {
      const studentId = StudentId.create('ABC');
      expect(studentId.getValue()).toBe('ABC');
    });

    it('should create student id with maximum length', () => {
      const longId = 'A'.repeat(50);
      const studentId = StudentId.create(longId);
      expect(studentId.getValue()).toBe(longId);
    });

    it('should trim whitespace from student id', () => {
      const studentId = StudentId.create('  U202012345  ');
      expect(studentId.getValue()).toBe('U202012345');
    });
  });

  describe('shouldFailForInvalidStudentId', () => {
    it('should throw exception when student id is empty', () => {
      expect(() => StudentId.create('')).toThrow(InvalidValueObjectException);
      expect(() => StudentId.create('')).toThrow('cannot be empty');
    });

    it('should throw exception when student id is only whitespace', () => {
      expect(() => StudentId.create('   ')).toThrow(InvalidValueObjectException);
      expect(() => StudentId.create('   ')).toThrow('cannot be empty');
    });

    it('should throw exception when student id is too short', () => {
      expect(() => StudentId.create('AB')).toThrow(InvalidValueObjectException);
      expect(() => StudentId.create('AB')).toThrow('must be between 3 and 50 characters');
    });

    it('should throw exception when student id is too long', () => {
      const longId = 'A'.repeat(51);
      expect(() => StudentId.create(longId)).toThrow(InvalidValueObjectException);
      expect(() => StudentId.create(longId)).toThrow('must be between 3 and 50 characters');
    });
  });

  describe('shouldCompareStudentIdsCorrectly', () => {
    it('should return true when comparing equal student ids', () => {
      const id1 = StudentId.create('U202012345');
      const id2 = StudentId.create('U202012345');
      expect(id1.equals(id2)).toBe(true);
    });

    it('should return false when comparing different student ids', () => {
      const id1 = StudentId.create('U202012345');
      const id2 = StudentId.create('U202012346');
      expect(id1.equals(id2)).toBe(false);
    });
  });

  describe('shouldReturnCorrectString', () => {
    it('should return student id as string', () => {
      const studentId = StudentId.create('U202012345');
      expect(studentId.toString()).toBe('U202012345');
    });
  });
});
