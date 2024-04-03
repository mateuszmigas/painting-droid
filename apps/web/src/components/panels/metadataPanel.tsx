import { Button } from "../ui/button";
import { useState } from "react";
import { coreClient } from "@/wasm/core/coreClient";

export const MetadataPanel = () => {
  const [result, setResult] = useState<string>("");

  const callRust = async () => {
    const now = performance.now();
    coreClient.hello("Zdzicho2").then((res) => {
      const time = performance.now() - now;
      setResult(`${res.result} in ${time}ms`);
    });
  };

  return (
    <div className="flex flex-col gap-medium">
      <div className="flex flex-wrap flex-row gap-small p-small">
        <Button variant="secondary" onClick={callRust}>
          Call Rust Test
        </Button>
      </div>
      <div className="p-small">{result}</div>
    </div>
  );
};
