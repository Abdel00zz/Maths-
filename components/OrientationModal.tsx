
import React, { useState, useMemo } from 'react';
import { Modal } from './ui/LayoutComponents';
import { Icon } from './ui/Base';
import { MathRenderer } from './MathRenderer';

interface Chapter {
    id: number;
    section: string;
    title: string;
    contents: string[];
    capacities: string[];
}

// Données 1BSM
const CHAPTERS_1BSM: Chapter[] = [
    // Algèbre
    {
        id: 7, section: 'Algèbre', title: 'Notions de logique',
        contents: [
            'Propositions ; opérations sur les propositions ; fonctions propositionnelles ;',
            'Les quantificateurs ; les propositions quantifiées ; les lois logiques.',
            'Les raisonnements mathématiques : raisonnement par l\'absurde; raisonnement par contraposée ; raisonnement par disjonction des cas; raisonnement par équivalence; raisonnement par récurrence.'
        ],
        capacities: [
            'Transformer un énoncé mathématique en écriture symbolique en utilisant les connecteurs et les quantificateurs logiques et inversement ;',
            'Utiliser le type de raisonnement convenable selon la situation étudiée ;',
            'Rédiger des raisonnements et des démonstrations mathématiques claires et logiquement correctes.'
        ]
    },
    {
        id: 8, section: 'Algèbre', title: 'Les ensembles',
        contents: [
            'Définition d\'un ensemble par compréhension et par extension, partie d\'un ensemble ;',
            'Ensemble des parties d\'un ensemble ; la notation $P(E)$;',
            'Inclusion; égalité; complémentaire ;',
            'Intersection, réunion et différence de deux ensembles, lois de Morgan ;',
            'Propriétés de l\'intersection et de la réunion ;',
            'Produit cartésien de deux ensembles.'
        ],
        capacities: [
            'Déterminer un ensemble par compréhension ou par extension ;',
            'Maitriser la relation entre les règles de la logique et les opérations sur les ensembles.'
        ]
    },
    {
        id: 9, section: 'Algèbre', title: 'Les applications',
        contents: [
            'Egalité de deux applications',
            'Image et image réciproque d\'une partie par une application;',
            'Application injective, application surjective; application bijective; application réciproque d\'une bijection;',
            'Composée de deux applications ;',
            'Restriction et prolongement d\'une application.'
        ],
        capacities: [
            'Déterminer l\'image et l\'image réciproque d\'un ensemble par une application;',
            'Déterminer la bijection et la bijection réciproque d\'une application et son utilisation dans la résolution de problèmes ;',
            'Déterminer la composée de deux applications et la décomposition d\'une application en deux applications en vue d\'explorer ses propriétés.'
        ]
    },
    {
        id: 10, section: 'Algèbre', title: 'Arithmétique dans $\\mathbb{Z}$',
        contents: [
            'La division euclidienne et ses propriétés ;',
            'Les nombres premiers ; la décomposition en produit de facteurs premiers ;',
            'Le plus petit commun multiple (PPCM ; $a \\lor b$ ); le plus grand commun diviseur (PGCD ; $a \\land b$ ) ; propriétés ;',
            'Algorithme d\'Euclide ;',
            'Congruence modulo n ; l\'ensemble $\\mathbb{Z} / n\\mathbb{Z}$ et opérations.'
        ],
        capacities: [
            'Appliquer l\'algorithme d\'Euclide pour la détermination du PGCD de deux nombres entiers ;',
            'Reconnaitre l\'ensemble $\\mathbb{Z}/n\\mathbb{Z}$ et les règles de calcul modulo n ;',
            'Utiliser la congruence modulo n dans l\'étude de la divisibilité et inversement.'
        ]
    },
    {
        id: 11, section: 'Algèbre', title: 'Dénombrement',
        contents: [
            'Ensemble fini; cardinal d\'un ensemble fini: la notation card;',
            'Principe général du dénombrement, cardinal du produit cartésien;',
            'Cardinal de l\'ensemble des applications d\'un ensemble fini vers un autre ensemble fini ;',
            'Cardinal de l\'ensemble des parties d\'un ensemble fini;',
            'Cardinal de la réunion et de l\'intersection de deux ensembles finis ;',
            'Nombre d\'arrangements; la notation $A_n^p$;',
            'Nombre de permutations ; la notation $n!$;',
            'Nombre de combinaisons ; la notation $C_n^p$;',
            'Propriétés des nombres $C_n^p$',
            'Formule du binôme.'
        ],
        capacities: [
            'Utiliser l\'arbre des choix dans des situations combinatoires;',
            'Utiliser le modèle combinatoire (ou de dénombrement) adéquat à la situation étudiée;',
            'Application du dénombrement dans la résolution de problèmes variés.'
        ]
    },
    // Analyse
    {
        id: 12, section: 'Analyse', title: 'Généralités sur les fonctions numériques',
        contents: [
            'Fonction majorée ; fonction minorée ; fonctions bornée ; fonction périodique ;',
            'Comparaison de deux fonctions, interprétation géométrique ;',
            'Extrémums d\'une fonction numérique ;',
            'Monotonie d\'une fonction numérique ;',
            'Composée de deux fonctions numériques;',
            'Monotonie de la composée de deux fonctions numériques monotones ;',
            'Représentation graphique des fonctions : $x \\mapsto \\sqrt{x+a}$, $x \\mapsto ax^3$ et $x \\mapsto E(x)$.'
        ],
        capacities: [
            'Comparer deux expressions en utilisant différentes techniques ;',
            'Déduire les variations ou les extrémums ou le signe d\'une fonction à partir de sa représentation graphique ou à partir de son tableau de variation ;',
            'Déterminer les variations des fonctions $f + \\lambda$ et $\\lambda f$ à partir des variations de la fonction $f$ ;',
            'Discuter les solutions d\'une équation de type $f(x)=c$ et $f(x) = g(x)$ à partir de la représentation graphique ;',
            'Etude d\'équations et d\'inéquations en utilisant et en représentant les fonctions.'
        ]
    },
    {
        id: 13, section: 'Analyse', title: 'Généralités sur les suites numériques',
        contents: [
            'Suites numériques ; Suites récurrentes ;',
            'Suites majorées, suites minorées, suites bornées ;',
            'Monotonie d\'une suite ; Suites arithmétiques ; Suites géométriques.'
        ],
        capacities: [
            'Utiliser le raisonnement par récurrence;',
            'Etudier une suite numérique (majoration, minoration, monotonie);',
            'Reconnaitre une suite arithmétique ou géométrique ;',
            'Calculer la somme de n termes consécutifs d\'une suite arithmétique ou géométrique ;',
            'Reconnaitre une situation de suite arithmétique ou géométrique ;',
            'Utiliser une suite arithmétique ou géométrique pour résoudre des problèmes.'
        ]
    },
    {
        id: 14, section: 'Analyse', title: 'Trigonométrie',
        contents: [
            'Formules de transformation ; Transformation de l\'expression : $a \\cos x + b \\sin x$.'
        ],
        capacities: [
            'Maitriser les différentes formules de transformation ;',
            'Résoudre les équations et les inéquations trigonométriques se ramenant à la résolution d\'équations et d\'inéquations fondamentales;',
            'Représenter et lire les solutions d\'une équation et d\'une inéquation sur le cercle trigonométrique.'
        ]
    },
    {
        id: 15, section: 'Analyse', title: 'Limite d\'une fonction numérique',
        contents: [
            'Limite finie en un point; limite infinie en un point;',
            'Limite finie en $+\\infty$ et en $-\\infty$; limite infinie en $+\\infty$ et en $-\\infty$;',
            'Limite à gauche, limite à droite ; Opérations sur les limites ;',
            'Limites de fonction polynôme, de fonction rationnelle et limites de fonction de la forme $\\sqrt{f}$ où f est une fonction usuelle ;',
            'Les limites usuelles trigonométriques;',
            'Limites et ordre.'
        ],
        capacities: [
            'Calculer les limites des fonctions polynômes, des fonctions rationnelles et des fonctions irrationnelles ;',
            'Calculer les limites de fonctions trigonométriques simples en utilisant les limites usuelles ;',
            'Résoudre des inéquations de type $|f(x)-l| < \\varepsilon$ et de type $f(x) > A$.'
        ]
    },
    {
        id: 16, section: 'Analyse', title: 'Dérivation',
        contents: [
            'Dérivabilité en un point; nombre dérivé ; interprétation géométrique ; tangente à une courbe;',
            'Dérivabilité sur un intervalle; dérivée première; dérivée seconde ; dérivées successives ;',
            'Dérivation de $f+g$, $\\lambda f$, $f \\times g$, $1/g$, $f/g$, $f^n$, $f(ax+b)$ et $\\sqrt{f}$;',
            'Equation différentielle : $y\'\' + \\omega^2y = 0$.'
        ],
        capacities: [
            'Approcher une fonction au voisinage d\'un point;',
            'Reconnaitre que le nombre dérivée de la fonction en $x_0$ est le coefficient directeur de la tangente;',
            'Maitriser les techniques de calcul de la dérivée de fonctions ;',
            'Déterminer une équation de la tangente à une courbe en un point;',
            'Déterminer la monotonie d\'une fonction à partir de l\'étude du signe de sa dérivée ;',
            'Résoudre des problèmes concernant des valeurs minimales et des valeurs maximales.'
        ]
    },
    {
        id: 17, section: 'Analyse', title: 'Représentation graphique',
        contents: [
            'Branches infinies; droites asymptotes ; directions asymptotiques;',
            'Point d\'inflexion; concavité de la courbe d\'une fonction ;',
            'Eléments de symétrie de la courbe d\'une fonction.'
        ],
        capacities: [
            'Résoudre graphiquement des équations et des inéquations ;',
            'Utiliser la périodicité et les éléments de symétrie pour réduire le domaine d\'étude ;',
            'Utiliser le signe de la dérivée seconde pour étudier la concavité d\'une courbe.',
            'Etudier et représenter des fonctions polynômes, rationnelles et trigonométriques simples.'
        ]
    },
    // Géométrie
    {
        id: 1, section: 'Géométrie', title: 'Le barycentre dans le plan',
        contents: [
            'Barycentre de n points ($2 \\le n \\le 4$) ; centre de gravité ;',
            'Propriété caractéristique du barycentre; invariance; associativité ;',
            'Coordonnées du barycentre dans un repère donné.'
        ],
        capacities: [
            'Utiliser le barycentre pour simplifier une expression vectorielle ;',
            'Utiliser le barycentre pour établir l\'alignement de trois points ou l\'intersection de droites ;',
            'Construire le barycentre de n points;',
            'Utiliser le barycentre pour déterminer des lieux géométriques.'
        ]
    },
    {
        id: 2, section: 'Géométrie', title: 'Analytique du produit scalaire',
        contents: [
            'Expression analytique du produit scalaire, de la norme et de la distance.',
            'Expression de $\\cos \\theta$ et $\\sin \\theta$;',
            'La droite dans le plan et le cercle (Etude analytique) : Équations cartésiennes, paramétriques.',
            'Etude de la position relative d\'un cercle et d\'une droite ; tangente.'
        ],
        capacities: [
            'Exprimer le parallélisme et l\'orthogonalité de deux droites ;',
            'Utiliser le produit scalaire pour calculer des distances, des aires et des angles ;',
            'Déterminer le centre et le rayon d\'un cercle défini par une équation cartésienne ;',
            'Passer d\'une équation cartésienne à une représentation paramétrique et inversement.'
        ]
    },
    {
        id: 3, section: 'Géométrie', title: 'La rotation dans le plan',
        contents: [
            'Définition d\'une rotation; la rotation réciproque ;',
            'Propriétés : Conservation de la distance, des angles, du barycentre, du parallélisme et de l\'orthogonalité ;',
            'Image par une rotation de figures usuelles ;',
            'Composée de deux rotations.'
        ],
        capacities: [
            'Utiliser une rotation donnée dans une situation géométrique ;',
            'Construire les images de figures usuelles par une rotation donnée ;',
            'Reconnaitre une rotation et l\'utiliser pour résoudre des problèmes géométriques.'
        ]
    },
    {
        id: 4, section: 'Géométrie', title: 'Géométrie dans l\'espace',
        contents: [
            'Calcul vectoriel dans l\'espace; Vecteurs colinéaires et coplanaires.',
            'Coordonnées d\'un point et d\'un vecteur ; déterminant ;',
            'Représentation paramétrique et cartésienne de droites et de plans ;',
            'Positions relatives de droites et de plans.'
        ],
        capacities: [
            'Maitriser les règles du calcul vectoriel dans l\'espace ;',
            'Reconnaitre et exprimer la colinéarité et la coplanarité ;',
            'Exprimer les propriétés géométriques à l\'aide des coordonnées ;',
            'Choisir la représentation convenable pour étudier les positions relatives.'
        ]
    },
    {
        id: 5, section: 'Géométrie', title: 'Produit scalaire dans l\'espace',
        contents: [
            'Définition et propriétés ; Orthogonalité ; Repère orthonormé ;',
            'Expression analytique du produit scalaire ;',
            'Vecteur normal à un plan ; Équation cartésienne d\'un plan ;',
            'Distance d\'un point à un plan; Étude analytique de la sphère.'
        ],
        capacities: [
            'Utiliser le produit scalaire pour montrer l\'orthogonalité ;',
            'Déterminer un plan défini par un point et un vecteur normal ;',
            'Déterminer une équation cartésienne d\'une sphère ;',
            'Reconnaitre l\'ensemble des points M tels que : $\\vec{MA} \\cdot \\vec{MB} = 0$'
        ]
    },
    {
        id: 6, section: 'Géométrie', title: 'Produit vectoriel',
        contents: [
            'Orientation de l\'espace; trièdre ; repère orienté;',
            'Définition géométrique et propriétés (antisymétrie, bilinéarité) ;',
            'Coordonnées du produit vectoriel dans une base orthonormée directe ;',
            'Distance d\'un point à une droite.'
        ],
        capacities: [
            'Calculer l\'aire d\'un triangle en utilisant le produit vectoriel ;',
            'Déterminer une équation d\'un plan défini par trois points non alignés ;',
            'Appliquer le produit vectoriel dans la résolution de problèmes.'
        ]
    }
];

