import React, { useState, createContext, useContext, useMemo } from 'react';
import './App.css';
// IMPORT YOUR NEW DATA FILE
import { masterData, metricConfig } from './data/masterData';
// import { insightsData } from './data/insightsData';

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer,
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar
} from 'recharts';

// STRICTLY USING ONLY YOUR WORKING ICONS TO PREVENT CRASHES
import {
  TrendingUp, Building2, Users, DollarSign, Award, Target, Lightbulb, Heart, Zap,
  Activity, BarChart3, PieChart, Trophy, Search, Cpu, AlertTriangle, CheckCircle2,
  ChevronDown, Check, FileText, ArrowLeft, AlertOctagon, LineChart
} from 'lucide-react';

import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// --- UTILITIES ---
function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// --- DATA TRANSFORMATION ---
const competitorData = masterData.map(company => ({
  name: company.name,
  ...company.metrics,
  ...company.raw,
  raw: company.raw,
  metrics: company.metrics,
  profile: company.profile
}));

const metrics = metricConfig;

const formatCurrency = (val) => {
  if (!val) return "N/A";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    notation: "compact",
    maximumFractionDigits: 1
  }).format(val);
};

// --- INLINE UI COMPONENTS ---
const Card = ({ className, ...props }) => (
  <div className={cn("rounded-xl border bg-card text-card-foreground shadow", className)} {...props} />
);
const CardHeader = ({ className, ...props }) => (
  <div className={cn("flex flex-col space-y-1.5 p-6", className)} {...props} />
);
const CardTitle = ({ className, ...props }) => (
  <h3 className={cn("font-semibold leading-none tracking-tight", className)} {...props} />
);
const CardDescription = ({ className, ...props }) => (
  <p className={cn("text-sm text-muted-foreground", className)} {...props} />
);
const CardContent = ({ className, ...props }) => (
  <div className={cn("p-6 pt-0", className)} {...props} />
);

const InfoChip = ({ label, value, isLink = false }) => {
  if (!value) return null;
  return (
    <div className="flex items-center gap-2 bg-slate-900/50 border border-white/5 rounded-lg px-3 py-2">
      <span className="text-xs uppercase tracking-wide text-slate-500">{label}</span>
      {isLink ? (
        <a href={value} target="_blank" rel="noreferrer" className="text-cyan-400 hover:underline truncate">
          {value}
        </a>
      ) : (
        <span className="text-slate-200 truncate">{value}</span>
      )}
    </div>
  );
};

const Badge = ({ className, variant = "default", ...props }) => {
  const variants = {
    default: "border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80",
    secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
    destructive: "border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80",
    outline: "text-foreground",
  };
  return (
    <div className={cn("inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2", variants[variant], className)} {...props} />
  );
};

const TabsContext = createContext();
const Tabs = ({ defaultValue, value, onValueChange, children, className }) => {
  const [activeTab, setActiveTab] = useState(defaultValue || value);
  const currentTab = value !== undefined ? value : activeTab;
  const handleTabChange = (val) => {
    if (onValueChange) onValueChange(val);
    if (value === undefined) setActiveTab(val);
  };
  return (
    <TabsContext.Provider value={{ activeTab: currentTab, setActiveTab: handleTabChange }}>
      <div className={cn("", className)}>{children}</div>
    </TabsContext.Provider>
  );
};
const TabsList = ({ className, children }) => (
  <div className={cn("inline-flex h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground", className)}>{children}</div>
);
const TabsTrigger = ({ value, className, children }) => {
  const { activeTab, setActiveTab } = useContext(TabsContext);
  const isActive = activeTab === value;
  return (
    <button
      onClick={() => setActiveTab(value)}
      data-state={isActive ? 'active' : 'inactive'}
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        isActive ? "bg-background text-foreground shadow" : "hover:bg-background/50 hover:text-foreground",
        className
      )}
    >
      {children}
    </button>
  );
};
const TabsContent = ({ value, className, children }) => {
  const { activeTab } = useContext(TabsContext);
  if (activeTab !== value) return null;
  return <div className={cn("mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 h-full", className)}>{children}</div>;
};

// --- MAIN APP COMPONENT ---

const BeamLogo = () => (
  <div className="flex items-center gap-3 group cursor-pointer">
    <div className="relative flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-tr from-cyan-500 to-violet-600 shadow-lg group-hover:shadow-cyan-500/50 transition-all duration-500">
      <Zap className="h-7 w-7 text-white fill-white" />
      <div className="absolute inset-0 rounded-xl ring-2 ring-white/20 group-hover:ring-white/40 transition-all" />
    </div>
    <div className="flex flex-col">
      <h1 className="text-2xl font-bold tracking-tight text-white">
        BEAM<span className="text-cyan-400">DATA</span>
      </h1>
      <span className="text-[10px] font-medium tracking-[0.2em] text-slate-400 uppercase">Intelligence Dashboard</span>
    </div>
  </div>
);

