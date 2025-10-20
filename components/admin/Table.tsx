interface TableProps {
  headers: string[];
  rows: Array<{
    id: string;
    cells: React.ReactNode[];
    actions?: React.ReactNode;
  }>;
}

export function Table({ headers, rows }: TableProps) {
  return (
    <div className="glass rounded-2xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-white/5 border-b border-white/10">
            <tr>
              {headers.map((header, index) => (
                <th
                  key={index}
                  className="px-6 py-4 text-left text-sm font-medium text-white/70"
                >
                  {header}
                </th>
              ))}
              <th className="px-6 py-4 text-right text-sm font-medium text-white/70">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {rows.map((row) => (
              <tr
                key={row.id}
                className="hover:bg-white/5 transition-colors"
              >
                {row.cells.map((cell, index) => (
                  <td
                    key={index}
                    className="px-6 py-4 text-sm text-white"
                  >
                    {cell}
                  </td>
                ))}
                <td className="px-6 py-4 text-right">
                  {row.actions}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
