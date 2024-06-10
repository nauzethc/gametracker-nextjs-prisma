type RGBColor = { r: number, g: number, b: number }
type HSLColor = { h: number, s: number, l: number }

const MAX_DEPTH = 4

function buildRGB (data: Uint8ClampedArray): RGBColor[] {
  const values = []
  for (let i = 0; i < data.length; i += 4) {
    values.push({ r: data[i], g: data[i + 1], b: data[i + 2] })
  }
  return values
}

function findBiggestColorRange (colors: RGBColor[]): 'r'|'g'|'b' {
  let rMin = Number.MAX_VALUE
  let gMin = Number.MAX_VALUE
  let bMin = Number.MAX_VALUE
  let rMax = Number.MIN_VALUE
  let gMax = Number.MIN_VALUE
  let bMax = Number.MIN_VALUE

  colors.forEach(({ r, g, b }) => {
    rMin = Math.min(rMin, r)
    gMin = Math.min(gMin, g)
    bMin = Math.min(bMin, b)
    rMax = Math.max(rMax, r)
    gMax = Math.max(gMax, g)
    bMax = Math.max(bMax, b)
  })

  const rRange = rMax - rMin
  const gRange = gMax - gMin
  const bRange = bMax - bMin

  const biggestRange = Math.max(rRange, gRange, bRange)
  if (biggestRange === rRange) return 'r'
  if (biggestRange === gRange) return 'g'
  return 'b'
}

function quantization (colors: RGBColor[], depth: number): RGBColor[] {
  if (depth === MAX_DEPTH || colors.length === 0) {
    const color = colors.reduce(
      (acc, color) => {
        acc.r += color.r
        acc.g += color.g
        acc.b += color.b
        return acc
      },
      { r: 0, g: 0, b: 0 }
    )
    color.r = Math.round(color.r / colors.length)
    color.g = Math.round(color.g / colors.length)
    color.b = Math.round(color.b / colors.length)
    return [color]
  }

  const componentToSortBy = findBiggestColorRange(colors)
  colors.sort((c1, c2) => c1[componentToSortBy] - c2[componentToSortBy])

  const mid = colors.length / 2
  return [
    ...quantization(colors.slice(0, mid), depth + 1),
    ...quantization(colors.slice(mid + 1), depth + 1)
  ]
}

export async function findDominantColors (src: string, depth: number): Promise<RGBColor[]> {
  console.assert(depth <= MAX_DEPTH, `Max depth can't be greater than ${MAX_DEPTH}`)

  if (typeof window === 'undefined' || typeof document === 'undefined') {
    return Promise.resolve([])
  }

  // Load image
  const image = new Image()
  image.src = src
  image.crossOrigin = ''

  return new Promise((resolve, _reject) => {
    image.onload = () => {
      // Create canvas where draw image
      const canvas = document.createElement('canvas')
      canvas.width = image.width
      canvas.height = image.height

      // Draw image
      const context = canvas.getContext('2d')
      context!.drawImage(image, 0, 0)

      // Calculate dominant color
      const { data } = context!.getImageData(0, 0, canvas.width, canvas.height)
      const colors = buildRGB(data)
      const palette = quantization(colors, depth)
      resolve(palette)
    }
  })
}

export function rgbToHsl (color: RGBColor): HSLColor {
  let { r, g, b } = color

  // Make r, g, and b fractions of 1
  r /= 255
  g /= 255
  b /= 255

  // Find greatest and smallest channel values
  const cmin = Math.min(r, g, b)
  const cmax = Math.max(r, g, b)
  const delta = cmax - cmin
  let h = 0
  let s = 0
  let l = 0

  // Calculate hue
  // No difference
  if (delta === 0) h = 0
  // Red is max
  else if (cmax === r) h = ((g - b) / delta) % 6
  // Green is max
  else if (cmax === g) h = (b - r) / delta + 2
  // Blue is max
  else { h = (r - g) / delta + 4 }

  h = Math.round(h * 60)

  // Make negative hues positive behind 360°
  if (h < 0) { h += 360 }

  // Calculate lightness
  l = (cmax + cmin) / 2

  // Calculate saturation
  s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1))

  // Multiply l and s by 100
  s = +(s * 100).toFixed(1)
  l = +(l * 100).toFixed(1)

  return { h, s, l }
}

type StatusColor = 'primary'|'danger'|'success'|'default'

export function getStatusColor (status: string): StatusColor {
  switch (status) {
    case 'finished':
      return 'success'
    case 'abandoned':
      return 'danger'
    case 'ongoing':
      return 'primary'
    default:
      return 'default'
  }
}
