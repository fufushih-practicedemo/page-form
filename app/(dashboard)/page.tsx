import React from 'react'
import { Button } from "@/components/ui/button"
import Link from 'next/link'

const LandingPage = () => {
  return (
    <main className="container mx-auto px-4 py-16 text-center">
      <h1 className="text-4xl font-bold mb-6">Welcome to Our Amazing App</h1>
      <p className="text-xl mb-8">Discover a world of possibilities with our innovative solution.</p>
      <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        <Link href="/auth">Get Started</Link>
      </Button>
    </main>
  )
}

export default LandingPage
