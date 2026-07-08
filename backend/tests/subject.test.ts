import { describe, expect, it } from 'vitest';
import { Subject } from '../src/modules/scores/subject.js';
import { SUBJECTS } from '../src/modules/scores/subject-registry.js';

describe('Subject', () => {
  const math = new Subject('toan', 'Math', 'toan');

  it('classifies score boundaries into the four required bands', () => {
    expect(math.getBand(8)).toBe('excellent');
    expect(math.getBand(6)).toBe('good');
    expect(math.getBand(4)).toBe('average');
    expect(math.getBand(3.99)).toBe('poor');
  });

  it('rejects scores outside the 0 to 10 range', () => {
    expect(() => math.getBand(-0.1)).toThrow('Score must be between 0 and 10');
    expect(() => math.getBand(10.1)).toThrow('Score must be between 0 and 10');
  });
});

describe('SUBJECTS', () => {
  it('contains the nine reportable exam subjects', () => {
    expect(SUBJECTS.map((subject) => subject.csvColumn)).toEqual([
      'toan',
      'ngu_van',
      'ngoai_ngu',
      'vat_li',
      'hoa_hoc',
      'sinh_hoc',
      'lich_su',
      'dia_li',
      'gdcd',
    ]);
  });
});
