import React, { useState, useMemo } from 'react';
import {
  Calendar as CalendarIcon,
  Plus,
  ChevronLeft,
  ChevronRight,
  Clock,
  CheckCircle,
  Circle,
  Trash2,
  Edit2,
  Dumbbell,
  Utensils,
  Flame,
  Activity,
  Smile
} from 'lucide-react';
import { useFitness } from '../context/FitnessContext';
import { ScheduleFormModal } from '../components/schedule/ScheduleFormModal';
import { Button } from '../components/common/Button';

export const Schedule = () => {
  const {
    schedules,
    addSchedule,
    updateSchedule,
    deleteSchedule,
    toggleScheduleCompleted
  } = useFitness();

  const [currentDate, setCurrentDate] = useState(new Date(2026, 10, 8)); // Nov 2026
  const [selectedDayDate, setSelectedDayDate] = useState('2026-11-09');
  const [calendarView, setCalendarView] = useState('month'); // 'month' | 'week' | 'day'

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState(null);

  // Calendar calculations
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthName = currentDate.toLocaleString('default', { month: 'long' });
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayIndex = new Date(year, month, 1).getDay(); // 0 is Sunday

  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const emptyDaysPrefix = Array.from({ length: firstDayIndex }, (_, i) => i);

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const formatDayDateString = (dayNum) => {
    const m = (month + 1).toString().padStart(2, '0');
    const d = dayNum.toString().padStart(2, '0');
    return `${year}-${m}-${d}`;
  };

  // Get schedules for a specific day
  const getSchedulesForDay = (dateStr) => {
    return schedules.filter((s) => s.date === dateStr);
  };

  // Upcoming activities list
  const upcomingActivities = useMemo(() => {
    return [...schedules]
      .filter((s) => !s.completed)
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [schedules]);

  const handleOpenAdd = (dateStr) => {
    setSelectedDayDate(dateStr || new Date().toISOString().split('T')[0]);
    setEditingSchedule(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (sch) => {
    setEditingSchedule(sch);
    setIsModalOpen(true);
  };

  const handleFormSubmit = (data) => {
    if (editingSchedule) {
      updateSchedule(editingSchedule.id, data);
    } else {
      addSchedule(data);
    }
  };

  const handleDelete = (id, name) => {
    if (window.confirm(`Delete activity "${name}"?`)) {
      deleteSchedule(id);
    }
  };

  return (
    <div className="fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Page Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px'
        }}
      >
        <div>
          <h1 style={{ fontSize: '1.65rem', fontWeight: 800 }}>My Schedule & Planner</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Coordinate your training sessions, hydration checks, and meal prep reminders on an interactive calendar.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <div className="tabs-container" style={{ margin: 0, paddingBottom: 0, border: 'none' }}>
            <button
              type="button"
              className={`tab-btn ${calendarView === 'month' ? 'active' : ''}`}
              onClick={() => setCalendarView('month')}
            >
              Monthly
            </button>
            <button
              type="button"
              className={`tab-btn ${calendarView === 'week' ? 'active' : ''}`}
              onClick={() => setCalendarView('week')}
            >
              Weekly
            </button>
            <button
              type="button"
              className={`tab-btn ${calendarView === 'day' ? 'active' : ''}`}
              onClick={() => setCalendarView('day')}
            >
              Day Agenda
            </button>
          </div>

          <Button
            variant="primary"
            icon={Plus}
            onClick={() => handleOpenAdd(selectedDayDate)}
          >
            Schedule Activity
          </Button>
        </div>
      </div>

      {/* Main Grid: Calendar Grid (Left) + Upcoming Activities (Right) */}
      <div className="schedule-layout">
        {/* Left Column: Interactive Calendar */}
        <div className="calendar-box">
          <div className="calendar-header">
            <h2 style={{ fontSize: '1.35rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CalendarIcon size={20} color="var(--primary-teal)" />
              {monthName} {year}
            </h2>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={prevMonth}
                aria-label="Previous month"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => setCurrentDate(new Date(2026, 10, 8))}
              >
                Today
              </button>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={nextMonth}
                aria-label="Next month"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          {calendarView === 'month' && (
            <div>
              {/* Day names */}
              <div className="calendar-grid" style={{ marginBottom: '8px' }}>
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
                  <div key={d} className="calendar-day-header">
                    {d}
                  </div>
                ))}
              </div>

              {/* Day cells */}
              <div className="calendar-grid">
                {emptyDaysPrefix.map((_, i) => (
                  <div
                    key={`empty-${i}`}
                    style={{
                      background: 'rgba(255, 255, 255, 0.02)',
                      borderRadius: 'var(--radius-md)',
                      minHeight: '85px',
                      opacity: 0.3
                    }}
                  />
                ))}

                {daysArray.map((dayNum) => {
                  const dayDateStr = formatDayDateString(dayNum);
                  const daySchedules = getSchedulesForDay(dayDateStr);
                  const isSelected = selectedDayDate === dayDateStr;
                  const isToday = dayNum === 8; // Nov 8

                  return (
                    <div
                      key={dayNum}
                      className={`calendar-day-cell ${isSelected ? 'active-day' : ''} ${isToday ? 'today' : ''}`}
                      onClick={() => setSelectedDayDate(dayDateStr)}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span className="day-number">{dayNum}</span>
                        {isToday && (
                          <span style={{ fontSize: '0.65rem', background: 'var(--primary-teal)', color: '#061C1B', padding: '1px 5px', borderRadius: 'var(--radius-full)', fontWeight: 700 }}>
                            Today
                          </span>
                        )}
                      </div>

                      <div className="activity-dot-list">
                        {daySchedules.slice(0, 2).map((s) => (
                          <div
                            key={s.id}
                            className="activity-mini-tag"
                            title={`${s.time} - ${s.activityName}`}
                          >
                            {s.activityName}
                          </div>
                        ))}
                        {daySchedules.length > 2 && (
                          <span style={{ fontSize: '0.62rem', color: 'var(--text-muted)' }}>
                            +{daySchedules.length - 2} more
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {calendarView === 'week' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
                Weekly Schedule Overview for <strong>Nov 08 - Nov 14, 2026</strong>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '10px' }}>
                {[8, 9, 10, 11, 12, 13, 14].map((d) => {
                  const dayDateStr = formatDayDateString(d);
                  const daySchedules = getSchedulesForDay(dayDateStr);
                  return (
                    <div
                      key={d}
                      className="glass-card"
                      style={{ padding: '12px', minHeight: '180px', display: 'flex', flexDirection: 'column', gap: '8px' }}
                    >
                      <div style={{ fontWeight: 700, fontSize: '0.85rem', color: d === 8 ? 'var(--primary-teal)' : 'inherit' }}>
                        Nov {d}
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        {daySchedules.map((s) => (
                          <div
                            key={s.id}
                            style={{
                              padding: '6px 8px',
                              background: 'var(--bg-card-secondary)',
                              borderRadius: 'var(--radius-sm)',
                              fontSize: '0.75rem',
                              borderLeft: '3px solid var(--primary-teal)'
                            }}
                          >
                            <strong>{s.time}</strong>
                            <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {s.activityName}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {calendarView === 'day' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontSize: '1.1rem' }}>
                  Agenda for <strong>{selectedDayDate}</strong>
                </h3>
                <Button variant="outline" size="sm" icon={Plus} onClick={() => handleOpenAdd(selectedDayDate)}>
                  Add To This Date
                </Button>
              </div>

              {getSchedulesForDay(selectedDayDate).length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                  No activities planned on this date. Click "+ Add To This Date" to schedule.
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {getSchedulesForDay(selectedDayDate).map((s) => (
                    <div
                      key={s.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '14px 18px',
                        background: 'var(--bg-card-secondary)',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--border-color)'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <button
                          type="button"
                          onClick={() => toggleScheduleCompleted(s.id)}
                          style={{ color: s.completed ? 'var(--primary-teal)' : 'var(--text-muted)' }}
                        >
                          {s.completed ? <CheckCircle size={20} /> : <Circle size={20} />}
                        </button>
                        <div>
                          <h4 style={{ fontSize: '0.95rem', fontWeight: 600, textDecoration: s.completed ? 'line-through' : 'none' }}>
                            {s.activityName}
                          </h4>
                          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                            {s.time} • {s.duration} • {s.activityType}
                          </span>
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(s)}
                          style={{ padding: '6px', borderRadius: 'var(--radius-sm)', color: 'var(--text-secondary)' }}
                        >
                          <Edit2 size={15} />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(s.id, s.activityName)}
                          style={{ padding: '6px', borderRadius: 'var(--radius-sm)', color: '#EF4444' }}
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Column: Upcoming Activities Panel */}
        <aside className="glass-card" style={{ padding: '22px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Upcoming Activities</h3>
            <span className="badge badge-teal">{upcomingActivities.length} Pending</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {upcomingActivities.slice(0, 6).map((item) => (
              <div
                key={item.id}
                style={{
                  padding: '14px',
                  background: 'var(--bg-card-secondary)',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-color)',
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  gap: '10px'
                }}
              >
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    type="button"
                    onClick={() => toggleScheduleCompleted(item.id)}
                    style={{ marginTop: '2px', color: 'var(--text-muted)' }}
                    title="Mark as done"
                  >
                    <Circle size={18} />
                  </button>

                  <div>
                    <h4 style={{ fontSize: '0.88rem', fontWeight: 600, marginBottom: '2px' }}>
                      {item.activityName}
                    </h4>
                    <div style={{ fontSize: '0.75rem', color: 'var(--primary-teal)', marginBottom: '4px' }}>
                      {item.date} at {item.time} ({item.duration})
                    </div>
                    {item.notes && (
                      <p style={{ fontSize: '0.74rem', color: 'var(--text-muted)', lineHeight: 1.3 }}>
                        {item.notes}
                      </p>
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleDelete(item.id, item.activityName)}
                  style={{ color: 'var(--text-muted)', padding: '4px' }}
                  title="Remove"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </aside>
      </div>

      {/* Schedule Form Modal */}
      <ScheduleFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={editingSchedule}
        defaultDate={selectedDayDate}
      />
    </div>
  );
};
