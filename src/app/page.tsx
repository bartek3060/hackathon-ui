"use client";

import { useTestQuery } from "@/hooks/queries/useTestQuery";

export default function Home() {
  const data = useTestQuery();

  return (
    <div className="flex ">
      <div>{JSON.stringify(data?.data[0])}</div>;
    </div>
  );
}
