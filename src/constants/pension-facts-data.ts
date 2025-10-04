export type Fact = {
  id: string;
  title: string;
  teaser: string;
  body: string;
  sourceLabel?: string;
  sourceUrl?: string;
  tags?: string[];
};

export const PENSION_FACTS: Fact[] = [
  {
    id: "fact-1",
    title: "Najwyższa emerytura w Polsce",
    teaser: "Najwyższą emeryturę w Polsce otrzymuje mieszkaniec województwa śląskiego. Jego świadczenie wynosi ponad 48 000 zł miesięcznie.",
    body: "Najwyższą emeryturę w Polsce otrzymuje mieszkaniec województwa śląskiego, który przepracował ponad 50 lat w górnictwie. Wysokość jego emerytury to ponad 48 000 zł miesięcznie. Przez całą swoją karierę zawodową nie był ani razu na zwolnieniu lekarskim, a jego składki były odprowadzane z najwyższych możliwych podstaw wymiaru.",
    sourceLabel: "ZUS",
    sourceUrl: "https://www.zus.pl/",
    tags: ["emerytura", "rekord"]
  },
  {
    id: "fact-2",
    title: "Wiek emerytalny w Polsce",
    teaser: "Obecnie wiek emerytalny w Polsce wynosi 60 lat dla kobiet i 65 lat dla mężczyzn, ale nie zawsze tak było.",
    body: "Wiek emerytalny w Polsce przeszedł wiele zmian na przestrzeni lat. W 2013 roku wprowadzono reformę podwyższającą wiek emerytalny do 67 lat dla obu płci, jednak w 2017 roku wrócono do poprzednich zasad: 60 lat dla kobiet i 65 lat dla mężczyzn. Ta zmiana wywołała wiele debat społecznych i politycznych o przyszłości systemu emerytalnego.",
    sourceLabel: "ZUS - Wiek emerytalny",
    sourceUrl: "https://www.zus.pl/",
    tags: ["wiek emerytalny", "reforma"]
  },
  {
    id: "fact-3",
    title: "Średnia emerytura w Polsce",
    teaser: "Średnia emerytura z systemu powszechnego wynosi około 3 500 zł brutto. To jednak nie cała prawda o świadczeniach seniorów.",
    body: "Według danych ZUS, średnia emerytura z systemu powszechnego wynosi około 3 500 zł brutto (dane za 2024 rok). Należy jednak pamiętać, że ta wartość obejmuje bardzo zróżnicowaną grupę emerytów. Wysokość emerytury zależy od wielu czynników: długości okresu składkowego, wysokości zarobków, z których odprowadzano składki, oraz wieku przejścia na emeryturę. Emerytury kobiet są średnio niższe od emerytur mężczyzn, głównie ze względu na krótszy staż pracy i niższe zarobki.",
    sourceLabel: "ZUS - Statystyki",
    sourceUrl: "https://www.zus.pl/",
    tags: ["średnia", "statystyki"]
  },
  {
    id: "fact-4",
    title: "System kapitałowy a repartycyjny",
    teaser: "Polski system emerytalny łączy w sobie elementy systemu kapitałowego i repartycyjnego. Rozumiesz różnicę?",
    body: "Polski system emerytalny jest systemem mieszanym. Składa się z dwóch filarów: pierwszego filara (zarządzanego przez ZUS) opartego na systemie repartycyjnym, gdzie składki obecnych pracowników finansują świadczenia obecnych emerytów, oraz elementów kapitałowych w ramach subkonta. W systemie kapitałowym składki są gromadzone na indywidualnych kontach i inwestowane, a przyszła emerytura zależy od zgromadzonego kapitału. Reforma emerytalna z 1999 roku wprowadziła ten mieszany model, aby zwiększyć stabilność systemu i powiązać wysokość emerytury z wkładem jednostki.",
    sourceLabel: "ZUS - System emerytalny",
    sourceUrl: "https://www.zus.pl/",
    tags: ["system", "reforma"]
  },
  {
    id: "fact-5",
    title: "Kapitał początkowy",
    teaser: "Jeśli pracowałeś przed 1999 rokiem, ZUS musi ustalić Twój kapitał początkowy. To kluczowy element przyszłej emerytury.",
    body: "Kapitał początkowy to kwota, która odzwierciedla Twoje prawa emerytalne nabyte przed 1 stycznia 1999 roku, czyli przed reformą emerytalną. ZUS przelicza wszystkie Twoje składki i okresy pracy z czasów starego systemu na kapitał zgodny z nowym systemem. Wysokość kapitału początkowego zależy od stażu pracy i wysokości zarobków w wybranym okresie bazowym. Jest to bardzo ważny element, ponieważ dla wielu osób stanowi znaczną część podstawy wyliczenia emerytury. Kapitał ten jest później waloryzowany i dolicza się do niego składki odprowadzane po 1999 roku.",
    sourceLabel: "ZUS - Kapitał początkowy",
    sourceUrl: "https://www.zus.pl/",
    tags: ["kapitał początkowy", "reforma"]
  },
  {
    id: "fact-6",
    title: "Emerytury pomostowe",
    teaser: "Niektóre zawody uprawniają do wcześniejszej emerytury. Czy Twój zawód jest na liście?",
    body: "Emerytury pomostowe to świadczenia dla osób, które pracowały w szczególnych warunkach lub w szczególnym charakterze. Obejmują one m.in. pracowników wykonujących prace w szczególnie szkodliwych warunkach, nauczycieli, służby mundurowe, górników. Warunkiem uzyskania emerytury pomostowej jest odpowiedni staż pracy w takich warunkach (zazwyczaj minimum 15 lat) oraz osiągnięcie określonego wieku (niższego niż powszechny wiek emerytalny). System emerytur pomostowych powstał jako rekompensata za wcześniejszą utratę zdolności do pracy w związku z wykonywaniem ciężkich zawodów.",
    sourceLabel: "ZUS - Emerytury pomostowe",
    sourceUrl: "https://www.zus.pl/",
    tags: ["emerytura pomostowa", "zawody"]
  },
  {
    id: "fact-7",
    title: "Przeliczenie emerytury",
    teaser: "Twoja emerytura może być przeliczona! Dowiedz się, kiedy warto złożyć wniosek o przeliczenie świadczenia.",
    body: "Emerytura może być przeliczona z urzędu lub na wniosek emeryta. Przeliczenie z urzędu następuje automatycznie, gdy ZUS otrzyma nowe dokumenty wpływające na wysokość świadczenia. Emeryt może również sam wystąpić o przeliczenie, jeśli: odkryje nowe dokumenty dotyczące okresów składkowych lub zarobków, będzie kontynuował pracę po przejściu na emeryturę i odprowadzał dalsze składki, lub gdy zmienią się przepisy korzystne dla emeryta. Wniosek o przeliczenie można złożyć w dowolnym momencie, a jeśli okaże się, że emerytura powinna być wyższa, ZUS wypłaci wyrównanie za maksymalnie 3 lata wstecz.",
    sourceLabel: "ZUS - Przeliczenie emerytury",
    sourceUrl: "https://www.zus.pl/",
    tags: ["przeliczenie", "wniosek"]
  },
  {
    id: "fact-8",
    title: "Waloryzacja emerytur",
    teaser: "Twoja emerytura jest corocznie waloryzowana, czyli podwyższana. Jak to działa?",
    body: "Waloryzacja to mechanizm corocznej podwyżki emerytur, który ma na celu utrzymanie ich realnej wartości mimo inflacji. Następuje ona 1 marca każdego roku. Wysokość waloryzacji zależy od wskaźnika cen towarów i usług konsumpcyjnych (inflacji) oraz 20% realnego wzrostu przeciętnego wynagrodzenia. Minimalna waloryzacja to 100% inflacji, co oznacza, że emerytury zawsze rosną co najmniej tak szybko, jak drożeją produkty i usługi. W latach wysokiej inflacji waloryzacja może znacząco podnieść wysokość świadczeń, choć jej głównym celem jest ochrona siły nabywczej emerytów.",
    sourceLabel: "ZUS - Waloryzacja",
    sourceUrl: "https://www.zus.pl/",
    tags: ["waloryzacja", "podwyżka"]
  }
];

