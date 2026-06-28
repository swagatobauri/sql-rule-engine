import { Database, KeyRound, Link2 } from "lucide-react";

function KeyBadge({ k }) {
  if (!k) return null;
  return (
    <span className="inline-flex items-center gap-1 text-[10.5px] font-semibold text-ink/55">
      <span className="inline-flex items-center rounded bg-amber-100 text-amber-700 px-1.5 py-0.5 text-[9.5px] font-bold">
        {k}
      </span>
      {k === "PK" ? (
        <KeyRound size={12} className="text-amber-500" />
      ) : (
        <Link2 size={12} className="text-sky-500" />
      )}
    </span>
  );
}

export default function SchemaTable({ table }) {
  return (
    <div className="rounded-xl border border-black/[0.08] overflow-hidden">
      <div className="flex items-center justify-between bg-[#FAFAFC] px-3 py-2 border-b border-black/[0.06]">
        <span className="flex items-center gap-2 text-[13px] font-bold text-ink">
          <Database size={14} className="text-brand" /> {table.name}
        </span>
        <span className="text-[11px] text-body">({table.columnCount} columns)</span>
      </div>
      <table className="w-full text-[11.5px]">
        <thead>
          <tr className="text-body bg-white">
            <th className="text-left font-semibold px-3 py-1.5">Column Name</th>
            <th className="text-left font-semibold px-2 py-1.5">Type</th>
            <th className="text-left font-semibold px-2 py-1.5">Key</th>
          </tr>
        </thead>
        <tbody>
          {table.columns.map(([name, type, key]) => (
            <tr key={name} className="border-t border-black/[0.05]">
              <td className="px-3 py-1.5 font-mono text-ink/80">{name}</td>
              <td className="px-2 py-1.5 text-body">{type}</td>
              <td className="px-2 py-1.5">
                <KeyBadge k={key} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
