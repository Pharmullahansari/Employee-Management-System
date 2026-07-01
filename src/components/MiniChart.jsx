import React from 'react';

export const MiniChart = ({ type = 'line', data = [], height = 120 }) => {
  if (type === 'line') {
    const padding = 10;
    const chartHeight = height - padding * 2;
    const chartWidth = 500;
    
    const maxVal = Math.max(...data, 10);
    const minVal = Math.min(...data, 0);
    const range = maxVal - minVal;
    
    const points = data.map((val, idx) => {
      const x = padding + (idx / (data.length - 1)) * (chartWidth - padding * 2);
      const y = padding + chartHeight - ((val - minVal) / range) * chartHeight;
      return { x, y };
    });
    
    const pathD = points.reduce((acc, p, idx) => {
      return idx === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`;
    }, '');

    // Path for the filled gradient area underneath the line
    const areaD = points.length > 0 
      ? `${pathD} L ${points[points.length - 1].x} ${height - padding} L ${points[0].x} ${height - padding} Z`
      : '';

    return (
      <div className="w-full relative">
        <svg viewBox={`0 0 ${chartWidth} ${height}`} className="w-full h-auto overflow-visible">
          <defs>
            <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgb(99, 102, 241)" stopOpacity="0.25" />
              <stop offset="100%" stopColor="rgb(99, 102, 241)" stopOpacity="0.00" />
            </linearGradient>
          </defs>
          
          {/* Grid lines */}
          <line x1={padding} y1={padding} x2={chartWidth - padding} y2={padding} stroke="currentColor" className="text-slate-100 dark:text-slate-800" strokeWidth="1" strokeDasharray="3" />
          <line x1={padding} y1={padding + chartHeight / 2} x2={chartWidth - padding} y2={padding + chartHeight / 2} stroke="currentColor" className="text-slate-100 dark:text-slate-800" strokeWidth="1" strokeDasharray="3" />
          <line x1={padding} y1={height - padding} x2={chartWidth - padding} y2={height - padding} stroke="currentColor" className="text-slate-200 dark:text-slate-800" strokeWidth="1.5" />

          {/* Area Gradient */}
          {areaD && <path d={areaD} fill="url(#chartGradient)" />}

          {/* Main Line */}
          {pathD && (
            <path 
              d={pathD} 
              fill="none" 
              stroke="rgb(99, 102, 241)" 
              strokeWidth="2.5" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
            />
          )}

          {/* Data Nodes */}
          {points.map((p, idx) => (
            <g key={idx} className="group/node">
              <circle 
                cx={p.x} 
                cy={p.y} 
                r="3.5" 
                fill="rgb(99, 102, 241)" 
                stroke="white" 
                strokeWidth="1.5" 
                className="transition-transform dark:stroke-slate-900 group-hover/node:scale-150 cursor-pointer"
              />
              <circle 
                cx={p.x} 
                cy={p.y} 
                r="8" 
                fill="rgb(99, 102, 241)" 
                fillOpacity="0" 
                className="cursor-pointer"
              />
            </g>
          ))}
        </svg>
      </div>
    );
  }

  if (type === 'bar') {
    const maxVal = Math.max(...data.map(d => d.value), 10);
    return (
      <div className="flex items-end justify-between w-full gap-2 pt-4" style={{ height: `${height}px` }}>
        {data.map((item, idx) => {
          const percentage = (item.value / maxVal) * 100;
          return (
            <div key={idx} className="flex flex-col items-center flex-1 group">
              {/* Tooltip on hover */}
              <div className="absolute mb-14 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-800 dark:bg-slate-950 text-white text-[10px] py-1 px-2 rounded shadow-md pointer-events-none whitespace-nowrap">
                {item.value}
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800/60 rounded-t-lg overflow-hidden flex items-end" style={{ height: `${height - 30}px` }}>
                <div 
                  className="w-full rounded-t-lg bg-gradient-to-t from-indigo-500 to-violet-650 transition-all duration-500 origin-bottom scale-y-0 group-hover:from-indigo-400 group-hover:to-violet-500"
                  style={{ height: `${percentage}%`, transform: 'scaleY(1)' }}
                />
              </div>
              <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-2 font-medium truncate w-full text-center">
                {item.label}
              </span>
            </div>
          );
        })}
      </div>
    );
  }

  if (type === 'donut') {
    // Basic animated progress ring
    const radius = 35;
    const strokeWidth = 8;
    const circumference = 2 * Math.PI * radius;
    const percentage = data[0] || 0;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
      <div className="flex items-center justify-center relative" style={{ height: `${height}px` }}>
        <svg width={height} height={height} className="transform -rotate-90">
          {/* Track ring */}
          <circle
            cx={height / 2}
            cy={height / 2}
            r={radius}
            stroke="currentColor"
            strokeWidth={strokeWidth}
            fill="transparent"
            className="text-slate-100 dark:text-slate-800/50"
          />
          {/* Progress ring */}
          <circle
            cx={height / 2}
            cy={height / 2}
            r={radius}
            stroke="url(#donutGradient)"
            strokeWidth={strokeWidth}
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
          <defs>
            <linearGradient id="donutGradient" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#6366f1" />
              <stop offset="100%" stopColor="#8b5cf6" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute flex flex-col items-center justify-center">
          <span className="text-base font-extrabold text-slate-800 dark:text-white">{percentage}%</span>
          <span className="text-[8px] font-semibold text-slate-400 dark:text-slate-500 tracking-wider uppercase">Rate</span>
        </div>
      </div>
    );
  }

  return null;
};
export default MiniChart;
