"use client"

import { useState, useEffect } from 'react'

export function useUserType() {
  const [userType, setUserType] = useState<'admin' | 'temp' | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Verifica o tipo de usuário pelos cookies
    const getUserType = () => {
      if (typeof document !== 'undefined') {
        const userTypeCookie = document.cookie
          .split('; ')
          .find(row => row.startsWith('user-type='))
          ?.split('=')[1]
        
        setUserType(userTypeCookie as 'admin' | 'temp' || null)
      }
      setIsLoading(false)
    }

    getUserType()
  }, [])

  return { userType, isLoading, isAdmin: userType === 'admin', isTemp: userType === 'temp' }
}
