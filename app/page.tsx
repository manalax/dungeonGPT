'use client'

import Image from 'next/image'
import { useState } from "react";
import Dropdown from "../components/Dropdown.tsx";

export default function Home() {
  const [itemInput, setItemInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const itemsData = ["Sword", "Staff", "Wand", "Weapon", "Body Armour", "Robe"];
  const itemName = "";
  const itemBackstory = "";
  const itemStatistics = "";

  async function onSubmit(event) {
    console.log("submitting...")
    event.preventDefault();
    setLoading(true);
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ item: itemInput }),
      });

      const data = await response.json();
      if (response.status !== 200) {
        throw data.error || new Error(`Request failed with status ${response.status}`);
      }

      setResult(data.result);
      setItemInput("");
    } catch(error) {
      // Consider implementing your own error handling logic here
      console.error(error);
      alert(error.message);
    }
    setLoading(false);
  }

  const extractName = ( result: string ) => {
    // Typical format
    // Name:
    // Backstory:
    // Statistics:
    // This method is vulnerable to changes in the model

    const downcasedResult = result.toLowerCase();

    const firstColonIndex = downcasedResult.indexOf(":");
    const backstoryIndex = downcasedResult.indexOf("backstory:");

    const name = result.slice(firstColonIndex, backstoryIndex);

    return name
  }

  const extractBackstory = ( result: string ) => {
    const downcasedResult = result.toLowerCase();

    const backstoryIndex = downcasedResult.indexOf("backstory:");
    const statisticsIndex = downcasedResult.indexOf("statistics:");

    const backstory = result.slice(backstoryIndex, statisticsIndex);
    return backstory
  }

  const extractStats = ( result: string ) => {
    const downcasedResult = result.toLowerCase();
    const statisticsIndex = downcasedResult.indexOf("statistics:");

    const stats = result.slice(statisticsIndex);
    return stats
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-center font-mono text-sm lg:flex">
        <h3>I need a... &nbsp;</h3>
        <Dropdown
          itemsData={itemsData}
          setItemInput={setItemInput}
          itemInput={itemInput}
        />
        <button 
          className="bg-green-500 hover:bg-green-400 text-white font-bold py-2 px-4 border-b-4 border-green-700 hover:border-green-500 rounded"
          onClick={onSubmit}
        >
          {loading ? "Generating..." : "Generate!"}
        </button>
      </div>

      {loading ? 
      <div className="animate-spin inline-block w-6 h-6 border-[3px] border-current border-t-transparent text-blue-600 rounded-full" role="status" aria-label="loading">
        <span className="sr-only">Loading...</span>
      </div> : ""}

      <div className="relative flex place-items-center before:absolute before:h-[300px] before:w-[480px] before:-translate-x-1/2 before:rounded-full before:bg-gradient-radial before:from-white before:to-transparent before:blur-2xl before:content-[''] after:absolute after:-z-20 after:h-[180px] after:w-[240px] after:translate-x-1/3 after:bg-gradient-conic after:from-sky-200 after:via-blue-200 after:blur-2xl after:content-[''] before:dark:bg-gradient-to-br before:dark:from-transparent before:dark:to-blue-700 before:dark:opacity-10 after:dark:from-sky-900 after:dark:via-[#0141ff] after:dark:opacity-40 before:lg:h-[360px]">
        {/* {result === "" ? "" : 
          extractName(result) + '\n' +
          extractBackstory(result) + '\n' + 
          extractStats(result)
        } */}
        {result}
      </div>
    </main>
  )
}