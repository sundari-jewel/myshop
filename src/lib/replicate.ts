import Replicate from "replicate";
import type { JewelleryType } from "@/models/ProductTryonConfig";

// ── Types ──────────────────────────────────────────────────────────────────

export type PredictionStatus = "starting" | "processing" | "succeeded" | "failed" | "canceled";

export interface PredictionResult {
  status:     PredictionStatus;
  outputUrl?: string;
  error?:     string;
}

export interface RefinementInput {
  compositeUrl:      string;
  blendMaskUrl:      string;
  jewelleryType:     JewelleryType;
  promptDescriptor?: string;
  seed:              number;
}

export interface RefinementProvider {
  startRefinement(input: RefinementInput): Promise<string>;
  pollResult(providerJobId: string): Promise<PredictionResult>;
}

// ── Prompts ────────────────────────────────────────────────────────────────

export function buildRefinementPrompt(type: JewelleryType, descriptor?: string): string {
  const blend = "seamless lighting integration, soft contact shadow, photorealistic skin interaction";
  return `${descriptor ?? "gold jewellery"}, ${blend}, professional jewellery photography, preserve exact jewellery design`;
}

export function buildNegativePrompt(): string {
  return "different jewellery, missing jewellery, changed jewellery shape, extra jewellery, blurry, distorted anatomy";
}

// ── Replicate implementation ───────────────────────────────────────────────

export const FLUX_FILL_MODEL = "black-forest-labs/flux-fill-pro";

export class ReplicateProvider implements RefinementProvider {
  private client: Replicate;

  constructor() {
    this.client = new Replicate({ auth: process.env.REPLICATE_API_TOKEN! });
  }

  async startRefinement(input: RefinementInput): Promise<string> {
    const prediction = await this.client.predictions.create({
      model: FLUX_FILL_MODEL,
      input: {
        image:    input.compositeUrl,
        mask:     input.blendMaskUrl,
        prompt:   buildRefinementPrompt(input.jewelleryType, input.promptDescriptor),
        strength: 0.28,
        guidance: 3.5,
        seed:     input.seed,
      },
      webhook:               process.env.REPLICATE_WEBHOOK_URL,
      webhook_events_filter: ["completed"],
    });
    return prediction.id;
  }

  async pollResult(providerJobId: string): Promise<PredictionResult> {
    const prediction = await this.client.predictions.get(providerJobId);
    return {
      status:    prediction.status as PredictionStatus,
      outputUrl: Array.isArray(prediction.output)
        ? prediction.output[0]
        : (prediction.output as string | undefined) ?? undefined,
      error: prediction.error ? String(prediction.error) : undefined,
    };
  }
}

export const defaultProvider: RefinementProvider = new ReplicateProvider();
