import { Subject } from './subject.js';

export const SUBJECTS = [
  new Subject('toan', 'Math', 'toan'),
  new Subject('nguVan', 'Literature', 'ngu_van'),
  new Subject('ngoaiNgu', 'Foreign Language', 'ngoai_ngu'),
  new Subject('vatLi', 'Physics', 'vat_li'),
  new Subject('hoaHoc', 'Chemistry', 'hoa_hoc'),
  new Subject('sinhHoc', 'Biology', 'sinh_hoc'),
  new Subject('lichSu', 'History', 'lich_su'),
  new Subject('diaLi', 'Geography', 'dia_li'),
  new Subject('gdcd', 'Civic Education', 'gdcd'),
] as const;

export class SubjectRegistry {
  getAll() {
    return SUBJECTS;
  }
}
