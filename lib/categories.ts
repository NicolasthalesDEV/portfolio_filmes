export const PROJECT_CATEGORIES = [
  'Film project',
  'Graphic Design Project',
  'Illustration project',
  'Architecture Project',
  'Small fine art project',
  'Advertising project'
] as const

export type ProjectCategory = typeof PROJECT_CATEGORIES[number]

export const DEFAULT_CATEGORY: ProjectCategory = 'Film project'

export const CATEGORY_DISPLAY_NAMES = {
  'Film project': 'Film Project',
  'Graphic Design Project': 'Graphic Design Project',
  'Illustration project': 'Illustration Project',
  'Architecture Project': 'Architecture Project',
  'Small fine art project': 'Small Fine Art Project',
  'Advertising project': 'Advertising Project'
} as const
