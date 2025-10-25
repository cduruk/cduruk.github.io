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
                <th className="text-center p-4 font-bold text-foreground border-l border-border" colSpan={2}>
                  Cold Outreach
                </th>
                <th className="text-center p-4 font-bold text-foreground border-l border-border" colSpan={2}>
                  Referrals
                </th>
              </tr>
              <tr className="border-b border-border">
                <th className="w-8"></th>
                <th className="text-left p-3 text-sm font-medium text-foreground sticky left-0 bg-background"></th>
                <th className="text-center p-3 text-sm font-medium text-foreground border-l border-border">Rate</th>
                <th className="text-center p-3 text-sm font-medium text-foreground">Volume</th>
                <th className="text-center p-3 text-sm font-medium text-foreground border-l border-border">Rate</th>
                <th className="text-center p-3 text-sm font-medium text-foreground">Volume</th>
              </tr>
            </thead>
            <tbody>
              {stages.map((stage, index) => {
                const coldVolume = coldVolumes[stage.volumeKey];
                const referralVolume = referralVolumes[stage.volumeKey];
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

                    {/* Cold Outreach - Rate */}
                    <td className="p-3 text-center border-l border-border">
                      {stage.rate ? (
                        <div className="flex items-center justify-center gap-1">
                          <input
                            type="number"
                            value={rates.cold[stage.rate]}
                            onChange={(e) => updateRate('cold', stage.rate!, e.target.value)}
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

                    {/* Cold Outreach - Volume */}
                    <td
                      className={`p-3 text-center align-middle transition-all ${isOutreach ? 'cursor-pointer' : ''} ${hoveredOutreach === 'cold' && isOutreach ? 'bg-blue-100 dark:bg-blue-900/30' : ''}`}
                      onMouseEnter={isOutreach ? () => setHoveredOutreach('cold') : undefined}
                      onMouseLeave={isOutreach ? () => setHoveredOutreach(null) : undefined}
                    >
                      <span className={`${isLast ? 'text-emerald-700 dark:text-emerald-400 font-semibold' : 'text-foreground'}`}>
                        {Math.ceil(coldVolume)}
                      </span>
                    </td>

                    {/* Referral - Rate */}
                    <td className="p-3 text-center border-l border-border">
                      {stage.rate ? (
                        <div className="flex items-center justify-center gap-1">
                          <input
                            type="number"
                            value={rates.referral[stage.rate]}
                            onChange={(e) => updateRate('referral', stage.rate!, e.target.value)}
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

                    {/* Referral - Volume */}
                    <td
                      className={`p-3 text-center align-middle transition-all ${isOutreach ? 'cursor-pointer' : ''} ${hoveredOutreach === 'referral' && isOutreach ? 'bg-blue-100 dark:bg-blue-900/30' : ''}`}
                      onMouseEnter={isOutreach ? () => setHoveredOutreach('referral') : undefined}
                      onMouseLeave={isOutreach ? () => setHoveredOutreach(null) : undefined}
                    >
                      <span className={`${isLast ? 'text-emerald-700 dark:text-emerald-400 font-semibold' : 'text-foreground'}`}>
                        {Math.ceil(referralVolume)}
                      </span>
                    </td>
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
              <th className="text-center p-4 font-bold text-foreground w-2/5">Cold Outreach</th>
              <th className="text-center p-4 font-bold text-foreground w-2/5">Referrals</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-border">
              <td className="p-4 font-medium text-foreground text-left align-middle">Total Outreach</td>
              <td
                className={`p-4 text-center align-middle cursor-pointer transition-all ${hoveredOutreach === 'cold' ? 'bg-blue-100 dark:bg-blue-900/30' : ''}`}
                onMouseEnter={() => setHoveredOutreach('cold')}
                onMouseLeave={() => setHoveredOutreach(null)}
              >
                <div className="text-foreground">{Math.ceil(coldVolumes.outreach)}</div>
                <div className="text-xs text-muted-foreground mt-1">touches needed</div>
              </td>
              <td
                className={`p-4 text-center align-middle cursor-pointer transition-all ${hoveredOutreach === 'referral' ? 'bg-blue-100 dark:bg-blue-900/30' : ''}`}
                onMouseEnter={() => setHoveredOutreach('referral')}
                onMouseLeave={() => setHoveredOutreach(null)}
              >
                <div className="text-foreground">{Math.ceil(referralVolumes.outreach)}</div>
                <div className="text-xs text-muted-foreground mt-1">touches needed</div>
              </td>
            </tr>
            <tr className="border-b border-border">
              <td className="p-4 font-medium text-foreground text-left align-middle">Weeks to Hire</td>
              <td className="p-4 text-center align-middle">
                <input
                  type="number"
                  value={coldWeeksToHire}
                  onChange={(e) => setColdWeeksToHire(Math.max(1, parseInt(e.target.value) || 1))}
                  className="text-foreground w-20 text-center border border-border rounded px-2 py-1 hover:border-primary focus:border-primary focus:ring-2 focus:ring-ring/50 outline-none transition-all bg-background"
                  min="1"
                />
              </td>
              <td className="p-4 text-center align-middle">
                <input
                  type="number"
                  value={referralWeeksToHire}
                  onChange={(e) => setReferralWeeksToHire(Math.max(1, parseInt(e.target.value) || 1))}
                  className="text-foreground w-20 text-center border border-border rounded px-2 py-1 hover:border-primary focus:border-primary focus:ring-2 focus:ring-ring/50 outline-none transition-all bg-background"
                  min="1"
                />
              </td>
            </tr>
            <tr className="border-b border-border">
              <td className="p-4 font-medium text-foreground text-left align-middle">Per Week</td>
              <td className="p-4 text-center align-middle">
                <div className="text-foreground">{coldWeeklyOutreach}</div>
              </td>
              <td className="p-4 text-center align-middle">
                <div className="text-foreground">{referralWeeklyOutreach}</div>
              </td>
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
