import { objectType } from "nexus";

/** All `User` fields we want to expose via GraphQL */
export const MFUser = objectType({
  name: "MFUser",
  description: "An Application user",
  definition(t) {
    t.nonNull.int("id");
    t.nonNull.int("email");
    t.nonNull.int("displayName");
    t.nonNull.field("authSource", { type: "Authenticator" });
    t.nonNull.field("role", { type: "UserRole" });
    t.nonNull.field("created", { type: "CsDateTime" });
    t.nonNull.field("lastSeen", { type: "CsDateTime" });

    // List properties: uncomment when these objects exist
    // t.list.field("Books", { type: "MFBook" });
    // t.list.field("Chapters", { type: "MFChapter" });
    // t.list.field("Characters", { type: "MFCharacter" });
    // t.list.field("Events", { type: "MFEvent" });
    // t.list.field("Groups", { type: "MFGroup" });
    // t.list.field("Locations", { type: "MFLocation" });
    // t.list.field("Paragraphs", { type: "MFParagraph" });
    // t.list.field("Scenes", { type: "MFScene" });
    // t.list.field("Timelines", { type: "MFTimeline" });
    // t.list.field("Worlds", { type: "MFWorld" });
    // t.list.field("Series", { type: "MFSeries" });
    // t.list.field("TimelineEvent", { type: "MFTimelineEvent" });
  }
});
