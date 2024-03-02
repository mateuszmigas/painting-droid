export const PanelHeader = (props: { title: string }) => {
  const { title } = props;
  return <div className="bg-secondary p-small">{title}</div>;
};

