import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { fast1a32utf } from 'fnv-plus';

export const get = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("tasks").collect();
  },
});

// TODO: Insert a new cluePath for each team, e.g.
// ["Sawyer", "CSM", "Ravioli House", etc.]
export const addNewTeam = mutation({
  args: {
    teamName: v.string(),
  },
  handler: async (ctx, args) => {
    const id = fast1a32utf(args.teamName);
    const existingTeam = await ctx.db.query("teams")
        .filter((q) => q.eq(q.field("teamId"), id))
        .first();
    if (existingTeam) {
      return existingTeam.teamId;
    }
    await ctx.db.insert("teams", {
        teamId: id,
        name: args.teamName,
        taskClue: "Sample text for the next location clue for team " + args.teamName,
    });
    return id;
  },
});

export const getTeamById = query({
  args: {
    teamId: v.number(),
  },
  handler: async (ctx, args) => {
    console.log("Fetching team with ID:", args.teamId);
    return await ctx.db.query("teams")
        .filter((q) => q.eq(q.field("teamId"), args.teamId))
        .first();
  },
});

