import type { Folder, Item, Kind, Source, Store } from "./types";

const MEDIA = ["#dcd7e4", "#e8d6c8", "#cdcaa6", "#e2ded2", "#45442a", "#dcdac0"];

export const folders: Folder[] = [
  { id: "health", name: "Health" },
  { id: "recipes", name: "Recipes" },
  { id: "wellness", name: "Wellness" },
  { id: "business", name: "Business" },
];

export const sources: Source[] = [
  { id: "field-notes", title: "Field Notes Weekly", kind: "article", site: "fieldnotes.example", color: MEDIA[2], status: "ok", folderIds: ["wellness"] },
  { id: "slow-kitchen", title: "The Slow Kitchen", kind: "video", site: "youtube.example", color: MEDIA[1], status: "ok", folderIds: ["recipes"] },
  { id: "coach-ana", title: "Coach Ana", kind: "video", site: "youtube.example", color: MEDIA[4], status: "ok", folderIds: ["health", "wellness"] },
  { id: "little-rituals", title: "Little Rituals", kind: "podcast", site: "littlerituals.example", color: MEDIA[0], status: "ok", folderIds: ["wellness"] },
  { id: "sleep-lab", title: "Sleep Lab", kind: "article", site: "sleeplab.example", color: MEDIA[5], status: "ok", folderIds: ["health", "wellness"] },
  { id: "maker-letters", title: "Maker Letters", kind: "article", site: "makerletters.example", color: MEDIA[3], status: "ok", folderIds: ["business"] },
  { id: "pricing-pod", title: "The Pricing Pod", kind: "podcast", site: "pricingpod.example", color: MEDIA[2], status: "needs_attention", folderIds: ["business"] },
  { id: "r-meditation", title: "r/Meditation", kind: "discussion", site: "reddit.example", color: MEDIA[3], status: "ok", folderIds: [] },
];

type Draft = [string, string, Kind, number, number, string]; // source, title, kind, minutes, hoursAgo, standfirst

const drafts: Draft[] = [
  ["field-notes", "The quiet case for walking without headphones", "article", 8, 3, "What happens to your attention when the soundtrack goes away."],
  ["coach-ana", "Strength training basics, explained in 12 minutes", "video", 12, 4, "A first session you can do with two dumbbells and a mat."],
  ["little-rituals", "The slow mornings episode: rituals that stick", "podcast", 41, 6, "Why the habits that survive are the ones that cost almost nothing."],
  ["slow-kitchen", "Fall soups, start to finish", "video", 24, 8, "Five soups, one pot, and a freezer plan for the week."],
  ["sleep-lab", "What 30 nights of sleep tracking actually taught me", "article", 9, 26, "The data was boring. The boring part was the lesson."],
  ["maker-letters", "Pricing when the work is slow", "article", 7, 28, "What to change first when the pipeline thins out."],
  ["r-meditation", "A beginner's guide to sitting still for five minutes", "discussion", 4, 30, "The thread that keeps getting reposted, and why it works."],
  ["field-notes", "The art of the weekly reset", "article", 6, 32, "One hour on Sunday that makes the other six days quieter."],
  ["little-rituals", "Ten quiet minutes: a walk without a podcast", "podcast", 10, 50, "An experiment in doing one thing at a time."],
  ["coach-ana", "Mobility routine for desk days", "video", 15, 52, "Eight movements for the hours you spend in a chair."],
  ["sleep-lab", "The two minute wind-down that actually works", "article", 3, 54, "Shorter than brushing your teeth, and it holds up."],
  ["maker-letters", "Rest is productive: a conversation on burnout", "article", 11, 72, "What recovery looks like when you work for yourself."],
  ["slow-kitchen", "A weeknight dinner you can make half asleep", "video", 9, 76, "Six ingredients, one pan, nothing to chop finely."],
  ["pricing-pod", "Raising your rates without losing the client", "podcast", 38, 80, "The script, and what to do when they push back."],
  ["field-notes", "Reading more by subscribing to less", "article", 5, 96, "A smaller pile read closely beats a big pile skimmed."],
  ["little-rituals", "The evening routine episode", "podcast", 35, 100, "Guests describe the hour before bed, in detail."],
  ["coach-ana", "Walking as training, not just transport", "video", 18, 120, "How to make a daily walk count for something."],
  ["sleep-lab", "Naps, honestly", "article", 6, 124, "What the research supports, and what it doesn't."],
  ["r-meditation", "What a year of daily practice changed", "discussion", 7, 130, "A long post worth the scroll, and the replies are good too."],
  ["maker-letters", "The one page business plan", "article", 8, 148, "What to write down before you build anything."],
  ["slow-kitchen", "Batch cooking without eating the same thing twice", "video", 21, 150, "One prep session, four different plates."],
  ["field-notes", "Notes on doing nothing on purpose", "article", 4, 170, "A short argument for unscheduled time."],
  ["pricing-pod", "What to charge for your first product", "podcast", 44, 176, "Pricing from the outcome, not the hours."],
  ["little-rituals", "Mornings when everything goes wrong", "podcast", 29, 196, "Routines that survive a bad night."],
  ["sleep-lab", "Light in the morning, dark at night", "article", 7, 200, "The one change with the most evidence behind it."],
  ["coach-ana", "Twenty minutes, no equipment", "video", 20, 220, "A full session for a hotel room or a small flat."],
  ["maker-letters", "How to tell if an idea is worth a weekend", "article", 9, 240, "Four questions before you open a code editor."],
  ["slow-kitchen", "The soup that freezes best", "video", 14, 244, "And how to freeze it flat so it thaws in ten minutes."],
  ["field-notes", "A small defence of printed things", "article", 6, 264, "On reading away from a screen."],
  ["r-meditation", "The five minute reset thread", "discussion", 3, 268, "Short, practical, and endlessly reposted."],
  ["little-rituals", "The season change episode", "podcast", 32, 290, "Adjusting a routine when the light shifts."],
  ["sleep-lab", "Caffeine, timing and sleep", "article", 8, 300, "The half-life maths nobody does."],
  ["coach-ana", "Form check: the five lifts", "video", 16, 320, "Slow motion, one cue each."],
  ["maker-letters", "Invoices, contracts and boring safety", "article", 10, 330, "The admin that prevents the expensive problems."],
  ["slow-kitchen", "Three breakfasts worth getting up for", "video", 11, 350, "Make-ahead, no blender."],
  ["field-notes", "What I stopped reading this year", "article", 7, 360, "Subtraction as a reading strategy."],
  ["pricing-pod", "Clients who ask for a discount", "podcast", 36, 380, "Holding the line without being cold about it."],
  ["little-rituals", "Walking meetings, actually tried", "podcast", 27, 400, "Two weeks of taking calls outside."],
  ["sleep-lab", "The weekend lie-in problem", "article", 5, 420, "Why Monday feels like jet lag."],
  ["r-meditation", "Beginners ask the same six questions", "discussion", 6, 440, "The answers, collected."],
];

