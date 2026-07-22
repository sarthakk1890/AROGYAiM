import React, { useState } from 'react';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { Input } from './Input';
import { Button } from './Button';

export interface ColumnDef<T> {
  key: keyof T | string;
  header: string;
  render?: (item: T) => React.ReactNode;
}

interface DataTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  keyExtractor: (item: T) => string;
  searchable?: boolean;
  onSearch?: (query: string) => void;
  selectable?: boolean;
  onSelectionChange?: (selectedIds: string[]) => void;
  actions?: React.ReactNode;
}

export function DataTable<T>({ 
  data, 
  columns, 
  keyExtractor, 
  searchable = true, 
  onSearch,
  selectable = false,
  onSelectionChange,
  actions
}: DataTableProps<T>) {
  
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      const allIds = new Set(data.map(item => keyExtractor(item)));
      setSelectedIds(allIds);
      onSelectionChange?.(Array.from(allIds));
    } else {
      setSelectedIds(new Set());
      onSelectionChange?.([]);
    }
  };

  const handleSelectOne = (id: string, checked: boolean) => {
    const newSelected = new Set(selectedIds);
    if (checked) {
      newSelected.add(id);
    } else {
      newSelected.delete(id);
    }
    setSelectedIds(newSelected);
    onSelectionChange?.(Array.from(newSelected));
  };

  return (
    <div style={{ backgroundColor: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)', overflow: 'hidden' }}>
      
      {/* Toolbar */}
      <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
         <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 }}>
            {searchable && (
               <div style={{ maxWidth: 300, width: '100%' }}>
                 <Input 
                   placeholder="Search..." 
                   leftIcon={<Search size={16} />} 
                   onChange={(e) => onSearch?.(e.target.value)}
                 />
               </div>
            )}
            {selectedIds.size > 0 && (
               <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
                 {selectedIds.size} selected
               </span>
            )}
         </div>
         {actions && (
            <div style={{ display: 'flex', gap: '0.5rem' }}>
               {actions}
            </div>
         )}
      </div>

      {/* Table */}
      <div style={{ overflowX: 'auto' }}>
         <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
               <tr style={{ backgroundColor: 'var(--color-bg)', borderBottom: '1px solid var(--color-border)' }}>
                  {selectable && (
                     <th style={{ padding: '1rem 1.5rem', width: 40 }}>
                        <input 
                           type="checkbox" 
                           checked={data.length > 0 && selectedIds.size === data.length}
                           onChange={handleSelectAll}
                        />
                     </th>
                  )}
                  {columns.map((col, i) => (
                     <th key={col.header + i} style={{ padding: '1rem 1.5rem', fontSize: 'var(--font-size-xs)', textTransform: 'uppercase', color: 'var(--color-text-secondary)', fontWeight: 600 }}>
                        {col.header}
                     </th>
                  ))}
               </tr>
            </thead>
            <tbody>
               {data.length === 0 ? (
                 <tr>
                   <td colSpan={selectable ? columns.length + 1 : columns.length} style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-text-secondary)' }}>
                     No data available
                   </td>
                 </tr>
               ) : (
                 data.map((item, index) => {
                    const id = keyExtractor(item);
                    return (
                       <tr key={id} style={{ borderBottom: index < data.length - 1 ? '1px solid var(--color-border)' : 'none', transition: 'background-color var(--transition-fast)' }}>
                          {selectable && (
                             <td style={{ padding: '1rem 1.5rem' }}>
                                <input 
                                   type="checkbox" 
                                   checked={selectedIds.has(id)}
                                   onChange={(e) => handleSelectOne(id, e.target.checked)}
                                />
                             </td>
                          )}
                          {columns.map((col, i) => (
                             <td key={col.header + i} style={{ padding: '1rem 1.5rem', fontSize: 'var(--font-size-sm)' }}>
                                {col.render ? col.render(item) : (item as any)[col.key]}
                             </td>
                          ))}
                       </tr>
                    );
                 })
               )}
            </tbody>
         </table>
      </div>

      {/* Pagination Footer */}
      <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
         <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
            Showing 1 to {data.length} of {data.length} entries
         </span>
         <div style={{ display: 'flex', gap: '0.25rem' }}>
            <Button variant="outline" size="sm" style={{ padding: '0.25rem 0.5rem' }}><ChevronLeft size={16} /></Button>
            <Button variant="outline" size="sm" style={{ padding: '0.25rem 0.5rem' }}><ChevronRight size={16} /></Button>
         </div>
      </div>
    </div>
  );
}
