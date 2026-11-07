import { FAITH_CHOICES, TRADITIONS, type FaithChoice, type TraditionId } from "./types";

const TRADITION_IDS = TRADITIONS.map((t) => t.id) as string[];

/**
 * The tradition an item belongs to. Content saved before traditions existed has none, so
 * prayers, scripture, and anything with a scripture reference count as Christian.
 */
export function traditionOf(item: { tradition?: string; type?: string; reference?: string }): TraditionId {
  if (item.tradition && TRADITION_IDS.includes(item.tradition)) return item.tradition as TraditionId;
  if (item.type) return item.type === "prayer" || item.type === "scripture" ? "christian" : "all";
  return item.reference ? "christian" : "all";
}

export function isFaithChoice(v: unknown): v is FaithChoice {
  return FAITH_CHOICES.some((c) => c.id === v);
}

/** Whether an item should show for someone who chose `faith` ("" = show everything). */
export function matchesFaith(tradition: TraditionId, faith: FaithChoice) {
  if (!faith || tradition === "all") return true;
  return tradition === faith;
}

/** True when the chosen faith has its own tradition-specific content to show. */
export const hasOwnTradition = (faith: FaithChoice) => TRADITION_IDS.includes(faith);

export const faithLabel = (faith: FaithChoice) => FAITH_CHOICES.find((c) => c.id === faith)?.label ?? "";
