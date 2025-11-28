import { Course, CourseInstructor, CourseModule } from '@/lib/types/courseTypes';

/**
 * Mock Course Data
 * Rich, realistic course data for demonstration
 */

// Mock Instructors
export const mockInstructors: CourseInstructor[] = [
    {
        id: 'inst-1',
        name: 'Dr. Sarah Chen',
        title: 'AI Research Scientist',
        avatar: '/avatars/instructor-1.jpg',
        bio: 'Former Google AI researcher with 10+ years of experience in machine learning.',
        rating: 4.9,
        studentsCount: 125000,
    },
    {
        id: 'inst-2',
        name: 'Marcus Rodriguez',
        title: 'Senior Full-Stack Developer',
        avatar: '/avatars/instructor-2.jpg',
        bio: 'Lead developer at Meta, specializing in React and Next.js.',
        rating: 4.8,
        studentsCount: 98000,
    },
    {
        id: 'inst-3',
        name: 'Emily Watson',
        title: 'UX Design Director',
        avatar: '/avatars/instructor-3.jpg',
        bio: 'Award-winning designer with projects for Apple, Adobe, and Airbnb.',
        rating: 4.9,
        studentsCount: 76000,
    },
    {
        id: 'inst-4',
        name: 'Dr. James Liu',
        title: 'Data Science Expert',
        avatar: '/avatars/instructor-4.jpg',
        bio: 'PhD in Statistics, former Netflix data scientist.',
        rating: 4.7,
        studentsCount: 54000,
    },
];

