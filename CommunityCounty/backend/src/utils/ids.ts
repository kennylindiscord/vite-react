import crypto from "crypto";

export function id(prefix: string) {
  return `${prefix}_${crypto.randomBytes(10).toString("hex")}`;
}

export function anonTag() {
  const words = ["Sky", "River", "Pine", "Stone", "Sun", "Moon", "Cloud", "Maple", "Oak", "Lake"];
  const w = words[Math.floor(Math.random() * words.length)];
  const tail = crypto.randomBytes(2).toString("hex").toUpperCase();
  return `${w}-${tail}`;
}

