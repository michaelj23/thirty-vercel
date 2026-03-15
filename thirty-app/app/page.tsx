"use client";

import Image from "next/image";
import Form from "next/form";
import { ReactMutation, useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
import { redirect } from 'next/navigation';
// import { useQuery } from "convex/react";
// import { api } from "../convex/_generated/api";

export default function Home() {
  const addNewTeam = useMutation(api.tasks.addNewTeam);
  // const tasks = useQuery(api.tasks.get);
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
          <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
            Enter your team name
          </h1>
          {/* <Form action="/hunt"> */}
          <Form action={async (formData: FormData) => {
            await saveTeam(formData, addNewTeam);
          }}>
            {/* On submission, the input value will be appended to
                the URL, e.g. /search?query=abc */}
            <input name="teamname" />
            <div className="mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-full bg-foreground px-5 text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc] md:w-[158px]">
              <button type="submit">Submit</button>
            </div>
          </Form>
          {/* {tasks?.map(({_id, text}) => <div key={_id}>{text}</div>)} */}
        </div>
      </main>
    </div>
  );
}

async function saveTeam(
    formData: FormData,
    addNewTeam: ReactMutation<typeof api.tasks.addNewTeam>) {
  const teamNameVal = formData.get('teamname');
  if (!teamNameVal || typeof teamNameVal !== 'string') {
    console.warn('No valid team name provided');
    return;
  }
  const teamId = await addNewTeam({
    teamName: teamNameVal,
  });
  redirect(`/hunt?teamid=${teamId}`);
}
