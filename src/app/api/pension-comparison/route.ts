import { NextResponse } from "next/server";

export interface PensionGroup {
  id: string;
  name: string;
  averageAmount: number;
  percentage: number;
  description: string;
  color: string;
}

export interface PensionComparisonData {
  nationalAverage: number;
  userAmount: number;
  groups: PensionGroup[];
}

export async function POST(request: Request) {
  try {
    const { desiredAmount } = await request.json();

    const pensionGroups: PensionGroup[] = [
      {
        id: "below-minimum",
        name: "Poniżej minimalnej",
        averageAmount: 1200,
        percentage: 15,
        description:
          "Świadczeniobiorcy otrzymujący emeryturę w wysokości poniżej minimalnej wykazywali się niską aktywnością zawodową, nie przepracowali minimum 25 lat dla mężczyzn i 20 lat dla kobiet, w związku z tym nie nabyli prawa do gwarancji minimalnej emerytury.",
        color: "#F05E5E",
      },
      {
        id: "minimum",
        name: "Minimalna",
        averageAmount: 1780,
        percentage: 22,
        description:
          "Osoby otrzymujące emeryturę minimalną przepracowały wymagany staż, jednak ich podstawy wymiaru były niskie. Wysokość emerytury minimalnej jest waloryzowana corocznie i stanowi gwarancję minimalnego świadczenia dla uprawnionych.",
        color: "#FFB34F",
      },
      {
        id: "below-average",
        name: "Poniżej średniej",
        averageAmount: 2500,
        percentage: 28,
        description:
          "Grupa obejmująca osoby, które przepracowały wymagany okres, jednak ich wynagrodzenia były poniżej średniej krajowej. Często są to osoby zatrudnione w sektorach o niższych zarobkach lub z przerwami w karierze zawodowej.",
        color: "#BEC3CE",
      },
      {
        id: "average",
        name: "Średnia krajowa",
        averageAmount: 3500,
        percentage: 20,
        description:
          "Emerytura na poziomie średniej krajowej. Osoby z tej grupy przepracowały pełny staż zawodowy z wynagrodzeniem zbliżonym do średniej krajowej. Stanowią punkt odniesienia dla systemu emerytalnego.",
        color: "#3F84D2",
      },
      {
        id: "above-average",
        name: "Powyżej średniej",
        averageAmount: 5000,
        percentage: 10,
        description:
          "Osoby osiągające emerytury powyżej średniej charakteryzują się długim stażem pracy oraz ponadprzeciętnymi zarobkami. Często są to kadra kierownicza, specjaliści oraz osoby prowadzące własną działalność gospodarczą.",
        color: "#00993F",
      },
      {
        id: "high",
        name: "Wysokie",
        averageAmount: 7500,
        percentage: 5,
        description:
          "Najwyższe emerytury otrzymują osoby, które przez większość kariery zawodowej osiągały wysokie dochody podlegające oskładkowaniu. Często są to osoby z wyższym wykształceniem, zajmujące stanowiska kierownicze najwyższego szczebla.",
        color: "#00416E",
      },
    ];

    const nationalAverage = 3500;

    const data: PensionComparisonData = {
      nationalAverage,
      userAmount: desiredAmount,
      groups: pensionGroups,
    };

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: "Invalid request" },
      { status: 400 }
    );
  }
}

