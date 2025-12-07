// Location and Interest data for El Faro selectors

export const LOCATIONS = [
    { id: "us", name: "Estados Unidos", flag: "🇺🇸", region: "North America" },
    { id: "latam", name: "Latinoamérica", flag: "🌎", region: "Latin America" },
    { id: "europe", name: "Europa", flag: "🇪🇺", region: "Europe" },
    { id: "asia", name: "Asia", flag: "🌏", region: "Asia" },
    { id: "emirates", name: "Emiratos Árabes", flag: "🇦🇪", region: "Middle East" },
    { id: "global", name: "Global", flag: "🌍", region: "Worldwide" },
] as const

export const INTERESTS = [
    { id: "fashion", name: "Moda", icon: "👗", color: "from-pink-500 to-purple-500" },
    { id: "art", name: "Arte", icon: "🎨", color: "from-purple-500 to-indigo-500" },
    { id: "business", name: "Negocios", icon: "💼", color: "from-blue-500 to-cyan-500" },
    { id: "trading", name: "Trading", icon: "📈", color: "from-green-500 to-emerald-500" },
    { id: "fitness", name: "Fitness", icon: "💪", color: "from-orange-500 to-red-500" },
    { id: "sports", name: "Deportes", icon: "⚽", color: "from-red-500 to-orange-500" },
    { id: "motherhood", name: "Maternidad", icon: "👶", color: "from-pink-400 to-rose-400" },
    { id: "agriculture", name: "Agricultura", icon: "🌾", color: "from-green-600 to-lime-500" },
    { id: "food", name: "Comida", icon: "🍔", color: "from-yellow-500 to-orange-500" },
    { id: "travel", name: "Viajes", icon: "✈️", color: "from-sky-500 to-blue-500" },
    { id: "tech", name: "Tecnología", icon: "💻", color: "from-slate-600 to-gray-500" },
    { id: "lifestyle", name: "Lifestyle", icon: "✨", color: "from-violet-500 to-purple-500" },
] as const

export const GENDERS = [
    { id: "any", name: "Cualquiera", icon: "👥" },
    { id: "male", name: "Hombres", icon: "👨" },
    { id: "female", name: "Mujeres", icon: "👩" },
] as const

export type LocationId = typeof LOCATIONS[number]["id"]
export type InterestId = typeof INTERESTS[number]["id"]
export type GenderId = typeof GENDERS[number]["id"]
