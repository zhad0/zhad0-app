import { useRef, useEffect } from "react";
import { useInView } from "framer-motion";
import { useScramble } from "@/hooks/use-scramble";

interface ScrambleTextProps {
  children: string;
  duration?: number;
  className?: string;
  trigger?: "hover" | "click" | "both";
}

export function ScrambleText({
  children,
  duration,
  className,
  trigger = "hover",
}: ScrambleTextProps) {
  const { display, trigger: scramble } = useScramble(children, duration);

  return (
    <span
      className={className}
      onMouseEnter={trigger === "hover" || trigger === "both" ? scramble : undefined}
      onClick={trigger === "click" || trigger === "both" ? scramble : undefined}
    >
      {display}
    </span>
  );
}

/* ── ScrambleHeading: auto-fires on scroll into view ── */
interface ScrambleHeadingProps {
  children: string;
  duration?: number;
  delay?: number;
  className?: string;
}

export function ScrambleHeading({
  children,
  duration = 900,
  delay = 0,
  className = "",
}: ScrambleHeadingProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const { display, trigger } = useScramble(children, duration);
  const fired = useRef(false);

  useEffect(() => {
    if (!inView || fired.current) return undefined;
    fired.current = true;
    if (delay > 0) {
      const t = setTimeout(trigger, delay);
      return () => clearTimeout(t);
    }
    trigger();
    return undefined;
  }, [inView, delay, trigger]);

  return (
    <span ref={ref} className={className}>
      {display}
    </span>
  );
}
