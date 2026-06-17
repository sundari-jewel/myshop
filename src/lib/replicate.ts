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
  seed?:             number;
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
const FLUX_STRENGTH = 0.28;
const FLUX_GUIDANCE = 3.5;

export class ReplicateProvider implements RefinementProvider {
  private client: Replicate;

  constructor() {
    const token = process.env.REPLICATE_API_TOKEN;
    if (!token) throw new Error("REPLICATE_API_TOKEN is not set");
    this.client = new Replicate({ auth: token });
  }

  async startRefinement(input: RefinementInput): Promise<string> {
    if (!process.env.REPLICATE_WEBHOOK_URL) {
      console.warn("[replicate] REPLICATE_WEBHOOK_URL is not set — webhook notifications disabled");
    }
    const seed = input.seed ?? Math.floor(Math.random() * 2 ** 32);
    const prediction = await this.client.predictions.create({
      model: FLUX_FILL_MODEL,
      input: {
        image:    input.compositeUrl,
        mask:     input.blendMaskUrl,
        prompt:   buildRefinementPrompt(input.jewelleryType, input.promptDescriptor),
        strength: FLUX_STRENGTH,
        guidance: FLUX_GUIDANCE,
        seed,
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
        ? (prediction.output[0] as string | undefined)
        : typeof prediction.output === "string"
          ? prediction.output
          : undefined,
      error: prediction.error ? String(prediction.error) : undefined,
    };
  }
}

export let defaultProvider: RefinementProvider = new ReplicateProvider();
