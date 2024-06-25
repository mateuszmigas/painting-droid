export const readStream = async <T extends AllowSharedBufferSource>(
  stream: ReadableStream<T>,
  callback: (chunk: T, done: boolean) => void
) => {
  const reader = stream.getReader();
  const processText = async (reader: ReadableStreamDefaultReader<T>) => {
    let done: boolean;
    let value: T | undefined;

    do {
      ({ done, value } = await reader.read());

      if (value) {
        callback(value, done);
      }
    } while (!done);
  };

  return processText(reader);
};