function body(title: string, standfirst: string): string[] {
  return [
    `${standfirst} This is placeholder reading copy for the prototype, laid out the way a real article will be: a comfortable line length, generous line height, and no clutter in the margins.`,
    `The point of this screen is the reading itself. Nothing animates, nothing slides in from the side, and there is no related content waiting at the bottom to pull you onward.`,
    `When the real version arrives, this text comes from the source's own feed, with the page furniture stripped out. If a feed only offers an excerpt, the full article is fetched and cleaned before it lands here.`,
    `"${title}" ends where it ends. The next thing you read is a thing you chose.`,
  ];
}

export function makeSeed(): Store {
  const now = Date.now();
  const items: Item[] = drafts.map((d, i) => {
    const [sourceId, title, kind, minutes, hoursAgo, standfirst] = d;
    const published = new Date(now - hoursAgo * 3600_000).toISOString();
    // state: recent items unseen; older mostly seen; a handful saved or archived
    const seen = hoursAgo > 36;
    const saved = [1, 5, 9, 14].includes(i);
    const archived = [20, 24, 29, 33, 37].includes(i);
    return {
      id: `item-${i + 1}`,
      sourceId,
      title,
      standfirst,
      body: body(title, standfirst),
      kind,
      minutes,
      publishedAt: published,
      seenAt: seen && !saved ? new Date(now - (hoursAgo - 6) * 3600_000).toISOString() : null,
      savedAt: saved ? new Date(now - hoursAgo * 1800_000).toISOString() : null,
      archivedAt: archived ? new Date(now - hoursAgo * 1200_000).toISOString() : null,
      deletedAt: null,
    };
  });

  return {
    version: 1,
    sources,
    folders,
    items,
    settings: { markSeenOnScroll: false, showCounts: false, openOriginal: false },
  };
}

export function emptyStore(): Store {
  return {
    version: 1,
    sources: [],
    folders: [],
    items: [],
    settings: { markSeenOnScroll: false, showCounts: false, openOriginal: false },
  };
}