function App() {
  // STATE
  const [activeTab, setActiveTab] = useState('insights');
  // Safety checks for initial state
  const [selectedCompany, setSelectedCompany] = useState(competitorData[0]?.name || 'Beam Data');
  const [selectedInsightCompany, setSelectedInsightCompany] = useState(null);
  const [showBenchmark, setShowBenchmark] = useState(true);

  // COMPARE TAB STATE
  const [compareSelection, setCompareSelection] = useState(['Beam Data', 'Tredence', 'Adastra']);
  const [compareViewMode, setCompareViewMode] = useState('chart'); // 'chart' or 'heatmap'

  // INSIGHT ENGINE STATE
  const [insightsData, setInsightsData] = useState([]);
  const [loadingInsights, setLoadingInsights] = useState(true);
  const [insightsError, setInsightsError] = useState(null);
  const [expandedFlag, setExpandedFlag] = useState(null); // { id: string, flag: string }

  // FETCH INSIGHTS
  React.useEffect(() => {
    const fetchInsights = async () => {
      try {
        setLoadingInsights(true);
        const response = await fetch('http://localhost:8000/api/insights');
        if (!response.ok) throw new Error('Failed to fetch insights');
        const data = await response.ok ? await response.json() : [];
        setInsightsData(data);
      } catch (err) {
        console.error(err);
        setInsightsError(err.message);
      } finally {
        setLoadingInsights(false);
      }
    };
    fetchInsights();
  }, []);

  // CALCULATIONS
  const companiesWithOverall = competitorData.map(company => {
    const metricValues = Object.values(company.metrics || {});
    const overall = metricValues.length ? metricValues.reduce((a, b) => a + b, 0) / metricValues.length : 0;
    return { ...company, overall };
  });

  const sortedCompanies = [...companiesWithOverall].sort((a, b) => b.overall - a.overall);

  // HELPERS
  const getMetricIcon = (metricKey) => {
    const iconMap = {
      marketPresence: Building2,
      technicalDepth: Lightbulb,
      serviceProductFit: Target,
      deliveryExcellence: Award,
      customerOutcomes: TrendingUp,
      financialHealth: DollarSign,
      talentCulture: Heart,
      pricingValue: Users
    };
    return iconMap[metricKey] || Building2;
  };

  const getScoreColor = (score) => {
    if (score >= 4.5) return 'bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.5)]';
    if (score >= 3.5) return 'bg-violet-400';
    if (score >= 2.5) return 'bg-fuchsia-400';
    if (score >= 1.5) return 'bg-orange-400';
    return 'bg-red-500';
  };

  const getScoreTextColor = (score) => {
    if (score >= 4.5) return 'text-cyan-400';
    if (score >= 3.5) return 'text-violet-400';
    if (score >= 2.5) return 'text-fuchsia-400';
    return 'text-red-400';
  };

  const toggleCompareSelection = (name) => {
    setCompareSelection(prev => {
      if (prev.includes(name)) {
        if (prev.length === 1) return prev; // Prevent deselecting all
        return prev.filter(c => c !== name);
      }
      return [...prev, name];
    });
  };

  // CHART DATA PREP
  const selectedCompanyData = competitorData.find(c => c.name === selectedCompany) || competitorData[0];

  const industryAverage = useMemo(() => {
    const avgs = {};
    if (competitorData.length === 0) return avgs;
    metrics.forEach(m => {
      const sum = competitorData.reduce((acc, curr) => acc + (curr.metrics[m.key] || 0), 0);
      avgs[m.key] = sum / competitorData.length;
    });
    return avgs;
  }, []);

  const radarData = metrics.map(metric => ({
    metric: metric.label,
    score: selectedCompanyData?.metrics[metric.key] || 0,
    average: industryAverage[metric.key] || 0,
    fullMark: 5
  }));

  const comparisonData = metrics.map(metric => {
    const data = { metric: metric.label };
    competitorData.forEach(company => {
      if (compareSelection.includes(company.name)) {
        data[company.name] = company.metrics[metric.key] || 0;
      }
    });
    return data;
  });

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900/95 border border-slate-700 p-3 rounded-lg shadow-xl backdrop-blur-md">
          <p className="font-bold text-slate-100 mb-2 border-b border-slate-700/50 pb-1">{label}</p>
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center gap-2 text-sm mb-1">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }}></div>
              <span className="text-slate-300 w-24 truncate">{entry.name}:</span>
              <span className="font-bold font-mono" style={{ color: entry.color }}>{Number(entry.value).toFixed(1)}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  const getInsights = (company) => {
    if (!company) return { strengths: [], weaknesses: [] };
    const strengths = metrics.filter(m => company.metrics[m.key] >= 4.5);
    const weaknesses = metrics.filter(m => company.metrics[m.key] <= 3);
    return { strengths, weaknesses };
  };

  const currentInsights = getInsights(selectedInsightCompany);
  const currentOverall = companiesWithOverall.find(c => c.name === selectedInsightCompany?.name)?.overall || 0;
  const profile = selectedInsightCompany?.profile || {};

  const tabDetails = {
    overview: {
      title: "Executive Overview",
      desc: "High-level summary of market standing and key performance indicators."
    },
    comparison: {
      title: "Competitive Landscape",
      desc: "Direct head-to-head comparison of metric scores across the industry."
    },
    radar: {
      title: "Strategic Profile",
      desc: "Visual analysis of individual company strengths and focus areas."
    },
    insights: {
      title: selectedInsightCompany ? "Company Dossier" : "Health Overview",
      desc: selectedInsightCompany ? "Comprehensive breakdown including raw scraped data and AI evaluations." : "What deserves attention right now."
    },
    insightEngine: {
      title: "Insight Engine",
      desc: "Advanced predictive analytics and pattern recognition."
    },
    rankings: {
      title: "Leaderboard",
      desc: "Ordered rankings of all competitors by specific metric performance."
    }
  };

  return (
    <div className="min-h-screen text-slate-200 selection:bg-cyan-500/30 flex flex-col font-sans">
      <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/70 backdrop-blur-md">
        <div className="w-full max-w-[1920px] mx-auto px-6 h-20 flex items-center justify-between">
          <BeamLogo />
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/50 border border-white/5">
              <div className="h-2 w-2 rounded-full bg-cyan-500 animate-pulse"></div>
              <span className="text-xs font-medium text-slate-400">System Live</span>
            </div>
            <div className="h-8 w-8 rounded-full bg-gradient-to-r from-cyan-500 to-violet-500 p-[1px]">
              <div className="h-full w-full rounded-full bg-slate-950 flex items-center justify-center">
                <span className="text-xs font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-violet-500">BD</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container - Full Width */}
      <main className="w-full max-w-[1920px] mx-auto p-6 space-y-8 flex-1">

        {/* Dynamic Page Header */}
        <div className="flex flex-col gap-4 border-b border-white/5 pb-6">
          <h2 className="text-3xl md:text-4xl font-bold text-white animate-in slide-in-from-left duration-500">
            {tabDetails[activeTab]?.title}
          </h2>
          <p className="text-slate-400 max-w-2xl animate-in slide-in-from-left duration-700 delay-100">
            {tabDetails[activeTab]?.desc}
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full space-y-8 min-h-[calc(100vh-300px)]">
          <TabsList className="w-full max-w-4xl grid grid-cols-6 bg-slate-900/50 p-1 rounded-xl border border-white/5 mx-auto md:mx-0">
            {[
              { id: 'overview', icon: Activity, label: 'Overview' },
              { id: 'comparison', icon: BarChart3, label: 'Compare' },
              { id: 'radar', icon: PieChart, label: 'Profile' },
              { id: 'insights', icon: Cpu, label: 'Health Overview' },
              { id: 'insightEngine', icon: Search, label: 'Insight Engine' },
              { id: 'rankings', icon: Trophy, label: 'Rankings' }
            ].map(tab => (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                className="data-[state=active]:bg-cyan-500/10 data-[state=active]:text-cyan-400 data-[state=active]:border-cyan-500/50 border border-transparent rounded-lg transition-all duration-300 flex items-center justify-center gap-2"
              >
                <tab.icon className="h-4 w-4" />
                <span className="hidden md:inline">{tab.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {/* OVERVIEW TAB */}
          <TabsContent value="overview" className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {metrics.map(metric => {
                const Icon = getMetricIcon(metric.key);
                const beamScore = competitorData.find(c => c.name === 'Beam Data')?.metrics[metric.key] || 0;
                const avgScore = (competitorData.reduce((sum, c) => sum + (c.metrics[metric.key] || 0), 0) / competitorData.length).toFixed(1);
                const isAboveAvg = beamScore >= avgScore;

                return (
                  <Card key={metric.key} className="glass-card border-l-4 border-l-transparent hover:border-l-cyan-500">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                      <CardTitle className="text-xs font-medium uppercase tracking-wider text-slate-400">{metric.label}</CardTitle>
                      <Icon className={`h-4 w-4 ${isAboveAvg ? 'text-cyan-400' : 'text-slate-500'}`} />
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-end justify-between">
                        <div className="text-3xl font-bold text-white">{beamScore}</div>
                        <div className={`text-xs px-2 py-1 rounded-full ${isAboveAvg ? 'bg-cyan-500/10 text-cyan-400' : 'bg-red-500/10 text-red-400'}`}>
                          {isAboveAvg ? '+' : ''}{((beamScore - avgScore)).toFixed(1)} vs Avg
                        </div>
                      </div>
                      <div className="mt-3 h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-1000 ${getScoreColor(beamScore)}`}
                          style={{ width: `${(beamScore / 5) * 100}%` }}
                        />
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-yellow-500" />
                  Market Leaders
                </CardTitle>
                <CardDescription className="text-slate-400">Companies ranked by calculated overall performance score.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {sortedCompanies.slice(0, 5).map((company, index) => (
                    <div key={company.name} className="group flex items-center justify-between p-4 rounded-lg bg-slate-900/40 border border-white/5 hover:border-cyan-500/30 transition-all">
                      <div className="flex items-center gap-4">
                        <div className={`flex items-center justify-center w-8 h-8 rounded-full font-bold ${index === 0 ? 'bg-yellow-500/20 text-yellow-500 ring-1 ring-yellow-500/50' : 'bg-slate-800 text-slate-400'}`}>
                          {index + 1}
                        </div>
                        <div>
                          <h3 className={`font-semibold ${company.name === 'Beam Data' ? 'text-cyan-400' : 'text-white'}`}>
                            {company.name}
                          </h3>
                          <p className="text-xs text-slate-500 hidden sm:block">{company.raw.description || "No description available"}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-white">{company.overall.toFixed(1)}</div>
                        <div className="text-xs text-slate-500">Overall Score</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* COMPARISON TAB (UPDATED LAYOUT) */}
          <TabsContent value="comparison" className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[800px]">

              {/* SIDEBAR: COMPANY SELECTION */}
              <div className="lg:col-span-2 space-y-4 flex flex-col h-full">
                <Card className="glass-card flex-1 flex flex-col">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2 text-sm uppercase tracking-wider text-slate-400">
                      <Search className="w-4 h-4 text-cyan-400" /> Filter
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1 overflow-y-auto custom-scrollbar space-y-1">
                    {competitorData.map(c => (
                      <button
                        key={c.name}
                        onClick={() => toggleCompareSelection(c.name)}
                        className={`w-full flex items-center justify-between px-3 py-3 rounded-md text-sm transition-all border ${compareSelection.includes(c.name)
                          ? 'bg-cyan-500/10 border-cyan-500/50 text-cyan-100'
                          : 'bg-transparent border-transparent text-slate-400 hover:bg-white/5'
                          }`}
                      >
                        <span className="truncate mr-2 text-left">{c.name}</span>
                        {compareSelection.includes(c.name) && <Check className="w-3 h-3 text-cyan-400 shrink-0" />}
                      </button>
                    ))}
                  </CardContent>
                </Card>
              </div>

              {/* MAIN CONTENT */}
              <div className="lg:col-span-10 flex flex-col gap-4 h-full">

                {/* VIEW TOGGLE */}
                <div className="flex justify-end">
                  <div className="bg-slate-900/50 p-1 rounded-lg border border-white/5 inline-flex">
                    <button
                      onClick={() => setCompareViewMode('chart')}
                      className={`px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition-all ${compareViewMode === 'chart' ? 'bg-cyan-500 text-white shadow' : 'text-slate-400 hover:text-white'}`}
                    >
                      <BarChart3 className="w-4 h-4" /> Chart
                    </button>
                    <button
                      onClick={() => setCompareViewMode('heatmap')}
                      className={`px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition-all ${compareViewMode === 'heatmap' ? 'bg-cyan-500 text-white shadow' : 'text-slate-400 hover:text-white'}`}
                    >
                      <Activity className="w-4 h-4" /> Heatmap
                    </button>
                  </div>
                </div>

                <Card className="glass-card flex-1 p-4 relative overflow-hidden">
                  {compareViewMode === 'chart' ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={comparisonData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }} barGap={2}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                        <XAxis dataKey="metric" tick={{ fontSize: 12, fill: '#94a3b8' }} interval={0} />
                        <YAxis stroke="#94a3b8" domain={[0, 5]} />
                        <RechartsTooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
                        <Legend wrapperStyle={{ paddingTop: '20px' }} />
                        {competitorData
                          .filter(c => compareSelection.includes(c.name))
                          .map((company, idx) => {
                            // Dynamic Color Pallete
                            const colors = ['#06b6d4', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#3b82f6', '#ef4444'];
                            const color = company.name === 'Beam Data' ? '#22d3ee' : colors[idx % colors.length];
                            return (
                              <Bar
                                key={company.name}
                                dataKey={company.name}
                                fill={color}
                                radius={[4, 4, 0, 0]}
                                maxBarSize={50}
                              />
                            );
                          })}
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="w-full h-full overflow-auto custom-scrollbar">
                      {/* HEATMAP IMPLEMENTATION */}
                      <div className="w-full">
                        {/* Header Row */}
                        <div className="flex border-b border-white/10 sticky top-0 bg-slate-900 z-10">
                          <div className="w-64 p-4 font-bold text-slate-400 text-sm uppercase tracking-wider bg-slate-950/50">Metric</div>
                          {competitorData.filter(c => compareSelection.includes(c.name)).map(c => (
                            <div key={c.name} className="flex-1 p-4 text-center font-bold text-white min-w-[120px] bg-slate-950/50">
                              {c.name}
                            </div>
                          ))}
                        </div>
                        {/* Data Rows */}
                        {metrics.map((metric, i) => (
                          <div key={metric.key} className={`flex border-b border-white/5 hover:bg-white/5 transition-colors ${i % 2 === 0 ? 'bg-white/[0.02]' : ''}`}>
                            <div className="w-64 p-4 text-sm font-medium text-slate-300 flex items-center gap-2">
                              {React.createElement(getMetricIcon(metric.key), { className: "w-4 h-4 text-slate-500" })}
                              {metric.label}
                            </div>
                            {competitorData.filter(c => compareSelection.includes(c.name)).map(c => {
                              const score = c.metrics[metric.key];
                              let bgClass = '';
                              // Heatmap color logic
                              if (score >= 4.5) bgClass = 'bg-cyan-500/20 text-cyan-400';
                              else if (score >= 3.5) bgClass = 'bg-violet-500/20 text-violet-400';
                              else if (score >= 2.5) bgClass = 'bg-fuchsia-500/20 text-fuchsia-400';
                              else bgClass = 'bg-red-500/20 text-red-400';

                              return (
                                <div key={c.name} className="flex-1 p-4 flex items-center justify-center min-w-[120px]">
                                  <div className={`w-12 h-8 rounded flex items-center justify-center font-mono font-bold text-sm ${bgClass}`}>
                                    {score}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* INSIGHTS TAB: HEALTH OVERVIEW + COMPANY DOSSIER */}
          <TabsContent value="insights" className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 h-full">
            {/* Layer 1: Health Overview */}
            {!selectedInsightCompany && (
              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  <Card className="bg-gradient-to-br from-red-900/50 via-red-900/30 to-orange-900/20 border-red-900/40 shadow-lg">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-red-200 flex items-center gap-2 text-base">
                        <AlertOctagon className="w-5 h-5" /> Immediate Actions Required
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex gap-3 items-start p-3 rounded-lg border border-red-900/30 bg-red-900/20">
                        <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                        <div>
                          <div className="font-bold text-red-100">Divest / Write-off: DATA212</div>
                          <p className="text-sm text-red-200/80 mt-1">Entity listed as "Closed". Verify asset liquidation or pivot status immediately to minimize exposure.</p>
                        </div>
                      </div>
                      <div className="flex gap-3 items-start p-3 rounded-lg border border-amber-900/30 bg-amber-900/10">
                        <Activity className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                        <div>
                          <div className="font-bold text-amber-100">Monitor Growth: Tredence</div>
                          <p className="text-sm text-amber-200/80 mt-1">Investigate -0.40% traffic dip despite Series B status. Ensure customer acquisition cost (CAC) is stable.</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-emerald-900/40 via-cyan-900/30 to-slate-900/40 border-emerald-900/40 shadow-lg">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-emerald-200 flex items-center gap-2 text-base">
                        <TrendingUp className="w-5 h-5" /> Strategic Opportunities
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex gap-3 items-start p-3 rounded-lg border border-emerald-900/30 bg-emerald-900/15">
                        <Zap className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                        <div>
                          <div className="font-bold text-emerald-100">Acquisition Targets: Beam Data &amp; Synergo</div>
                          <p className="text-sm text-emerald-200/80 mt-1">High heat scores relative to small size. Prime targets to bolster AI &amp; Fintech capabilities.</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-cyan-900/30 via-slate-900/40 to-slate-900/60 border-cyan-900/30 shadow-lg">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-cyan-200 flex items-center gap-2 text-base">
                        <Search className="w-5 h-5" /> Watchlist
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex gap-3 items-start p-3 rounded-lg border border-cyan-900/30 bg-cyan-900/15">
                        <Activity className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
                        <div>
                          <div className="font-bold text-cyan-100">Watchlist: Keyrus</div>
                          <p className="text-sm text-cyan-200/80 mt-1">Monitor integration of 16 acquisitions. Verify if inorganic growth is yielding operational synergies.</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card className="glass-card overflow-hidden">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <LineChart className="w-5 h-5 text-cyan-400" /> Executive Market Matrix
                    </CardTitle>
                    <CardDescription>High-level comparison to identify market outliers and leaders.</CardDescription>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm text-left">
                        <thead className="text-xs text-slate-400 uppercase bg-slate-900/50 border-b border-white/5">
                          <tr>
                            <th className="px-6 py-4 font-bold">Company</th>
                            <th className="px-6 py-4 font-bold">Status</th>
                            <th className="px-6 py-4 font-bold">Size</th>
                            <th className="px-6 py-4 font-bold">Heat Score</th>
                            <th className="px-6 py-4 font-bold">Primary Focus</th>
                            <th className="px-6 py-4 text-right">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                          {companiesWithOverall.map(company => {
                            const status = company.profile?.status || company.raw.operating_status || company.raw.status || 'Unknown';
                            const employees = company.profile?.employees || company.raw.num_employees || 'N/A';
                            const heatScore = company.raw.heat_score ?? 0;
                            const focus = company.profile?.industries?.[0] || company.raw.industries?.[0]?.value || company.raw.company_industry || 'General';
                            const isPublic = company.raw.ipo_status === 'public';
                            const isClosed = status === 'closed';
                            const isHot = heatScore > 80;

                            return (
                              <tr
                                key={company.name}
                                className={`group transition-colors ${isClosed ? 'bg-red-500/5 hover:bg-red-500/10' : 'hover:bg-cyan-500/5'}`}
                              >
                                <td className="px-6 py-4">
                                  <div className="flex items-center gap-3">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${isClosed ? 'bg-red-900/50 text-red-200' : 'bg-slate-800 text-slate-300 group-hover:bg-cyan-500 group-hover:text-white transition-colors'}`}>
                                      {company.name.substring(0, 2).toUpperCase()}
                                    </div>
                                    <div>
                                      <div className={`font-semibold ${isClosed ? 'text-red-400 line-through' : 'text-slate-200'}`}>{company.name}</div>
                                      {isPublic && <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">Public</span>}
                                    </div>
                                  </div>
                                </td>
                                <td className="px-6 py-4">
                                  <Badge variant={isClosed ? 'destructive' : isPublic ? 'success' : 'secondary'}>
                                    {status}
                                  </Badge>
                                </td>
                                <td className="px-6 py-4 text-slate-400">{employees}</td>
                                <td className="px-6 py-4">
                                  <div className="flex items-center gap-2">
                                    <span className={`font-mono font-bold ${isHot ? 'text-orange-400' : 'text-slate-300'}`}>{heatScore}</span>
                                    {isHot && <Zap className="w-3 h-3 text-orange-500 fill-orange-500" />}
                                  </div>
                                </td>
                                <td className="px-6 py-4 text-slate-300">{focus}</td>
                                <td className="px-6 py-4 text-right">
                                  <button
                                    onClick={() => setSelectedInsightCompany(company)}
                                    className="text-xs font-medium text-cyan-200 hover:text-cyan-100 bg-cyan-500/10 border border-cyan-500/30 px-3 py-1.5 rounded-md transition-colors"
                                  >
                                    Deep Dive →
                                  </button>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Layer 2: Company Dossier (after Deep Dive) */}
            {selectedInsightCompany && (
              <div className="space-y-6 h-full">
                <div className="flex items-center gap-4 mb-4">
                  <button
                    onClick={() => setSelectedInsightCompany(null)}
                    className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors border border-white/5"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <div>
                    <p className="text-xs uppercase tracking-[0.25em] text-slate-500">Company Dossier</p>
                    <h2 className="text-xl font-semibold text-white">Deep Dive Intelligence</h2>
                  </div>
                </div>

                {profile.status === 'closed' && (
                  <div className="rounded-lg border border-red-500/50 bg-gradient-to-r from-red-900/60 to-red-800/40 text-red-100 px-4 py-3 text-sm flex items-center gap-2">
                    <AlertOctagon className="w-4 h-4" /> This entity is marked as Closed. Confirm disposition and exposure.
                  </div>
                )}
                {profile.status !== 'closed' && currentOverall < 3 && (
                  <div className="rounded-lg border border-amber-500/40 bg-gradient-to-r from-amber-900/40 to-amber-800/30 text-amber-100 px-4 py-3 text-sm flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4" /> Weak performance indicators detected. Prioritize remediation.
                  </div>
                )}

                <div className="relative overflow-hidden rounded-2xl glass-card border-0 p-8">
                  <div className="absolute top-0 right-0 p-4 opacity-10">
                    <Zap className="w-64 h-64 text-cyan-400" />
                  </div>
                  <div className="relative z-10">
                    <div className="flex justify-between items-start">
                      <div>
                        <Badge className="mb-4 bg-cyan-500/20 text-cyan-300 border-cyan-500/30 hover:bg-cyan-500/30">
                          Intelligence Dossier
                        </Badge>
                        <h1 className="text-4xl font-bold text-white mb-2">{selectedInsightCompany.name}</h1>
                        <p className="text-lg text-slate-300 max-w-xl">{profile.description}</p>

                        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
                          <InfoChip label="Headquarters" value={profile.headquarters} />
                          <InfoChip label="Employees" value={profile.employees} />
                          <InfoChip label="Status" value={profile.status} />
                          <InfoChip label="IPO" value={profile.ipoStatus} />
                          <InfoChip label="Website" value={profile.website} isLink />
                          <InfoChip label="Tech Count" value={profile.techCount} />
                          <InfoChip label="Rank" value={profile.rank && `#${profile.rank.toLocaleString()}`} />
                          <InfoChip label="Est. IT Spend" value={profile.itSpend ? formatCurrency(profile.itSpend) : null} />
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-violet-400">
                          {currentOverall.toFixed(1)}
                        </div>
                        <div className="text-sm font-medium text-slate-400 uppercase tracking-widest mt-1">Overall Rating</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="glass-card h-full">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-sm uppercase tracking-widest text-slate-400">
                        <Cpu className="w-4 h-4 text-violet-400" /> AI Evaluation
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div>
                        <h4 className="flex items-center gap-2 font-semibold text-green-400 mb-3">
                          <CheckCircle2 className="w-4 h-4" /> Leading Strengths
                        </h4>
                        <div className="space-y-2">
                          {currentInsights.strengths.length > 0 ? (
                            currentInsights.strengths.map(m => (
                              <div key={m.key} className="flex justify-between items-center bg-green-500/5 p-2 rounded border border-green-500/10">
                                <span className="text-sm text-slate-300">{m.label}</span>
                                <span className="font-mono text-green-400 font-bold">{selectedInsightCompany.metrics[m.key]}</span>
                              </div>
                            ))
                          ) : (
                            <div className="text-sm text-slate-500 italic">No standout strengths detected (&gt;4.5)</div>
                          )}
                        </div>
                      </div>
                      <div>
                        <h4 className="flex items-center gap-2 font-semibold text-orange-400 mb-3">
                          <AlertTriangle className="w-4 h-4" /> Areas for Improvement
                        </h4>
                        <div className="space-y-2">
                          {currentInsights.weaknesses.length > 0 ? (
                            currentInsights.weaknesses.map(m => (
                              <div key={m.key} className="flex justify-between items-center bg-orange-500/5 p-2 rounded border border-orange-500/10">
                                <span className="text-sm text-slate-300">{m.label}</span>
                                <span className="font-mono text-orange-400 font-bold">{selectedInsightCompany.metrics[m.key]}</span>
                              </div>
                            ))
                          ) : (
                            <div className="text-sm text-slate-500 italic">No critical weaknesses detected (&lt;3.0)</div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="glass-card h-full">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-sm uppercase tracking-widest text-slate-400">
                        <Activity className="w-4 h-4 text-cyan-400" /> Performance Matrix
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {metrics.map(metric => (
                        <div key={metric.key} className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span className="text-slate-400">{metric.label}</span>
                            <span className={`font-mono font-bold ${getScoreTextColor(selectedInsightCompany.metrics[metric.key])}`}>
                              {selectedInsightCompany.metrics[metric.key]}/5
                            </span>
                          </div>
                          <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${getScoreColor(selectedInsightCompany.metrics[metric.key])}`}
                              style={{ width: `${(selectedInsightCompany.metrics[metric.key] / 5) * 100}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card className="glass-card">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-sm uppercase tracking-widest text-slate-400">
                        <Activity className="w-4 h-4 text-cyan-400" /> Industries
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-wrap gap-2">
                      {(profile.industries || []).length ? (
                        profile.industries.map((ind) => (
                          <Badge key={ind} className="bg-slate-800 text-slate-100 px-2 py-1 rounded">
                            {ind}
                          </Badge>
                        ))
                      ) : (
                        <p className="text-sm text-slate-500 italic">Not available.</p>
                      )}
                    </CardContent>
                  </Card>

                  <Card className="glass-card">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-sm uppercase tracking-widest text-slate-400">
                        <FileText className="w-4 h-4 text-fuchsia-400" /> Key Products / Services
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {(profile.products || []).length ? (
                        profile.products.map((prod, i) => (
                          <div key={i} className="bg-slate-950/30 p-3 rounded border border-white/5 text-sm text-slate-200">
                            {prod}
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-slate-500 italic">Not available.</p>
                      )}
                    </CardContent>
                  </Card>

                  <Card className="glass-card">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-sm uppercase tracking-widest text-slate-400">
                        <Users className="w-4 h-4 text-emerald-400" /> Founders
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="flex flex-wrap gap-3">
                      {(profile.founders || []).length ? (
                        profile.founders.map((f, i) => (
                          <Badge key={i} className="bg-slate-800 text-slate-100 px-3 py-1 rounded">
                            {f}
                          </Badge>
                        ))
                      ) : (
                        <p className="text-sm text-slate-500 italic">Not available.</p>
                      )}
                    </CardContent>
                  </Card>
                </div>

                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-sm uppercase tracking-widest text-slate-400">
                      <FileText className="w-4 h-4 text-fuchsia-400" /> Raw Intelligence Data
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 gap-4">
                      {Object.entries(selectedInsightCompany.raw).map(([key, value]) => {
                        if (key === 'description') return null;
                        return (
                          <div key={key} className="bg-slate-950/30 p-4 rounded-lg border border-white/5">
                            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">{key}</h4>
                            <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">{value}</p>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>

          {/* RADAR TAB (UPDATED) */}
          <TabsContent value="radar" className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

              {/* Controls Panel */}
              <div className="lg:col-span-3 space-y-4">
                <Card className="glass-card">
                  <CardHeader>
                    <CardTitle className="text-sm uppercase tracking-wider text-slate-400">Configuration</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-300">Target Company</label>
                      <div className="relative">
                        <select
                          value={selectedCompany}
                          onChange={(e) => setSelectedCompany(e.target.value)}
                          className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-sm appearance-none focus:ring-2 focus:ring-cyan-500 focus:outline-none text-white cursor-pointer"
                        >
                          {competitorData.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
                        </select>
                        <ChevronDown className="absolute right-3 top-3 h-4 w-4 text-slate-500 pointer-events-none" />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-300">Benchmarks</label>
                      <button
                        onClick={() => setShowBenchmark(!showBenchmark)}
                        className={`w-full flex items-center justify-between p-3 rounded-lg border text-sm transition-all ${showBenchmark ? 'bg-violet-500/20 border-violet-500 text-violet-200' : 'bg-slate-900 border-slate-700 text-slate-400'}`}
                      >
                        <span>Industry Average</span>
                        {showBenchmark ? <Check className="w-4 h-4" /> : <div className="w-4 h-4" />}
                      </button>
                    </div>

                    <div className="pt-4 border-t border-white/10">
                      <h4 className="text-xs font-bold text-slate-500 mb-2">CURRENT SCORE</h4>
                      <div className="text-4xl font-black text-cyan-400">{selectedCompanyData?.overall?.toFixed(1) || '0.0'}</div>
                      <div className="text-xs text-slate-500 mt-2">Based on 8 key performance indicators</div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Chart Panel */}
              <div className="lg:col-span-9">
                <Card className="glass-card flex items-center justify-center p-6 bg-gradient-to-b from-slate-900/50 to-slate-950/50">
                  <div className="h-[500px] w-full max-w-4xl">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                        <PolarGrid stroke="#334155" />
                        <PolarAngleAxis dataKey="metric" tick={{ fill: '#94a3b8', fontSize: 12, dy: 4 }} />
                        <PolarRadiusAxis angle={30} domain={[0, 5]} tick={false} axisLine={false} />

                        {/* Target Company */}
                        <Radar
                          name={selectedCompany}
                          dataKey="score"
                          stroke="#06b6d4"
                          strokeWidth={4}
                          fill="#06b6d4"
                          fillOpacity={0.4}
                        />

                        {/* Benchmark Overlay */}
                        {showBenchmark && (
                          <Radar
                            name="Industry Avg"
                            dataKey="average"
                            stroke="#8b5cf6"
                            strokeWidth={2}
                            strokeDasharray="4 4"
                            fill="#8b5cf6"
                            fillOpacity={0.1}
                          />
                        )}

                        <Legend />
                        <RechartsTooltip content={<CustomTooltip />} />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* INSIGHT ENGINE TAB */}
          <TabsContent value="insightEngine" className="animate-in fade-in slide-in-from-bottom-4 duration-500 min-h-screen">
            <div className="grid grid-cols-1 gap-6">
              {loadingInsights && (
                <div className="flex flex-col items-center justify-center p-12 space-y-4">
                  <div className="h-12 w-12 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin"></div>
                  <p className="text-slate-400 animate-pulse">Scanning strategic signals...</p>
                </div>
              )}
              {insightsError && (
                <div className="p-8 rounded-xl border border-red-500/20 bg-red-500/5 text-center">
                  <AlertOctagon className="h-8 w-8 text-red-500 mx-auto mb-3" />
                  <p className="text-red-200">Failed to connect to Insight Engine</p>
                  <p className="text-sm text-red-400 mt-1">{insightsError}</p>
                </div>
              )}
              {!loadingInsights && !insightsError && insightsData.length === 0 && (
                <div className="text-center p-12 border border-dashed border-white/10 rounded-xl">
                  <Search className="h-12 w-12 text-slate-600 mx-auto mb-3" />
                  <p className="text-slate-400">No signals detected in the specified range.</p>
                </div>
              )}
              {!loadingInsights && !insightsError && insightsData.map((company) => (
                <Card key={company.id} className="glass-card overflow-hidden border-l-4 border-l-cyan-500">
                  <CardHeader className="bg-slate-900/50 border-b border-white/5 pb-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-3">
                          <h3 className="text-xl font-bold text-white">{company.company_name}</h3>
                          <Badge variant="outline" className="border-cyan-500/30 text-cyan-400 text-[10px] uppercase tracking-wider">
                            {company.activity_recency} Days Ago
                          </Badge>
                        </div>
                        <p className="text-slate-400 text-sm mt-1 max-w-2xl">{company.insight_summary}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="text-right hidden md:block">
                          <div className="text-xs text-slate-500 uppercase tracking-widest">Hiring Volume</div>
                          <div className="text-lg font-bold text-white">{company.job_postings_count} Roles</div>
                        </div>
                        <div className="h-10 w-10 rounded-full bg-slate-800 flex items-center justify-center border border-white/10">
                          <Users className="h-5 w-5 text-cyan-400" />
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

                      {/* Column 1: Core Info */}
                      <div className="space-y-3">
                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                          <Building2 className="h-3 w-3" /> Firm Profile
                        </h4>
                        <div className="text-sm space-y-1">
                          <div className="text-slate-300"><span className="text-slate-500">HQ:</span> {company.region.split(',')[0]}</div>
                          <div className="text-slate-300"><span className="text-slate-500">Size:</span> {company.size_band}</div>
                          <div className="text-slate-300"><span className="text-slate-500">Tech:</span> {company.tech_mentions.split(',').slice(0, 3).join(', ')}</div>
                        </div>
                      </div>

                      {/* Column 2: Signals */}
                      <div className="space-y-3 col-span-1 lg:col-span-2">
                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                          <Activity className="h-3 w-3" /> Strategic Signals
                        </h4>
                        <div className="grid grid-cols-2 gap-2 relative">
                          {/* Hiring Trend */}
                          <div
                            className={`group cursor-pointer flex items-center gap-2 p-2 rounded border transition-all ${company.trend_hiring ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20' : 'bg-slate-900 border-slate-800 text-slate-500 opacity-50'}`}
                            onClick={() => company.trend_hiring && setExpandedFlag(expandedFlag?.id === company.id && expandedFlag?.flag === 'trend_hiring' ? null : { id: company.id, flag: 'trend_hiring' })}
                          >
                            {company.trend_hiring ? <TrendingUp className="h-4 w-4" /> : <div className="h-4 w-4" />}
                            <span className="text-xs font-medium">Hiring Trend</span>
                          </div>

                          {/* Tech Pivot */}
                          <div
                            className={`group cursor-pointer flex items-center gap-2 p-2 rounded border transition-all ${company.tech_stack_pivot ? 'bg-violet-500/10 border-violet-500/20 text-violet-400 hover:bg-violet-500/20' : 'bg-slate-900 border-slate-800 text-slate-500 opacity-50'}`}
                            onClick={() => company.tech_stack_pivot && setExpandedFlag(expandedFlag?.id === company.id && expandedFlag?.flag === 'tech_stack_pivot' ? null : { id: company.id, flag: 'tech_stack_pivot' })}
                          >
                            {company.tech_stack_pivot ? <Cpu className="h-4 w-4" /> : <div className="h-4 w-4" />}
                            <span className="text-xs font-medium">Tech Pivot</span>
                          </div>

                          {/* Market Expansion */}
                          <div
                            className={`group cursor-pointer flex items-center gap-2 p-2 rounded border transition-all ${company.market_expansion ? 'bg-blue-500/10 border-blue-500/20 text-blue-400 hover:bg-blue-500/20' : 'bg-slate-900 border-slate-800 text-slate-500 opacity-50'}`}
                            onClick={() => company.market_expansion && setExpandedFlag(expandedFlag?.id === company.id && expandedFlag?.flag === 'market_expansion' ? null : { id: company.id, flag: 'market_expansion' })}
                          >
                            {company.market_expansion ? <Target className="h-4 w-4" /> : <div className="h-4 w-4" />}
                            <span className="text-xs font-medium">Market Exp.</span>
                          </div>

                          {/* Capability Expansion */}
                          <div
                            className={`group cursor-pointer flex items-center gap-2 p-2 rounded border transition-all ${company.capability_expansion ? 'bg-orange-500/10 border-orange-500/20 text-orange-400 hover:bg-orange-500/20' : 'bg-slate-900 border-slate-800 text-slate-500 opacity-50'}`}
                            onClick={() => company.capability_expansion && setExpandedFlag(expandedFlag?.id === company.id && expandedFlag?.flag === 'capability_expansion' ? null : { id: company.id, flag: 'capability_expansion' })}
                          >
                            {company.capability_expansion ? <Lightbulb className="h-4 w-4" /> : <div className="h-4 w-4" />}
                            <span className="text-xs font-medium">New Cap.</span>
                          </div>

                          {/* DETAIL POPOVER OVERLAY */}
                          {expandedFlag?.id === company.id && (
                            <div className="absolute top-full left-0 right-0 mt-2 z-10 bg-slate-800 border border-white/10 rounded-lg p-3 shadow-xl animate-in fade-in zoom-in-95 duration-200">
                              <div className="flex justify-between items-start mb-1">
                                <h5 className="text-xs font-bold text-white uppercase tracking-wider">
                                  {expandedFlag.flag === 'trend_hiring' && 'Hiring Surge Details'}
                                  {expandedFlag.flag === 'tech_stack_pivot' && 'Tech Pivot Details'}
                                  {expandedFlag.flag === 'market_expansion' && 'Market Expansion Details'}
                                  {expandedFlag.flag === 'capability_expansion' && 'New Capabilities Details'}
                                </h5>
                              </div>
                              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                                {company.flag_details?.[expandedFlag.flag] || "Recent intelligence aggregation highlights steady strategic movements. Continuous monitoring is active to surface further actionable updates."}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Column 3: Insight */}
                      <div className="space-y-3">
                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-2">
                          <Search className="h-3 w-3" /> Competitive Analysis
                        </h4>
                        <div className="space-y-3">
                          <div className="bg-slate-950/50 p-3 rounded-lg border border-white/5">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">Impact</span>
                              <Badge variant="outline" className={`
                                ${company.competitive_impact === 'HIGH' ? 'border-red-500/50 text-red-400 bg-red-500/10' : ''}
                                ${company.competitive_impact === 'MEDIUM' ? 'border-orange-500/50 text-orange-400 bg-orange-500/10' : ''}
                                ${company.competitive_impact === 'LOW' ? 'border-emerald-500/50 text-emerald-400 bg-emerald-500/10' : ''}
                              `}>
                                {company.competitive_impact}
                              </Badge>
                            </div>
                            <p className="text-xs text-slate-300 leading-relaxed italic">
                              "{company.insight_summary}"
                            </p>
                          </div>

                          <div className="bg-slate-900/40 p-3 rounded-lg border border-cyan-500/20">
                            <h5 className="text-[10px] uppercase tracking-wider text-cyan-400 font-bold mb-1">Recommended Action</h5>
                            <p className="text-xs text-slate-300 leading-relaxed">
                              {company.recommended_action}
                            </p>
                          </div>

                          <div className="flex flex-wrap gap-1.5">
                            {company.tags?.map(tag => (
                              <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-white/5">
                                #{tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* RANKINGS TAB (UPDATED FOR FULL WIDTH) */}
          <TabsContent value="rankings" className="animate-in fade-in slide-in-from-bottom-4 duration-500 min-h-screen">
            <Card className="glass-card">
              <CardHeader>
                <CardTitle>Category Champions</CardTitle>
                <CardDescription className="text-slate-400">Top performers across specific operational metrics</CardDescription>
              </CardHeader>
              <CardContent>
                {/* Updated grid cols for full screen effect */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {metrics.map(metric => {
                    const sortedByMetric = [...competitorData].sort((a, b) => (b.metrics[metric.key] || 0) - (a.metrics[metric.key] || 0));
                    return (
                      <div key={metric.key} className="bg-slate-900/40 p-4 rounded-xl border border-white/5 hover:border-white/10 transition-colors h-full flex flex-col">
                        <div className="flex items-center gap-2 mb-4 pb-2 border-b border-white/5">
                          {React.createElement(getMetricIcon(metric.key), { className: "text-cyan-500 h-5 w-5" })}
                          <h3 className="font-semibold text-slate-200 text-sm">{metric.label}</h3>
                        </div>
                        <div className="space-y-2 flex-1">
                          {sortedByMetric.slice(0, 3).map((company, index) => (
                            <div key={company.name} className="flex items-center justify-between p-2 rounded hover:bg-white/5 transition-colors">
                              <div className="flex items-center space-x-3 overflow-hidden">
                                <Badge className={`w-6 h-6 flex-shrink-0 flex items-center justify-center p-0 ${index === 0 ? 'bg-yellow-500 text-black hover:bg-yellow-600' : 'bg-slate-700 hover:bg-slate-600'}`}>
                                  {index + 1}
                                </Badge>
                                <span className={`text-sm truncate ${company.name === 'Beam Data' ? 'text-cyan-400 font-bold' : 'text-slate-300'}`}>
                                  {company.name}
                                </span>
                              </div>
                              <span className="font-mono text-sm font-semibold text-slate-400 ml-2">{company.metrics[metric.key]}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

        </Tabs>
      </main>
    </div >
  );
}

export default App;
