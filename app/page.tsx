'use client'

import { useEffect, useState } from 'react'
import { loadTasks, processTasks, Task } from '../lib/taskUtils'
import GanttChart from '../components/GanttChart'

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        console.log('Starting to fetch tasks...')
        const taskData = await loadTasks()
        console.log('Fetched task data:', taskData)
        setTasks(taskData)
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : 'Unknown error'
        setError(`タスクデータの読み込みに失敗しました: ${errorMsg}`)
        console.error('Error in fetchTasks:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchTasks()
  }, [])

  if (loading) {
    return (
      <div className="container">
        <div className="loading">
          <h2>📊 読み込み中...</h2>
          <p>タスクデータを取得しています。</p>
        </div>
      </div>
    )
  }
  
  if (error || tasks.length === 0) {
    return (
      <div className="container">
        <div className="error">
          <h2>❌ エラー</h2>
          <p>{error || 'タスクデータを読み込めませんでした。'}</p>
          <p>data/tasks.yml ファイルが存在し、正しい形式で記述されているかご確認ください。</p>
        </div>
      </div>
    )
  }

  const { processedTasks, startDate, totalDays } = processTasks(tasks)

  return (
    <div className="container">
      <div className="header">
        <h1>📊 タスク管理ガントチャート</h1>
        <p>YMLファイルからタスクデータを読み込んで表示しています</p>
        <div style={{ marginTop: '10px', color: '#666', fontSize: '14px' }}>
          プロジェクト期間: {startDate.toLocaleDateString('ja-JP')} ～ 全{totalDays}日間 | タスク数: {tasks.length}件
        </div>
      </div>

      <GanttChart 
        tasks={processedTasks} 
        startDate={startDate} 
        totalDays={totalDays}
      />
      
      <div style={{ marginTop: '30px', padding: '20px', background: 'white', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)' }}>
        <h3>📝 使用方法</h3>
        <ul style={{ marginLeft: '20px', marginTop: '10px', lineHeight: '1.6' }}>
          <li>タスクバーをクリックすると詳細情報が表示されます</li>
          <li>担当者別に色分けされています</li>
          <li>data/tasks.yml ファイルを編集してタスクを追加・変更できます</li>
        </ul>
      </div>
    </div>
  )
}