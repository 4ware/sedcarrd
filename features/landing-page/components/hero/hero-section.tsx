import { HERO_HEADLINE_ID } from "./hero-headline";
import { Container } from "@/components/container";
import { HeroShowcase } from "../showcase/hero-showcase";
import { HeroCopy } from "./hero-copy";

export function HeroSection() {
  return (
    <section aria-labelledby={HERO_HEADLINE_ID} className="overflow-hidden bg-sand py-16 sm:py-24">
      <Container className="grid items-center gap-16 lg:grid-cols-[1.15fr_1fr]">
        <HeroCopy />
        <HeroShowcase />
      </Container>
    </section>
  );
}
