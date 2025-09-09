import { redirect } from 'next/navigation'

export default function HomePage() {
  // Redirect to admin calculator as the main entry point
  redirect('/admin/calculator')
}
