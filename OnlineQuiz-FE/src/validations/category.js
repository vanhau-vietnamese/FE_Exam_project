import { z } from 'zod';

export const CategorySchema = z.object({
  title: z.string().min(3, 'Tiêu đề phải có ít nhất 3 ký tự!'),
  description: z.string().nullable(),
});
