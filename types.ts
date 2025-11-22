

// --- Curriculum Types ---
export interface CurriculumChapter {
    id: string;
    title: string;
    isActive: boolean;
    version: string;
    session_dates?: string[]; // Array of ISO 8601 strings (e.g., "2025-11-20T14:00:00Z")
}

export interface CurriculumLevel {
    title: string;
    chapters: CurriculumChapter[];
}

export interface Curriculum {
    version: string;
    levels: {
        [key: string]: CurriculumLevel;
    };
}

// --- Lesson Content Types ---
export interface LessonImage {
    src: string;
    alt: string;
    caption?: string;
    position?: 'left' | 'right' | 'center'; // Intelligent positioning
    width?: string; // CSS width (e.g., "50%", "300px")
    allowZoom?: boolean; // Click to expand
    transparent?: boolean; // For SVGs/PNGs with transparency (removes shadows/borders)
    border?: boolean; // Force border
}

export interface GraphFunction {
    fn: string;
    color?: string;
    graphType?: string; // 'polyline', 'scatter', etc.
}

export interface Graph2DConfig {
    functions: GraphFunction[];
    xDomain?: [number, number];
    yDomain?: [number, number];
    grid?: boolean;
    title?: string;
}

export interface GeoGebraConfig {
    materialId?: string; // ID from GeoGebra Tube
    appName?: 'graphing' | 'geometry' | 'classic' | '3d'; // Default app
    width?: number;
    height?: number;
    showMenuBar?: boolean;
    showToolBar?: boolean;
    showAlgebraInput?: boolean;
    enableShiftDragZoom?: boolean;
    borderColor?: string;
    commands?: string[]; // Commands to execute on load
    title?: string; // Caption
}

export interface TableRow {
    cells: string[];
    isHeader?: boolean;
}

export interface LessonElement {
    type: 'definition-box' | 'example-box' | 'practice-box' | 'remark-box' | 'property-box' | 'theorem-box' | 'method-box' | 'proof-box' | 'activity-box' | 'demo-box' | 'consequence-box' | 'warning-box' | 'p' | 'table' | 'image' | 'graph-2d' | 'geogebra';
    title?: string; // Title of the box (displayed in header)
    preamble?: string; // Introductory text (displayed in header if no title, or body)
    content?: string | string[];
    statement?: string;
    solution?: string[];
    listType?: 'bullet' | 'numbered';
    columns?: number;
    image?: LessonImage; // Embedded image in a box
    tableData?: TableRow[];
    graph2d?: Graph2DConfig;
    geogebra?: GeoGebraConfig;
}

export interface LessonSubsection {
    title: string;
    elements: LessonElement[];
}

export interface LessonSection {
    title: string;
    subsections: LessonSubsection[];
}

export interface LessonHeader {
    title: string;
    subtitle: string;
    classe: string;
    chapter: string;
    academicYear: string;
}

export interface LessonData {
    header: LessonHeader;
    sections: LessonSection[];
}

// --- Quiz & Exercises Types ---
export interface QuizOption {
    text: string;
    is_correct: boolean;
    explanation: string;
}

export interface QuizQuestion {
    id: string;
    question: string;
    type: 'mcq';
    options: QuizOption[];
    steps?: any[];
}

export interface SubSubQuestion {
    text: string;
    image?: LessonImage; // Added Image support
}

export interface SubQuestion {
    text: string;
    questionNumber?: string;
    sub_sub_questions?: SubSubQuestion[];
    image?: LessonImage; // Added Image support
}

export interface Exercise {
    id: string;
    title: string;
    statement: string;
    images?: LessonImage[]; // Global images for the exercise statement
    sub_questions: SubQuestion[];
    hint?: { text: string; questionNumber: string }[];
    solution?: string[]; 
}

// --- State & Progress Types ---

export type ExerciseFeedback = 'Facile' | 'Moyen' | 'Difficile' | 'pending';

export interface LessonProgress {
    isRead: boolean; 
    percentage: number; 
    checkedSections: string[]; 
    totalSections: number; // Added for JSON export
    highlights: string[]; 
    revealedBlanks: string[]; 
}

export interface QuizProgress {
    isSubmitted: boolean;
    score: number; // Percentage
    scoreRaw: number; // Number of correct answers
    totalQuestions: number; // Total questions
    attempts: number;
    durationSeconds: number;
    hintsUsed: number;
    answers: Record<string, number>; // QuestionID -> OptionIndex
}

export interface ExercisesProgress {
    feedbackMap: Record<string, ExerciseFeedback>; // exerciseId -> Feedback
    durationSeconds: number;
    lastActive: number; // Timestamp for duration calc
}

export interface ChapterProgress {
    lesson: LessonProgress;
    quiz: QuizProgress;
    exercises: ExercisesProgress;
    isSubmitted: boolean;
    submissionDate?: string;
}

// --- Notification Types ---
export type NotificationType = 'session' | 'achievement' | 'update' | 'info';

export interface AppNotification {
    id: string;
    type: NotificationType;
    title: string;
    message: string;
    timestamp: number;
    isRead: boolean;
    link?: string; // Optional link to navigate to
}

export interface AppState {
    studentName: string;
    classId: string;
    progress: Record<string, ChapterProgress>; // Key is chapterId
    notifications: AppNotification[];
}