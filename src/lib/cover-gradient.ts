import gradients from "@/generated/cover-gradients.json";

export type CoverGradient = { light: string; dark: string };

const map = gradients as Record<string, CoverGradient | null>;

export function getCoverGradient(coverPath: string): CoverGradient | null {
    return map[coverPath] ?? null;
}
