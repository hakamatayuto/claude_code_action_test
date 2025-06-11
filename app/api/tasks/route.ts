import { NextRequest, NextResponse } from 'next/server'
import yaml from 'js-yaml'
import fs from 'fs'
import path from 'path'

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

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), 'data', 'tasks.yml')
    const fileContents = fs.readFileSync(filePath, 'utf8')
    const data = yaml.load(fileContents) as TaskData
    
    return NextResponse.json(data.tasks || [])
  } catch (error) {
    console.error('YMLファイルの読み込みに失敗しました:', error)
    return NextResponse.json(
      { message: 'ファイルの読み込みに失敗しました', error: String(error) },
      { status: 500 }
    )
  }
}