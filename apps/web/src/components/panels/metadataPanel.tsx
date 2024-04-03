import { Button } from "../ui/button";
import { useState } from "react";
import { coreClient } from "@/wasm/core/coreClient";
import { useNotificationService } from "@/contexts/notificationService";

export const MetadataPanel = () => {
  const [result, setResult] = useState<string>("");
  const { showInfo } = useNotificationService();

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
        <Button
          variant="secondary"
          onClick={() => showInfo("Hey", "Some test message")}
        >
          Notification Test
        </Button>
      </div>
      <div className="p-small">{result}</div>
    </div>
  );
};
