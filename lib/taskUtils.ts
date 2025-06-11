export interface Task {
  タスク名: string
  担当者: string
  開始日: string
  終了日: string
  詳細: string
}

export interface TaskData {
  tasks: Task[]
}

export interface ProcessedTask extends Task {
  startDate: Date
  endDate: Date
  duration: number
  startOffset: number
}

export async function loadTasks(): Promise<Task[]> {
  try {
    const apiUrl = typeof window !== 'undefined' 
      ? '/api/tasks' 
      : `http://localhost:${process.env.PORT || 3001}/api/tasks`
    
    console.log('Fetching tasks from:', apiUrl)
    const response = await fetch(apiUrl)
    console.log('Response status:', response.status)
    
    if (!response.ok) {
      const errorText = await response.text()
      console.error('API error response:', errorText)
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`)
    }
    
    const tasks = await response.json()
    console.log('Loaded tasks:', tasks)
    return tasks
  } catch (error) {
    console.error('タスクの読み込みに失敗しました:', error)
    throw error // エラーを再スローして上位でキャッチ
  }
}

export function processTasks(tasks: Task[]): {
  processedTasks: ProcessedTask[]
  startDate: Date
  endDate: Date
  totalDays: number
} {
  if (tasks.length === 0) {
    const now = new Date()
    return {
      processedTasks: [],
      startDate: now,
      endDate: now,
      totalDays: 0
    }
  }

  const processedTasks: ProcessedTask[] = tasks.map(task => {
    const startDate = new Date(task.開始日)
    const endDate = new Date(task.終了日)
    const duration = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)) + 1
    
    return {
      ...task,
      startDate,
      endDate,
      duration,
      startOffset: 0 // 後で計算
    }
  })

  // 全体の開始日と終了日を計算
  const allStartDates = processedTasks.map(task => task.startDate)
  const allEndDates = processedTasks.map(task => task.endDate)
  
  const projectStartDate = new Date(Math.min(...allStartDates.map(date => date.getTime())))
  const projectEndDate = new Date(Math.max(...allEndDates.map(date => date.getTime())))
  
  const totalDays = Math.ceil((projectEndDate.getTime() - projectStartDate.getTime()) / (1000 * 60 * 60 * 24)) + 1

  // 各タスクの開始オフセットを計算
  processedTasks.forEach(task => {
    task.startOffset = Math.ceil((task.startDate.getTime() - projectStartDate.getTime()) / (1000 * 60 * 60 * 24))
  })

  return {
    processedTasks,
    startDate: projectStartDate,
    endDate: projectEndDate,
    totalDays
  }
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString('ja-JP', {
    month: 'short',
    day: 'numeric'
  })
}

export function generateDateRange(startDate: Date, totalDays: number): Date[] {
  const dates: Date[] = []
  for (let i = 0; i < totalDays; i++) {
    const date = new Date(startDate)
    date.setDate(startDate.getDate() + i)
    dates.push(date)
  }
  return dates
}