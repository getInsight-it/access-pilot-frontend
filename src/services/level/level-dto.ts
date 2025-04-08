export interface LevelParent {
  id: number
  uuid: string
  sigla: string
  name: string
  description: string
  type: string
}

export interface LevelItem {
  id: number
  uuid: string
  parent?: LevelParent
  sigla: string
  name: string
  description: string
  externalUrl?: string
  type: string
  icon?: string
  apiKey: string
}

export interface LevelDTO {
  total: number
  items: LevelItem[]
}


