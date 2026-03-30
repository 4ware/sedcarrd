import { AnimatedGroup } from "@/components/ui/animated-group";
import type { FC } from "react";
import { transitionVariants } from "./hero";
import Image from "next/image";

const AppScreen: FC = () => {
  return (
    <section>
      <AnimatedGroup
        variants={{
          container: {
            visible: {
              transition: {
                staggerChildren: 0.05,
                delayChildren: 0.75,
              },
            },
          },
          ...transitionVariants,
        }}
      >
        <div className="mask-b-from-55% relative -mr-56 mt-8 overflow-hidden px-2 sm:mr-0 sm:mt-12 md:mt-20">
          <div className="inset-shadow-2xs ring-background dark:inset-shadow-white/20 bg-background relative mx-auto max-w-6xl overflow-hidden rounded-2xl border p-4 shadow-lg shadow-zinc-950/15 ring-1">
            <Image
              className="bg-background aspect-15/8 relative hidden rounded-2xl dark:block"
              src="/mail2.png"
              alt="app screen"
              width="2700"
              height="1440"
            />
            <Image
              className="z-2 border-border/25 aspect-15/8 relative rounded-2xl border dark:hidden"
              src="/mail2-light.png"
              alt="app screen"
              width="2700"
              height="1440"
            />
          </div>
        </div>
      </AnimatedGroup>
    </section>
  );
};

export default AppScreen;
