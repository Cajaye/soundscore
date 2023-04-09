import type { Rate } from "@prisma/client";

const calcsoundscore = (rate: Rate[]) => {
  const fire = rate.filter((r) => r.rateType === "fire").length;
  const mid = rate.filter((r) => r.rateType === "mid").length;
  const trash = rate.filter((r) => r.rateType === "trash").length;

  const total = fire + mid + trash;
  const soundscore: number = isNaN(Math.floor((fire / total) * 100))
    ? 0
    : Math.floor((fire / total) * 100);

  return soundscore;
};

export default calcsoundscore;
