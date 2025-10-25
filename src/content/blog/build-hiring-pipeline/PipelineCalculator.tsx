import React, { useState } from 'react';
import { ArrowDown } from 'lucide-react';

export default function PipelineCalculator() {
  const [coldWeeksToHire, setColdWeeksToHire] = useState(10);
  const [referralWeeksToHire, setReferralWeeksToHire] = useState(10);
  const [hoveredOutreach, setHoveredOutreach] = useState<'cold' | 'referral' | null>(null);

  // Conversion rates (as percentages for easier editing)
  const [rates, setRates] = useState({
    cold: {
      response: 4,
      screening: 65,
      technical: 30,
      team: 50,
      offer: 50,
      acceptance: 50
    },
    referral: {
      response: 8,
      screening: 80,
      technical: 50,
      team: 60,
      offer: 60,
      acceptance: 50
    }
  });

  // Calculate pipeline volumes working backwards from 1 hire
  const calculatePipeline = (pipelineRates: typeof rates.cold) => {
    const r = pipelineRates;
    const volumes = {
      accepted: 0,
      offered: 0,
      team: 0,
      technical: 0,
      screening: 0,
      response: 0,
      outreach: 0
    };

    volumes.accepted = 1;
    volumes.offered = volumes.accepted / (r.acceptance / 100);
    volumes.team = volumes.offered / (r.offer / 100);
    volumes.technical = volumes.team / (r.team / 100);
    volumes.screening = volumes.technical / (r.technical / 100);
    volumes.response = volumes.screening / (r.screening / 100);
    volumes.outreach = volumes.response / (r.response / 100);

    return volumes;
  };

  const coldVolumes = calculatePipeline(rates.cold);
  const referralVolumes = calculatePipeline(rates.referral);

  const coldWeeklyOutreach = Math.ceil(coldVolumes.outreach / coldWeeksToHire);
  const referralWeeklyOutreach = Math.ceil(referralVolumes.outreach / referralWeeksToHire);
  const efficiency = coldVolumes.outreach / referralVolumes.outreach;

  const pipelines = [
    { type: 'cold' as const, label: 'Cold Outreach', volumes: coldVolumes, rates: rates.cold, weeksToHire: coldWeeksToHire, setWeeksToHire: setColdWeeksToHire, weeklyOutreach: coldWeeklyOutreach },
    { type: 'referral' as const, label: 'Referrals', volumes: referralVolumes, rates: rates.referral, weeksToHire: referralWeeksToHire, setWeeksToHire: setReferralWeeksToHire, weeklyOutreach: referralWeeklyOutreach }
  ];

  const updateRate = (pipelineType: 'cold' | 'referral', stage: string, value: string) => {
    const numValue = parseFloat(value);
    if (isNaN(numValue) || numValue < 0 || numValue > 100) return;

    setRates({
      ...rates,
      [pipelineType]: {
        ...rates[pipelineType],
        [stage]: numValue
      }
    });
  };

  type VolumeKey = keyof typeof coldVolumes;
  type RateKey = keyof typeof rates.cold;

  const stages: Array<{ key: string; label: string; volumeKey: VolumeKey; rate: RateKey | null }> = [
    { key: 'outreach', label: 'Initial Outreach', volumeKey: 'outreach', rate: null },
    { key: 'response', label: 'Response/Interest', volumeKey: 'response', rate: 'response' },
    { key: 'screening', label: 'Screening Call Booked', volumeKey: 'screening', rate: 'screening' },
    { key: 'technical', label: 'Take-Home Exercise', volumeKey: 'technical', rate: 'technical' },
    { key: 'team', label: 'Team Interview', volumeKey: 'team', rate: 'team' },
    { key: 'offered', label: 'Offer Extended', volumeKey: 'offered', rate: 'offer' },
    { key: 'accepted', label: 'Offer Accepted', volumeKey: 'accepted', rate: 'acceptance' }
  ];

  return (
    <div className="w-full min-w-full">

      {/* Main Table */}
      <div className="bg-background overflow-hidden mb-6 w-full">
        <div className="overflow-x-auto w-full">
          <table className="w-full min-w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="w-8"></th>
                <th className="text-left p-4 font-bold text-foreground sticky left-0 bg-background">Pipeline Stage</th>
                {pipelines.map((pipeline) => (
                  <th key={pipeline.type} className="text-center p-4 font-bold text-foreground border-l border-border" colSpan={2}>
                    {pipeline.label}
                  </th>
                ))}
              </tr>
              <tr className="border-b border-border">
                <th className="w-8"></th>
                <th className="text-left p-3 text-sm font-medium text-foreground sticky left-0 bg-background"></th>
                {pipelines.map((pipeline) => (
                  <React.Fragment key={pipeline.type}>
                    <th className="text-center p-3 text-sm font-medium text-foreground border-l border-border">Rate</th>
                    <th className="text-center p-3 text-sm font-medium text-foreground">Volume</th>
                  </React.Fragment>
                ))}
              </tr>
            </thead>
            <tbody>
              {stages.map((stage, index) => {
                const isLast = index === stages.length - 1;
                const isOutreach = stage.key === 'outreach';

                return (
                  <tr key={stage.key} className={`border-b border-border transition-colors ${isLast ? 'bg-emerald-50 dark:bg-emerald-950/20' : 'hover:bg-muted/50'}`}>
                    {/* Arrow */}
                    <td className="p-3 text-center align-middle">
                      {!isLast && (
                        <ArrowDown className="w-4 h-4 text-muted-foreground mx-auto" />
                      )}
                    </td>

                    <td className={`p-4 sticky left-0 ${isLast ? 'bg-emerald-50 dark:bg-emerald-950/20' : 'bg-background'}`}>
                      <span className={`font-medium ${isLast ? 'text-emerald-700 dark:text-emerald-400' : 'text-foreground'}`}>
                        {stage.label}
                      </span>
                    </td>

                    {pipelines.map((pipeline) => (
                      <React.Fragment key={pipeline.type}>
                        {/* Rate */}
                        <td className="p-3 text-center border-l border-border">
                          {stage.rate ? (
                            <div className="flex items-center justify-center gap-1">
                              <input
                                type="number"
                                value={pipeline.rates[stage.rate]}
                                onChange={(e) => updateRate(pipeline.type, stage.rate!, e.target.value)}
                                className="w-16 px-2 py-1 border border-border rounded text-center text-foreground hover:border-primary focus:border-primary focus:ring-2 focus:ring-ring/50 outline-none transition-all bg-background"
                                min="0"
                                max="100"
                                step="1"
                              />
                              <span className="text-muted-foreground text-sm">%</span>
                            </div>
                          ) : (
                            <span className="text-muted-foreground text-sm">—</span>
                          )}
                        </td>

                        {/* Volume */}
                        <td
                          className={`p-3 text-center align-middle transition-all ${isOutreach ? 'cursor-pointer' : ''} ${hoveredOutreach === pipeline.type && isOutreach ? 'bg-blue-100 dark:bg-blue-900/30' : ''}`}
                          onMouseEnter={isOutreach ? () => setHoveredOutreach(pipeline.type) : undefined}
                          onMouseLeave={isOutreach ? () => setHoveredOutreach(null) : undefined}
                        >
                          <span className={`${isLast ? 'text-emerald-700 dark:text-emerald-400 font-semibold' : 'text-foreground'}`}>
                            {Math.ceil(pipeline.volumes[stage.volumeKey])}
                          </span>
                        </td>
                      </React.Fragment>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="bg-background overflow-hidden mb-6 w-full">
        <table className="w-full min-w-full table-fixed">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left p-4 font-bold text-foreground w-1/5">Metric</th>
              {pipelines.map((pipeline) => (
                <th key={pipeline.type} className="text-center p-4 font-bold text-foreground w-2/5">
                  {pipeline.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-border">
              <td className="p-4 font-medium text-foreground text-left align-middle">Total Outreach</td>
              {pipelines.map((pipeline) => (
                <td
                  key={pipeline.type}
                  className={`p-4 text-center align-middle cursor-pointer transition-all ${hoveredOutreach === pipeline.type ? 'bg-blue-100 dark:bg-blue-900/30' : ''}`}
                  onMouseEnter={() => setHoveredOutreach(pipeline.type)}
                  onMouseLeave={() => setHoveredOutreach(null)}
                >
                  <div className="text-foreground">{Math.ceil(pipeline.volumes.outreach)}</div>
                  <div className="text-xs text-muted-foreground mt-1">touches needed</div>
                </td>
              ))}
            </tr>
            <tr className="border-b border-border">
              <td className="p-4 font-medium text-foreground text-left align-middle">Weeks to Hire</td>
              {pipelines.map((pipeline) => (
                <td key={pipeline.type} className="p-4 text-center align-middle">
                  <input
                    type="number"
                    value={pipeline.weeksToHire}
                    onChange={(e) => pipeline.setWeeksToHire(Math.max(1, parseInt(e.target.value) || 1))}
                    className="text-foreground w-20 text-center border border-border rounded px-2 py-1 hover:border-primary focus:border-primary focus:ring-2 focus:ring-ring/50 outline-none transition-all bg-background"
                    min="1"
                  />
                </td>
              ))}
            </tr>
            <tr className="border-b border-border">
              <td className="p-4 font-medium text-foreground text-left align-middle">Per Week</td>
              {pipelines.map((pipeline) => (
                <td key={pipeline.type} className="p-4 text-center align-middle">
                  <div className="text-foreground">{pipeline.weeklyOutreach}</div>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      {/* Comparison Insights */}
      <div className="bg-muted border-l-4 border-primary p-6">
        <h3 className="font-bold text-foreground mb-3">Key Insights</h3>
        <ul className="list-disc list-inside space-y-2 text-sm text-foreground">
          <li>
            Referrals are <strong className="text-primary">{efficiency.toFixed(1)}x more efficient</strong> than cold outreach ({Math.ceil(coldVolumes.outreach)} vs. {Math.ceil(referralVolumes.outreach)} touches)
          </li>
          <li>
            Only <strong className="text-primary">{((1 / coldVolumes.outreach) * 100).toFixed(2)}%</strong> of cold outreach becomes a hire
          </li>
          <li>
            <strong className="text-primary">{((1 / referralVolumes.outreach) * 100).toFixed(2)}%</strong> of referral outreach becomes a hire
          </li>
        </ul>
      </div>

    </div>
  );
}
