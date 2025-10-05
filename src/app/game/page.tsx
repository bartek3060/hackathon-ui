"use client";
import dynamic from 'next/dynamic'

const DynamicComponentWithNoSSR = dynamic(
  () => import('./components/GameScreen').then((mod) => mod.GameScreen),
  { ssr: false }
)

export default function Game() {
  return <DynamicComponentWithNoSSR />;
}


