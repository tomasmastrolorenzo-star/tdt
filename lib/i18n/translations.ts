export type Language = "es" | "en" | "pt"

export type Currency = "USD" | "EUR" | "BRL" | "MXN" | "ARS" | "COP" | "CLP" | "PEN"

export const currencySymbols: Record<Currency, string> = {
  USD: "$",
  EUR: "€",
  BRL: "R$",
  MXN: "$",
  ARS: "$",
  COP: "$",
  CLP: "$",
  PEN: "S/",
}

export const currencyRates: Record<Currency, number> = {
  USD: 1,
  EUR: 0.92,
  BRL: 4.97,
  MXN: 17.15,
  ARS: 875,
  COP: 3950,
  CLP: 880,
  PEN: 3.72,
}

export const countryToCurrency: Record<string, Currency> = {
  US: "USD",
  ES: "EUR",
  PT: "EUR",
  BR: "BRL",
  MX: "MXN",
  AR: "ARS",
  CO: "COP",
  CL: "CLP",
  PE: "PEN",
  // Default to USD for other countries
}

export const countryToLanguage: Record<string, Language> = {
  US: "en",
  GB: "en",
  CA: "en",
  AU: "en",
  ES: "es",
  MX: "es",
  AR: "es",
  CO: "es",
  CL: "es",
  PE: "es",
  BR: "pt",
  PT: "pt",
}