// Données 2BSE - Programme Officiel
const CHAPTERS_2BSE: Chapter[] = [
    // Analyse
    {
        id: 1, section: 'Analyse', title: 'Suites Numériques',
        contents: [
            'Limites des suites numériques de référence ($n$, $n^2$, $\\sqrt{n}$, $1/n$, etc.) ;',
            'Suite convergente ; Critères de convergence ;',
            'Opérations sur les limites ; Limites et ordre ;',
            'Suites récurrentes de la forme $u_{n+1} = f(u_n)$.'
        ],
        capacities: [
            'Utiliser les suites géométriques et arithmétiques pour étudier des exemples ;',
            'Utiliser les critères de convergence pour déterminer les limites ;',
            'Déterminer la limite d\'une suite convergente $u_{n+1} = f(u_n)$ où $f$ est continue sur $I$ et $f(I) \\subset I$.'
        ]
    },
    {
        id: 2, section: 'Analyse', title: 'Continuité et Étude de Fonctions',
        contents: [
            'Continuité en un point, sur un intervalle (polynômes, rationnelles, trigonométriques) ;',
            'Image d\'un segment ou d\'un intervalle par une fonction continue ;',
            'Théorème des valeurs intermédiaires  ;',
            'Fonction réciproque d\'une fonction continue strictement monotone ;',
            'Dérivée de la fonction composée et de la fonction réciproque ;',
            'Puissances rationnelles et dérivée de $x \\to \\sqrt[n]{x}$.'
        ],
        capacities: [
            'Appliquer le TVI pour l\'étude d\'équations ou de signes ;',
            'Utiliser la dichotomie pour des valeurs approchées ;',
            'Déterminer la monotonie d\'une fonction (dérivée, graphique) ;',
            'Étudier et représenter la fonction réciproque ;',
            'Étudier des fonctions irrationnelles simples.'
        ]
    },
    {
        id: 3, section: 'Analyse', title: 'Fonctions Primitives',
        contents: [
            'Fonctions primitives d\'une fonction continue sur un intervalle ;',
            'Primitives de sommes, produits par un réel ;',
            'Formules usuelles.'
        ],
        capacities: [
            'Déterminer les fonctions primitives des fonctions usuelles ;',
            'Utiliser les formules de dérivation (lecture croisée du tableau).'
        ]
    },
    {
        id: 4, section: 'Analyse', title: 'Fonctions Logarithmes',
        contents: [
            'Fonction logarithme népérien (ln) : définition, propriétés algébriques, étude ;',
            'Dérivée logarithmique ; Primitives de $u\'/u$ ;',
            'Fonction logarithme de base $a$ et logarithme décimal.'
        ],
        capacities: [
            'Maîtriser le calcul algébrique sur les logarithmes ;',
            'Résoudre équations, inéquations et systèmes avec logarithmes ;',
            'Maîtriser les limites logarithmiques essentielles ;',
            'Étudier et représenter des fonctions comportant le ln.'
        ]
    },
    {
        id: 5, section: 'Analyse', title: 'Fonctions Exponentielles',
        contents: [
            'Fonction exponentielle népérienne (exp) : définition, propriétés, nombre $e$ ;',
            'Primitives de $u\'e^u$ ;',
            'Fonction exponentielle de base $a$ ($a^x$).'
        ],
        capacities: [
            'Résoudre équations et inéquations avec exponentielles ;',
            'Maîtriser les limites fondamentales ;',
            'Étudier et représenter des fonctions avec exponentielles (et logarithmes).'
        ]
    },
    {
        id: 6, section: 'Analyse', title: 'Équations Différentielles',
        contents: [
            'Équation $y\' = ay + b$ ;',
            'Équation $y\'\' + ay\' + by = 0$ ;'
        ],
        capacities: [
            'Résoudre l\'équation $y\' = ay + b$ ;',
            'Résoudre l\'équation du second ordre ;',
            'Utiliser ces équations dans des situations de la spécialité (Physique, Chimie...).'
        ]
    },
    {
        id: 7, section: 'Analyse', title: 'Calcul Intégral',
        contents: [
            'Intégrale sur un segment ; Propriétés (Chasles, linéarité, ordre, valeur moyenne) ;',
            'Techniques : primitives, intégration par parties (IPP) ;',
            'Calcul d\'aires et de volumes.'
        ],
        capacities: [
            'Calculer l\'intégrale à l\'aide des primitives ou par IPP ;',
            'Calculer l\'aire d\'un domaine plan ;',
            'Calculer le volume d\'un solide de révolution.'
        ]
    },
    // Géométrie
    {
        id: 8, section: 'Géométrie', title: 'Produit Scalaire dans l\'Espace',
        contents: [
            'Définition, propriétés, repère orthonormé ;',
            'Expression analytique, norme, distance ;',
            'Plan (point + vecteur normal), Sphère (équation cartésienne et paramétrique) ;',
            'Positions relatives (Sphère/Plan, Sphère/Droite).'
        ],
        capacities: [
            'Déterminer un plan défini par un point et un vecteur normal ;',
            'Déterminer l\'équation d\'une sphère ;',
            'Étudier le parallélisme et l\'orthogonalité dans l\'espace.'
        ]
    },
    {
        id: 9, section: 'Géométrie', title: 'Produit Vectoriel',
        contents: [
            'Orientation, trièdre, définition géométrique ;',
            'Coordonnées dans une base orthonormée directe ;',
            'Distance d\'un point à une droite.'
        ],
        capacities: [
            'Calculer l\'aire d\'un triangle ;',
            'Déterminer l\'équation d\'un plan défini par trois points non alignés ;',
            'Appliquer le produit vectoriel pour résoudre des problèmes géométriques.'
        ]
    },
    // Algèbre (Nombres Complexes souvent classés ici ou à part)
    {
        id: 10, section: 'Algèbre', title: 'Nombres Complexes',
        contents: [
            'Écriture algébrique, conjugué, module, argument ;',
            'Forme trigonométrique et notation exponentielle ($e^{i\\theta}$) ;',
            'Interprétation géométrique (affixe, vecteur, angle, alignement) ;',
            'Transformations : translation, homothétie, rotation ;',
            'Équations du second degré dans $\\mathbb{C}$.'
        ],
        capacities: [
            'Maîtriser le calcul sur les complexes ;',
            'Passer entre les formes algébrique, trigonométrique et exponentielle ;',
            'Linéariser des polynômes trigonométriques ;',
            'Résoudre des problèmes géométriques (alignement, orthogonalité, cocyclicité) ;',
            'Résoudre l\'équation $az^2 + bz + c = 0$.'
        ]
    },
    // Probabilités
    {
        id: 11, section: 'Probabilités', title: 'Calcul de Probabilités',
        contents: [
            'Rappels de dénombrement ;',
            'Probabilité d\'un événement, équiprobabilité ;',
            'Probabilité conditionnelle, indépendance ;',
            'Variable aléatoire, loi de probabilité, espérance, variance ;',
            'Loi binomiale.'
        ],
        capacities: [
            'Calculer la probabilité d\'événements (réunion, intersection, contraire) ;',
            'Utiliser le modèle de dénombrement adéquat ;',
            'Reconnaître l\'indépendance ;',
            'Déterminer la loi d\'une variable aléatoire.'
        ]
    }
];

