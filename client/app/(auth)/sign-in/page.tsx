"use client"

import { LoginForm } from '@/components/loginform'
import { Spinner } from '@/components/ui/spinner'
import { authClient } from '@/lib/auth-client'
import { useRouter } from 'next/navigation'
import React, { useEffect } from 'react'

const Page = () => {
  const { data, isPending } = authClient.useSession()
  const router = useRouter()

  useEffect(() => {
    if (data?.session && data?.user) {
      router.push("/")   // redirect logged-in users away from login page
    }
  }, [data, router])

  if (isPending) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-black">
        <Spinner />
      </div>
    )
  }

  return <LoginForm />
}

export default Page
