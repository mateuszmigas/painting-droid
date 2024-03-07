export const PanelHeader = (props: { title: string }) => {
  const { title } = props;
  return <h1 className="font-bold border-b px-small">{title}</h1>;
};

