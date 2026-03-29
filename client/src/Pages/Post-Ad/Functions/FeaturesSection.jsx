import { useState } from 'react';
import FEATURE_DATA from '../../../JSON-DATA/feature_groups.json';
import SectionCard from '../Components/SectionCard';
import SectionTitle from '../Components/SectionTitle';

const FEATURE_GROUPS = FEATURE_DATA.FEATURE_GROUPS || [];

const FeaturesSection = ({ features, toggleFeature, FeatureToggle }) => {
  // Track which group is expanded. Default to the first one.
  const [expandedGroup, setExpandedGroup] = useState(FEATURE_GROUPS[0]?.group);

  return (
    <SectionCard id="step-features">
      <SectionTitle step="3" sub="Select the features available in your vehicle">
        Features & Equipment
      </SectionTitle>

      <div className="flex flex-col gap-3">
        {FEATURE_GROUPS.map((group) => {
          const isExpanded = expandedGroup === group.group;
          const selectedCount = group.items.filter((i) => features.includes(i)).length;

          return (
            <div key={group.group} className="border border-[#E8E3DC] rounded-xl overflow-hidden">
              {/* Accordion Header */}
              <button
                type="button"
                onClick={() => setExpandedGroup(isExpanded ? null : group.group)}
                className="w-full flex items-center justify-between p-4 bg-[#FAFAF9] hover:bg-white transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-[#3B3640]">{group.group}</span>
                  {selectedCount > 0 && (
                    <span className="bg-[#6C3CE1] text-white text-[10px] px-2 py-0.5 rounded-full">
                      {selectedCount} selected
                    </span>
                  )}
                </div>
                <span
                  className={`transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                >
                  ▼
                </span>
              </button>

              {/* Accordion Content */}
              {isExpanded && (
                <div className="p-4 grid grid-cols-2 md:grid-cols-3 gap-3 border-t border-[#E8E3DC] animate-fadeIn">
                  {group.items.map((item) => (
                    <FeatureToggle
                      key={item}
                      label={item}
                      checked={features.includes(item)}
                      onChange={() => toggleFeature(item)}
                    />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </SectionCard>
  );
};

export default FeaturesSection;
