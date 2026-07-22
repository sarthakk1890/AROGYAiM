import React, { useState } from 'react';
import classNames from 'classnames';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './Button';
import './Calendar.css';

interface CalendarEvent {
  date: string; // YYYY-MM-DD
  title: string;
}

interface CalendarProps {
  events?: CalendarEvent[];
  onDateSelect?: (date: string) => void;
  selectedDate?: string;
}

export const Calendar: React.FC<CalendarProps> = ({ events = [], onDateSelect, selectedDate }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const renderCells = () => {
    const cells = [];
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth() + 1; // 1-12
    const monthStr = month < 10 ? `0${month}` : `${month}`;

    // Empty cells before the 1st
    for (let i = 0; i < firstDayOfMonth; i++) {
      cells.push(<div key={`empty-${i}`} className="calendar-cell disabled" />);
    }

    // Days in month
    for (let d = 1; d <= daysInMonth; d++) {
      const dayStr = d < 10 ? `0${d}` : `${d}`;
      const dateString = `${year}-${monthStr}-${dayStr}`;
      
      const dayEvents = events.filter(e => e.date === dateString);
      const isSelected = selectedDate === dateString;

      cells.push(
        <div 
          key={d} 
          className={classNames('calendar-cell', { 'selected': isSelected })}
          onClick={() => onDateSelect?.(dateString)}
        >
          <span className="calendar-date-number">{d}</span>
          <div className="calendar-events">
            {dayEvents.slice(0, 2).map((ev, idx) => (
              <div key={idx} className="calendar-event-badge">{ev.title}</div>
            ))}
            {dayEvents.length > 2 && <div className="calendar-event-dot" style={{ marginTop: '2px', alignSelf: 'center' }} />}
          </div>
        </div>
      );
    }

    // Fill the rest of the grid
    const totalCells = firstDayOfMonth + daysInMonth;
    const remainingCells = 42 - totalCells; // 6 rows * 7 days
    for (let i = 0; i < remainingCells; i++) {
      cells.push(<div key={`end-empty-${i}`} className="calendar-cell disabled" />);
    }

    return cells;
  };

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <h3 className="calendar-title">{monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}</h3>
        <div className="calendar-nav">
          <Button variant="outline" size="sm" onClick={handlePrevMonth}><ChevronLeft size={16} /></Button>
          <Button variant="outline" size="sm" onClick={handleNextMonth}><ChevronRight size={16} /></Button>
        </div>
      </div>
      <div className="calendar-grid">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
          <div key={d} className="calendar-day-header">{d}</div>
        ))}
        {renderCells()}
      </div>
    </div>
  );
};
