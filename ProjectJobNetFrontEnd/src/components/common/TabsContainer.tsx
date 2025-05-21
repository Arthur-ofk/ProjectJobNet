import React, { ReactNode } from 'react';
import './TabsContainer.css';

export interface TabItem {
  id: string;
  label: string;
  component: ReactNode;
}

interface TabsContainerProps {
  tabs: TabItem[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  className?: string;
  tabClassName?: string;
}

const TabsContainer: React.FC<TabsContainerProps> = ({
  tabs,
  activeTab,
  onTabChange,
  className = '',
  tabClassName = ''
}) => {
  return (
    <div className={`tabs-container ${className}`}>
      <div className="tabs-header">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`tab-button ${activeTab === tab.id ? 'active' : ''} ${tabClassName}`}
            onClick={() => onTabChange(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="tab-content">
        {tabs.find(tab => tab.id === activeTab)?.component}
      </div>
    </div>
  );
};

export default TabsContainer;
