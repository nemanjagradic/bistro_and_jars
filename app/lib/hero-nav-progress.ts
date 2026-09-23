export type HeroNavKind = "absent" | "pin" | "static";

export type HeroNavSignal = {
  kind: HeroNavKind;
  progress: number;
};

type Listener = (signal: HeroNavSignal) => void;

const listeners = new Set<Listener>();

let signal: HeroNavSignal = { kind: "absent", progress: 0 };

export function getHeroNavSignal(): HeroNavSignal {
  return signal;
}

export function setHeroNavSignal(next: HeroNavSignal) {
  signal = next;
  listeners.forEach((fn) => fn(next));
}

export function subscribeHeroNav(fn: Listener) {
  listeners.add(fn);
  fn(signal);
  return () => {
    listeners.delete(fn);
  };
}
