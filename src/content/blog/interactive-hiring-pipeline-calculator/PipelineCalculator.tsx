import { useState, useEffect } from 'react';
import { ArrowDown, Link, Share2, Check } from 'lucide-react';

// Default values
const DEFAULT_WEEKS = 10;
const DEFAULT_RATES = {
  response: 4,
  screening: 65,
  technical: 30,
  team: 50,
  offer: 50,
  acceptance: 50
};

export default function PipelineCalculator() {
  const [copied, setCopied] = useState(false);

  // Initialize state from URL or use defaults
  const getInitialState = () => {
    if (typeof window === 'undefined') return { weeksToHire: DEFAULT_WEEKS, rates: DEFAULT_RATES };

    const params = new URLSearchParams(window.location.search);
    const weeksToHire = parseInt(params.get('weeks') || '') || DEFAULT_WEEKS;
    const rates = {
      response: parseFloat(params.get('response') || '') || DEFAULT_RATES.response,
      screening: parseFloat(params.get('screening') || '') || DEFAULT_RATES.screening,
      technical: parseFloat(params.get('technical') || '') || DEFAULT_RATES.technical,
      team: parseFloat(params.get('team') || '') || DEFAULT_RATES.team,
      offer: parseFloat(params.get('offer') || '') || DEFAULT_RATES.offer,
      acceptance: parseFloat(params.get('acceptance') || '') || DEFAULT_RATES.acceptance
    };

    return { weeksToHire, rates };
  };

  const initialState = getInitialState();
  const [weeksToHire, setWeeksToHire] = useState(initialState.weeksToHire);
  const [rates, setRates] = useState(initialState.rates);

  // Update URL when state changes
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const params = new URLSearchParams();
    params.set('weeks', weeksToHire.toString());
    params.set('response', rates.response.toString());
    params.set('screening', rates.screening.toString());
    params.set('technical', rates.technical.toString());
    params.set('team', rates.team.toString());
    params.set('offer', rates.offer.toString());
    params.set('acceptance', rates.acceptance.toString());

    const newUrl = `${window.location.pathname}?${params.toString()}#calculator`;
    window.history.replaceState({}, '', newUrl);
  }, [weeksToHire, rates]);

  // Scroll to calculator on mount if hash is present
  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (window.location.hash === '#calculator') {
      setTimeout(() => {
        const element = document.getElementById('calculator');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  }, []);

  // Calculate pipeline volumes working backwards from 1 hire
  const calculatePipeline = (pipelineRates: typeof rates) => {
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

  const volumes = calculatePipeline(rates);
  const weeklyOutreach = Math.ceil(volumes.outreach / weeksToHire);

  const updateRate = (stage: string, value: string) => {
    const numValue = parseFloat(value);
    if (isNaN(numValue) || numValue < 0 || numValue > 100) return;

    setRates({
      ...rates,
      [stage]: numValue
    });
  };

  type VolumeKey = keyof typeof volumes;
  type RateKey = keyof typeof rates;

  const stages: Array<{ key: string; label: string; volumeKey: VolumeKey; rate: RateKey | null }> = [
    { key: 'outreach', label: 'Initial Outreach', volumeKey: 'outreach', rate: null },
    { key: 'response', label: 'Response/Interest', volumeKey: 'response', rate: 'response' },
    { key: 'screening', label: 'Screening Call Booked', volumeKey: 'screening', rate: 'screening' },
    { key: 'technical', label: 'Take-Home Exercise', volumeKey: 'technical', rate: 'technical' },
    { key: 'team', label: 'Team Interview', volumeKey: 'team', rate: 'team' },
    { key: 'offered', label: 'Offer Extended', volumeKey: 'offered', rate: 'offer' },
    { key: 'accepted', label: 'Offer Accepted', volumeKey: 'accepted', rate: 'acceptance' }
  ];

  const handleCopyShareLink = async () => {
    if (typeof window === 'undefined') return;

    const url = window.location.href;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  return (
    <div id="calculator" className="w-full min-w-full">
      {/* Share Button */}
      <div className="mb-4 flex justify-end">
        <button
          onClick={handleCopyShareLink}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border border-border bg-background hover:bg-muted/50 text-foreground transition-colors"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Link Copied!</span>
            </>
          ) : (
            <>
              <Share2 className="w-4 h-4" />
              <span>Copy Share Link</span>
            </>
          )}
        </button>
      </div>

      {/* Main Table */}
      <div className="bg-background overflow-hidden mb-6 w-full">
        <div className="overflow-x-auto w-full">
          <table className="w-full min-w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="w-8"></th>
                <th className="text-left p-4 font-bold text-foreground sticky left-0 bg-background">Pipeline Stage</th>
                <th className="text-center p-3 text-sm font-medium text-foreground border-l border-border">Rate</th>
                <th className="text-center p-3 text-sm font-medium text-foreground">Volume</th>
              </tr>
            </thead>
            <tbody>
              {stages.map((stage, index) => {
                const isLast = index === stages.length - 1;
                const isOutreach = stage.key === 'outreach';

                return (
                  <tr key={stage.key} className={`border-b border-border ${isLast ? 'bg-emerald-50 dark:bg-emerald-950/20' : ''}`}>
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

                    {/* Rate */}
                    <td className="p-3 text-center border-l border-border">
                      {stage.rate ? (
                        <div className="flex items-center justify-center gap-1">
                          <input
                            type="number"
                            value={rates[stage.rate]}
                            onChange={(e) => updateRate(stage.rate!, e.target.value)}
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
                    <td className="p-3 text-center align-middle">
                      <div className="flex items-center justify-center gap-2">
                        <span className={`${isLast ? 'text-emerald-700 dark:text-emerald-400 font-semibold' : 'text-foreground'}`}>
                          {Math.ceil(volumes[stage.volumeKey])}
                        </span>
                        {isOutreach && (
                          <Link className="w-4 h-4 text-muted-foreground" />
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
              {/* Separator row */}
              <tr>
                <td colSpan={4} className="p-0">
                  <hr className="border-t-2 border-border" />
                </td>
              </tr>

              {/* Summary rows */}
              <tr className="border-b border-border bg-muted/30">
                <td className="p-3 text-center align-middle bg-muted/30"></td>
                <td className="p-4 sticky left-0 bg-muted/30">
                  <span className="font-medium text-foreground">Total Outreach</span>
                </td>
                <td className="p-3 text-center border-l border-border bg-muted/30">
                  <span className="text-muted-foreground text-sm">—</span>
                </td>
                <td className="p-3 text-center align-middle bg-muted/30">
                  <div className="flex flex-col items-center">
                    <div className="flex items-center gap-2">
                      <div className="text-foreground">{Math.ceil(volumes.outreach)}</div>
                      <Link className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">touches needed</div>
                  </div>
                </td>
              </tr>

              <tr className="border-b border-border bg-muted/30">
                <td className="p-3 text-center align-middle bg-muted/30"></td>
                <td className="p-4 sticky left-0 bg-muted/30">
                  <span className="font-medium text-foreground">Weeks to Hire</span>
                </td>
                <td className="p-3 text-center border-l border-border bg-muted/30">
                  <span className="text-muted-foreground text-sm">—</span>
                </td>
                <td className="p-3 text-center align-middle bg-muted/30">
                  <input
                    type="number"
                    value={weeksToHire}
                    onChange={(e) => setWeeksToHire(Math.max(1, parseInt(e.target.value) || 1))}
                    className="text-foreground w-20 text-center border border-border rounded px-2 py-1 hover:border-primary focus:border-primary focus:ring-2 focus:ring-ring/50 outline-none transition-all bg-background"
                    min="1"
                  />
                </td>
              </tr>

              <tr className="border-b border-border bg-muted/30">
                <td className="p-3 text-center align-middle bg-muted/30"></td>
                <td className="p-4 sticky left-0 bg-muted/30">
                  <span className="font-medium text-foreground">Per Week</span>
                </td>
                <td className="p-3 text-center border-l border-border bg-muted/30">
                  <span className="text-muted-foreground text-sm">—</span>
                </td>
                <td className="p-3 text-center align-middle bg-muted/30">
                  <div className="text-foreground font-medium">{weeklyOutreach}</div>
                  <div className="text-xs text-muted-foreground mt-1">outreach per week</div>
                </td>
              </tr>

            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
