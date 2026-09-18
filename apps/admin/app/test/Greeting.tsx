"use client";

import { useState } from "react";

export function Greeting({ name }: { name: string }) {
  const [count, setCount] = useState(0);

  return (
    <div className="mt-6 w-full max-w-md rounded-xl bg-white p-6 shadow-lg ring-1 ring-gray-200">
      <h2 className="text-xl font-semibold text-gray-800">Hello, {name}!</h2>
      <button
        type="button"
        className="mt-4 rounded-lg bg-blue-600 px-4 py-2 font-medium text-white transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        onClick={() => setCount(count + 1)}
      >
        Clicked {count} times
      </button>
    </div>
  );
}
