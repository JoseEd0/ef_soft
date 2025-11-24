import { WeightPercentage } from '../../../domain/value-objects/WeightPercentage';
import { InvalidValueObjectException } from '../../../domain/exceptions/DomainExceptions';
import {
  MIN_EVALUATION_WEIGHT_PERCENTAGE,
  MAX_EVALUATION_WEIGHT_PERCENTAGE,
} from '../../../domain/constants/DomainConstants';

describe('WeightPercentage Value Object', () => {
  describe('shouldCreateValidWeightPercentage', () => {
    it('should create weight percentage with minimum valid value', () => {
      const weight = WeightPercentage.create(MIN_EVALUATION_WEIGHT_PERCENTAGE);
      expect(weight.getValue()).toBe(MIN_EVALUATION_WEIGHT_PERCENTAGE);
    });

    it('should create weight percentage with maximum valid value', () => {
      const weight = WeightPercentage.create(MAX_EVALUATION_WEIGHT_PERCENTAGE);
      expect(weight.getValue()).toBe(MAX_EVALUATION_WEIGHT_PERCENTAGE);
    });

    it('should create weight percentage with mid-range value', () => {
      const weightValue = 50;
      const weight = WeightPercentage.create(weightValue);
      expect(weight.getValue()).toBe(weightValue);
    });

    it('should create weight percentage with decimal value', () => {
      const weightValue = 33.33;
      const weight = WeightPercentage.create(weightValue);
      expect(weight.getValue()).toBe(weightValue);
    });
  });

  describe('shouldFailForInvalidWeightPercentage', () => {
    it('should throw exception when weight is below minimum', () => {
      expect(() => WeightPercentage.create(-1)).toThrow(InvalidValueObjectException);
      expect(() => WeightPercentage.create(-1)).toThrow('must be between 0 and 100');
    });

    it('should throw exception when weight is above maximum', () => {
      expect(() => WeightPercentage.create(101)).toThrow(InvalidValueObjectException);
      expect(() => WeightPercentage.create(101)).toThrow('must be between 0 and 100');
    });

    it('should throw exception when weight is not a finite number', () => {
      expect(() => WeightPercentage.create(Number.NaN)).toThrow(InvalidValueObjectException);
      expect(() => WeightPercentage.create(Number.NaN)).toThrow('must be a finite number');
    });

    it('should throw exception when weight is infinity', () => {
      expect(() => WeightPercentage.create(Infinity)).toThrow(InvalidValueObjectException);
    });
  });

  describe('shouldConvertToDecimalFactorCorrectly', () => {
    it('should convert 100% to factor 1.0', () => {
      const weight = WeightPercentage.create(100);
      expect(weight.toDecimalFactor()).toBe(1);
    });

    it('should convert 50% to factor 0.5', () => {
      const weight = WeightPercentage.create(50);
      expect(weight.toDecimalFactor()).toBe(0.5);
    });

    it('should convert 25% to factor 0.25', () => {
      const weight = WeightPercentage.create(25);
      expect(weight.toDecimalFactor()).toBe(0.25);
    });

    it('should convert 0% to factor 0.0', () => {
      const weight = WeightPercentage.create(0);
      expect(weight.toDecimalFactor()).toBe(0);
    });
  });

  describe('shouldCompareWeightPercentagesCorrectly', () => {
    it('should return true when comparing equal weights', () => {
      const weight1 = WeightPercentage.create(50);
      const weight2 = WeightPercentage.create(50);
      expect(weight1.equals(weight2)).toBe(true);
    });

    it('should return false when comparing different weights', () => {
      const weight1 = WeightPercentage.create(50);
      const weight2 = WeightPercentage.create(40);
      expect(weight1.equals(weight2)).toBe(false);
    });
  });

  describe('shouldReturnCorrectString', () => {
    it('should return formatted string with percentage symbol', () => {
      const weight = WeightPercentage.create(50);
      expect(weight.toString()).toBe('50%');
    });

    it('should return formatted string with decimal', () => {
      const weight = WeightPercentage.create(33.33);
      expect(weight.toString()).toBe('33.33%');
    });
  });
});
