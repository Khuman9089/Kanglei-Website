'use client';

import React from 'react';
import { ManipuriBookPanchangData } from '@/engine/manipuriPanchangBook';
import { toBengaliNumerals, toMeeteiNumerals } from '@/engine/manipuriCalendar';

interface BookPanchang3x8TableProps {
  data: ManipuriBookPanchangData;
  script?: 'bengali' | 'meetei' | 'blipi' | 'en';
  theme?: 'light' | 'dark';
}

function renderCell(
  val: number | string | undefined | null,
  script: 'bengali' | 'meetei' | 'blipi' | 'en' = 'bengali'
): React.ReactNode {
  if (val === '' || val === undefined || val === null) {
    return <span className="opacity-0 select-none">-</span>;
  }
  if (val === '-') {
    return <span className="text-slate-400 font-bold">-</span>;
  }
  if (val === 'নুমিৎ' || val === 'ꯅꯨꯃꯤꯠ' || val === 'nuim\\' || val === 'Numit') {
    if (script === 'meetei') return <span className="text-amber-900 font-black">ꯅꯨꯃꯤꯠ</span>;
    if (script === 'blipi') return <span className="text-amber-900 font-black font-blipi">nuim\</span>;
    if (script === 'en') return <span className="text-amber-900 font-black">Numit</span>;
    return <span className="text-amber-900 font-black">নুমিৎ</span>;
  }
  if (val === 'চুপ্না' || val === 'ꯆꯨꯞꯅꯥ' || val === 'cup_na' || val === 'Chupna') {
    if (script === 'meetei') return <span className="text-amber-900 font-black">ꯆꯨꯞꯅꯥ</span>;
    if (script === 'blipi') return <span className="text-amber-900 font-black font-blipi">cup_na</span>;
    if (script === 'en') return <span className="text-amber-900 font-black">Chupna</span>;
    return <span className="text-amber-900 font-black">চুপ্না</span>;
  }

  const num = typeof val === 'number' ? val : Number(val);
  if (!isNaN(num)) {
    if (script === 'meetei') return toMeeteiNumerals(num);
    if (script === 'bengali') return toBengaliNumerals(num);
    return num;
  }
  return String(val);
}

export default function BookPanchang3x8Table({
  data,
  script = 'bengali',
  theme = 'light',
}: BookPanchang3x8TableProps) {
  const isDark = theme === 'dark';
  const { astronomical } = data;

  return (
    <div className="w-full">
      {/* ─────────────────────────────────────────────────────────────
         THE 3×8 NUMERICAL GRID (8 Rows x 3 Columns = 24 Cells)
         Pure grid without top header boxes or column title names
         ───────────────────────────────────────────────────────────── */}
      <div
        className={`overflow-hidden rounded-2xl border-2 shadow-xs transition-colors ${
          isDark
            ? 'border-amber-600/50 bg-slate-900'
            : 'border-amber-900/60 bg-white'
        }`}
      >
        <table className="w-full table-fixed text-center border-collapse">
          <tbody
            className={`divide-y font-mono font-black text-sm sm:text-base ${
              isDark ? 'divide-slate-800 text-slate-100' : 'divide-amber-900/30 text-slate-950'
            }`}
          >
            {astronomical.numericalTable.rows.map((row, idx) => {
              const isEven = idx % 2 === 0;
              return (
                <tr
                  key={`3x8-row-${idx}`}
                  className={`transition-colors ${
                    isEven
                      ? isDark
                        ? 'bg-slate-900/90'
                        : 'bg-[#fffdf8]'
                      : isDark
                      ? 'bg-slate-800/40'
                      : 'bg-amber-50/40'
                  } hover:bg-amber-100/50 dark:hover:bg-amber-900/30`}
                >
                  <td
                    className={`py-2.5 px-2 border-r text-center truncate font-black text-sm sm:text-base ${
                      isDark ? 'border-slate-800 text-white' : 'border-amber-900/30 text-slate-950'
                    }`}
                  >
                    {renderCell(row.danda, script)}
                  </td>
                  <td
                    className={`py-2.5 px-2 border-r text-center truncate font-black text-sm sm:text-base ${
                      isDark ? 'border-slate-800 text-white' : 'border-amber-900/30 text-slate-950'
                    }`}
                  >
                    {renderCell(row.pal, script)}
                  </td>
                  <td
                    className={`py-2.5 px-2 text-center truncate font-black text-sm sm:text-base ${
                      isDark ? 'text-white' : 'text-slate-950'
                    }`}
                  >
                    {renderCell(row.bipal, script)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
