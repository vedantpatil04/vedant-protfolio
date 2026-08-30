export interface Achievement {
  id: string
  title: string
  description: string
  date: string
  organization?: string
  url?: string
  category?: 'hackathon' | 'competition' | 'award' | 'publication' | 'other'
}
