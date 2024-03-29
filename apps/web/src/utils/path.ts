export const splitNameAndExtension = (name: string) => {
  const parts = name.split(".");
  const extension = parts.pop();
  const fileName = parts.join(".");
  return { fileName, extension };
};
