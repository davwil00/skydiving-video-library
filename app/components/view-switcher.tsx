type ViewSwitcherProps = {
  hasTopView: boolean,
  hasSideView: boolean,
  activeView: string
}

export const ViewSwitcher = ({hasTopView, hasSideView, activeView}: ViewSwitcherProps) => {
    if (hasTopView && hasSideView) {
      return (
        <div role="tablist" className="tabs tabs-lifted tabs-lg">
          {hasTopView ? <a role="tab" className={`tab ${activeView === 'TOP' ? 'tab-active' : ''}`} href="?view=TOP">Top
            Down</a> : null}
          {hasSideView ? <a role="tab" className={`tab ${activeView === 'SIDE' ? 'tab-active' : ''}`} href="?view=SIDE">Side
            View</a> : null}
        </div>
      )
    }

    return null
}
