export interface Template {
  slug: string;
  name: string;
  description: string;
  isPro: boolean;
  imageUrl: string;
}

export const templates: Template[] = [
  { 
    slug: 'modern-minimalist', 
    name: 'Modern Minimalist', 
    description: 'Clean, modern, and perfect for any industry.', 
    isPro: false, 
    imageUrl: '/assets/images/template-modern-minimalist.png' 
  },
  { 
    slug: 'professional-classic', 
    name: 'Professional Classic', 
    description: 'A timeless, elegant design for corporate roles.', 
    isPro: false, 
    imageUrl: '/assets/images/template-professional-classic.png' 
  },
  { 
    slug: 'creative-portfolio', 
    name: 'Creative Portfolio', 
    description: 'A stylish layout for designers and artists.', 
    isPro: true, 
    imageUrl: '/assets/images/template-creative-portfolio.png' 
  },
  { 
    slug: 'tech-savvy', 
    name: 'Tech Savvy', 
    description: 'A dark-mode, monospace font template for tech roles.', 
    isPro: true, 
    imageUrl: '/assets/images/template-tech-savvy.png' 
  },
  { 
    slug: 'academic-research', 
    name: 'Academic Research', 
    description: 'Structured for academics, researchers, and PhDs.', 
    isPro: true, 
    imageUrl: '/assets/images/template-academic-research.png' 
  },
  { 
    slug: 'executive-summary', 
    name: 'Executive Summary', 
    description: 'A bold, impactful design for leadership positions.', 
    isPro: true, 
    imageUrl: '/assets/images/template-executive-summary.png' 
  },
];