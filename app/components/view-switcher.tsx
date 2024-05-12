type ViewSwitcherProps = {
  views: { view: string, name: string }[],
  activeView: string
}

export const ViewSwitcher = ({ views, activeView }: ViewSwitcherProps) => {
  if (views.length > 0) {
    return (
      <div role="tablist" className="tabs tabs-lifted tabs-lg">
        {views.map(view => (
          <a role="tab" className={`tab ${activeView === view.view ? "tab-active" : ""}`} href={`?view=${view.view}`}>{view.name}</a>
        ))}
      </div>
    );
  }

  return null;
};
