import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sidan finns ej'
}

export default function NotFound() {
  return <div>
      <h1>Not found – 404!</h1>
      <div>
        <Link href="/">Go back to Home</Link>
      </div>
  </div>
}