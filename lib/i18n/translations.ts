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
      badgeChristmas: "🎄 Navidad llegó a TDT",
      badgeNewYear: "🎉 Oferta de Año Nuevo",
      badge: "🎄 Navidad llegó a TDT",
      title: "Vence al Algoritmo y Conecta con",
      titleHighlight: "Audiencias Reales",
      titleEnd: "mediante IA",
      subtitle:
        "Sin bots, sin cuentas falsas. Solo crecimiento orgánico segmentado por género y ubicación en tiempo récord.",
      problem: "¿Cansado que el algoritmo esconda tu cuenta?",
      solution: "TDT usa Inteligencia Artificial para poner tu contenido en frente de personas reales interesadas en contenido como el tuyo. Solo selecciona género, ubicación del público objetivo, y nuestra IA se encarga del resto.",
      solutionHighlight: "Empezarás a ver crecimiento real en horas.",
      trustBadge: "No son bots ni cuentas fake. Es gente real.",
      trustLine: "Amado por más de *80,000* fans",
      guarantee: "💯 Garantía de satisfacción o te devolvemos tu dinero",
      cta: "Impulsar mi cuenta con IA →",
      ctaSecondary: "Cómo Funciona",
      stats: {
        clients: "Clientes Satisfechos",
        followers: "Seguidores Entregados",
        support: "Soporte Disponible",
      },
      statsGrid: {
        monthlyGrowth: "Aumento mensual de seguidores",
        hoursSaved: "Horas ahorradas para los clientes",
        rating: "Basado en opiniones reales",
        userBase: "Base actual de usuarios de TDT",
      },

    },
    // Platform selector
    platform: {
      title: "Selecciona tu Plataforma",
    },
    // Packages
    packages: {
      title: "Choose Your Package of",
      followers: "Followers",
      subscribers: "Subscribers",
      subtitle: "All packages include real followers, gradual delivery, and refill guarantee",
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
        refundDesc: "Sin preguntas en 30 días",
      },
    },
    // Testimonials Section Header
    testimonialsSection: {
      badge: "Amor de nuestros clientes",
      title: "Clientes aman nuestra herramienta de crecimiento",
      subtitle: "Mira por qué influencers y marcas confían en TDT para su crecimiento en Instagram.",
    },
    // New Features / Benefits Section (Competitor Match)
    features: {
      header: {
        main: "Tecnología de IA + Estrategas de marketing =",
        highlight: "Crecimiento fácil y rápido 🚀",
      },
      badge: "Impulsado por IA",
      title: "Sin seguidores falsos ni bots",
      subtitle: "Solo crecimiento inteligente para Instagram. Verás crecimiento inmediato gracias a la tecnología impulsada por IA de TDT.",
      list: [
        {
          title: "Sin Tácticas de Spam",
          description: "No dependas de la automatización y los bots. TDT garantiza fans nuevos y auténticos que realmente aprecian e interactúan con tu contenido.",
        },
        {
          title: "Crecimiento Constante",
          description: "Mira cómo crece tu contador de seguidores cada día sin trabajo de tu parte. Trabajamos 24/7 para hacer crecer tu cuenta.",
        },
        {
          title: "Crecimiento Sin Riesgos",
          description: "TDT nunca pide tu contraseña de IG. Cumplimos completamente con las directrices de Instagram y hemos ayudado a más de 80,000 usuarios.",
        },
        {
          title: "Nuevos Seguidores Comprometidos",
          description: "TDT se asegura de que tus seguidores no solo te sigan y dejen de seguir, sino que disfruten lo que compartes y quieran ver más.",
        },
        {
          title: "No Pierdas Tiempo ni Dinero",
          description: "¿Por qué pagar por un equipo de marketing entero cuando TDT hace crecer tu cuenta mejor? Tú enfócate en crear contenido.",
        },
        {
          title: "Modelos de Crecimiento de IA",
          description: "Una vez nos das tus filtros de segmentación (ubicación, edad, género, intereses), siéntate y deja que la tecnología de TDT encuentre tus seguidores.",
        },
      ]
    },
    // Testimonials
    testimonials: [
      {
        name: "Alexander K.",
        role: "🇩🇪 Germany",
        comment: "The precision of the GPT-4o targeting is impressive. I’ve seen a 20% increase in organic reach from high-quality European audiences.",
        rating: 5,
      },
      {
        name: "Sarah Jenkins",
        role: "🇺🇸 USA",
        comment: "Safety was my main concern, but TDT's no-password policy won me over. My community is growing with real, active users.",
        rating: 5,
      },
      {
        name: "Yuki Tanaka",
        role: "🇯🇵 Japan",
        comment: "Finally, a tool that understands global demographics. The AI helped me connect with art enthusiasts worldwide.",
        rating: 5,
      },
      {
        name: "Mateo Ricci",
        role: "🇮🇹 Italy",
        comment: "Switched to TDT after trying several SMM panels that failed. The difference is night and day; this is real AI-driven growth.",
        rating: 5,
      },
      {
        name: "Chloe Lefebvre",
        role: "🇫🇷 France",
        comment: "Setting up my goals took less than 5 minutes. The AI handles the rest perfectly. It’s the most seamless scaling experience.",
        rating: 5,
      },
      {
        name: "Liam O’Connor",
        role: "🇮🇪 Ireland",
        comment: "As a brand owner, I need results, not bots. TDT delivered a highly engaged audience that actually converts into web traffic.",
        rating: 5,
      },
      {
        name: "Amira Al-Sayed",
        role: "🇦🇪 UAE",
        comment: "The best investment for my digital presence. The targeting options for location and interests are incredibly accurate.",
        rating: 5,
      },
      {
        name: "Lucas Silva",
        role: "🇧🇷 Brazil",
        comment: "Incrível! A tecnologia GPT-4o realmente faz a diferença. O crescimento é orgânico e constante. Suporte nota 10.",
        rating: 5,
      },
      {
        name: "Oliver Smith",
        role: "🇬🇧 UK",
        comment: "Professional, secure, and effective. TDT is now an essential part of my marketing stack for all my client profiles.",
        rating: 5,
      },
      {
        name: "Elena Kostas",
        role: "🇬🇷 Greece",
        comment: "Fast results without compromising account safety. It’s rare to find a service that actually follows through on its promises.",
        rating: 5,
      },
    ],
    // How it works
    howItWorks: {
      badge: "¿Cómo funciona?",
      title: "Planes personalizados para",
      titleHighlight: "crecimiento orgánico",
      subtitle: "En 3 simples pasos estarás en camino a crecer tu audiencia",
      steps: [
        {
          title: "1. Define tus metas",
          description: "Utiliza nuestras opciones de segmentación avanzadas para encontrar los seguidores que deseas por edad, demografía, ubicación, género, etc.",
        },
        {
          title: "2. Ejecución con IA",
          description: "TDT usa aprendizaje automático, GPT4o y estrategas expertos para promocionar tu contenido a los usuarios correctos orgánicamente.",
        },
        {
          title: "3. Crecimiento Segmentado",
          description: "Obtendrás seguidores segmentados que interactúan con tu contenido según tu nicho, resultando en mayor retención y engagement genuino.",
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
      refundPolicy: "Política de Reembolso",
      copyright: "Todos los derechos reservados.",
      professional: {
        description: "La plataforma líder en crecimiento orgánico de Instagram. Más de 80,000 clientes confían en nosotros.",
        products: "Producto",
        company: "Empresa",
        legal: "Legal",
        securePayment: "🔒 Pagos 100% seguros y encriptados",
        rights: "Todos los derechos reservados.",
        madeWith: "Hecho con ❤️ en Argentina",
        features: "Características",
        pricing: "Precios",
        cases: "Casos de Éxito",
        testimonials: "Testimonios",
        about: "Sobre Nosotros",
        blog: "Blog",
        careers: "Carreras",
        press: "Prensa",
        terms: "Términos de Servicio",
        privacy: "Política de Privacidad",
        cookies: "Política de Cookies",
        gdpr: "GDPR",
        paymentMethods: "Métodos de pago aceptados:"
      }
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
      formTitle: "Grow with TDT",
      formSubtitle: "Ingresa tu usuario de Instagram para comenzar",
      online: "Online",
      change: "Cambiar",
      verified: "Perfil verificado y apto",
      input: {
        placeholder: "tuusuariodeinstagram",
        button: "Continuar →",
        loading: "Analizando...",
        analyzing: "Analizando perfil...",
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
    // Consultant (AI Growth)
    consultant: {
      badge: "✨ AI Growth Consultant",
      title: "Diseña tu Estrategia",
      titleHighlight: "Personalizada",
      subtitle: "Nuestra IA analiza tu perfil y diseña el plan perfecto para tu crecimiento. Solo selecciona tus preferencias.",
      step1: {
        title: "1. ¿Cuál es tu objetivo de alcance?",
        subtitle: "Selecciona tu plataforma y objetivo para comenzar el análisis.",
        followers: "Seguidores Objetivo",
        micro: "Micro Influencer",
        influencer: "Influencer",
        continue: "Continuar",
        // Loading & Analysis
        loading: {
          analyzing: "Analizando tendencias de {niche} en {location}...",
          optimizing: "Optimizando estrategia de crecimiento GPT-4o...",
        },
        // Dynamic ranges
        ranges: {
          foundation: "Perfecto para construir una base sólida.",
          authority: "Ideal para acelerar la autoridad de marca.",
          dominance: "Nivel élite para dominio global del mercado.",
        },
      },
      step2: {
        title: "2. Define tu Audiencia Ideal",
        subtitle: "Selecciona las características de tu público objetivo",
        genderLabel: "Género del Público",
        locationLabel: "Ubicación del Público",
        interestLabel: "Nicho / Interés",
        back: "Atrás",
        cta: "Ver Opciones",
      },
      // Selectors
      selectors: {
        locations: {
          us: "Estados Unidos",
          latam: "Latinoamérica",
          europe: "Europa",
          asia: "Asia",
          emirates: "Emiratos Árabes",
          global: "Global",
        },
        interests: {
          fashion: "Moda",
          art: "Arte",
          business: "Negocios",
          trading: "Trading",
          fitness: "Fitness",
          sports: "Deportes",
          motherhood: "Maternidad",
          agriculture: "Agricultura",
          food: "Comida",
          travel: "Viajes",
          tech: "Tecnología",
          lifestyle: "Estilo de Vida",
        },
        genders: {
          any: "Cualquiera",
          male: "Hombres",
          female: "Mujeres",
        }
      },
      trust: {
        encrypted: "Datos Encriptados",
        noPassword: "Sin Contraseñas",
        guarantee: "Garantía Total",
      },
    },
    // Checkout Redesign
    checkout: {
      orderBump: {
        headline: "🚀 ONE-TIME OFFER: PRIORITY PROCESSING",
        copy: "Yes! Add priority processing for just $4.99.",
        price: "+$4.99",
      },
      mysteryUpsell: {
        title: "Wait! Don't create yet...",
        subtitle: "Our AI suggests boosting your order to maximize retention.",
        offer: "Do you want to DOUBLE your followers for only 50% of the cost?",
        ctaAccept: "Yes, Upgrade My Order",
        ctaReject: "No thanks, I'll keep my small order",
      },
      visualValidator: {
        valid: "Account Found",
        checking: "Validating with AI...",
      },
      paymentButton: {
        text: "Activate Plan Now",
        subtext: "Guaranteed Delivery within 24h",
      },
      noPassword: "🔒 We never ask for your password",
      secureLogos: "100% Secure Usage & Encrypted Payment",
    },
    // Social Proof Ticker
    socialProofTicker: {
      analyzed: "analizó su perfil 🔍",
      requested: "solicitó estrategia 📈",
      time: {
        min: "min",
        hour: "h",
        ago: "hace",
      },
    },

    // Impact Section
    impact: {
      lovedBy: "Amado por creadores de todo el mundo",
      title: "TDT impulsa los",
      titleMiddle: "resultados de su marca",
      titleEnd: "específica",
      cta: "Empieza Ya",
      card: {
        followers: "Followers",
        growth: "Growth",
        reach: "Account reach",
        engagement: "Engagement",
        sales: "Monthly sales",
      }
    },
    // Custom Plan Page (Servicios)
    plan: {
      title: "Tu Plan",
      titleHighlight: "Personalizado",
      subtitle: "Basado en tu perfil:",
      normal: {
        title: "Plan Normal",
        subtitle: "Crecimiento constante y seguro",
        cta: "Seleccionar Normal",
      },
      premium: {
        title: "Plan Premium",
        subtitle: "Crecimiento acelerado con IA",
        cta: "Seleccionar Premium",
        badge: "⚡ RECOMENDADO",
        bonus: "+20% seguidores bonus gratis",
      },
      features: {
        delivery: (days: string) => `Entrega en <strong>${days}</strong>`,
        deliveryNormal: "7-10 días",
        deliveryPremium: "2-4 días",
        deliverySpeedPremium: "(3x más rápido)",
        realFollowers: "Seguidores reales y activos",
        premiumFollowers: "Seguidores premium de alta calidad",
        supportEmail: "Soporte por email (24-48h)",
        supportPriority: "Soporte prioritario 24/7 (WhatsApp)",
        guarantee30: "Garantía de reposición 30 días",
        guarantee90: "Garantía de reposición 90 días",
        engagementNormal: "Engagement moderado (2-5% likes)",
        engagementHigh: "Engagement alto (8-15% likes + comentarios)",
      },
      visualization: {
        title: "📈 Visualiza tu Crecimiento Mes a Mes",
        subtitle: "Proyección estimada con Plan Premium",
        month: "Mes",
        disclaimer: "* Proyección basada en crecimiento orgánico + servicios TDT. Resultados pueden variar según contenido y engagement.",
      },
      trust: {
        secure: "100% Seguro",
        real: "Seguidores Reales",
        noBots: "Sin Bots",
        guarantee: "Garantía Total",
      },
      back: "Volver",
    },
    // Checkout
    checkout: {
      title: "Complete Purchase",
      subtitle: "Enter your details to receive the service.",
      notFound: "Package not found",
      backToServices: "Back to Services",
      form: {
        email: "Your Email (for confirmation)",
        emailPlaceholder: "example@email.com",
        username: "Username / Channel Link",
        postLink: "Post / Video Link",
        publicAccount: "Make sure the account is public.",
        location: "Target Country / Location (Optional)",
        locationPlaceholder: "Ex: USA, Spain, Mexico...",
        segmentationHelp: "Help us better target your audience (if applicable).",
        fillAll: "Please fill all fields",
      },
      payment: {
        title: "Payment Method",
        crypto: "Crypto",
        whatsapp: "WhatsApp",
        transfer: "Transfer/Cash",
        secure: "100% Secure Payment",
        encrypted: "Encrypted and secure transaction",
        subtotal: "Subtotal",
        discountCrypto: "Crypto Discount (10%)",
        total: "Total to Pay",
        payCrypto: "Pay with Crypto",
        payWhatsapp: "Proceed to Payment",
      },
      whatsappMessage: "Hello! I want to purchase service: {service} for {price}. Link: {link} Email: {email} {segmentation}",
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
    // Pricing
    pricing: {
      limitedDiscount: "Descuento Limitado",
      title: "Elige tu crecimiento",
      titleHighlight: "sin límites",
      subtitle: "Sin bots. Sin riesgos. Crecimiento real garantizado.",
      want: "Quiero conseguir",
      realFollowers: "seguidores reales",
      monthly: "Mensual",
      annual: "Anual",
      standard: {
        name: "Crecimiento Estándar",
        desc: "Ideal para empezar a crecer de manera constante.",
        delivery: "Velocidad de entrega natural",
        start: "Inicio en 24-48hs",
        guarantee: "Garantía de recarga 30 días",
        support: "Soporte por Email",
        cta: "Elegir Estándar",
      },
      premium: {
        badge: "RECOMENDADO POR IA",
        name: "Crecimiento Turbo IA",
        desc: "Máxima velocidad y calidad con Inteligencia Artificial.",
        delivery: "Velocidad Turbo (Prioridad Alta)",
        start: "Inicio Inmediato (<1h)",
        guarantee: "Garantía de por Vida",
        support: "Soporte VIP Prioritario 24/7",
        ai: "Segmentación por IA (GPT-4o)",
        advisor: "<b>Consultor de Crecimiento</b>",
        cta: "Elegir Premium ⭐",
        bonus: "(+Bono)",
      },
      moreSpecific: "¿Buscas algo más específico?",
      viewAll: "Ver todos los servicios y paquetes disponibles",
    },
    subscription_v2: {
      title: "Tu Estrategia de Crecimiento con IA está lista.",
      subtitle: "Selecciona tu plan de aceleración mensual. Cancela cuando quieras.",
      monthly: "Mensual",
      quarterly: "Trimestral",
      save20: "Ahorra 20%",
      tiers: {
        starter: {
          name: "INFLUENCER STARTER",
          price: "97",
          description: "Perfecto para creadores construyendo su base inicial.",
          features: [
            "🚀 2,500 Seguidores Reales (Crecimiento Mensual)",
            "✨ Auto-Likes en todos los nuevos posts",
            "👁️ Auto-Views para Reels/TikToks",
            "🛡️ Protección de Recarga 30 Días"
          ],
          cta: "Comenzar Crecimiento",
        },
        pro: {
          badge: "🔥 MÁS POPULAR",
          name: "PRO AUTHORITY",
          price: "249",
          description: "Velocidad dominante para marcas y marcas personales serias.",
          features: [
            "🚀 10,000 Seguidores Reales (Crecimiento Mensual)",
            "🔥 Impulso VIP de Likes (Mayor retención)",
            "⚡ Vistas de Velocidad Viral",
            "💎 Soporte Prioritario WhatsApp",
            "🔒 No Requiere Contraseña"
          ],
          anchor: "Equivalente a una Agencia de $2,000/mes.",
          cta: "Activar Plan Pro",
        },
        celebrity: {
          name: "CELEBRITY STATUS",
          price: "497",
          description: "Máxima exposición y gestión dedicada.",
          features: [
            "🚀 25,000+ Seguidores Reales (Crecimiento Agresivo)",
            "🤖 Estrategia de Comentarios con IA",
            "🌟 Acceso a Red de Power-Likes",
            "👨‍💼 Account Manager Dedicado",
            "📈 Reporte Mensual de Rendimiento"
          ],
          cta: "Aplicar Estatus Socio",
        }
      },
      guarantee: {
        secure: "Pago Seguro SSL",
        moneyBack: "Garantía de Reembolso 14 Días",
        cancel: "Cancela Cuando Quieras"
      }
    },
    footer_v2: {
      tagline: "Impulsa tu presencia digital",
      terms: "Términos",
      privacy: "Privacidad",
      contact: "Contacto",
      login: "Ingresar",
      refundPolicy: "Política de Reembolso",
      copyright: "Todos los derechos reservados."
    },
  },
  en: {
    // Hero
    hero: {
      badgeChristmas: "🎄 Christmas came to TDT",
      badgeNewYear: "🎉 New Year Offer",
      badge: "Christmas came to TDT",
      title: "Beat the Algorithm and Connect with",
      titleHighlight: "Real Audiences",
      titleEnd: "using AI",
      subtitle:
        "No bots, no fake accounts. Just organic growth targeted by gender and location in record time.",
      problem: "Tired of the algorithm hiding your account?",
      solution: "TDT uses Artificial Intelligence to put your content in front of real people interested in content like yours. Just select gender, target audience location, and our AI takes care of the rest.",
      solutionHighlight: "You'll start seeing real growth in hours.",
      trustBadge: "Not bots or fake accounts. Real people.",
      trustLine: "Loved by over *80,000* fans",
      guarantee: "💯 Satisfaction guarantee or your money back",
      cta: "Boost my account with AI →",
      ctaSecondary: "How It Works",
      stats: {
        clients: "Satisfied Clients",
        followers: "Followers Delivered",
        support: "Support Available",
      },
      statsGrid: {
        monthlyGrowth: "Monthly follower increase",
        hoursSaved: "Hours saved for clients",
        rating: "Based on real client reviews",
        userBase: "Current TDT user base",
      },
    },
    // Platform selector
    platform: {
      title: "Select your Platform",
    },
    // Subscription Plans (Monthly Recurring)
    subscription_v2: {
      title: "Your AI Growth Strategy is Ready.",
      subtitle: "Select your monthly acceleration plan. Cancel anytime.",
      monthly: "Monthly",
      quarterly: "Quarterly",
      save20: "Save 20%",
      tiers: {
        starter: {
          name: "INFLUENCER STARTER",
          price: "97",
          description: "Perfect for creators building their initial base.",
          features: [
            "🚀 2,500 Real Followers (Monthly Growth)",
            "✨ Auto-Likes on all new posts",
            "👁️ Auto-Views for Reels/TikToks",
            "🛡️ 30-Day Refill Protection"
          ],
          cta: "Start Growth",
        },
        pro: {
          badge: "🔥 MOST POPULAR",
          name: "PRO AUTHORITY",
          price: "249",
          description: "Dominance speed for brands and serious personal brands.",
          features: [
            "🚀 10,000 Real Followers (Monthly Growth)",
            "🔥 VIP Likes Boost (Higher retention)",
            "⚡ Viral Velocity Views",
            "💎 Priority WhatsApp Support",
            "🔒 No Password Required"
          ],
          anchor: "Equivalent to a $2,000/mo Agency.",
          cta: "Activate Pro Plan",
        },
        celebrity: {
          name: "CELEBRITY STATUS",
          price: "497",
          description: "Maximum exposure and dedicated management.",
          features: [
            "🚀 25,000+ Real Followers (Aggressive Growth)",
            "🤖 AI Comment Strategy",
            "🌟 Access to Power-Likes Network",
            "👨‍💼 Dedicated Account Manager",
            "📈 Monthly Performance Report"
          ],
          cta: "Apply for Partner Status",
        }
      },
      guarantee: {
        secure: "Secure SSL Payment",
        moneyBack: "14-Day Money-Back Guarantee",
        cancel: "Cancel Anytime"
      }
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
        refundDesc: "No questions asked in 30 days",
      },
    },
    // Testimonials Section Header
    testimonialsSection: {
      subtitle: "Discover why influencers and brands trust TDT with their social media growth and success",
    },

    // Testimonials
    testimonials: [
      {
        name: "Alexander K.",
        role: "🇩🇪 Germany",
        comment: "The precision of the GPT-4o targeting is impressive. I’ve seen a 20% increase in organic reach from high-quality European audiences.",
        rating: 5,
      },
      {
        name: "Sarah Jenkins",
        role: "🇺🇸 USA",
        comment: "Safety was my main concern, but TDT's no-password policy won me over. My community is growing with real, active users.",
        rating: 5,
      },
      {
        name: "Yuki Tanaka",
        role: "🇯🇵 Japan",
        comment: "Finally, a tool that understands global demographics. The AI helped me connect with art enthusiasts worldwide.",
        rating: 5,
      },
      {
        name: "Mateo Ricci",
        role: "🇮🇹 Italy",
        comment: "Switched to TDT after trying several SMM panels that failed. The difference is night and day; this is real AI-driven growth.",
        rating: 5,
      },
      {
        name: "Chloe Lefebvre",
        role: "🇫🇷 France",
        comment: "Setting up my goals took less than 5 minutes. The AI handles the rest perfectly. It’s the most seamless scaling experience.",
        rating: 5,
      },
      {
        name: "Liam O’Connor",
        role: "🇮🇪 Ireland",
        comment: "As a brand owner, I need results, not bots. TDT delivered a highly engaged audience that actually converts into web traffic.",
        rating: 5,
      },
      {
        name: "Amira Al-Sayed",
        role: "🇦🇪 UAE",
        comment: "The best investment for my digital presence. The targeting options for location and interests are incredibly accurate.",
        rating: 5,
      },
      {
        name: "Lucas Silva",
        role: "🇧🇷 Brazil",
        comment: "Incrível! A tecnologia GPT-4o realmente faz a diferença. O crescimento é orgânico e constante. Suporte nota 10.",
        rating: 5,
      },
      {
        name: "Oliver Smith",
        role: "🇬🇧 UK",
        comment: "Professional, secure, and effective. TDT is now an essential part of my marketing stack for all my client profiles.",
        rating: 5,
      },
      {
        name: "Elena Kostas",
        role: "🇬🇷 Greece",
        comment: "Fast results without compromising account safety. It’s rare to find a service that actually follows through on its promises.",
        rating: 5,
      },
    ],
    // How it works
    howItWorks: {
      badge: "How it works?",
      title: "Custom plans for",
      titleHighlight: "organic growth",
      subtitle: "In just 3 simple steps you'll be on your way to growing your audience",
      steps: [
        {
          title: "1. Set your goals",
          description: "Use our advanced targeting options to find the followers you want by age, demographic, location, gender, etc.",
        },
        {
          title: "2. AI Execution",
          description: "TDT uses machine learning, GPT4o, and expert growth strategists to promote your content to the right users organically.",
        },
        {
          title: "3. Targeted organic growth",
          description: "You'll get segmented followers who engage with your content based on your niche, resulting in higher retention and genuine engagement.",
        },
      ],
      steps_v2: [
        {
          title: "1. Set your goals",
          description: "Use our advanced targeting options to find the followers you want by age, demographic, location, gender, etc.",
        },
        {
          title: "2. AI Execution",
          description: "TDT uses machine learning, GPT4o, and expert growth strategists to promote your content to the right users organically.",
        },
        {
          title: "3. Targeted organic growth",
          description: "You'll get segmented followers who engage with your content based on your niche, resulting in higher retention and genuine engagement.",
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
          answer: "Yes. TDT uses GPT-4o and advanced targeting to connect your profile with real users interested in your specific niche. We don't use fake bot farms.",
        },
        {
          question: "How long does delivery take?",
          answer: "You will see the first results within hours. Our AI optimizes the growth speed to ensure it looks 100% organic and safe for the platform's algorithm.",
        },
        {
          question: "Is it safe for my account?",
          answer: "Absolutely. We comply with all official guidelines. Since we don't use automation that violates terms of service, your account is 100% safe.",
        },
        {
          question: "Do you offer a guarantee?",
          answer: "Yes, we have a refill guarantee. If your numbers drop within the first 30 days, our system automatically detects it and restores your growth.",
        },
        {
          question: "What payment methods do you accept?",
          answer: "We accept all major Credit Cards, PayPal, and Cryptocurrency for your convenience and privacy.",
        },
        {
          question: "Do you need my password?",
          answer: "Never. We only need your username or link. We will never ask for sensitive access information.",
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
      refundPolicy: "Refund Policy",
      copyright: "All rights reserved.",
      professional: {
        description: "The leading platform for organic Instagram growth. Over 80,000 clients trust us.",
        products: "Products",
        company: "Company",
        legal: "Legal",
        securePayment: "🔒 100% secure and encrypted payments",
        rights: "All rights reserved.",
        madeWith: "Made with ❤️ in Argentina",
        features: "Features",
        pricing: "Pricing",
        cases: "Success Stories",
        testimonials: "Testimonials",
        about: "About Us",
        blog: "Blog",
        careers: "Careers",
        press: "Press",
        terms: "Terms of Service",
        privacy: "Privacy Policy",
        cookies: "Cookie Policy",
        gdpr: "GDPR",
        paymentMethods: "Accepted payment methods:"
      }
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
      formTitle: "Grow with TDT",
      formSubtitle: "Enter your Instagram username to start",
      online: "Online",
      change: "Change",
      verified: "Verified & Eligible Profile",
      input: {
        placeholder: "yourinstagramusername",
        button: "Continue →",
        loading: "Analyzing...",
        analyzing: "Analyzing profile...",
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
        subtitle: "Select a goal and we'll show you the best path",
        followers: {
          title: "Gain Followers",
          desc: "Grow with real, engaged followers",
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
    // Consultant (AI Growth)
    consultant: {
      badge: "✨ AI Growth Consultant",
      title: "Design Your Strategy",
      titleHighlight: "Personalized",
      subtitle: "Our AI analyzes your profile and designs the perfect plan for your growth. Just select your preferences.",
      step1: {
        title: "1. What is your reach goal?",
        subtitle: "Select your platform and goal to start the analysis.",
        followers: "Target Followers",
        micro: "Micro Influencer",
        influencer: "Influencer",
        continue: "Continue",
        loading: {
          analyzing: "Analyzing {niche} trends in {location}...",
          optimizing: "Optimizing GPT-4o growth strategy...",
        },
        ranges: {
          foundation: "Perfect for building a solid foundation.",
          authority: "Ideal for accelerating brand authority.",
          dominance: "Elite tier for global market dominance.",
        },
      },
      step2: {
        title: "2. Define your Ideal Audience",
        subtitle: "Select the characteristics of your target audience",
        genderLabel: "Audience Gender",
        locationLabel: "Audience Location",
        interestLabel: "Niche / Interest",
        back: "Back",
        cta: "See Options",
      },
      // Selectors
      selectors: {
        locations: {
          us: "United States",
          latam: "Latin America",
          europe: "Europe",
          asia: "Asia",
          emirates: "UAE",
          global: "Global",
        },
        interests: {
          fashion: "Fashion",
          art: "Art",
          business: "Business",
          trading: "Trading",
          fitness: "Fitness",
          sports: "Sports",
          motherhood: "Motherhood",
          agriculture: "Agriculture",
          food: "Food",
          travel: "Travel",
          tech: "Technology",
          lifestyle: "Lifestyle",
        },
        genders: {
          any: "Any",
          male: "Men",
          female: "Women",
        }
      },
      trust: {
        encrypted: "Encrypted Data",
        noPassword: "No Passwords",
        guarantee: "Full Guarantee",
      },
    },
    // Checkout Redesign
    checkout: {
      orderBump: {
        headline: "🚀 One-Time Offer: Priority Processing",
        copy: "Yes, add priority processing for $3.99.",
        price: "+$3.99",
      },
      mysteryUpsell: {
        title: "Wait! Do not close this page...",
        subtitle: "Our AI suggests boosting your order to maximize retention.",
        offer: "Get Double the Followers for only 50% of the cost?",
        ctaAccept: "Yes, Upgrade My Order Instantly",
        ctaReject: "No thanks, I'll keep my small growth",
      },
      visualValidator: {
        valid: "Account Found",
        checking: "Validating with AI...",
      },
      paymentButton: {
        text: "Start Growth Now",
        subtext: "Guaranteed Delivery within 24h",
      },
      noPassword: "🔒 We never ask for your password",
      secureLogos: "100% Secure & Encrypted Payments",
      legal: {
        title: "Terms of Service & Refund Policy",
        checkbox: "I agree to the Terms of Service and understand that this purchase is non-refundable.",
        sections: {
          refund: {
            title: "1. NO-REFUND POLICY",
            content: "Due to the nature of digital marketing services and intangible goods, Trend Digital Trade (TDT) does not offer monetary refunds once the order processing has begun.\n\nDigital Nature: You acknowledge that by purchasing a plan, you are paying for a digital promotional campaign that consumes server resources and ad spend immediately. These costs are non-recoverable.\n\nThe Remedy: In the event of followers dropping or delivery delays, TDT offers a 30-Day Free Refill Guarantee. We will restore any lost numbers automatically. Refills are the sole remedy; monetary refunds are not permitted."
          },
          chargeback: {
            title: "2. CHARGEBACK & DISPUTE CLAUSE",
            content: "By completing a purchase, you agree that you will not file a chargeback or dispute with your payment provider.\n\nBreach of Contract: Filing a dispute without contacting our support team first is considered a breach of these Terms.\n\nConsequences: In the event of an unauthorized chargeback, TDT reserves the right to:\n- Ban your account and IP address permanently.\n- Report your details to global merchant blacklists.\n- Remove all delivered followers/likes instantly using our reversal algorithm."
          },
          disclaimer: {
            title: "3. SERVICE DISCLAIMER",
            content: "TDT is an independent digital strategy agency and is not affiliated with Instagram, TikTok, or Meta.\n\nPlatform Updates: We are not responsible for damages, bans, or blocks caused by updates to Instagram/TikTok algorithms. You use our services at your own risk.\n\nDelivery Speed: Delivery times are estimates. 'Instant Start' implies the campaign setup begins immediately, but full delivery may take time to ensure organic safety."
          },
          cancellation: {
            title: "4. SUBSCRIPTION CANCELLATION",
            content: "You may cancel your monthly subscription at any time via your dashboard or by contacting support.\n\nTiming: Cancellations must be requested at least 24 hours before the next billing cycle.\n\nPartial Months: No refunds will be issued for partial months of service if you cancel mid-cycle. The service will continue until the end of the paid period."
          }
        }
      },
    },
    // Social Proof Ticker
    socialProofTicker: {
      analyzed: "analyzed their profile 🔍",
      requested: "requested strategy 📈",
      time: {
        min: "min",
        hour: "h",
        ago: "ago",
      },
    },
    // Impact Section
    impact: {
      lovedBy: "Loved by over 80,000 fans",
      title: "Dominate Your Niche",
      titleMiddle: "with Data-Driven Precision",
      titleEnd: "",
      cta: "Start Now",
      card: {
        followers: "Followers",
        growth: "Growth",
        reach: "Account reach",
        engagement: "Engagement",
        sales: "Monthly sales",
      }
    },
    // Checkout
    checkout: {
      title: "Complete Purchase",
      subtitle: "Enter your details to receive the service.",
      notFound: "Package not found",
      backToServices: "Back to Services",
      form: {
        email: "Your Email (for confirmation)",
        emailPlaceholder: "example@email.com",
        username: "Username / Channel Link",
        postLink: "Post / Video Link",
        publicAccount: "Make sure the account is public.",
        location: "Target Country / Location (Optional)",
        locationPlaceholder: "Ex: USA, Spain, Mexico...",
        segmentationHelp: "Help us better target your audience (if applicable).",
        fillAll: "Please complete all fields",
      },
      payment: {
        title: "Payment Method",
        crypto: "Crypto",
        whatsapp: "WhatsApp",
        transfer: "Transfer/Cash",
        secure: "100% Secure Payment",
        encrypted: "Encrypted and secure transaction",
        subtotal: "Subtotal",
        discountCrypto: "Crypto Discount (10%)",
        total: "Total to Pay",
        payCrypto: "Pay with Crypto",
        payWhatsapp: "Finish on WhatsApp",
      },
      whatsappMessage: "Hi! I want to order the service: {service} for {price}. Link: {link} Email: {email} {segmentation}",
    },
    // Footer
    footer: {
      tagline: "Boost your digital presence",
      terms: "Terms",
      privacy: "Privacy",
      contact: "Contact",
      login: "Login",
      refundPolicy: "Refund Policy",
      copyright: "All rights reserved.",
      professional: {
        description: "The leading platform for organic Instagram growth. Over 80,000 clients trust us.",
        products: "Product",
        company: "Company",
        legal: "Legal",
        securePayment: "🔒 100% Secure & Encrypted Payments",
        rights: "All rights reserved.",
        madeWith: "Made with ❤️ in Argentina",
        features: "Features",
        pricing: "Pricing",
        cases: "Success Cases",
        testimonials: "Testimonials",
        about: "About Us",
        blog: "Blog",
        careers: "Careers",
        press: "Press",
        terms: "Terms of Service",
        privacy: "Privacy Policy",
        cookies: "Cookies Policy",
        gdpr: "GDPR",
        paymentMethods: "Accepted payment methods:"
      },
    },
    footer_v2: {
      tagline: "Boost your digital presence",
      terms: "Terms",
      privacy: "Privacy",
      contact: "Contact",
      login: "Login",
      refundPolicy: "Refund Policy",
      copyright: "All rights reserved."
    },
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
    // Pricing
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
        advisor: "<b>Growth Consultant</b>",
        cta: "Choose Premium ⭐",
        bonus: "(+Bonus)",
      },
      moreSpecific: "Looking for something more specific?",
      viewAll: "See all available services and options",
    },
    // Custom Plan Page (Services)
    plan: {
      title: "Your",
      titleHighlight: "Custom Plan",
      subtitle: "Based on your profile:",
      normal: {
        title: "Standard Plan",
        subtitle: "Steady and safe growth",
        cta: "Select Standard",
      },
      premium: {
        title: "Premium Plan",
        subtitle: "Accelerated growth with AI",
        cta: "Select Premium",
        badge: "⚡ RECOMMENDED",
        bonus: "+20% free bonus followers",
      },
      features: {
        delivery: (days: string) => `Delivery in <strong>${days}</strong>`,
        deliveryNormal: "7-10 days",
        deliveryPremium: "2-4 days",
        deliverySpeedPremium: "(3x faster)",
        realFollowers: "Real and active followers",
        premiumFollowers: "High-quality premium followers",
        supportEmail: "Email support (24-48h)",
        supportPriority: "Priority support 24/7 (WhatsApp)",
        guarantee30: "30-day refill guarantee",
        guarantee90: "90-day refill guarantee",
        engagementNormal: "Moderate engagement (2-5% likes)",
        engagementHigh: "High engagement (8-15% likes + comments)",
      },
      visualization: {
        title: "📈 Visualize Your Month-to-Month Growth",
        subtitle: "Estimated projection with Premium Plan",
        month: "Month",
        disclaimer: "* Projection based on organic growth + TDT services. Results may vary based on content and engagement.",
      },
      trust: {
        secure: "100% Secure",
        real: "Real Followers",
        noBots: "No Bots",
        guarantee: "Full Guarantee",
      },
      back: "Back",
    },
  },
  pt: {
    // Hero
    hero: {
      badgeChristmas: "🎄 O Natal chegou à TDT",
      badgeNewYear: "🎉 Oferta de Ano Novo",
      badge: "🎄 O Natal chegou à TDT",
      title: "Vença o Algoritmo e Conecte-se com",
      titleHighlight: "Públicos Reais",
      titleEnd: "usando IA",
      subtitle:
        "Sem bots, sem contas falsas. Apenas crescimento orgânico segmentado por gênero e localização em tempo recorde.",
      problem: "Cansado do algoritmo esconder sua conta?",
      solution: "TDT usa Inteligência Artificial para colocar seu conteúdo na frente de pessoas reais interessadas em conteúdo como o seu. Apenas selecione gênero, localização do público-alvo, e nossa IA cuida do resto.",
      solutionHighlight: "Você começará a ver crescimento real em horas.",
      trustBadge: "Não são bots ou contas falsas. São pessoas reais.",
      trustLine: "Amado por mais de *80.000* fãs",
      guarantee: "💯 Garantia de satisfação ou seu dinheiro de volta",
      cta: "Impulsionar minha conta com IA →",
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
        "Se você perder seguidores, repomos automaticamente sem custo adicional. Seu investimento está 100% protegida.",
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
        refundDesc: "Sem perguntas em 30 dias",
      },
    },
    // Testimonials Section Header
    testimonialsSection: {
      badge: "Amor dos clientes",
      title: "Clientes amam nossa ferramenta de crescimento",
      subtitle: "Veja por que influenciadores e marcas confiam na TDT para seu crescimento no Instagram.",
    },
    // New Features / Benefits Section
    features: {
      header: {
        main: "Tecnologia IA + Estrategistas de Marketing =",
        highlight: "Crescimento Rápido e Fácil 🚀",
      },
      badge: "Impulsionado por IA",
      title: "Sem seguidores falsos ou bots",
      subtitle: "Apenas crescimento inteligente no Instagram. Você verá crescimento imediato graças à tecnologia de IA da TDT.",
      list: [
        {
          title: "Sem Táticas de Spam",
          description: "Não dependa de automação e bots. TDT garante novos fãs autênticos que realmente apreciam e interagem com seu conteúdo.",
        },
        {
          title: "Crescimento Constante",
          description: "Veja seu contador de seguidores crescer todo dia sem trabalho da sua parte. Trabalhamos 24/7 para crescer sua conta.",
        },
        {
          title: "Crescimento Sem Riscos",
          description: "TDT nunca pede sua senha do IG. Estamos em total conformidade com as diretrizes do Instagram.",
        },
        {
          title: "Novos Seguidores Engajados",
          description: "TDT garante que seus seguidores não apenas sigam e deixem de seguir, mas que aproveitem o que você compartilha.",
        },
        {
          title: "Não Perca Tempo ou Dinheiro",
          description: "Por que pagar por uma equipe de marketing inteira quando a TDT cresce sua conta melhor? Foque em criar conteúdo.",
        },
        {
          title: "Modelos de Crescimento IA",
          description: "Uma vez que você nos dá seus filtros de segmentação, sente-se e deixe a tecnologia da TDT encontrar os seguidores certos.",
        },
      ]
    },
    // Testimonials

    // Testimonials
    testimonials: [
      {
        name: "Alexander K.",
        role: "🇩🇪 Germany",
        comment: "The precision of the GPT-4o targeting is impressive. I’ve seen a 20% increase in organic reach from high-quality European audiences.",
        rating: 5,
      },
      {
        name: "Sarah Jenkins",
        role: "🇺🇸 USA",
        comment: "Safety was my main concern, but TDT's no-password policy won me over. My community is growing with real, active users.",
        rating: 5,
      },
      {
        name: "Yuki Tanaka",
        role: "🇯🇵 Japan",
        comment: "Finally, a tool that understands global demographics. The AI helped me connect with art enthusiasts worldwide.",
        rating: 5,
      },
      {
        name: "Mateo Ricci",
        role: "🇮🇹 Italy",
        comment: "Switched to TDT after trying several SMM panels that failed. The difference is night and day; this is real AI-driven growth.",
        rating: 5,
      },
      {
        name: "Chloe Lefebvre",
        role: "🇫🇷 France",
        comment: "Setting up my goals took less than 5 minutes. The AI handles the rest perfectly. It’s the most seamless scaling experience.",
        rating: 5,
      },
      {
        name: "Liam O’Connor",
        role: "🇮🇪 Ireland",
        comment: "As a brand owner, I need results, not bots. TDT delivered a highly engaged audience that actually converts into web traffic.",
        rating: 5,
      },
      {
        name: "Amira Al-Sayed",
        role: "🇦🇪 UAE",
        comment: "The best investment for my digital presence. The targeting options for location and interests are incredibly accurate.",
        rating: 5,
      },
      {
        name: "Lucas Silva",
        role: "🇧🇷 Brazil",
        comment: "Incrível! A tecnologia GPT-4o realmente faz a diferença. O crescimento é orgânico e constante. Suporte nota 10.",
        rating: 5,
      },
      {
        name: "Oliver Smith",
        role: "🇬🇧 UK",
        comment: "Professional, secure, and effective. TDT is now an essential part of my marketing stack for all my client profiles.",
        rating: 5,
      },
      {
        name: "Elena Kostas",
        role: "🇬🇷 Greece",
        comment: "Fast results without compromising account safety. It’s rare to find a service that actually follows through on its promises.",
        rating: 5,
      },
    ],
    // How it works
    howItWorks: {
      badge: "Como funciona?",
      title: "Planos personalizados para",
      titleHighlight: "crescimento orgânico",
      subtitle: "Em apenas 3 passos simples você estará no caminho para crescer sua audiência",
      steps: [
        {
          title: "1. Defina seus objetivos",
          description: "Use nossas opções avançadas de segmentação para encontrar os seguidores que você deseja por idade, demografia, localização, gênero, etc.",
        },
        {
          title: "2. Execução com IA",
          description: "TDT usa aprendizado de máquina, GPT4o e estrategistas especialistas para promover seu conteúdo aos usuários certos organicamente.",
        },
        {
          title: "3. Crescimento Segmentado",
          description: "Você obterá seguidores segmentados que interagem com seu conteúdo com base em seu nicho, resultando em maior retenção e engajamento genuíno.",
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
      professional: {
        description: "A plataforma líder em crescimento orgânico no Instagram. Mais de 80.000 clientes confiam em nós.",
        products: "Produto",
        company: "Empresa",
        legal: "Legal",
        securePayment: "🔒 Pagamentos 100% seguros e criptografados",
        rights: "Todos os direitos reservados.",
        madeWith: "Feito com ❤️ na Argentina",
        features: "Características",
        pricing: "Preços",
        cases: "Casos de Sucesso",
        testimonials: "Depoimentos",
        about: "Sobre Nós",
        blog: "Blog",
        careers: "Carreiras",
        press: "Imprensa",
        terms: "Termos de Serviço",
        privacy: "Política de Privacidade",
        cookies: "Política de Cookies",
        gdpr: "GDPR",
        paymentMethods: "Métodos de pagamento aceitos:"
      }
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
      title: "Domina tu Nicho",
      titleMiddle: "con Precisión Basada en Datos",
      titleEnd: "",
      cta: "Empezar Ahora",
      card: {
        followers: "Seguidores",
        growth: "Crescimento",
        reach: "Alcance da conta",
        engagement: "Engajamento",
        sales: "Vendas mensais",
      }
    },
    // Checkout
    checkout: {
      title: "Finalizar Compra",
      subtitle: "Preencha seus dados para receber o serviço.",
      notFound: "Pacote não encontrado",
      backToServices: "Voltar aos Serviços",
      form: {
        email: "Seu E-mail (para confirmação)",
        emailPlaceholder: "exemplo@email.com",
        username: "Nome de usuário / Link do canal",
        postLink: "Link da publicação / vídeo",
        publicAccount: "Certifique-se de que a conta é pública.",
        location: "País / Localização do público (Opcional)",
        locationPlaceholder: "Ex: EUA, Brasil, Portugal...",
        segmentationHelp: "Ajude-nos a segmentar melhor seu público (se aplicável).",
        fillAll: "Por favor, preencha todos os campos",
      },
      payment: {
        title: "Método de Pagamento",
        crypto: "Cripto",
        whatsapp: "WhatsApp",
        transfer: "Transferência/Dinheiro",
        secure: "Pagamento 100% Seguro",
        encrypted: "Transação criptografada e segura",
        subtotal: "Subtotal",
        discountCrypto: "Desconto Cripto (10%)",
        total: "Total a Pagar",
        payCrypto: "Pagar com Cripto",
        payWhatsapp: "Finalizar no WhatsApp",
      },
      whatsappMessage: "Olá! Quero contratar o serviço: {service} por {price}. Link: {link} Email: {email} {segmentation}",
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
    // Custom Plan Page (Services)
    plan: {
      title: "Seu Plano",
      titleHighlight: "Personalizado",
      subtitle: "Baseado no seu perfil:",
      normal: {
        title: "Plano Normal",
        subtitle: "Crescimento constante e seguro",
        cta: "Selecionar Normal",
      },
      premium: {
        title: "Plano Premium",
        subtitle: "Crescimento acelerado com IA",
        cta: "Selecionar Premium",
        badge: "⚡ RECOMENDADO",
        bonus: "+20% seguidores bônus grátis",
      },
      features: {
        delivery: (days: string) => `Entrega em <strong>${days}</strong>`,
        deliveryNormal: "7-10 dias",
        deliveryPremium: "2-4 dias",
        deliverySpeedPremium: "(3x mais rápido)",
        realFollowers: "Seguidores reais e ativos",
        premiumFollowers: "Seguidores premium de alta qualidade",
        supportEmail: "Suporte por e-mail (24-48h)",
        supportPriority: "Suporte prioritário 24/7 (WhatsApp)",
        guarantee30: "Garantia de reposição 30 dias",
        guarantee90: "Garantia de reposição 90 dias",
        engagementNormal: "Engajamento moderado (2-5% curtidas)",
        engagementHigh: "Engajamento alto (8-15% curtidas + comentários)",
      },
      visualization: {
        title: "📈 Visualize seu Crescimento Mês a Mês",
        subtitle: "Projeção estimada com Plano Premium",
        month: "Mês",
        disclaimer: "* Projeção baseada em crescimento orgânico + serviços TDT. Resultados podem variar conforme o conteúdo e engajamento.",
      },
      trust: {
        secure: "100% Seguro",
        real: "Seguidores Reais",
        noBots: "Sem Bots",
        guarantee: "Garantia Total",
      },
      back: "Voltar",
    },
    direct: {
      title: "Precisa de um impulso rápido? Explore soluções individuais.",
      bestSeller: "Mais Vendido",
      instant: "Início Instantâneo",
    },
    footer_v2: {
      tagline: "Impulsione sua presença digital",
      terms: "Termos",
      privacy: "Privacidade",
      contact: "Contato",
      login: "Entrar",
      refundPolicy: "Política de Reembolso",
      copyright: "Todos os direitos reservados."
    },
  },
}

