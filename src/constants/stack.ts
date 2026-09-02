export interface StackLayer {
  label: string
  items: string[]
}

export const STACK_LAYERS: StackLayer[] = [
  {
    label: 'Interface',
    items: ['React', 'TypeScript', 'Tailwind CSS', 'Framer Motion'],
  },
  {
    label: 'Service',
    items: ['Node.js', 'Express', 'REST APIs', 'JWT Auth'],
  },
  {
    label: 'Data',
    items: ['MongoDB', 'Mongoose', 'Schema Design', 'Aggregation'],
  },
]
