import React from 'react'

function BuilderLayout({children}: {children: React.ReactNode}) {
  return (
    <div className="flex w-full flex-grow mx-auto">
        {children}
    </div>
  )
}

export default BuilderLayout