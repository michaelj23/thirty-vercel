import { query, mutation, QueryCtx } from "./_generated/server";
import { v } from "convex/values";
import { fast1a32utf } from 'fnv-plus';

export const get = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("tasks").collect();
  },
});

function getRandomTask(taskGroup: string[]) {
  return taskGroup[Math.floor(Math.random() * taskGroup.length)];
}

function generateTaskPath() {
  const taskGroup1 = ["Sawyer", "Laurelwood"];
  const task1 = getRandomTask(taskGroup1);

  // const taskGroup2 = ["CSM"];
  // const task2 = getRandomTask(taskGroup2);

  // const taskGroup3 = ["Ravioli House", "Malatown"];
  // const task3 = getRandomTask(taskGroup3);

  // const taskGroup4 = ["Merced", "GGP"];
  // const task4 = getRandomTask(taskGroup4);

  return [task1];
  // return [task1, task2, task3, task4];
}

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
        taskPath: generateTaskPath(),
        taskIndex: 0,
    });
    return id;
  },
});

async function getTeam(ctx: QueryCtx, teamId: number) {
  return await ctx.db.query("teams")
      .filter((q) => q.eq(q.field("teamId"), teamId))
      .first();
}

export const getTeamById = query({
  args: {
    teamId: v.number(),
  },
  handler: async (ctx, args) => {
    console.log("Fetching team with ID:", args.teamId);
    return getTeam(ctx, args.teamId);
  },
});

export const getTaskForTeam = query({
  args: {
    teamId: v.number()
  },
  handler: async (ctx, args) => {
    console.log("Fetching task for team with ID:", args.teamId);
    return await getTeam(ctx, args.teamId)
        .then(team =>
            ctx.db.query("tasks")
                .filter((q) => q.eq(q.field("clueName"), team.taskPath[team.taskIndex]))
                .first()
        );
  },
});
