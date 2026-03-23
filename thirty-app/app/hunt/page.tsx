"use client";

import Form from "next/form";
import { api } from "../../convex/_generated/api";
import { useQuery } from "convex/react";
import { useSearchParams } from "next/navigation";
import { useGeolocated } from "react-geolocated";
import * as turf from "@turf/turf";

export default function Hunt() {
  // Requires HTTPS / secure origin for geolocation to be available.
  const { coords, isGeolocationAvailable, isGeolocationEnabled } = useGeolocated({
    positionOptions: {
      enableHighAccuracy: false,
      maximumAge: 10000, // 10 seconds
      timeout: 5000, // 5 seconds
    },
    // userDecisionTimeout: 5000,
    watchPosition: true,
  });

  if (!isGeolocationAvailable || !isGeolocationEnabled) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
        <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
          <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
            <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
              Geolocation is not available or enabled. Please make sure you're using a modern browser with location access enabled.
            </h1>
          </div>
        </main>
      </div>
    );
  }

  // const isInsideOverland = turf.booleanContains(turfOverlandDr, turfPoint);
  // const isInsideSawyer = turf.booleanContains(turfSawyer, turfPoint);

  const searchParams = useSearchParams();
  const teamId = searchParams.get("teamid");
  console.log("Team ID from URL:", teamId);
  // Remember that the Convex APIs are async. If you want to chain together 2 fetches,
  // I think you have to create a new Convex API that chains promises.
  // Also you can't use the returned value immediately in JS below... I think you may only
  // be able to use it in the React HTML.
  const task = useQuery(api.tasks.getTaskForTeam, {teamId: teamId ? parseInt(teamId) : 0});

  // console.log("task: ", task);
  // console.log("team: ", team);
  // const useTextHint = task.textHint && task.textHint.length > 0;
  // const useImageHint = task.imageHint && task.imageHint.length > 0;

  if (!task) {
    return (
      <p>Loading...</p>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
          <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
            {task.textHint && task.textHint.length > 0 && <p>{task.textHint}</p>}
            {task.useImageHint && <img src={task.imageHint} alt="Hint" />}
            {/* {task.imageHint && task.imageHint.length > 0 && <p>{task.imageHint}</p>} */}
          </h1>
          <Form action="/hunt">
            {/* On submission, the input value will be appended to
                the URL, e.g. /search?query=abc */}
            <div>
              Your current position is: {coords?.latitude}, {coords?.longitude}
            </div>
            <div>
            </div>
            <div className="mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-full bg-foreground px-5 text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc] md:w-[158px]">
              <button type="submit">Submit</button>
            </div>
          </Form>
        </div>
      </main>
    </div>
  );
}

function success(pos: GeolocationPosition) {
  const crd = pos.coords;
  console.log("Your current position is: "
    + crd.latitude + " latitude, " + crd.longitude + " longitude");

  // if (crd.latitude && target.longitude === crd.longitude) {
  //   console.log("Congratulations, you reached the target");
  //   navigator.geolocation.clearWatch(id);
  // }
}

function error(err: GeolocationPositionError) {
  console.error(`ERROR(${err.code}): ${err.message}`);
}

// target = {
//   latitude: 0,
//   longitude: 0,
// };

// options = {
//   enableHighAccuracy: false,
//   timeout: 5000,
//   maximumAge: 0,
// };