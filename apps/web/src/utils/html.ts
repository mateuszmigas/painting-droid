export const downloadAsFile = (data: string, filename: string) => {
  var anchor = document.createElement("a");
  anchor.href = data;
  anchor.download = filename;
  anchor.click();
};

