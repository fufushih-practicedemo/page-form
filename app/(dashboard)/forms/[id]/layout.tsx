import React from 'react'

function FormLayout({children}: {children: React.ReactNode}) {
  return (
    <div className="flex w-full flex-grow mx-auto">
        {children}
    </div>
  )
}

export default FormLayout