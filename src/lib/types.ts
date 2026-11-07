export const TOPICS = [
  { id: "stress", label: "Stress & difficult calls" },
  { id: "grief", label: "Grief & loss" },
  { id: "family", label: "Family challenges" },
  { id: "burnout", label: "Burnout & exhaustion" },
  { id: "recovery", label: "Fear, uncertainty & recovery" },
  { id: "families", label: "For spouses & families" },
] as const;

export type TopicId = (typeof TOPICS)[number]["id"];

export const ENTRY_TYPES = [
  { id: "prayer", label: "Prayer" },
  { id: "scripture", label: "Scripture" },
  { id: "reflection", label: "Reflection" },
  { id: "encouragement", label: "Encouragement" },
] as const;

export type EntryType = (typeof ENTRY_TYPES)[number]["id"];

/** Faith tradition of a prayer, reading, or encouragement. "all" means written for everyone, with no religious language. */
export const TRADITIONS = [
  { id: "all", label: "Everyone (no religious language)" },
  { id: "christian", label: "Christian" },
  { id: "jewish", label: "Jewish" },
  { id: "muslim", label: "Muslim" },
  { id: "buddhist", label: "Buddhist" },
  { id: "hindu", label: "Hindu" },
] as const;

export type TraditionId = (typeof TRADITIONS)[number]["id"];

/** What a person can pick under "My faith". Saved only on their device. "" shows everything. */
export const FAITH_CHOICES = [
  { id: "", label: "Show everything" },
  { id: "christian", label: "Christian" },
  { id: "jewish", label: "Jewish" },
  { id: "muslim", label: "Muslim" },
  { id: "buddhist", label: "Buddhist" },
  { id: "hindu", label: "Hindu" },
  { id: "other", label: "Another faith" },
  { id: "none", label: "No religious preference" },
] as const;

export type FaithChoice = (typeof FAITH_CHOICES)[number]["id"];

export const RESOURCE_CATEGORIES = [
  { id: "chaplain", label: "Chaplain support" },
  { id: "peer", label: "Peer support" },
  { id: "grief", label: "Grief support" },
  { id: "counseling", label: "Counseling" },
  { id: "family", label: "Family resources" },
  { id: "crisis", label: "Crisis support" },
] as const;

export type ResourceCategory = (typeof RESOURCE_CATEGORIES)[number]["id"];

export const IDEA_CATEGORIES = [
  { id: "prayer", label: "A prayer" },
  { id: "topic", label: "A topic to cover" },
  { id: "resource", label: "A resource" },
  { id: "event", label: "An event" },
  { id: "app", label: "App improvement" },
  { id: "other", label: "Something else" },
] as const;

export type IdeaCategory = (typeof IDEA_CATEGORIES)[number]["id"];

export interface Settings {
  appName: string;
  departmentName: string;
  /** Optional department badge as a small PNG/JPEG/WebP data URL (resized in the browser before upload). */
  departmentLogo: string;
  departmentAddress: string;
  departmentPhone: string;
  departmentEmail: string;
  departmentWebsite: string;
  /** Shown as a banner on every page while forms are not backed by secure storage. */
  prototypeMode: boolean;
}

export interface ChaplainContact {
  name: string;
  title: string;
  /** Phone number for calls. Leave empty if no direct line is available. */
  phone: string;
  /** Phone number for texts. Falls back to `phone` when empty. */
  textPhone: string;
  availability: string;
  note: string;
}

export interface Encouragement {
  id: string;
  text: string;
  reference: string;
  tradition: TraditionId;
}

export interface LibraryEntry {
  id: string;
  title: string;
  type: EntryType;
  topics: TopicId[];
  body: string;
  reference: string;
  tradition: TraditionId;
}

export interface Resource {
  id: string;
  category: ResourceCategory;
  name: string;
  description: string;
  phone: string;
  text: string;
  url: string;
  hours: string;
}

export type SubmissionStatus = "new" | "reviewed" | "archived";

interface SubmissionBase {
  id: string;
  createdAt: string;
  status: SubmissionStatus;
}

export interface PrayerRequest extends SubmissionBase {
  kind: "prayer";
  anonymous: boolean;
  name: string;
  visibility: "chaplain" | "prayer-group";
  request: string;
}

export interface IdeaSubmission extends SubmissionBase {
  kind: "idea";
  anonymous: boolean;
  name: string;
  category: IdeaCategory;
  idea: string;
}

export interface FollowUpRequest extends SubmissionBase {
  kind: "followup";
  name: string;
  contactMethod: "call" | "text" | "email";
  contact: string;
  bestTime: string;
  note: string;
}

export type Submission = PrayerRequest | IdeaSubmission | FollowUpRequest;

/** Everything an administrator can edit. Personal pastor/friend contacts are never part of this. */
export interface SiteContent {
  settings: Settings;
  chaplain: ChaplainContact;
  encouragements: Encouragement[];
  library: LibraryEntry[];
  resources: Resource[];
}

/**
 * A browser's anonymous push address for the optional daily reminder.
 * It identifies a device's browser, not a person, and is never shown in the admin area.
 */
export interface PushSubscriptionRecord {
  endpoint: string;
  p256dh: string;
  auth: string;
  /** Local hour (0–23) the person chose. */
  hour: number;
  /** IANA time zone, e.g. "America/Chicago". */
  tz: string;
  /** Local date (YYYY-MM-DD) of the last reminder sent, so nobody gets two in a day. */
  lastSentOn: string | null;
  createdAt: string;
}

export interface Store extends SiteContent {
  submissions: Submission[];
  pushSubscriptions: PushSubscriptionRecord[];
}
