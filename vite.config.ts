import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const OPENAI_API_KEY = env.OPENAI_API_KEY
  const chatApiPlugin = {
    name: 'chat-api',
    configureServer(server: any) {
      server.middlewares.use('/api/chat', async (req: any, res: any) => {
        if (req.method !== 'POST') {
          res.statusCode = 405
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ error: 'Method Not Allowed' }))
          return
        }
        try {
          const chunks: Uint8Array[] = []
          await new Promise<void>((resolve, reject) => {
            req.on('data', (chunk: Uint8Array) => chunks.push(chunk))
            req.on('end', () => resolve())
            req.on('error', (err: any) => reject(err))
          })
          const raw = Buffer.concat(chunks).toString('utf-8')
          const payload = JSON.parse(raw || '{}') as {
            prompt?: string
            messages?: Array<{ role: 'system' | 'user' | 'assistant'; content: string }>
          }
          const apiKey = OPENAI_API_KEY
          if (!apiKey) {
            res.statusCode = 500
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ error: 'Missing OPENAI_API_KEY on server' }))
            return
          }
          const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
              model: 'gpt-3.5-turbo',
              messages: payload.messages && payload.messages.length > 0
                ? payload.messages
                : [
                    { role: 'system', content: 'You are an AI assistant that helps users track activities and habits. Be concise.' },
                    { role: 'user', content: payload.prompt || 'Hello' }
                  ]
            })
          })
          const data = await response.json()
          res.statusCode = response.ok ? 200 : (data?.error?.code ? 400 : 500)
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify(data))
        } catch (err: any) {
          res.statusCode = 500
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ error: 'Server error', details: String(err?.message || err) }))
        }
      })
    }
  }
  return {
    plugins: [react(), chatApiPlugin]
  }
})
