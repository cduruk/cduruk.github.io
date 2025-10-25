import React, { useState } from 'react';
import { Calculator, ArrowDown } from 'lucide-react';

export default function PipelineCalculator() {
  const [weeksToHire, setWeeksToHire] = useState(10);

  // Conversion rates (as percentages for easier editing)
  const [rates, setRates] = useState({
    cold: {
      response: 8,
      screening: 55,
      technical: 45,
      team: 55,
      final: 72,
      offer: 75,
      acceptance: 60
    },
    referral: {
      response: 27,
      screening: 55,
      technical: 45,
      team: 55,
      final: 72,
      offer: 75,
      acceptance: 60
    }
  });

  // Calculate pipeline volumes working backwards from 1 hire
  const calculatePipeline = (pipelineRates: typeof rates.cold) => {
    const r = pipelineRates;
    const volumes = {
      accepted: 0,
      offered: 0,
      final: 0,
      team: 0,
      technical: 0,
      screening: 0,
      response: 0,
      outreach: 0
    };

    volumes.accepted = 1;
    volumes.offered = volumes.accepted / (r.acceptance / 100);
    volumes.final = volumes.offered / (r.offer / 100);
    volumes.team = volumes.final / (r.final / 100);
    volumes.technical = volumes.team / (r.team / 100);
    volumes.screening = volumes.technical / (r.technical / 100);
    volumes.response = volumes.screening / (r.screening / 100);
    volumes.outreach = volumes.response / (r.response / 100);

    return volumes;
  };

  const coldVolumes = calculatePipeline(rates.cold);
  const referralVolumes = calculatePipeline(rates.referral);

  const coldWeeklyOutreach = Math.ceil(coldVolumes.outreach / weeksToHire);
  const referralWeeklyOutreach = Math.ceil(referralVolumes.outreach / weeksToHire);
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

  const stages: Array<{ key: string; label: string; volumeKey: VolumeKey; rate: string | null }> = [
    { key: 'outreach', label: 'Initial Outreach', volumeKey: 'outreach', rate: null },
    { key: 'response', label: 'Response/Interest', volumeKey: 'response', rate: 'response' },
    { key: 'screening', label: 'Screening Call Booked', volumeKey: 'screening', rate: 'screening' },
    { key: 'technical', label: 'Technical Interview', volumeKey: 'technical', rate: 'technical' },
    { key: 'team', label: 'Team Interview', volumeKey: 'team', rate: 'team' },
    { key: 'final', label: 'Final Interview', volumeKey: 'final', rate: 'final' },
    { key: 'offered', label: 'Offer Extended', volumeKey: 'offered', rate: 'offer' },
    { key: 'accepted', label: 'Offer Accepted', volumeKey: 'accepted', rate: 'acceptance' }
  ];

  return (
    <div className="bg-background p-8 border border-border">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Calculator className="w-10 h-10 text-primary" />
            <h1 className="text-4xl font-bold text-foreground">Hiring Pipeline Calculator</h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Compare cold outreach vs. referrals side-by-side. All conversion rates are editable.
          </p>
        </div>

        {/* Main Table */}
        <div className="bg-background border border-border overflow-hidden mb-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-muted border-b-2 border-border">
                  <th className="text-left p-4 font-bold text-foreground sticky left-0 bg-muted">Pipeline Stage</th>
                  <th className="text-center p-4 font-bold text-primary border-l border-border" colSpan={2}>
                    Cold Outreach
                  </th>
                  <th className="text-center p-4 font-bold text-primary border-l border-border" colSpan={2}>
                    Referrals
                  </th>
                  <th className="w-8 border-l border-border"></th>
                </tr>
                <tr className="bg-muted border-b-2 border-border">
                  <th className="text-left p-3 text-sm font-medium text-muted-foreground sticky left-0 bg-muted"></th>
                  <th className="text-center p-3 text-sm font-medium text-muted-foreground border-l border-border">Rate</th>
                  <th className="text-center p-3 text-sm font-medium text-muted-foreground">Volume</th>
                  <th className="text-center p-3 text-sm font-medium text-muted-foreground border-l border-border">Rate</th>
                  <th className="text-center p-3 text-sm font-medium text-muted-foreground">Volume</th>
                  <th className="w-8 border-l border-border"></th>
                </tr>
              </thead>
              <tbody>
                {stages.map((stage, index) => {
                  const coldVolume = coldVolumes[stage.volumeKey];
                  const referralVolume = referralVolumes[stage.volumeKey];
                  const isLast = index === stages.length - 1;

                  return (
                    <tr key={stage.key} className={`border-b border-border hover:bg-muted/50 transition-colors ${isLast ? 'bg-muted' : ''}`}>
                      <td className="p-4 sticky left-0 bg-background">
                        <span className={`font-medium ${isLast ? 'text-primary' : 'text-foreground'}`}>
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
                              className="w-16 px-2 py-1 border border-border rounded text-center font-medium text-foreground hover:border-primary focus:border-primary focus:ring-2 focus:ring-ring/50 outline-none transition-all bg-background"
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
                      <td className="p-3 text-center">
                        <span className={`text-xl font-bold ${isLast ? 'text-primary' : 'text-primary/80'}`}>
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
                              className="w-16 px-2 py-1 border border-border rounded text-center font-medium text-foreground hover:border-primary focus:border-primary focus:ring-2 focus:ring-ring/50 outline-none transition-all bg-background"
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
                      <td className="p-3 text-center">
                        <span className={`text-xl font-bold ${isLast ? 'text-primary' : 'text-primary/80'}`}>
                          {Math.ceil(referralVolume)}
                        </span>
                      </td>

                      {/* Arrow */}
                      <td className="p-3 text-center border-l border-border">
                        {!isLast && (
                          <ArrowDown className="w-4 h-4 text-muted-foreground mx-auto" />
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          <div className="bg-background border border-border p-6">
            <div className="text-sm text-muted-foreground mb-1">Weeks to Hire</div>
            <input
              type="number"
              value={weeksToHire}
              onChange={(e) => setWeeksToHire(Math.max(1, parseInt(e.target.value) || 1))}
              className="text-3xl font-bold text-foreground w-full border-b-2 border-transparent hover:border-border focus:border-primary outline-none transition-all bg-background"
              min="1"
            />
            <div className="text-xs text-muted-foreground mt-2">Click to edit</div>
          </div>

          <div className="bg-muted border border-primary/20 p-6">
            <div className="text-sm text-primary font-medium mb-1">Cold: Total Outreach</div>
            <div className="text-3xl font-bold text-primary">{Math.ceil(coldVolumes.outreach)}</div>
            <div className="text-xs text-muted-foreground mt-2">touches needed</div>
          </div>

          <div className="bg-muted border border-primary/20 p-6">
            <div className="text-sm text-primary font-medium mb-1">Cold: Per Week</div>
            <div className="text-3xl font-bold text-primary">{coldWeeklyOutreach}</div>
          </div>

          <div className="bg-muted border border-primary/20 p-6">
            <div className="text-sm text-primary font-medium mb-1">Referral: Total Outreach</div>
            <div className="text-3xl font-bold text-primary">{Math.ceil(referralVolumes.outreach)}</div>
            <div className="text-xs text-muted-foreground mt-2">touches needed</div>
          </div>

          <div className="bg-muted border border-primary/20 p-6">
            <div className="text-sm text-primary font-medium mb-1">Referral: Per Week</div>
            <div className="text-3xl font-bold text-primary">{referralWeeklyOutreach}</div>
          </div>
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
            <li>
              You'll need approximately <strong className="text-primary">{Math.ceil(coldVolumes.offered)}</strong> offers for cold outreach and <strong className="text-primary">{Math.ceil(referralVolumes.offered)}</strong> for referrals to make one hire
            </li>
          </ul>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>Based on real hiring data. Click any conversion rate to edit with your own numbers.</p>
        </div>
      </div>
    </div>
  );
}
