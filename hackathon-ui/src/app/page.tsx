"use client";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

import { useTestQuery } from "@/hooks/queries/useTestQuery";
import { Button } from "@mui/material";

export default function Home() {
  const data = useTestQuery();

  return (
    <div className="flex ">
      <div>{JSON.stringify(data?.data[0])}</div>;
      <Button variant="contained">Hello world</Button>
      <Button variant="contained">Hello world</Button>
    </div>
  );
}