interface OrientationModalProps {
    isOpen: boolean;
    onClose: () => void;
    classId: string;
}

export const OrientationModal: React.FC<OrientationModalProps> = ({ isOpen, onClose, classId }) => {
    const [expandedChapter, setExpandedChapter] = useState<number | null>(null);
    
    // Détermine les données et les sections dynamiquement
    const { data, sections } = useMemo(() => {
        const chapters = classId === '2bse' ? CHAPTERS_2BSE : CHAPTERS_1BSM;
        
        // Extraire les sections uniques
        const uniqueSections = Array.from(new Set(chapters.map(c => c.section)));
        
        // Ordre préférentiel des onglets
        const sortOrder = ['Analyse', 'Algèbre', 'Géométrie', 'Probabilités'];
        uniqueSections.sort((a, b) => {
            const idxA = sortOrder.indexOf(a);
            const idxB = sortOrder.indexOf(b);
            return (idxA === -1 ? 99 : idxA) - (idxB === -1 ? 99 : idxB);
        });

        return { data: chapters, sections: uniqueSections };
    }, [classId]);

    const [activeSection, setActiveSection] = useState<string>(sections[0] || 'Analyse');

    // Update activeSection if sections change and current is invalid
    React.useEffect(() => {
        if (!sections.includes(activeSection) && sections.length > 0) {
            setActiveSection(sections[0]);
        }
    }, [sections, activeSection]);

    const groupedChapters = useMemo(() => {
        const groups: Record<string, Chapter[]> = {};
        sections.forEach(sec => {
            groups[sec] = data.filter(c => c.section === sec);
        });
        return groups;
    }, [data, sections]);

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`Programme Officiel ${classId.toUpperCase()}`}>
            <div className="space-y-8">
                {/* Onglets de Navigation */}
                <div className="flex flex-wrap gap-4 justify-center">
                    {sections.map(sec => (
                        <button 
                            key={sec}
                            onClick={() => setActiveSection(sec)}
                            className={`px-6 py-3 rounded-xl border-2 transition-all duration-300 text-center min-w-[120px] ${activeSection === sec ? 'bg-slate-900 border-slate-900 text-white shadow-lg' : 'bg-white border-slate-200 hover:border-slate-400'}`}
                        >
                            <div className={`text-lg font-black font-display mb-0.5 leading-none ${activeSection === sec ? 'text-white' : 'text-slate-900'}`}>
                                {groupedChapters[sec]?.length || 0}
                            </div>
                            <div className={`text-[10px] font-bold uppercase tracking-widest ${activeSection === sec ? 'text-slate-300' : 'text-slate-400'}`}>
                                {sec}
                            </div>
                        </button>
                    ))}
                </div>

                {/* Liste des chapitres */}
                <div className="space-y-4">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="h-px bg-slate-200 flex-1"></div>
                        <span className="text-xs font-bold uppercase tracking-widest text-slate-400 bg-slate-50 px-4 py-1 rounded-full border border-slate-100">
                            {activeSection}
                        </span>
                        <div className="h-px bg-slate-200 flex-1"></div>
                    </div>

                    {groupedChapters[activeSection]?.map((chap) => (
                        <div 
                            key={chap.id} 
                            className={`bg-white rounded-xl border-2 transition-all duration-300 overflow-hidden ${expandedChapter === chap.id ? 'border-slate-900 shadow-lg' : 'border-slate-100 hover:border-slate-300'}`}
                        >
                            {/* Header Chapitre */}
                            <div 
                                onClick={() => setExpandedChapter(expandedChapter === chap.id ? null : chap.id)}
                                className="p-5 cursor-pointer flex items-center justify-between gap-4"
                            >
                                <div className="flex items-center gap-4">
                                    <span className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold font-mono border-2 ${expandedChapter === chap.id ? 'bg-slate-900 text-white border-slate-900' : 'bg-slate-50 text-slate-500 border-slate-200'}`}>
                                        {String(chap.id).padStart(2, '0')}
                                    </span>
                                    <h4 className="font-display font-bold text-lg text-slate-900 leading-tight">
                                        <MathRenderer expression={chap.title} inline />
                                    </h4>
                                </div>
                                <Icon name={expandedChapter === chap.id ? "remove" : "add"} className="text-slate-400" />
                            </div>

                            {/* Détails Chapitre (Accordion) */}
                            <div className={`bg-slate-50 border-t border-slate-100 transition-all duration-500 ease-in-out ${expandedChapter === chap.id ? 'max-h-[1500px] opacity-100 p-6' : 'max-h-0 opacity-0 py-0 overflow-hidden'}`}>
                                <div className="grid md:grid-cols-2 gap-8">
                                    <div>
                                        <div className="flex items-center gap-2 mb-4 text-blue-700">
                                            <Icon name="menu_book" className="text-lg" />
                                            <span className="text-xs font-bold uppercase tracking-widest">Contenus</span>
                                        </div>
                                        <ul className="space-y-3">
                                            {chap.contents.map((c, i) => (
                                                <li key={i} className="flex items-start gap-3 text-sm text-slate-600 leading-relaxed">
                                                    <span className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-1.5 flex-shrink-0"></span>
                                                    <span><MathRenderer expression={c} inline /></span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2 mb-4 text-emerald-700">
                                            <Icon name="psychology" className="text-lg" />
                                            <span className="text-xs font-bold uppercase tracking-widest">Capacités attendues</span>
                                        </div>
                                        <ul className="space-y-3">
                                            {chap.capacities.map((c, i) => (
                                                <li key={i} className="flex items-start gap-3 text-sm text-slate-600 leading-relaxed">
                                                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full mt-1.5 flex-shrink-0"></span>
                                                    <span><MathRenderer expression={c} inline /></span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </Modal>
    );
};
