

// LaTeX / Academic Style Config
// Uniform badges: Black background, White text.

export interface BoxConfig {
    title: string;
    styles: {
        containerBorder: string; // Main border style
        badgeClass: string; // Style for the title badge
        bodyFont: string; // Font class for the content
    };
}

export const PATTERNS = {
    noise: "bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPjxyZWN0IHdpZHRoPSI0IiBoZWlnaHQ9IjQiIGZpbGw9InRyYW5zcGFyZW50Ii8+PHJlY3Qgd2lkdGg9IjEiIGhlaWdodD0iMSIgZmlsbD0iIzAwMCIgZmlsbC1vcGFjaXR5PSIwLjAzIi8+PC9zdmc+')]",
};

const COMMON_BADGE = "bg-slate-900 text-white px-3 py-1 text-xs font-bold uppercase tracking-widest inline-block shadow-sm select-none";

export const BOX_TYPES: Record<string, BoxConfig> = {
    'definition-box': {
        title: "Définition",
        styles: { 
            containerBorder: "border-2 border-slate-200 bg-white",
            badgeClass: COMMON_BADGE,
            bodyFont: "font-body text-slate-800 text-[0.95rem]", 
        }
    },
    'property-box': {
        title: "Propriété",
        styles: { 
            containerBorder: "border-2 border-slate-200 bg-white",
            badgeClass: COMMON_BADGE,
            bodyFont: "font-body text-slate-800",
        }
    },
    'example-box': {
        title: "Exemple",
        styles: { 
            containerBorder: "border-2 border-dashed border-slate-300 bg-slate-50/30",
            badgeClass: COMMON_BADGE,
            bodyFont: "font-body text-slate-700 text-sm", 
        }
    },
    'theorem-box': {
        title: "Théorème",
        styles: { 
            containerBorder: "border-2 border-slate-900 bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]",
            badgeClass: COMMON_BADGE,
            bodyFont: "font-body text-slate-900 text-base leading-relaxed font-medium", 
        }
    },
    'method-box': {
        title: "Méthode",
        styles: { 
            containerBorder: "border-2 border-dashed border-slate-400 bg-white",
            badgeClass: COMMON_BADGE,
            bodyFont: "font-body",
        }
    },
    'activity-box': {
        title: "Activité",
        styles: {
            containerBorder: "border-2 border-slate-200 bg-white",
            badgeClass: COMMON_BADGE,
            bodyFont: "font-body",
        }
    },
    'demo-box': {
        title: "Démonstration",
        styles: {
            containerBorder: "zigzag-left bg-slate-50/50 py-2 pr-4",
            badgeClass: COMMON_BADGE,
            bodyFont: "font-academic italic text-slate-700",
        }
    },
    'consequence-box': {
        title: "Conséquence",
        styles: {
            containerBorder: "border-2 border-slate-900 bg-white",
            badgeClass: COMMON_BADGE,
            bodyFont: "font-body",
        }
    },
    'proof-box': {
        title: "Preuve",
        styles: { 
            containerBorder: "zigzag-left bg-slate-50/50 py-2 pr-4",
            badgeClass: COMMON_BADGE,
            bodyFont: "font-academic text-slate-700",
        }
    },
    'remark-box': {
        title: "Remarque",
        styles: {
            containerBorder: "border-2 border-slate-200 bg-slate-50",
            badgeClass: COMMON_BADGE,
            bodyFont: "font-body text-sm",
        }
    },
    'warning-box': {
        title: "Attention",
        styles: {
            containerBorder: "border-2 border-rose-500 bg-rose-50/30",
            badgeClass: "bg-rose-600 text-white px-3 py-1 text-xs font-bold uppercase tracking-widest inline-block shadow-sm select-none",
            bodyFont: "font-body text-sm text-rose-900",
        }
    }
};