export const translations = {
  es: {
    // Hero
    hero: {
      badge: "🎄 Navidad llegó a TDT",
      title: "Lleva tus Redes al",
      titleHighlight: "Siguiente Nivel",
      subtitle:
        "Seguidores reales, engagement auténtico. Crece en Instagram, TikTok y más con la plataforma de confianza de miles de creadores.",
      problem: "¿Cansado que el algoritmo esconda tu cuenta?",
      solution: "TDT usa Inteligencia Artificial para poner tu contenido en frente de personas reales interesadas en contenido como el tuyo. Solo selecciona género, ubicación del público objetivo, y nuestra IA se encarga del resto.",
      solutionHighlight: "Empezarás a ver crecimiento real en horas.",
      trustBadge: "No son bots ni cuentas fake. Es gente real.",
      trustLine: "Más de 50,000 creadores confían en nosotros",
      guarantee: "💯 Garantía de satisfacción o te devolvemos tu dinero",
      cta: "Usar IA Ahora ✨",
      ctaSecondary: "Cómo Funciona",
      stats: {
        clients: "Clientes Satisfechos",
        followers: "Seguidores Entregados",
        support: "Soporte Disponible",
      },
    },
    // Platform selector
    platform: {
      title: "Selecciona tu Plataforma",
    },
    // Packages
    packages: {
      title: "Elige tu Paquete de",
      followers: "Seguidores",
      subscribers: "Suscriptores",
      subtitle: "Todos los paquetes incluyen seguidores reales, entrega gradual y garantía de reposición",
      popular: "Más Popular",
      bestValue: "Mejor Valor",
      delivery: "Entrega en",
      guarantee: "Garantía",
      support: "Soporte",
      buyNow: "Comprar Ahora",
      getOffer: "Obtener Oferta",
      guaranteeTitle: "Garantía de Reemplazo de por Vida",
      guaranteeText:
        "Si pierdes seguidores, los reponemos automáticamente sin costo adicional. Tu inversión está 100% protegida.",
    },
    // Trust section
    trust: {
      title: "Por qué elegir",
      subtitle: "Miles de creadores confían en nosotros para impulsar su presencia en redes sociales",
      elements: {
        clients: "+50,000 clientes",
        clientsDesc: "Satisfechos en toda Latinoamérica",
        guaranteed: "Entrega garantizada",
        guaranteedDesc: "O te devolvemos tu dinero",
        segmented: "Seguidores segmentados",
        segmentedDesc: "USA, Europa, Dubai y más",
        support: "Soporte 24/7",
        supportDesc: "Siempre estamos para ayudarte",
        secure: "Pago seguro",
        secureDesc: "Encriptación de nivel bancario",
        refund: "Reembolso garantizado",
        refundDesc: "Sin preguntas en 30 días",
      },
    },
    // Testimonials
    testimonials: [
      {
        name: "María García",
        comment: "Increíble servicio! Mis seguidores llegaron en menos de 24 horas. 100% recomendado.",
        platform: "Instagram",
      },
      {
        name: "Carlos Mendoza",
        comment: "El mejor servicio de SMM que he probado. Seguidores reales y soporte excelente.",
        platform: "TikTok",
      },
      {
        name: "Ana Rodríguez",
        comment: "Mi canal de YouTube creció increíblemente rápido. Volveré a comprar.",
        platform: "YouTube",
      },
    ],
    // How it works
    howItWorks: {
      title: "Cómo",
      titleHighlight: "Funciona",
      subtitle: "En solo 3 simples pasos estarás en camino a hacer crecer tu audiencia",
      steps: [
        {
          title: "Elige tu paquete",
          description: "Selecciona la plataforma y el paquete que mejor se adapte a tus necesidades de crecimiento.",
        },
        {
          title: "Ingresa tu perfil",
          description: "Solo necesitamos tu nombre de usuario. Nunca pedimos contraseñas ni datos sensibles.",
        },
        {
          title: "Recibe tus seguidores",
          description: "Comenzarás a ver los resultados en cuestión de horas. Entrega gradual y segura.",
        },
      ],
    },
    // FAQ
    faq: {
      title: "Preguntas",
      titleHighlight: "Frecuentes",
      subtitle: "Resolvemos tus dudas más comunes sobre nuestros servicios",
      items: [
        {
          question: "¿Son seguidores reales?",
          answer:
            "Sí, todos nuestros seguidores son cuentas reales con actividad. No usamos bots ni cuentas falsas que puedan perjudicar tu cuenta.",
        },
        {
          question: "¿Cuánto tarda la entrega?",
          answer:
            "El tiempo de entrega varía según el paquete seleccionado. Generalmente entre 24 horas y 10 días, dependiendo de la cantidad.",
        },
        {
          question: "¿Es seguro para mi cuenta?",
          answer:
            "Absolutamente. Usamos métodos seguros y graduales de entrega que respetan las políticas de las plataformas. Tu cuenta está 100% protegida.",
        },
        {
          question: "¿Ofrecen garantía?",
          answer:
            "Sí, todos nuestros paquetes incluyen garantía de reposición. Si pierdes seguidores durante el período de garantía, los reponemos gratis.",
        },
        {
          question: "¿Qué métodos de pago aceptan?",
          answer:
            "Aceptamos tarjetas de crédito/débito, PayPal, transferencias bancarias y criptomonedas para tu comodidad.",
        },
        {
          question: "¿Necesitan mi contraseña?",
          answer: "No, nunca. Solo necesitamos tu nombre de usuario público. Tu seguridad es nuestra prioridad.",
        },
      ],
    },
    // Final CTA
    finalCta: {
      title: "¿Listo para crecer?",
      subtitle:
        "Únete a más de 50,000 creadores que ya están impulsando su presencia en redes sociales con Trend Digital Trade",
      cta: "Comenzar Ahora",
      disclaimer: "Sin compromisos. Garantía de satisfacción.",
    },
    // Footer
    footer: {
      tagline: "Impulsa tu presencia digital",
      terms: "Términos",
      privacy: "Privacidad",
      contact: "Contacto",
      login: "Iniciar Sesión",
      copyright: "Todos los derechos reservados.",
    },
    // Package qualities
    qualities: {
      real: "Seguidores reales",
      quality: "Seguidores de calidad",
      premium: "Seguidores premium",
      elite: "Seguidores elite",
      vip: "Seguidores VIP",
      realSubs: "Suscriptores reales",
      qualitySubs: "Suscriptores de calidad",
      premiumSubs: "Suscriptores premium",
      eliteSubs: "Suscriptores elite",
      vipSubs: "Suscriptores VIP",
    },
    // Support levels
    supportLevels: {
      email: "Email",
      priority: "Prioritario",
      dedicated: "24/7 Dedicado",
      vip: "24/7 VIP",
    },
    // Time units
    time: {
      days: "días",
      unlimited: "Ilimitada",
    },
    // Urgency and social proof
    urgency: {
      banner: "🎄 OFERTA DE NAVIDAD - 50% OFF EN TODOS LOS PAQUETES - SOLO POR HOY 🎅",
    },
    socialProof: {
      purchased: "compró",
    },
    // Profile Analyzer
    profileAnalyzer: {
      title: "Dispara tu Crecimiento en",
      titleHighlight: "Redes Sociales",
      subtitle: "y vuélvete Viral 🚀",
      input: {
        placeholder: "tuusuariodeinstagram",
        button: "Continuar →",
        loading: "Analizando...",
        error: "Por favor ingresa un nombre de usuario",
        errorFetch: "No se pudo cargar el perfil. Verifica el nombre de usuario.",
      },
      trust: {
        organic: "Crecimiento Orgánico",
        safe: "100% Seguro",
        results: "Resultados en 24-48h",
      },
      goals: {
        title: "¿Qué quieres lograr?",
        subtitle: "Selecciona un objetivo y te mostraremos el mejor camino",
        followers: {
          title: "Ganar Seguidores",
          desc: "Crece con seguidores reales y comprometidos",
        },
        viral: {
          title: "Volverse Viral",
          desc: "Aumenta tu alcance y visibilidad exponencialmente",
        },
        monetize: {
          title: "Monetizar",
          desc: "Monetiza tu contenido y trabaja con marcas",
        },
        recommended: "RECOMENDADO",
        continue: "Continuar al Plan de Crecimiento →",
      },
      profile: {
        analyze: "Analizar Perfil",
        followers: "seguidores",
        following: "siguiendo",
      }
    },
    // Impact Section
    impact: {
      lovedBy: "Amado por creadores de todo el mundo",
      title: "TDT impulsa los",
      titleMiddle: "resultados de su marca",
      titleEnd: "específica",
      cta: "Empieza Ya",
    },
  },
  en: {
    // Hero
    hero: {
      badge: "🎄 Christmas came to TDT",
      title: "Take Your Socials to the",
      titleHighlight: "Next Level",
      subtitle:
        "Real followers, authentic engagement. Grow on Instagram, TikTok and more with the platform trusted by thousands of creators.",
      problem: "Tired of the algorithm hiding your account?",
      solution: "TDT uses Artificial Intelligence to put your content in front of real people interested in content like yours. Just select gender, target audience location, and our AI takes care of the rest.",
      solutionHighlight: "You'll start seeing real growth in hours.",
      trustBadge: "Not bots or fake accounts. Real people.",
      trustLine: "Trusted by over 50,000 creators worldwide",
      guarantee: "💯 Satisfaction guarantee or your money back",
      cta: "Use AI Now ✨",
      ctaSecondary: "How It Works",
      stats: {
        clients: "Satisfied Clients",
        followers: "Followers Delivered",
        support: "Support Available",
      },
    },
    // Platform selector
    platform: {
      title: "Select Your Platform",
    },
    // Packages
    packages: {
      title: "Choose Your",
      followers: "Followers",
      subscribers: "Subscribers",
      subtitle: "All packages include real followers, gradual delivery and replacement guarantee",
      popular: "Most Popular",
      bestValue: "Best Value",
      delivery: "Delivery in",
      guarantee: "Guarantee",
      support: "Support",
      buyNow: "Buy Now",
      getOffer: "Get Offer",
      guaranteeTitle: "Lifetime Replacement Guarantee",
      guaranteeText:
        "If you lose followers, we replace them automatically at no extra cost. Your investment is 100% protected.",
    },
    // Trust section
    trust: {
      title: "Why Choose",
      subtitle: "Thousands of creators trust us to boost their social media presence",
      elements: {
        clients: "+50,000 clients",
        clientsDesc: "Satisfied worldwide",
        guaranteed: "Guaranteed delivery",
        guaranteedDesc: "Or your money back",
        segmented: "Targeted followers",
        segmentedDesc: "USA, Europe, Dubai & more",
        support: "24/7 Support",
        supportDesc: "We're always here to help",
        secure: "Secure payment",
        secureDesc: "Bank-level encryption",
        refund: "Refund guaranteed",
        refundDesc: "No questions in 30 days",
      },
    },
    // Testimonials
    testimonials: [
      {
        name: "María García",
        comment: "Incredible service! My followers arrived in less than 24 hours. 100% recommended.",
        platform: "Instagram",
      },
      {
        name: "Carlos Mendoza",
        comment: "The best SMM service I've tried. Real followers and excellent support.",
        platform: "TikTok",
      },
      {
        name: "Ana Rodríguez",
        comment: "My YouTube channel grew incredibly fast. Will buy again.",
        platform: "YouTube",
      },
    ],
    // How it works
    howItWorks: {
      title: "How It",
      titleHighlight: "Works",
      subtitle: "In just 3 simple steps you'll be on your way to growing your audience",
      steps: [
        {
          title: "Choose your package",
          description: "Select the platform and package that best fits your growth needs.",
        },
        {
          title: "Enter your profile",
          description: "We only need your username. We never ask for passwords or sensitive data.",
        },
        {
          title: "Receive your followers",
          description: "You'll start seeing results within hours. Gradual and safe delivery.",
        },
      ],
    },
    // FAQ
    faq: {
      title: "Frequently",
      titleHighlight: "Asked Questions",
      subtitle: "We answer your most common questions about our services",
      items: [
        {
          question: "Are these real followers?",
          answer:
            "Yes, all our followers are real accounts with activity. We don't use bots or fake accounts that could harm your account.",
        },
        {
          question: "How long does delivery take?",
          answer:
            "Delivery time varies by package selected. Generally between 24 hours and 10 days, depending on quantity.",
        },
        {
          question: "Is it safe for my account?",
          answer:
            "Absolutely. We use safe and gradual delivery methods that respect platform policies. Your account is 100% protected.",
        },
        {
          question: "Do you offer a guarantee?",
          answer:
            "Yes, all our packages include a replacement guarantee. If you lose followers during the guarantee period, we replace them for free.",
        },
        {
          question: "What payment methods do you accept?",
          answer: "We accept credit/debit cards, PayPal, bank transfers and cryptocurrencies for your convenience.",
        },
        {
          question: "Do you need my password?",
          answer: "No, never. We only need your public username. Your security is our priority.",
        },
      ],
    },
    // Final CTA
    finalCta: {
      title: "Ready to grow?",
      subtitle:
        "Join over 50,000 creators who are already boosting their social media presence with Trend Digital Trade",
      cta: "Start Now",
      disclaimer: "No commitments. Satisfaction guaranteed.",
    },
    // Footer
    footer: {
      tagline: "Boost your digital presence",
      terms: "Terms",
      privacy: "Privacy",
      contact: "Contact",
      login: "Log In",
      copyright: "All rights reserved.",
    },
    // Package qualities
    qualities: {
      real: "Real followers",
      quality: "Quality followers",
      premium: "Premium followers",
      elite: "Elite followers",
      vip: "VIP followers",
      realSubs: "Real subscribers",
      qualitySubs: "Quality subscribers",
      premiumSubs: "Premium subscribers",
      eliteSubs: "Elite subscribers",
      vipSubs: "VIP subscribers",
    },
    // Support levels
    supportLevels: {
      email: "Email",
      priority: "Priority",
      dedicated: "24/7 Dedicated",
      vip: "24/7 VIP",
    },
    // Time units
    time: {
      days: "days",
      unlimited: "Unlimited",
    },
    // Urgency and social proof
    urgency: {
      banner: "🎄 CHRISTMAS DEAL - 50% OFF ALL PACKAGES - TODAY ONLY 🎅",
    },
    socialProof: {
      purchased: "purchased",
    },
    // Profile Analyzer
    profileAnalyzer: {
      title: "Skyrocket Your",
      titleHighlight: "Social Media Growth",
      subtitle: "And Go Viral 🚀",
      input: {
        placeholder: "yourinstagramusername",
        button: "Continue →",
        loading: "Analyzing...",
        error: "Please enter a username",
        errorFetch: "Could not load profile. Check username.",
      },
      trust: {
        organic: "Organic Growth",
        safe: "100% Safe & Secure",
        results: "Results in 24-48h",
      },
      goals: {
        title: "What are you looking to achieve?",
        subtitle: "Select a goal and we'll show you the best way to get there",
        followers: {
          title: "Gain Followers",
          desc: "Grow with real and engaged followers",
        },
        viral: {
          title: "Go Viral",
          desc: "Increase your reach and visibility exponentially",
        },
        monetize: {
          title: "Monetize",
          desc: "Monetize your content and work with brands",
        },
        recommended: "RECOMMENDED",
        continue: "Continue to Growth Plan →",
      },
      profile: {
        analyze: "Analyze Profile",
        followers: "followers",
        following: "following",
      }
    },
    // Impact Section
    impact: {
      lovedBy: "Loved by creators worldwide",
      title: "TDT boosts your",
      titleMiddle: "brand results",
      titleEnd: "specifically",
      cta: "Get Started",
    },
  },
  pt: {
    // Hero
    hero: {
      badge: "🎄 O Natal chegou à TDT",
      title: "Leve suas Redes ao",
      titleHighlight: "Próximo Nível",
      subtitle:
        "Seguidores reais, engajamento autêntico. Cresça no Instagram, TikTok e mais com a plataforma de confiança de milhares de criadores.",
      problem: "Cansado do algoritmo esconder sua conta?",
      solution: "TDT usa Inteligência Artificial para colocar seu conteúdo na frente de pessoas reais interessadas em conteúdo como o seu. Apenas selecione gênero, localização do público-alvo, e nossa IA cuida do resto.",
      solutionHighlight: "Você começará a ver crescimento real em horas.",
      trustBadge: "Não são bots ou contas falsas. São pessoas reais.",
      trustLine: "Mais de 50.000 criadores confiam em nós",
      guarantee: "💯 Garantia de satisfação ou seu dinheiro de volta",
      cta: "Usar IA Agora ✨",
      ctaSecondary: "Como Funciona",
      stats: {
        clients: "Clientes Satisfeitos",
        followers: "Seguidores Entregues",
        support: "Suporte Disponível",
      },
    },
    // Platform selector
    platform: {
      title: "Selecione sua Plataforma",
    },
    // Packages
    packages: {
      title: "Escolha seu Pacote de",
      followers: "Seguidores",
      subscribers: "Inscritos",
      subtitle: "Todos os pacotes incluem seguidores reais, entrega gradual e garantia de reposição",
      popular: "Mais Popular",
      bestValue: "Melhor Valor",
      delivery: "Entrega em",
      guarantee: "Garantia",
      support: "Suporte",
      buyNow: "Comprar Agora",
      getOffer: "Obter Oferta",
      guaranteeTitle: "Garantia de Reposição Vitalícia",
      guaranteeText:
        "Se você perder seguidores, repomos automaticamente sem custo adicional. Seu investimento está 100% protegido.",
    },
    // Trust section
    trust: {
      title: "Por que escolher",
      subtitle: "Milhares de criadores confiam em nós para impulsionar sua presença nas redes sociais",
      elements: {
        clients: "+50.000 clientes",
        clientsDesc: "Satisfeitos em todo o continente",
        guaranteed: "Entrega garantida",
        guaranteedDesc: "Ou devolvemos seu dinheiro",
        segmented: "Seguidores segmentados",
        segmentedDesc: "EUA, Europa, Dubai e mais",
        support: "Suporte 24/7",
        supportDesc: "Sempre estamos aqui para ajudar",
        secure: "Pagamento seguro",
        secureDesc: "Criptografia de nível bancário",
        refund: "Reembolso garantido",
        refundDesc: "Sem perguntas em 30 dias",
      },
    },
    // Testimonials
    testimonials: [
      {
        name: "María García",
        comment: "Serviço incrível! Meus seguidores chegaram em menos de 24 horas. 100% recomendado.",
        platform: "Instagram",
      },
      {
        name: "Carlos Mendoza",
        comment: "O melhor serviço de SMM que já experimentei. Seguidores reais e suporte excelente.",
        platform: "TikTok",
      },
      {
        name: "Ana Rodríguez",
        comment: "Meu canal do YouTube cresceu incrivelmente rápido. Vou comprar novamente.",
        platform: "YouTube",
      },
    ],
    // How it works
    howItWorks: {
      title: "Como",
      titleHighlight: "Funciona",
      subtitle: "Em apenas 3 passos simples você estará no caminho para aumentar sua audiência",
      steps: [
        {
          title: "Escolha seu pacote",
          description: "Selecione a plataforma e o pacote que melhor se adapta às suas necessidades de crescimento.",
        },
        {
          title: "Insira seu perfil",
          description: "Só precisamos do seu nome de usuário. Nunca pedimos senhas ou dados sensíveis.",
        },
        {
          title: "Receba seus seguidores",
          description: "Você começará a ver resultados em questão de horas. Entrega gradual e segura.",
        },
      ],
    },
    // FAQ
    faq: {
      title: "Perguntas",
      titleHighlight: "Frequentes",
      subtitle: "Respondemos suas dúvidas mais comuns sobre nossos serviços",
      items: [
        {
          question: "São seguidores reais?",
          answer:
            "Sim, todos os nossos seguidores são contas reais com atividade. Não usamos bots ou contas falsas que possam prejudicar sua conta.",
        },
        {
          question: "Quanto tempo demora a entrega?",
          answer:
            "O tempo de entrega varia conforme o pacote selecionado. Geralmente entre 24 horas e 10 dias, dependendo da quantidade.",
        },
        {
          question: "É seguro para minha conta?",
          answer:
            "Absolutamente. Usamos métodos seguros e graduais de entrega que respeitam as políticas das plataformas. Sua conta está 100% protegida.",
        },
        {
          question: "Oferecem garantia?",
          answer:
            "Sim, todos os nossos pacotes incluem garantia de reposição. Se você perder seguidores durante o período de garantia, repomos gratuitamente.",
        },
        {
          question: "Quais métodos de pagamento aceitam?",
          answer:
            "Aceitamos cartões de crédito/débito, PayPal, transferências bancárias e criptomoedas para sua comodidade.",
        },
        {
          question: "Precisam da minha senha?",
          answer: "Não, nunca. Só precisamos do seu nome de usuário público. Sua segurança é nossa prioridade.",
        },
      ],
    },
    // Final CTA
    finalCta: {
      title: "Pronto para crescer?",
      subtitle:
        "Junte-se a mais de 50.000 criadores que já estão impulsionando sua presença nas redes sociais com Trend Digital Trade",
      cta: "Começar Agora",
      disclaimer: "Sem compromissos. Garantia de satisfação.",
    },
    // Footer
    footer: {
      tagline: "Impulsione sua presença digital",
      terms: "Termos",
      privacy: "Privacidade",
      contact: "Contacto",
      login: "Entrar",
      copyright: "Todos os direitos reservados.",
    },
    // Package qualities
    qualities: {
      real: "Seguidores reais",
      quality: "Seguidores de qualidade",
      premium: "Seguidores premium",
      elite: "Seguidores elite",
      vip: "Seguidores VIP",
      realSubs: "Inscritos reais",
      qualitySubs: "Inscritos de qualidade",
      premiumSubs: "Inscritos premium",
      eliteSubs: "Inscritos elite",
      vipSubs: "Inscritos VIP",
    },
    // Support levels
    supportLevels: {
      email: "Email",
      priority: "Prioritário",
      dedicated: "24/7 Dedicado",
      vip: "24/7 VIP",
    },
    // Time units
    time: {
      days: "dias",
      unlimited: "Ilimitada",
    },
    // Urgency and social proof
    urgency: {
      banner: "🎄 OFERTA DE NATAL - 50% OFF EM TODOS OS PACOTES - SÓ HOJE 🎅",
    },
    socialProof: {
      purchased: "comprou",
    },

    // Services
    services: {
      instagram: {
        followers: "Seguidores Instagram",
        likes: "Likes Instagram",
        views: "Vistas Instagram",
      },
      tiktok: {
        followers: "Seguidores TikTok",
        likes: "Likes TikTok",
        views: "Vistas TikTok",
      },
    },
    // Impact Section
    impact: {
      lovedBy: "Amado por más de 80.000 fans",
      title: "TDT impulsa los",
      titleMiddle: "resultados de su marca",
      titleEnd: "específica",
      cta: "Empieza ya",
      card: {
        followers: "Seguidores",
        growth: "Crecimiento",
        reach: "Alcance de cuenta",
        engagement: "Engagement",
        sales: "Ventas mensuales",
      }
    },
    // Pricing Specifics used in Component
    pricing: {
      limitedDiscount: "Descuento limitado",
      title: "Elige tu crecimiento",
      titleHighlight: "sin límites",
      subtitle: "Sin bots. Sin riesgos. Crecimiento real garantizado.",
      want: "Quiero conseguir",
      realFollowers: "seguidores reales",
      monthly: "Mensual",
      annual: "Anual",
      standard: {
        name: "Standard Growth",
        desc: "Ideal para comenzar a crecer de forma constante.",
        delivery: "Velocidad de entrega natural",
        start: "Inicio en 24-48hs",
        guarantee: "Garantía de reposición 30 días",
        support: "Soporte por Email",
        cta: "Elegir Standard",
      },
      premium: {
        badge: "RECOMENDADO POR IA",
        name: "Turbo AI Growth",
        desc: "Máxima velocidad y calidad con Inteligencia Artificial.",
        delivery: "Velocidad Turbo (Prioridad Alta)",
        start: "Inicio Instantáneo (<1h)",
        guarantee: "Garantía de por vida",
        support: "Soporte VIP Prioritario 24/7",
        ai: "Segmentación por IA (GPT-4o)",
        advisor: "Asesor de cuenta dedicado",
        cta: "Elegir Premium ⭐",
        bonus: "(+Bonus)",
      },
      moreSpecific: "¿Buscas algo más específico?",
      viewAll: "Ver todos los servicios y paquetes disponibles",
    },
  },
  en: {
    // Services
    services: {
      instagram: {
        followers: "Instagram Followers",
        likes: "Instagram Likes",
        views: "Instagram Views",
      },
      tiktok: {
        followers: "TikTok Followers",
        likes: "TikTok Likes",
        views: "TikTok Views",
      },
    },
    // Impact Section
    impact: {
      lovedBy: "Loved by over 80,000 fans",
      title: "TDT boosts your",
      titleMiddle: "specific brand",
      titleEnd: "results",
      cta: "Start now",
      card: {
        followers: "Followers",
        growth: "Growth",
        reach: "Account reach",
        engagement: "Engagement",
        sales: "Monthly sales",
      }
    },
    // Pricing Specifics used in Component
    pricing: {
      limitedDiscount: "Limited Discount",
      title: "Choose your growth",
      titleHighlight: "without limits",
      subtitle: "No bots. No risks. Real growth guaranteed.",
      want: "I want to get",
      realFollowers: "real followers",
      monthly: "Monthly",
      annual: "Annual",
      standard: {
        name: "Standard Growth",
        desc: "Ideal to start growing steadily.",
        delivery: "Natural delivery speed",
        start: "Start in 24-48hs",
        guarantee: "30-day refill guarantee",
        support: "Email Support",
        cta: "Choose Standard",
      },
      premium: {
        badge: "AI RECOMMENDED",
        name: "Turbo AI Growth",
        desc: "Maximum speed and quality with Artificial Intelligence.",
        delivery: "Turbo Speed (High Priority)",
        start: "Instant Start (<1h)",
        guarantee: "Lifetime Guarantee",
        support: "24/7 VIP Priority Support",
        ai: "AI Segmentation (GPT-4o)",
        advisor: "Dedicated Account Advisor",
        cta: "Choose Premium ⭐",
        bonus: "(+Bonus)",
      },
      moreSpecific: "Looking for something more specific?",
      viewAll: "View all available services and packages",
    },
  },
  pt: {
    // Services
    services: {
      instagram: {
        followers: "Seguidores Instagram",
        likes: "Curtidas Instagram",
        views: "Visualizações Instagram",
      },
      tiktok: {
        followers: "Seguidores TikTok",
        likes: "Curtidas TikTok",
        views: "Visualizações TikTok",
      },
    },
    // Impact Section
    impact: {
      lovedBy: "Amado por mais de 80.000 fãs",
      title: "TDT impulsiona os",
      titleMiddle: "resultados da sua marca",
      titleEnd: "específica",
      cta: "Comece agora",
      card: {
        followers: "Seguidores",
        growth: "Crescimento",
        reach: "Alcance da conta",
        engagement: "Engajamento",
        sales: "Vendas mensais",
      }
    },
    // Pricing Specifics used in Component
    pricing: {
      limitedDiscount: "Desconto Limitado",
      title: "Escolha seu crescimento",
      titleHighlight: "sem limites",
      subtitle: "Sem bots. Sem riscos. Crescimento real garantido.",
      want: "Quero conseguir",
      realFollowers: "seguidores reais",
      monthly: "Mensal",
      annual: "Anual",
      standard: {
        name: "Crescimento Padrão",
        desc: "Ideal para começar a crescer de forma constante.",
        delivery: "Velocidade de entrega natural",
        start: "Início em 24-48hs",
        guarantee: "Garantia de reposição 30 dias",
        support: "Suporte por Email",
        cta: "Escolher Padrão",
      },
      premium: {
        badge: "RECOMENDADO POR IA",
        name: "Crescimento Turbo IA",
        desc: "Máxima velocidade e qualidade com Inteligência Artificial.",
        delivery: "Velocidade Turbo (Prioridade Alta)",
        start: "Início Imediato (<1h)",
        guarantee: "Garantia Vitalícia",
        support: "Suporte VIP Prioritário 24/7",
        ai: "Segmentação por IA (GPT-4o)",
        advisor: "Consultor de conta dedicado",
        cta: "Escolher Premium ⭐",
        bonus: "(+Bônus)",
      },
      moreSpecific: "Procurando algo mais específico?",
      viewAll: "Ver todos os serviços e pacotes disponíveis",
    },
  },
}
