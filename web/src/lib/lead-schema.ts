import { z } from "zod";

export const leadSchema = z.object({
  name: z
    .string()
    .min(2, "Укажите имя")
    .max(80, "Слишком длинное имя"),
  phone: z
    .string()
    .min(10, "Укажите телефон")
    .max(32, "Проверьте формат телефона"),
  rideDate: z.string().min(1, "Выберите дату"),
  comment: z.string().max(2000).optional(),
  packageId: z.string().optional(),
});

export type LeadPayload = z.infer<typeof leadSchema>;
