export type PlaceSuggestion = {
  placeId: string
  name: string
  subtitle: string
}

export type MappedPlace = {
  name: string
  placeId: string
  address: string
  lat: number
  lng: number
}

export type DriveResult = {
  distanceMeters: number
  durationSeconds: number
}
