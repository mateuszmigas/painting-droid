export const splitNameAndExtension = (name: string) => {
  const parts = name.split(".");
  const extension = parts.pop()?.toLocaleLowerCase() ?? "";
  const fileName = parts.join(".");
  return { fileName, extension };
};

