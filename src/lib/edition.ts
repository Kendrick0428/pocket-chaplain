/**
 * Which audience this copy of the app serves. Each edition is deployed as its own
 * site with its own data; set NEXT_PUBLIC_EDITION=fire for the firefighter edition.
 * Everything else (prayers, resources, chaplain contact) is edited from /admin.
 */
export type EditionId = "police" | "fire";

export const EDITION: EditionId = process.env.NEXT_PUBLIC_EDITION === "fire" ? "fire" : "police";

type Edition = {
  /** Full name for browser tabs, the installed app, and search results. */
  appName: string;
  /** Shown after the app name in the header and home screen ("" for none). */
  label: string;
  description: string;
  /** Who the app is for, as in "for the ___ of [Department]". */
  audience: string;
  /** Label for the department's address field in Admin → Settings. */
  addressLabel: string;
  /** Work identifiers the privacy page promises not to collect. */
  workIds: string;
  themeColor: string;
};

const EDITIONS: Record<EditionId, Edition> = {
  police: {
    appName: "The Pocket Chaplain",
    label: "",
    description:
      "Support for those who serve. Prayer, encouragement, and easy access to chaplain support for law enforcement officers, staff, and their families.",
    audience: "officers, staff, and families",
    addressLabel: "Precinct or office address",
    workIds: "badge number, rank, or assignment",
    themeColor: "#0b1730",
  },
  fire: {
    appName: "Pocket Chaplain: Fire & Rescue",
    label: "Fire & Rescue",
    description:
      "Support for those who serve. Prayer, encouragement, and easy access to chaplain support for firefighters, rescue and EMS crews, staff, and their families.",
    audience: "firefighters, rescue and EMS crews, staff, and families",
    addressLabel: "Station or headquarters address",
    workIds: "employee number, rank, or station assignment",
    themeColor: "#0b1730",
  },
};

export const edition = EDITIONS[EDITION];
