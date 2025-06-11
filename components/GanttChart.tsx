'use client'

import { useState } from 'react'
import { ProcessedTask, generateDateRange, formatDate } from '../lib/taskUtils'

interface GanttChartProps {
  tasks: ProcessedTask[]
  startDate: Date
  totalDays: number
}

export default function GanttChart({ tasks, startDate, totalDays }: GanttChartProps) {
  const [selectedTask, setSelectedTask] = useState<ProcessedTask | null>(null)
  const dates = generateDateRange(startDate, totalDays)
  const dayWidth = 30 // px

  const getTaskColor = (assignee: string): string => {
    const colors = {
      '田中': '#007bff',
      '佐藤': '#28a745',
      '鈴木': '#ffc107',
      '高橋': '#dc3545',
    }
    return colors[assignee as keyof typeof colors] || '#6c757d'
  }

  const handleTaskClick = (task: ProcessedTask) => {
    setSelectedTask(selectedTask?.タスク名 === task.タスク名 ? null : task)
  }

  return (
    <div>
      <div className="gantt-chart">
        {/* ヘッダー */}
        <div className="gantt-header">
          <div className="gantt-task-column">タスク情報</div>
          <div className="gantt-timeline">
            {dates.map((date, index) => (
              <div key={index} className="gantt-day">
                {formatDate(date)}
              </div>
            ))}
          </div>
        </div>

        {/* タスク行 */}
        {tasks.map((task, index) => (
          <div key={index} className="gantt-row">
            <div className="gantt-task-info">
              <div className="task-name">{task.タスク名}</div>
              <div className="task-assignee">担当: {task.担当者}</div>
            </div>
            <div className="gantt-timeline-row">
              {/* タスクバー */}
              <div
                className="gantt-bar"
                style={{
                  left: `${task.startOffset * dayWidth}px`,
                  width: `${task.duration * dayWidth}px`,
                  background: getTaskColor(task.担当者),
                }}
                onClick={() => handleTaskClick(task)}
                title={`${task.タスク名} (${task.開始日} - ${task.終了日})`}
              >
                {task.duration * dayWidth > 80 ? task.タスク名 : ''}
              </div>
              
              {/* 日付グリッド */}
              {dates.map((_, dayIndex) => (
                <div
                  key={dayIndex}
                  style={{
                    position: 'absolute',
                    left: `${dayIndex * dayWidth}px`,
                    width: `${dayWidth}px`,
                    height: '100%',
                    borderRight: '1px solid #f0f0f0',
                  }}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* 選択されたタスクの詳細 */}
      {selectedTask && (
        <div className="task-details">
          <h3>📋 タスク詳細</h3>
          <p><strong>タスク名:</strong> {selectedTask.タスク名}</p>
          <p><strong>担当者:</strong> {selectedTask.担当者}</p>
          <p><strong>期間:</strong> {selectedTask.開始日} ～ {selectedTask.終了日} ({selectedTask.duration}日間)</p>
          <p><strong>詳細:</strong> {selectedTask.詳細}</p>
        </div>
      )}

      {/* 凡例 */}
      <div style={{ marginTop: '20px', padding: '15px', background: 'white', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)' }}>
        <h3 style={{ marginBottom: '10px' }}>👥 担当者別カラー</h3>
        <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
          {Array.from(new Set(tasks.map(task => task.担当者))).map(assignee => (
            <div key={assignee} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <div
                style={{
                  width: '16px',
                  height: '16px',
                  background: getTaskColor(assignee),
                  borderRadius: '3px',
                }}
              />
              <span>{assignee}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}