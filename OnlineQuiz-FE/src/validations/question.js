import { z } from 'zod';

export const FormQuestionCreateSchema = z.object({
  questionType: z.string(),
  category: z.union([z.string(), z.number()]),
  content: z.string().refine((content) => content.length > 0),
  answers: z.array(
    z.object({
      content: z.string().refine((content) => content.length > 0),
      isCorrect: z.boolean().default(false),
    })
  ),
});
