type ViewSwitcherProps = {
  views: { view: string, name: string }[],
  activeView: string
}

export const ViewSwitcher = ({ views, activeView }: ViewSwitcherProps) => {
  if (views.length > 0) {
    return (
      <div role="tablist" className="tabs tabs-lift tabs-lg">
        {views.map((view, key) => (
          <a role="tab" className={`tab ${activeView === view.view ? "tab-active" : ""}`} href={`?view=${view.view}`} key={key}>{view.name}</a>
        ))}
      </div>
    );
  }

  return null;
};
