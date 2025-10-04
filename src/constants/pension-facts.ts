export const PENSION_FACTS = [
  "Czy wiesz, że najwyższą emeryturę w Polsce otrzymuje mieszkaniec województwa śląskiego? Wysokość jego emerytury to 48 720 zł, pracował przez 52 lata i nie był nigdy na zwolnieniu lekarskim.",
  "Średni wiek przejścia na emeryturę w Polsce to 60 lat dla kobiet i 65 lat dla mężczyzn. To jeden z najniższych progów emerytalnych w Unii Europejskiej.",
  "W Polsce jest ponad 9,8 miliona emerytów i rencistów, co stanowi około 25% całej populacji kraju.",
  "Pierwszy system emerytalny w Polsce powstał w 1889 roku za czasów zaborów, wzorowany na niemieckim systemie Bismarcka.",
  "Najdłużej pracujący emeryt w Polsce przepracował 67 lat - zaczął pracę w wieku 14 lat i przeszedł na emeryturę w wieku 81 lat.",
  "Przeciętna emerytura w Polsce wynosi około 3 500 zł brutto, ale różnice regionalne są znaczące - najwyższe emerytury są w województwie mazowieckim.",
  "Kobiety otrzymują średnio o 30% niższą emeryturę niż mężczyźni, głównie z powodu przerw w karierze związanych z opieką nad dziećmi.",
  "System emerytalny w Polsce składa się z trzech filarów: obowiązkowego ZUS, dobrowolnych PPK oraz indywidualnych oszczędności emerytalnych.",
  "Corocznie w Polsce na emeryturę przechodzi około 400 tysięcy osób, przy czym kobiety stanowią około 55% nowych emerytów.",
  "Najniższa emerytura w Polsce to 1 780,96 zł brutto. Aby ją otrzymać, trzeba przepracować minimum 20 lat dla kobiet i 25 lat dla mężczyzn.",
  "W Polsce prawo do emerytury można uzyskać wcześniej - kobiety po 55 latach życia i 30 latach składkowych, jeśli wysokość emerytury wyniesie co najmniej 1,2 średniego wynagrodzenia.",
  "Emerytury w Polsce są waloryzowane corocznie, co oznacza ich podwyższanie o wskaźnik inflacji plus 20% realnego wzrostu przeciętnego wynagrodzenia.",
];

export function getRandomPensionFact(): string {
  return PENSION_FACTS[Math.floor(Math.random() * PENSION_FACTS.length)];
}

