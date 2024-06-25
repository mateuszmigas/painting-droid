type ChatResponseChunk = {
  model: string;
  created_at: Date;
  response: string;
  done: boolean;
};

export const sendMessageToAssistant = async (
  prompt: string,
  attachments: string[],
  callback: (message: string, done: boolean) => void
) => {
  const url = "http://localhost:11434/api/generate";

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "llava",
        prompt: `Prefer short and concise messages. ${prompt}`,
        images: attachments,
      }),
    });

    if (!response.ok || !response.body) {
      throw new Error("Failed to send message to assistant.");
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let message = "";

    const processText = async (
      reader: ReadableStreamDefaultReader<Uint8Array>,
      decoder: TextDecoder
    ) => {
      let done: boolean;
      let value: Uint8Array | undefined;

      do {
        ({ done, value } = await reader.read());

        if (value) {
          const chunk = JSON.parse(
            decoder.decode(value, { stream: true })
          ) as ChatResponseChunk;
          message += chunk.response;
          callback(message, done);
        }
      } while (!done);
    };
    await processText(reader, decoder);
  } catch (error) {
    console.error(error);
  }
};