// Mock Courses
export const mockCourses: Course[] = [
    {
        id: 'course-1',
        title: 'Complete Web Development Bootcamp 2024',
        slug: 'complete-web-development-bootcamp-2024',
        description: 'Master modern web development with React, Next.js, TypeScript, and more. Build real-world projects and deploy to production.',
        shortDescription: 'Become a professional web developer with hands-on projects',
        thumbnailUrl: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800',
        previewVideoUrl: 'https://example.com/preview-1.mp4',
        category: 'web-dev',
        difficulty: 'beginner',
        instructor: mockInstructors[1],
        modules: [
            {
                id: 'mod-1-1',
                title: 'Getting Started with Web Development',
                description: 'Learn the fundamentals of HTML, CSS, and JavaScript',
                order: 1,
                estimatedDuration: 240,
                lessons: [
                    {
                        id: 'lesson-1-1-1',
                        title: 'Introduction to Web Development',
                        description: 'Overview of what you\'ll learn in this course',
                        type: 'video',
                        duration: 15,
                        isPreview: true,
                        order: 1,
                    },
                    {
                        id: 'lesson-1-1-2',
                        title: 'HTML Fundamentals',
                        description: 'Learn HTML5 and semantic markup',
                        type: 'video',
                        duration: 45,
                        isPreview: false,
                        order: 2,
                    },
                    {
                        id: 'lesson-1-1-3',
                        title: 'CSS Styling Basics',
                        description: 'Style your web pages with modern CSS',
                        type: 'video',
                        duration: 60,
                        isPreview: false,
                        order: 3,
                    },
                ],
            },
            {
                id: 'mod-1-2',
                title: 'JavaScript Mastery',
                description: 'Modern JavaScript ES6+ features and best practices',
                order: 2,
                estimatedDuration: 360,
                lessons: [
                    {
                        id: 'lesson-1-2-1',
                        title: 'JavaScript Fundamentals',
                        description: 'Variables, functions, and data types',
                        type: 'video',
                        duration: 90,
                        isPreview: false,
                        order: 1,
                    },
                    {
                        id: 'lesson-1-2-2',
                        title: 'Async JavaScript & Promises',
                        description: 'Master asynchronous programming',
                        type: 'video',
                        duration: 75,
                        isPreview: false,
                        order: 2,
                    },
                ],
            },
        ],
        rating: 4.8,
        reviewsCount: 12450,
        studentsEnrolled: 45600,
        totalDuration: 3600,
        lastUpdated: new Date('2024-01-15'),
        createdAt: new Date('2023-06-01'),
        learningOutcomes: [
            'Build full-stack web applications from scratch',
            'Master React and Next.js for modern web development',
            'Deploy applications to production environments',
            'Work with APIs and databases',
        ],
        prerequisites: ['Basic computer skills', 'No programming experience required'],
        price: 0,
        isPremium: false,
        isFree: true,
        tags: ['react', 'nextjs', 'javascript', 'typescript', 'web-development'],
    },
    {
        id: 'course-2',
        title: 'Machine Learning & AI Fundamentals',
        slug: 'machine-learning-ai-fundamentals',
        description: 'Dive into the world of artificial intelligence and machine learning. Learn neural networks, deep learning, and build AI-powered applications.',
        shortDescription: 'Master AI and ML from theory to practical applications',
        thumbnailUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800',
        category: 'ai-ml',
        difficulty: 'intermediate',
        instructor: mockInstructors[0],
        modules: [
            {
                id: 'mod-2-1',
                title: 'Introduction to Machine Learning',
                description: 'Understanding ML fundamentals and algorithms',
                order: 1,
                estimatedDuration: 300,
                lessons: [
                    {
                        id: 'lesson-2-1-1',
                        title: 'What is Machine Learning?',
                        description: 'Overview of ML and its applications',
                        type: 'video',
                        duration: 20,
                        isPreview: true,
                        order: 1,
                    },
                ],
            },
        ],
        rating: 4.9,
        reviewsCount: 8920,
        studentsEnrolled: 32100,
        totalDuration: 4200,
        lastUpdated: new Date('2024-02-01'),
        createdAt: new Date('2023-09-15'),
        learningOutcomes: [
            'Understand machine learning algorithms and theory',
            'Build and train neural networks',
            'Implement AI solutions for real-world problems',
            'Work with TensorFlow and PyTorch',
        ],
        prerequisites: ['Python programming basics', 'High school mathematics'],
        price: 79.99,
        isPremium: true,
        isFree: false,
        tags: ['machine-learning', 'ai', 'neural-networks', 'python', 'tensorflow'],
    },
    {
        id: 'course-3',
        title: 'UI/UX Design Masterclass',
        slug: 'ui-ux-design-masterclass',
        description: 'Create stunning, user-centered designs. Master Figma, design systems, and learn to create interfaces users love.',
        shortDescription: 'Design beautiful, intuitive user experiences',
        thumbnailUrl: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800',
        category: 'design',
        difficulty: 'beginner',
        instructor: mockInstructors[2],
        modules: [
            {
                id: 'mod-3-1',
                title: 'Design Fundamentals',
                description: 'Core principles of great design',
                order: 1,
                estimatedDuration: 180,
                lessons: [
                    {
                        id: 'lesson-3-1-1',
                        title: 'Introduction to UI/UX',
                        description: 'Understanding user experience design',
                        type: 'video',
                        duration: 25,
                        isPreview: true,
                        order: 1,
                    },
                ],
            },
        ],
        rating: 4.9,
        reviewsCount: 6780,
        studentsEnrolled: 28900,
        totalDuration: 2400,
        lastUpdated: new Date('2024-01-20'),
        createdAt: new Date('2023-07-10'),
        learningOutcomes: [
            'Master Figma and design tools',
            'Create beautiful user interfaces',
            'Build and maintain design systems',
            'Conduct user research and testing',
        ],
        prerequisites: ['Creative mindset', 'Basic computer skills'],
        price: 0,
        isPremium: false,
        isFree: true,
        tags: ['ui-design', 'ux-design', 'figma', 'design-systems', 'user-research'],
    },
    {
        id: 'course-4',
        title: 'Data Science with Python',
        slug: 'data-science-with-python',
        description: 'Learn data analysis, visualization, and statistical modeling with Python. Master pandas, numpy, and scikit-learn.',
        shortDescription: 'Transform data into insights with Python',
        thumbnailUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800',
        category: 'data-science',
        difficulty: 'intermediate',
        instructor: mockInstructors[3],
        modules: [],
        rating: 4.7,
        reviewsCount: 5430,
        studentsEnrolled: 19800,
        totalDuration: 3000,
        lastUpdated: new Date('2024-01-10'),
        createdAt: new Date('2023-08-20'),
        learningOutcomes: [
            'Analyze and visualize data with Python',
            'Build predictive models',
            'Work with real-world datasets',
            'Master pandas and numpy',
        ],
        prerequisites: ['Python programming basics', 'Basic statistics'],
        price: 59.99,
        isPremium: true,
        isFree: false,
        tags: ['data-science', 'python', 'pandas', 'data-analysis', 'machine-learning'],
    },
    {
        id: 'course-5',
        title: 'React Native Mobile Development',
        slug: 'react-native-mobile-development',
        description: 'Build cross-platform mobile apps with React Native. Create iOS and Android apps from a single codebase.',
        shortDescription: 'Create native mobile apps with React Native',
        thumbnailUrl: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800',
        category: 'mobile-dev',
        difficulty: 'intermediate',
        instructor: mockInstructors[1],
        modules: [],
        rating: 4.8,
        reviewsCount: 4210,
        studentsEnrolled: 15600,
        totalDuration: 2800,
        lastUpdated: new Date('2024-02-05'),
        createdAt: new Date('2023-10-01'),
        learningOutcomes: [
            'Build iOS and Android apps',
            'Master React Native fundamentals',
            'Implement navigation and state management',
            'Publish apps to app stores',
        ],
        prerequisites: ['React basics', 'JavaScript knowledge'],
        price: 69.99,
        isPremium: true,
        isFree: false,
        tags: ['react-native', 'mobile-development', 'ios', 'android', 'react'],
    },
    {
        id: 'course-6',
        title: 'Digital Marketing Mastery',
        slug: 'digital-marketing-mastery',
        description: 'Master SEO, social media marketing, content marketing, and paid advertising. Grow your business online.',
        shortDescription: 'Complete guide to digital marketing success',
        thumbnailUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800',
        category: 'marketing',
        difficulty: 'beginner',
        instructor: mockInstructors[2],
        modules: [],
        rating: 4.6,
        reviewsCount: 3890,
        studentsEnrolled: 22300,
        totalDuration: 2200,
        lastUpdated: new Date('2024-01-25'),
        createdAt: new Date('2023-05-15'),
        learningOutcomes: [
            'Master SEO and content marketing',
            'Run effective social media campaigns',
            'Understand Google Ads and Facebook Ads',
            'Analyze marketing metrics',
        ],
        prerequisites: ['Basic internet knowledge'],
        price: 0,
        isPremium: false,
        isFree: true,
        tags: ['marketing', 'seo', 'social-media', 'advertising', 'analytics'],
    },
];

// Helper function to get courses by category
export function getCoursesByCategory(category: string): Course[] {
    return mockCourses.filter(course => course.category === category);
}

// Helper function to get featured courses
export function getFeaturedCourses(): Course[] {
    return mockCourses
        .sort((a, b) => b.studentsEnrolled - a.studentsEnrolled)
        .slice(0, 6);
}

// Helper function to get trending courses
export function getTrendingCourses(): Course[] {
    return mockCourses
        .sort((a, b) => {
            const aRecent = new Date(a.lastUpdated).getTime();
            const bRecent = new Date(b.lastUpdated).getTime();
            return bRecent - aRecent;
        })
        .slice(0, 6);
}
