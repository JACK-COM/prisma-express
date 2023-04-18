import { objectType } from "nexus";

/** All `User` fields we want to expose via GraphQL */
export const MFUser = objectType({
  name: "MFUser",
  description: "An Application user",
  definition(t) {
    t.nonNull.int("id");
    t.nonNull.string("email");
    t.nonNull.string("displayName");
    t.nonNull.field("authSource", { type: "Authenticator" });
    t.nonNull.field("role", { type: "UserRole" });
    t.nonNull.field("created", { type: "CsDateTime" });
    t.nonNull.field("lastSeen", { type: "CsDateTime" });

    // List properties
    t.list.field("Series", { type: "MFSeries" });
    t.list.field("Books", { type: "MFBook" });
    t.list.field("Characters", { type: "MFCharacter" });
    t.list.field("Timelines", { type: "MFTimeline" });
    t.list.field("Worlds", { type: "MFWorld" });

    // t.list.field("Chapters", { type: "MFChapter" });
    // t.list.field("Events", { type: "MFEvent" });
    // t.list.field("Groups", { type: "MFGroup" });
    // t.list.field("Locations", { type: "MFLocation" });
    // t.list.field("Scenes", { type: "MFScene" });

    // t.list.field("TimelineEvents", { type: "MFTimelineEvent" });
  }
});
