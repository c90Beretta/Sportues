"use client";

import { useState } from "react";

export function Greeting({ name }: { name: string }) {
  const [count, setCount] = useState(0);

  return (
    <div>
      <h2>Hello, {name}!</h2>
      <button type="button" onClick={() => setCount(count + 1)}>
        Clicked {count} times
      </button>
    </div>
  );
}
