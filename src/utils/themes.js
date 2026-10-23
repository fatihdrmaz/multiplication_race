export const THEMES = {
    jungle: {
        id: 'jungle',
        name: 'Vahşi Orman',
        emoji: '🌴',
        backgroundColors: ['#87CEEB', '#E0F6FF'], // Gökyüzü mavisi
        trackEnvironment: {
            colors: ['#2C1810', '#1A0F0A'], // Toprak
            dividerColor: '#FFD700',
            laneColor: 'rgba(139, 115, 85, 0.4)',
        },
        items: {
            clouds: ['☁️', '🌤️'],
            mountains: '🏔️',
            topDecor: ['🌴', '🌳', '🦜', '🍃'],
            bottomDecor: ['🌿', '🪨', '🍄', '🌺'],
        }
    },
    city: {
        id: 'city',
        name: 'Neon Şehir',
        emoji: '🏙️',
        backgroundColors: ['#0f0c29', '#302b63', '#24243e'], // Gece moru
        trackEnvironment: {
            colors: ['#2C3E50', '#1A252F'], // Asfalt
            dividerColor: '#00FF00', // Neon yeşil
            laneColor: 'rgba(255, 255, 255, 0.1)',
        },
        items: {
            clouds: ['🌙', '⭐'],
            mountains: '🏢', // Bina silüeti
            topDecor: ['🏢', '🏬', '🚁', '🏮'],
            bottomDecor: ['🚦', '🚏', '🚧', '⛽'],
        }
    },
    space: {
        id: 'space',
        name: 'Uzay Yolu',
        emoji: '🌌',
        backgroundColors: ['#000000', '#434343'], // Uzay siyahı
        trackEnvironment: {
            colors: ['#111111', '#000000'], // Koyu metal
            dividerColor: '#00FFFF', // Neon mavi
            laneColor: 'rgba(0, 255, 255, 0.1)',
        },
        items: {
            clouds: ['🪐', '☄️'],
            mountains: '🌑',
            topDecor: ['🛸', '🚀', '⭐', '👾'],
            bottomDecor: ['💎', '🌌', '🌠', '🤖'],
        }
    },
    desert: {
        id: 'desert',
        name: 'Kızgın Çöl',
        emoji: '🏜️',
        backgroundColors: ['#FF512F', '#F09819'], // Gün batımı
        trackEnvironment: {
            colors: ['#D2691E', '#8B4513'], // Kum
            dividerColor: '#FFF',
            laneColor: 'rgba(255, 255, 255, 0.2)',
        },
        items: {
            clouds: ['🦅', '☀️'],
            mountains: '🐫',
            topDecor: ['🌵', '🏜️', '🦂', '🦅'],
            bottomDecor: ['🦴', '🪨', '🦎', '🐍'],
        }
    }
};
