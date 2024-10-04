"use client";

import React, { forwardRef, useRef } from "react";

import { cn } from "@/lib/utils";
import { AnimatedBeam } from "@/components/ui/animated-beam";

const Circle = forwardRef<
  HTMLDivElement,
  { className?: string; children?: React.ReactNode }
>(({ className, children }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        "z-10 flex size-12 items-center justify-center rounded-full border-2 border-border  shadow-[0_0_20px_-12px_rgba(0,0,0,0.8)] mb-2",
        className
      )}
    >
      {children}
    </div>
  );
});

Circle.displayName = "Circle";

export function AnimatedBeamMultipleOutputDemo({
  className,
}: {
  className?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const div1Ref = useRef<HTMLDivElement>(null);
  const div2Ref = useRef<HTMLDivElement>(null);
  const div3Ref = useRef<HTMLDivElement>(null);
  const div4Ref = useRef<HTMLDivElement>(null);
  const div5Ref = useRef<HTMLDivElement>(null);
  const div6Ref = useRef<HTMLDivElement>(null);
  const div7Ref = useRef<HTMLDivElement>(null);

  return (
    <div
      className={cn(
        "relative flex h-[500px] w-full items-center justify-center overflow-hidden rounded-lg border p-10 md:shadow-xl",
        className
      )}
      ref={containerRef}
    >
      <div className="flex size-full flex-row items-stretch justify-between gap-10 max-w-lg">
        <div className="flex flex-col justify-center gap-2">
          <Circle ref={div1Ref}>
            <img
              src="/assets/networks/eth.png"
              className="h-10 w-10 bg-transparent rounded-3xl"
            />
          </Circle>
          <Circle ref={div2Ref}>
            <img
              src="/assets/networks/arbitrum.png"
              className="h-10 w-10 bg-transparent rounded-3xl"
            />
          </Circle>
          <Circle ref={div3Ref}>
            <img
              src="/assets/networks/op.png"
              className="h-10 w-10 bg-transparent rounded-3xl"
            />
          </Circle>
          <Circle ref={div4Ref}>
            <img
              src="/assets/networks/base.jpg"
              className="h-10 w-10 bg-transparent rounded-3xl"
            />
          </Circle>
          <Circle ref={div5Ref}>
            <img
              src="/assets/networks/polygon.webp"
              className="h-10 w-10 bg-transparent rounded-3xl"
            />
          </Circle>
        </div>
        <div className="flex flex-col justify-center">
          <Circle ref={div6Ref} className="size-16">
            <img
              src="/assets/logo.png"
              className="h-12 w-16 bg-transparent rounded-full"
            />
          </Circle>
        </div>
        <div className="flex flex-col justify-center">
          <Circle ref={div7Ref}>
            <img
              src="/assets/networks/solana.png"
              className="h-12 w-12 bg-transparent rounded-3xl"
            />
          </Circle>
        </div>
      </div>

      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div1Ref}
        toRef={div6Ref}
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div2Ref}
        toRef={div6Ref}
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div3Ref}
        toRef={div6Ref}
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div4Ref}
        toRef={div6Ref}
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div5Ref}
        toRef={div6Ref}
      />
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={div6Ref}
        toRef={div7Ref}
      />
    </div>
  );
}
