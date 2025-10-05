import { z } from "zod";

export const simulationFormSchema = z
  .object({
    age: z
      .number({ message: "Wiek jest wymagany" })
      .min(18, "Wiek musi wynosić co najmniej 18 lat")
      .max(100, "Wiek nie może przekraczać 100 lat"),

    gender: z.enum(["man", "woman"], {
      message: "Płeć jest wymagana",
    }),

    grossSalary: z
      .number({ message: "Wynagrodzenie jest wymagane" })
      .min(1, "Wynagrodzenie musi być większe od 0")
      .max(1000000, "Wynagrodzenie nie może przekraczać 1,000,000 PLN"),

    workStartYear: z
      .number({ message: "Rok rozpoczęcia pracy jest wymagany" })
      .min(1950, "Rok rozpoczęcia nie może być wcześniejszy niż 1950")
      .max(
        new Date().getFullYear(),
        "Rok rozpoczęcia nie może być w przyszłości"
      ),

    workEndYear: z
      .number({ message: "Rok zakończenia pracy jest wymagany" })
      .min(
        new Date().getFullYear(),
        "Rok zakończenia nie może być w przeszłości"
      )
      .max(2100, "Rok zakończenia nie może być późniejszy niż 2100"),

    zusAccountFunds: z
      .number()
      .min(0, "Środki na koncie ZUS nie mogą być ujemne")
      .max(10000000, "Środki na koncie ZUS nie mogą przekraczać 10,000,000 PLN")
      .optional()
      .default(0),

    zusSubAccountFunds: z
      .number()
      .min(0, "Środki na subkoncie ZUS nie mogą być ujemne")
      .max(
        10000000,
        "Środki na subkoncie ZUS nie mogą przekraczać 10,000,000 PLN"
      )
      .optional()
      .default(0),

    includeZusFields: z.boolean().optional().default(false),
    includeSickLeave: z.boolean().optional().default(false),

    postalCode: z
      .string()
      .regex(/^\d{2}-\d{3}$/, "Podaj kod w formacie XX-XXX")
      .optional()
      .or(z.literal("")),
  })
  .refine((data) => data.workEndYear > data.workStartYear, {
    message: "Rok zakończenia pracy musi być późniejszy niż rok rozpoczęcia",
    path: ["workEndYear"],
  });

export type SimulationFormData = z.infer<typeof simulationFormSchema>;

export type SimulationFormDataWithDefaults = {
  age: number;
  gender: "man" | "woman";
  grossSalary: number;
  workStartYear: number;
  workEndYear: number;
  zusAccountFunds: number;
  zusSubAccountFunds: number;
  includeZusFields: boolean;
  includeSickLeave: boolean;
};

export type SimulationFormInterface = z.input<typeof simulationFormSchema>;

export type SimulationFormOutput = z.output<typeof simulationFormSchema>;
