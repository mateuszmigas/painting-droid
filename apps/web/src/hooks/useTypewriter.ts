export const useTypewriter = (text: string, speed = 50) => {
  const typingDurationSeconds = (text.length * speed) / 1000;
  return { typingDurationSeconds };
};
