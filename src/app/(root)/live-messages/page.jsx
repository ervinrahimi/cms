'use client'

import { useEffect } from 'react'
import sdb from '@/db/surrealdb'

export default function LivePage() {
  useEffect(() => {
    async function connectLiveQuery() {
      const db = await sdb()                  // ۱) اتصال به دیتابیس
      const queryId = await db.live('messages')  // ۲) کوئری لایو
      db.subscribeLive(queryId, (action, result) => { // ۳) دریافت تغییرات
        if (action === 'CLOSE') return
        console.log('Action:', action)
        console.log('Result:', result)
      })
    }
    connectLiveQuery()
    
  }, [])

  return (
    <div>
      <h1>Live Query Test</h1>
      <p>برای مشاهدهٔ تغییرات، کنسول مرورگر را باز کنید.</p>
    </div>
  )
}
