"use client";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

import { useTestQuery } from "@/hooks/queries/useTestQuery";

export default function Home() {
  const data = useTestQuery();

  return (
    <div className="flex ">
      <div>{JSON.stringify(data?.data[0])}</div>;
    </div>
  );
}
