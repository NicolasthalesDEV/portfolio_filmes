import { 
  Inter, 
  Playfair_Display, 
  Lora, 
  Roboto, 
  Montserrat,
  Open_Sans,
  Poppins,
  Oswald,
  Raleway,
  Ubuntu
} from 'next/font/google'

export const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
export const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' })
export const lora = Lora({ subsets: ['latin'], variable: '--font-lora' })
export const roboto = Roboto({ subsets: ['latin'], weight: ['300','400','500','700'], variable: '--font-roboto' })
export const montserrat = Montserrat({ subsets: ['latin'], variable: '--font-montserrat' })
export const openSans = Open_Sans({ subsets: ['latin'], variable: '--font-open-sans' })
export const poppins = Poppins({ subsets: ['latin'], weight: ['300','400','500','600','700'], variable: '--font-poppins' })
export const oswald = Oswald({ subsets: ['latin'], variable: '--font-oswald' })
export const raleway = Raleway({ subsets: ['latin'], variable: '--font-raleway' })
export const ubuntu = Ubuntu({ subsets: ['latin'], weight: ['300','400','500','700'], variable: '--font-ubuntu' })

export const AVAILABLE_FONTS = [
  { value: 'Inter', label: 'Inter' },
  { value: 'Playfair Display', label: 'Playfair Display' },
  { value: 'Lora', label: 'Lora' },
  { value: 'Roboto', label: 'Roboto' },
  { value: 'Montserrat', label: 'Montserrat' },
  { value: 'Open Sans', label: 'Open Sans' },
  { value: 'Poppins', label: 'Poppins' },
  { value: 'Oswald', label: 'Oswald' },
  { value: 'Raleway', label: 'Raleway' },
  { value: 'Ubuntu', label: 'Ubuntu' },
];

export const fontFamilyMap: Record<string, string> = {
  'Inter': 'var(--font-inter)',
  'Playfair Display': 'var(--font-playfair)',
  'Lora': 'var(--font-lora)',
  'Roboto': 'var(--font-roboto)',
  'Montserrat': 'var(--font-montserrat)',
  'Open Sans': 'var(--font-open-sans)',
  'Poppins': 'var(--font-poppins)',
  'Oswald': 'var(--font-oswald)',
  'Raleway': 'var(--font-raleway)',
  'Ubuntu': 'var(--font-ubuntu)',
};

export const fontOptions = [
  { label: 'Inter', value: 'Inter', className: inter.variable },
  { label: 'Playfair Display', value: 'Playfair Display', className: playfair.variable },
  { label: 'Lora', value: 'Lora', className: lora.variable },
  { label: 'Roboto', value: 'Roboto', className: roboto.variable },
  { label: 'Montserrat', value: 'Montserrat', className: montserrat.variable },
  { label: 'Open Sans', value: 'Open Sans', className: openSans.variable },
  { label: 'Poppins', value: 'Poppins', className: poppins.variable },
  { label: 'Oswald', value: 'Oswald', className: oswald.variable },
  { label: 'Raleway', value: 'Raleway', className: raleway.variable },
  { label: 'Ubuntu', value: 'Ubuntu', className: ubuntu.variable },
]
