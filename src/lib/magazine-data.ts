import img1 from '@/assets/catalogo/1.png'
import img2 from '@/assets/catalogo/2.png'
import img3 from '@/assets/catalogo/3.png'
import img4 from '@/assets/catalogo/4.png'
import img5 from '@/assets/catalogo/5.png'
import img6 from '@/assets/catalogo/6.png'
import img7 from '@/assets/catalogo/7.png'
import img8 from '@/assets/catalogo/8.png'
import img9 from '@/assets/catalogo/9.png'
import img10 from '@/assets/catalogo/10.jpeg'
import img11 from '@/assets/catalogo/11.png'
import img12 from '@/assets/catalogo/12.png'

export type MagazinePage = {
  id: number
  label: string
  kind: 'cover' | 'content' | 'back'
  src?: string
  prompt: string
}

export const magazineMeta = {
  title: 'LARAN',
  issue: 'Catálogo',
  date: '2026',
}

export const pages: MagazinePage[] = [
  {
    id: 1,
    label: 'Portada',
    kind: 'cover',
    src: img1,
    prompt: 'Portada del catálogo Laran.',
  },
  {
    id: 2,
    label: 'Pág. 2',
    kind: 'content',
    src: img2,
    prompt: 'Página 2 del catálogo.',
  },
  {
    id: 3,
    label: 'Pág. 3',
    kind: 'content',
    src: img3,
    prompt: 'Página 3 del catálogo.',
  },
  {
    id: 4,
    label: 'Pág. 4',
    kind: 'content',
    src: img4,
    prompt: 'Página 4 del catálogo.',
  },
  {
    id: 5,
    label: 'Pág. 5',
    kind: 'content',
    src: img5,
    prompt: 'Página 5 del catálogo.',
  },
  {
    id: 6,
    label: 'Pág. 6',
    kind: 'content',
    src: img6,
    prompt: 'Página 6 del catálogo.',
  },
  {
    id: 7,
    label: 'Pág. 7',
    kind: 'content',
    src: img7,
    prompt: 'Página 7 del catálogo.',
  },
  {
    id: 8,
    label: 'Pág. 8',
    kind: 'content',
    src: img8,
    prompt: 'Página 8 del catálogo.',
  },
  {
    id: 9,
    label: 'Pág. 9',
    kind: 'content',
    src: img9,
    prompt: 'Página 9 del catálogo.',
  },
  {
    id: 10,
    label: 'Pág. 10',
    kind: 'content',
    src: img10,
    prompt: 'Página 10 del catálogo.',
  },
  {
    id: 11,
    label: 'Pág. 11',
    kind: 'content',
    src: img11,
    prompt: 'Página 11 del catálogo.',
  },
  {
    id: 12,
    label: 'Cierre',
    kind: 'back',
    src: img12,
    prompt: 'Cierre del catálogo Laran.',
  },
]
