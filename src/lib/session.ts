// Simple session management for anonymous users
export const getSessionId = (): string => {
  let sessionId = localStorage.getItem('session_id')
  
  if (!sessionId) {
    sessionId = crypto.randomUUID()
    localStorage.setItem('session_id', sessionId)
  }
  
  return sessionId
}