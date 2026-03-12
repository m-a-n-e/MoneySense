import { useState, useRef, useEffect } from 'react';
import { Calendar, ChevronDown } from 'lucide-react';

interface DateFilterProps {
  months: string[];
  selectedMonth: number;
  selectedYear: number;
  availableYears: number[];
  onMonthChange: (month: number) => void;
  onYearChange: (year: number) => void;
}

export default function DateFilter({
  months,
  selectedMonth,
  selectedYear,
  availableYears,
  onMonthChange,
  onYearChange
}: DateFilterProps) {
  const [isMonthOpen, setIsMonthOpen] = useState(false);
  const [isYearOpen, setIsYearOpen] = useState(false);
  const monthDropdownRef = useRef<HTMLDivElement>(null);
  const yearDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (monthDropdownRef.current && !monthDropdownRef.current.contains(event.target as Node)) {
        setIsMonthOpen(false);
      }
      if (yearDropdownRef.current && !yearDropdownRef.current.contains(event.target as Node)) {
        setIsYearOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="flex items-center bg-white border border-slate-200 rounded-xl shadow-sm hover:border-slate-300 transition-all duration-200 h-11">
      <div className="pl-4 pr-1">
        <Calendar size={18} className="text-indigo-600 opacity-80" />
      </div>
      
      {/* Month Dropdown */}
      <div className="relative h-full" ref={monthDropdownRef}>
        <button
          onClick={() => {
            setIsMonthOpen(!isMonthOpen);
            setIsYearOpen(false);
          }}
          className="px-3 h-full text-slate-700 font-bold text-sm hover:text-indigo-600 transition-all flex items-center gap-1.5 cursor-pointer group"
        >
          {months[selectedMonth]}
          <ChevronDown size={14} className={`transition-transform duration-200 text-slate-400 group-hover:text-indigo-600 ${isMonthOpen ? 'rotate-180' : ''}`} />
        </button>

        {isMonthOpen && (
          <div className="absolute top-full left-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-slate-100 z-50 py-2 max-h-80 overflow-y-auto custom-scrollbar animate-in fade-in zoom-in-95 duration-200">
            <div className="px-3 pb-2 mb-2 border-b border-slate-50">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Selecionar Mês</span>
            </div>
            {months.map((month, index) => (
              <button
                key={month}
                onClick={() => {
                  onMonthChange(index);
                  setIsMonthOpen(false);
                }}
                className={`w-[calc(100%-16px)] mx-2 text-left px-4 py-2 rounded-xl transition-all duration-200 text-sm mb-0.5 ${
                  selectedMonth === index
                    ? 'bg-indigo-600 text-white font-bold shadow-md shadow-indigo-100'
                    : 'hover:bg-slate-50 text-slate-600 font-semibold'
                }`}
              >
                {month}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="h-5 w-px bg-slate-100 mx-1" />

      {/* Year Dropdown */}
      <div className="relative h-full" ref={yearDropdownRef}>
        <button
          onClick={() => {
            setIsYearOpen(!isYearOpen);
            setIsMonthOpen(false);
          }}
          className="pl-3 pr-4 h-full text-slate-700 font-bold text-sm hover:text-indigo-600 transition-all flex items-center gap-1.5 cursor-pointer group"
        >
          {selectedYear}
          <ChevronDown size={14} className={`transition-transform duration-200 text-slate-400 group-hover:text-indigo-600 ${isYearOpen ? 'rotate-180' : ''}`} />
        </button>

        {isYearOpen && (
          <div className="absolute top-full right-0 mt-2 w-32 bg-white rounded-2xl shadow-xl border border-slate-100 z-50 py-2 max-h-80 overflow-y-auto custom-scrollbar animate-in fade-in zoom-in-95 duration-200">
            <div className="px-3 pb-2 mb-2 border-b border-slate-50 text-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Ano</span>
            </div>
            {availableYears.map((year) => (
              <button
                key={year}
                onClick={() => {
                  onYearChange(year);
                  setIsYearOpen(false);
                }}
                className={`w-[calc(100%-16px)] mx-2 text-center px-4 py-2 rounded-xl transition-all duration-200 text-sm mb-0.5 ${
                  selectedYear === year
                    ? 'bg-indigo-600 text-white font-bold shadow-md shadow-indigo-100'
                    : 'hover:bg-slate-50 text-slate-600 font-semibold'
                }`}
              >
                {year}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
