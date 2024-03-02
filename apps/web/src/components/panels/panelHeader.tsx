export const PanelHeader = (props: { title: string }) => {
  const { title } = props;
  return (
    <div>
      <h2>{title}</h2>
    </div>
  );
};

