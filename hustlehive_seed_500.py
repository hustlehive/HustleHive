import time
import requests

URL = "http://localhost:5000/api/hustles/"
TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZhNWJhY2MyNGUxM2U2YWJjYWIzMmI1MyIsImlhdCI6MTc5MDA0ODg3MCwiZXhwIjoxNzkyNjQwODcwfQ.EpbOK4JvTtgqElW3tX3cV0uzOg1hknClC_0dZOFqlUw"

HEADERS = {
    "Authorization": f"Bearer {TOKEN}",
    "Content-Type": "application/json",
}

HUSTLES = [
    {
        "title": "Poster Illustration",
        "description": "Need an original illustrated poster for a college club event.",
        "reward": 300,
        "deadline": "2026-10-08"
    },
    {
        "title": "Digital Portrait",
        "description": "Looking for someone to turn a reference photo into a clean digital portrait.",
        "reward": 475,
        "deadline": "2026-10-08"
    },
    {
        "title": "Sticker Pack Design",
        "description": "Need a small set of expressive stickers for a student community.",
        "reward": 650,
        "deadline": "2026-10-08"
    },
    {
        "title": "Comic Panel",
        "description": "Looking for an artist to draw a short comic panel for a campus campaign.",
        "reward": 825,
        "deadline": "2026-10-08"
    },
    {
        "title": "Character Sketch",
        "description": "Need a character concept sketch for a student animation project.",
        "reward": 1000,
        "deadline": "2026-10-08"
    },
    {
        "title": "Album Cover Art",
        "description": "Need original cover artwork for a student music release.",
        "reward": 1175,
        "deadline": "2026-10-08"
    },
    {
        "title": "Event Doodle Art",
        "description": "Looking for hand-drawn doodles that can be used in event promotions.",
        "reward": 1350,
        "deadline": "2026-10-08"
    },
    {
        "title": "Infographic Illustration",
        "description": "Need custom illustrations for an educational infographic.",
        "reward": 1525,
        "deadline": "2026-10-08"
    },
    {
        "title": "T-Shirt Artwork",
        "description": "Need a print-ready illustration for a college society T-shirt.",
        "reward": 1700,
        "deadline": "2026-10-08"
    },
    {
        "title": "Digital Caricature",
        "description": "Looking for a caricature artist for a college farewell gift.",
        "reward": 1875,
        "deadline": "2026-10-08"
    },
    {
        "title": "Storyboard Sketches",
        "description": "Need rough storyboard frames for a short student film.",
        "reward": 2050,
        "deadline": "2026-10-08"
    },
    {
        "title": "Campus Landmark Sketch",
        "description": "Need an artistic sketch of a recognizable campus location.",
        "reward": 2225,
        "deadline": "2026-10-08"
    },
    {
        "title": "Mascot Concept",
        "description": "Looking for concepts for a fun mascot for a student organization.",
        "reward": 2400,
        "deadline": "2026-10-08"
    },
    {
        "title": "Minimal Line Art",
        "description": "Need minimalist line-art illustrations for a presentation.",
        "reward": 2575,
        "deadline": "2026-10-08"
    },
    {
        "title": "Watercolor Artwork",
        "description": "Looking for a watercolor-style artwork for a college magazine.",
        "reward": 2750,
        "deadline": "2026-10-08"
    },
    {
        "title": "Book Illustration",
        "description": "Need a few simple illustrations for a student-written booklet.",
        "reward": 2925,
        "deadline": "2026-10-08"
    },
    {
        "title": "Logo Illustration",
        "description": "Need a hand-crafted visual concept that can inspire a club logo.",
        "reward": 3100,
        "deadline": "2026-10-08"
    },
    {
        "title": "Festival Artwork",
        "description": "Looking for artwork themed around a college cultural festival.",
        "reward": 3275,
        "deadline": "2026-10-08"
    },
    {
        "title": "Science Illustration",
        "description": "Need an accurate but visually appealing illustration for a science project.",
        "reward": 3450,
        "deadline": "2026-10-08"
    },
    {
        "title": "Art Portfolio Cleanup",
        "description": "Need help organizing and polishing scans of an art portfolio.",
        "reward": 3625,
        "deadline": "2026-10-08"
    },
    {
        "title": "Club Poster Design",
        "description": "Need a polished poster for a student club announcement.",
        "reward": 3800,
        "deadline": "2026-10-08"
    },
    {
        "title": "Instagram Carousel",
        "description": "Looking for a designer to create a five-slide Instagram carousel.",
        "reward": 3975,
        "deadline": "2026-10-08"
    },
    {
        "title": "Event Flyer",
        "description": "Need a clean flyer for an upcoming campus workshop.",
        "reward": 4150,
        "deadline": "2026-10-08"
    },
    {
        "title": "Presentation Design",
        "description": "Need help turning plain presentation slides into a professional deck.",
        "reward": 4325,
        "deadline": "2026-10-08"
    },
    {
        "title": "Resume Design",
        "description": "Looking for help improving the visual layout of a student resume.",
        "reward": 4500,
        "deadline": "2026-10-08"
    },
    {
        "title": "Certificate Template",
        "description": "Need a reusable certificate template for a college event.",
        "reward": 4675,
        "deadline": "2026-10-08"
    },
    {
        "title": "Social Media Banner",
        "description": "Need a banner graphic for a student organization page.",
        "reward": 4850,
        "deadline": "2026-10-08"
    },
    {
        "title": "Thumbnails Design",
        "description": "Looking for thumbnails for a student YouTube series.",
        "reward": 324,
        "deadline": "2026-10-08"
    },
    {
        "title": "Menu Card Design",
        "description": "Need a simple menu card for a college food stall event.",
        "reward": 499,
        "deadline": "2026-10-08"
    },
    {
        "title": "Invitation Card",
        "description": "Need a digital invitation for a student society gathering.",
        "reward": 674,
        "deadline": "2026-10-08"
    },
    {
        "title": "Brochure Layout",
        "description": "Need a tri-fold brochure layout for a campus initiative.",
        "reward": 849,
        "deadline": "2026-10-08"
    },
    {
        "title": "Workshop Poster",
        "description": "Need an informative workshop poster with clear hierarchy.",
        "reward": 1024,
        "deadline": "2026-10-08"
    },
    {
        "title": "Club Recruitment Creative",
        "description": "Need recruitment graphics for a college society.",
        "reward": 1199,
        "deadline": "2026-10-08"
    },
    {
        "title": "Event Schedule Graphic",
        "description": "Need a visually clear schedule graphic for a multi-day event.",
        "reward": 1374,
        "deadline": "2026-10-08"
    },
    {
        "title": "Merch Mockup",
        "description": "Looking for someone to create realistic mockups for student merchandise.",
        "reward": 1549,
        "deadline": "2026-10-08"
    },
    {
        "title": "Infographic Layout",
        "description": "Need a designer to turn research notes into an infographic.",
        "reward": 1724,
        "deadline": "2026-10-08"
    },
    {
        "title": "LinkedIn Banner",
        "description": "Need a professional LinkedIn banner for a college student.",
        "reward": 1899,
        "deadline": "2026-10-08"
    },
    {
        "title": "Photo Collage",
        "description": "Need a polished collage for a college farewell post.",
        "reward": 2074,
        "deadline": "2026-10-08"
    },
    {
        "title": "Digital Invitation",
        "description": "Need a modern digital invitation for a campus meetup.",
        "reward": 2249,
        "deadline": "2026-10-08"
    },
    {
        "title": "Magazine Page Layout",
        "description": "Need help laying out one feature page for a student magazine.",
        "reward": 2424,
        "deadline": "2026-10-08"
    },
    {
        "title": "Dance Choreography",
        "description": "Need a short choreography for a college cultural performance.",
        "reward": 2599,
        "deadline": "2026-10-08"
    },
    {
        "title": "Solo Dance Coaching",
        "description": "Looking for feedback and coaching for a solo college performance.",
        "reward": 2774,
        "deadline": "2026-10-08"
    },
    {
        "title": "Dance Cover Partner",
        "description": "Need a partner to practice and record a dance cover.",
        "reward": 2949,
        "deadline": "2026-10-08"
    },
    {
        "title": "Garba Routine",
        "description": "Need help creating a short Garba routine for a campus event.",
        "reward": 3124,
        "deadline": "2026-10-08"
    },
    {
        "title": "Hip-Hop Routine",
        "description": "Looking for choreography for a beginner-friendly hip-hop performance.",
        "reward": 3299,
        "deadline": "2026-10-08"
    },
    {
        "title": "Contemporary Routine",
        "description": "Need a contemporary routine for a college stage performance.",
        "reward": 3474,
        "deadline": "2026-10-08"
    },
    {
        "title": "Dance Rehearsal Help",
        "description": "Looking for someone to help clean formations before a performance.",
        "reward": 3649,
        "deadline": "2026-10-08"
    },
    {
        "title": "Freestyle Coaching",
        "description": "Need coaching to improve freestyle confidence and musicality.",
        "reward": 3824,
        "deadline": "2026-10-08"
    },
    {
        "title": "Bhangra Choreography",
        "description": "Need a high-energy Bhangra routine for a college team.",
        "reward": 3999,
        "deadline": "2026-10-08"
    },
    {
        "title": "Dance Video Direction",
        "description": "Looking for someone to plan movements and shots for a dance video.",
        "reward": 4174,
        "deadline": "2026-10-08"
    },
    {
        "title": "Expression Coaching",
        "description": "Need performance coaching focused on expressions and stage presence.",
        "reward": 4349,
        "deadline": "2026-10-08"
    },
    {
        "title": "Formation Planning",
        "description": "Need help arranging dancers into formations for a group routine.",
        "reward": 4524,
        "deadline": "2026-10-08"
    },
    {
        "title": "Warmup Session",
        "description": "Looking for someone to conduct a short dance warmup session.",
        "reward": 4699,
        "deadline": "2026-10-08"
    },
    {
        "title": "Dance Practice Partner",
        "description": "Need a reliable practice partner for an upcoming college event.",
        "reward": 4874,
        "deadline": "2026-10-08"
    },
    {
        "title": "Bollywood Routine",
        "description": "Need a fun Bollywood routine for a student fest.",
        "reward": 348,
        "deadline": "2026-10-08"
    },
    {
        "title": "K-Pop Cover Practice",
        "description": "Looking for help cleaning a K-Pop cover before recording.",
        "reward": 523,
        "deadline": "2026-10-08"
    },
    {
        "title": "Dance Audition Prep",
        "description": "Need feedback while preparing for a college dance audition.",
        "reward": 698,
        "deadline": "2026-10-08"
    },
    {
        "title": "Stage Blocking",
        "description": "Need assistance planning stage positions for a performance.",
        "reward": 873,
        "deadline": "2026-10-08"
    },
    {
        "title": "Performance Mix",
        "description": "Need help selecting and structuring songs for a dance performance.",
        "reward": 1048,
        "deadline": "2026-10-08"
    },
    {
        "title": "Dance Workshop Assistant",
        "description": "Looking for someone to assist with a beginner dance workshop.",
        "reward": 1223,
        "deadline": "2026-10-08"
    },
    {
        "title": "Music Composition",
        "description": "Looking for someone who can compose a short original background track for a student short film.",
        "reward": 1398,
        "deadline": "2026-10-08"
    },
    {
        "title": "Beat Production",
        "description": "Need an original beat for a student rap performance.",
        "reward": 1573,
        "deadline": "2026-10-08"
    },
    {
        "title": "Podcast Intro",
        "description": "Need a short original intro sound for a student podcast.",
        "reward": 1748,
        "deadline": "2026-10-08"
    },
    {
        "title": "Audio Cleanup",
        "description": "Need background noise removed from a recorded interview.",
        "reward": 1923,
        "deadline": "2026-10-08"
    },
    {
        "title": "Guitar Recording",
        "description": "Looking for a guitarist to record a simple part for a student song.",
        "reward": 2098,
        "deadline": "2026-10-08"
    },
    {
        "title": "Vocal Tuning",
        "description": "Need basic vocal cleanup and tuning for a student music project.",
        "reward": 2273,
        "deadline": "2026-10-08"
    },
    {
        "title": "DJ Set Curation",
        "description": "Need help arranging a playlist for a college cultural night.",
        "reward": 2448,
        "deadline": "2026-10-08"
    },
    {
        "title": "Sound Effects",
        "description": "Need a small collection of original sound effects for a student video.",
        "reward": 2623,
        "deadline": "2026-10-08"
    },
    {
        "title": "Jingle Creation",
        "description": "Looking for a short jingle for a college club campaign.",
        "reward": 2798,
        "deadline": "2026-10-08"
    },
    {
        "title": "Podcast Editing",
        "description": "Need editing and leveling for a short student podcast episode.",
        "reward": 2973,
        "deadline": "2026-10-08"
    },
    {
        "title": "Song Arrangement",
        "description": "Need help arranging an original song into a complete structure.",
        "reward": 3148,
        "deadline": "2026-10-08"
    },
    {
        "title": "Keyboard Recording",
        "description": "Looking for someone to record keyboard accompaniment.",
        "reward": 3323,
        "deadline": "2026-10-08"
    },
    {
        "title": "Bass Recording",
        "description": "Need a simple bass track for a student band recording.",
        "reward": 3498,
        "deadline": "2026-10-08"
    },
    {
        "title": "Drum Programming",
        "description": "Need programmed drums for a short original composition.",
        "reward": 3673,
        "deadline": "2026-10-08"
    },
    {
        "title": "Audio Mixing",
        "description": "Looking for basic mixing help for a student song.",
        "reward": 3848,
        "deadline": "2026-10-08"
    },
    {
        "title": "Music Transcription",
        "description": "Need a melody transcribed from an audio recording.",
        "reward": 4023,
        "deadline": "2026-10-08"
    },
    {
        "title": "Karaoke Track",
        "description": "Need a simple backing track prepared for a campus performance.",
        "reward": 4198,
        "deadline": "2026-10-08"
    },
    {
        "title": "Voiceover Recording",
        "description": "Looking for a clear voiceover for a student presentation video.",
        "reward": 4373,
        "deadline": "2026-10-08"
    },
    {
        "title": "Ambient Sound Design",
        "description": "Need subtle ambient audio for a short film scene.",
        "reward": 4548,
        "deadline": "2026-10-08"
    },
    {
        "title": "College Anthem Arrangement",
        "description": "Need help arranging a student-written college anthem.",
        "reward": 4723,
        "deadline": "2026-10-08"
    },
    {
        "title": "Event Photography",
        "description": "Need a student photographer to cover a small campus event.",
        "reward": 4898,
        "deadline": "2026-10-08"
    },
    {
        "title": "Portrait Session",
        "description": "Looking for portrait photos for a student portfolio.",
        "reward": 372,
        "deadline": "2026-10-08"
    },
    {
        "title": "Product Photography",
        "description": "Need simple photos of handmade student products.",
        "reward": 547,
        "deadline": "2026-10-08"
    },
    {
        "title": "Reel Shooting",
        "description": "Need someone to shoot a short Instagram reel on campus.",
        "reward": 722,
        "deadline": "2026-10-08"
    },
    {
        "title": "Video Editing",
        "description": "Looking for an editor for a two-minute college event recap.",
        "reward": 897,
        "deadline": "2026-10-08"
    },
    {
        "title": "Color Correction",
        "description": "Need basic color correction for footage from a student project.",
        "reward": 1072,
        "deadline": "2026-10-08"
    },
    {
        "title": "Short Film Editing",
        "description": "Need help assembling and pacing footage for a short student film.",
        "reward": 1247,
        "deadline": "2026-10-08"
    },
    {
        "title": "Interview Recording",
        "description": "Looking for someone to record a student interview with clean audio.",
        "reward": 1422,
        "deadline": "2026-10-08"
    },
    {
        "title": "Sports Photography",
        "description": "Need action photographs from a college sports practice.",
        "reward": 1597,
        "deadline": "2026-10-08"
    },
    {
        "title": "Campus B-Roll",
        "description": "Need cinematic campus B-roll for a student video.",
        "reward": 1772,
        "deadline": "2026-10-08"
    },
    {
        "title": "Travel Reel Editing",
        "description": "Looking for help editing a short student travel reel.",
        "reward": 1947,
        "deadline": "2026-10-08"
    },
    {
        "title": "Thumbnail Photography",
        "description": "Need a few photographs suitable for video thumbnails.",
        "reward": 2122,
        "deadline": "2026-10-08"
    },
    {
        "title": "Photo Retouching",
        "description": "Need light retouching on a batch of student event photographs.",
        "reward": 2297,
        "deadline": "2026-10-08"
    },
    {
        "title": "Slow Motion Edit",
        "description": "Need a short slow-motion sports edit from supplied footage.",
        "reward": 2472,
        "deadline": "2026-10-08"
    },
    {
        "title": "Video Subtitles",
        "description": "Need accurate subtitles added to a student interview video.",
        "reward": 2647,
        "deadline": "2026-10-08"
    },
    {
        "title": "Wedding Guest Photography",
        "description": "Need casual photography at a small student family function.",
        "reward": 2822,
        "deadline": "2026-10-08"
    },
    {
        "title": "Green Screen Cleanup",
        "description": "Need basic green-screen cleanup for a college project.",
        "reward": 2997,
        "deadline": "2026-10-08"
    },
    {
        "title": "Montage Editing",
        "description": "Need a montage made from several short phone clips.",
        "reward": 3172,
        "deadline": "2026-10-08"
    },
    {
        "title": "Stop Motion Video",
        "description": "Looking for help creating a simple stop-motion student project.",
        "reward": 3347,
        "deadline": "2026-10-08"
    },
    {
        "title": "Camera Operator",
        "description": "Need someone comfortable operating a camera during a campus event.",
        "reward": 3522,
        "deadline": "2026-10-08"
    },
    {
        "title": "React Bug Fix",
        "description": "Need help fixing a small UI bug in a React student project.",
        "reward": 3697,
        "deadline": "2026-10-08"
    },
    {
        "title": "Portfolio Website",
        "description": "Looking for someone to build a simple personal portfolio website.",
        "reward": 3872,
        "deadline": "2026-10-08"
    },
    {
        "title": "Landing Page",
        "description": "Need a responsive landing page for a student initiative.",
        "reward": 4047,
        "deadline": "2026-10-08"
    },
    {
        "title": "JavaScript Debugging",
        "description": "Need help debugging a JavaScript function in a college project.",
        "reward": 4222,
        "deadline": "2026-10-08"
    },
    {
        "title": "HTML CSS Cleanup",
        "description": "Looking for help cleaning up HTML and CSS in a student website.",
        "reward": 4397,
        "deadline": "2026-10-08"
    },
    {
        "title": "API Integration",
        "description": "Need assistance connecting a frontend to a REST API.",
        "reward": 4572,
        "deadline": "2026-10-08"
    },
    {
        "title": "Node Backend Fix",
        "description": "Need help fixing a small issue in a Node.js backend.",
        "reward": 4747,
        "deadline": "2026-10-08"
    },
    {
        "title": "Express Route",
        "description": "Looking for help adding one Express API route to a student project.",
        "reward": 4922,
        "deadline": "2026-10-08"
    },
    {
        "title": "MongoDB Query",
        "description": "Need assistance writing and debugging a MongoDB query.",
        "reward": 396,
        "deadline": "2026-10-08"
    },
    {
        "title": "Git Conflict Help",
        "description": "Need help resolving a Git merge conflict in a team project.",
        "reward": 571,
        "deadline": "2026-10-08"
    },
    {
        "title": "TypeScript Conversion",
        "description": "Looking for help converting a small JavaScript component to TypeScript.",
        "reward": 746,
        "deadline": "2026-10-08"
    },
    {
        "title": "Responsive Design",
        "description": "Need help making a student website work well on mobile.",
        "reward": 921,
        "deadline": "2026-10-08"
    },
    {
        "title": "Authentication Setup",
        "description": "Need guidance implementing basic authentication in a project.",
        "reward": 1096,
        "deadline": "2026-10-08"
    },
    {
        "title": "Form Validation",
        "description": "Need help adding frontend validation to a registration form.",
        "reward": 1271,
        "deadline": "2026-10-08"
    },
    {
        "title": "Web Scraper",
        "description": "Looking for help building a small legal scraper for public project data.",
        "reward": 1446,
        "deadline": "2026-10-08"
    },
    {
        "title": "Database Schema Review",
        "description": "Need another developer to review a small project database schema.",
        "reward": 1621,
        "deadline": "2026-10-08"
    },
    {
        "title": "Code Refactoring",
        "description": "Need help refactoring repetitive code in a college project.",
        "reward": 1796,
        "deadline": "2026-10-08"
    },
    {
        "title": "Deployment Help",
        "description": "Looking for assistance deploying a small student web application.",
        "reward": 1971,
        "deadline": "2026-10-08"
    },
    {
        "title": "Documentation Website",
        "description": "Need a simple documentation site for a student open-source project.",
        "reward": 2146,
        "deadline": "2026-10-08"
    },
    {
        "title": "CSS Animation",
        "description": "Need a few polished CSS animations for a student landing page.",
        "reward": 2321,
        "deadline": "2026-10-08"
    },
    {
        "title": "Flutter UI Screen",
        "description": "Need one polished Flutter screen implemented from a design.",
        "reward": 2496,
        "deadline": "2026-10-08"
    },
    {
        "title": "Flutter Bug Fix",
        "description": "Looking for help debugging a small Flutter application issue.",
        "reward": 2671,
        "deadline": "2026-10-08"
    },
    {
        "title": "Firebase Auth Setup",
        "description": "Need assistance connecting Firebase Authentication to a student app.",
        "reward": 2846,
        "deadline": "2026-10-08"
    },
    {
        "title": "Firestore Query",
        "description": "Need help writing an efficient Firestore query.",
        "reward": 3021,
        "deadline": "2026-10-08"
    },
    {
        "title": "Flutter State Management",
        "description": "Looking for help structuring state management in a Flutter app.",
        "reward": 3196,
        "deadline": "2026-10-08"
    },
    {
        "title": "Android UI Fix",
        "description": "Need help fixing layout issues in a native Android student project.",
        "reward": 3371,
        "deadline": "2026-10-08"
    },
    {
        "title": "App Icon Design",
        "description": "Need an icon designed for a student mobile application.",
        "reward": 3546,
        "deadline": "2026-10-08"
    },
    {
        "title": "Flutter Navigation",
        "description": "Need help implementing nested navigation in a Flutter app.",
        "reward": 3721,
        "deadline": "2026-10-08"
    },
    {
        "title": "Push Notifications",
        "description": "Looking for help setting up push notifications for a student app.",
        "reward": 3896,
        "deadline": "2026-10-08"
    },
    {
        "title": "Local Storage",
        "description": "Need help storing and retrieving user settings locally.",
        "reward": 4071,
        "deadline": "2026-10-08"
    },
    {
        "title": "Flutter Form",
        "description": "Need a clean registration form implemented in Flutter.",
        "reward": 4246,
        "deadline": "2026-10-08"
    },
    {
        "title": "App Splash Screen",
        "description": "Need a polished splash screen for a student mobile app.",
        "reward": 4421,
        "deadline": "2026-10-08"
    },
    {
        "title": "API Service Layer",
        "description": "Need help structuring API calls in a Flutter project.",
        "reward": 4596,
        "deadline": "2026-10-08"
    },
    {
        "title": "Firebase Storage",
        "description": "Looking for help uploading images to Firebase Storage.",
        "reward": 4771,
        "deadline": "2026-10-08"
    },
    {
        "title": "Android Build Fix",
        "description": "Need assistance resolving an Android build issue in a student app.",
        "reward": 4946,
        "deadline": "2026-10-08"
    },
    {
        "title": "Flutter Animation",
        "description": "Need a smooth animation added to one mobile screen.",
        "reward": 420,
        "deadline": "2026-10-08"
    },
    {
        "title": "App Testing",
        "description": "Looking for someone to test a student app and report bugs.",
        "reward": 595,
        "deadline": "2026-10-08"
    },
    {
        "title": "Responsive Flutter UI",
        "description": "Need help making a Flutter interface adapt to different screens.",
        "reward": 770,
        "deadline": "2026-10-08"
    },
    {
        "title": "Mobile App Documentation",
        "description": "Need concise technical documentation for a student mobile project.",
        "reward": 945,
        "deadline": "2026-10-08"
    },
    {
        "title": "App Performance Check",
        "description": "Looking for help identifying obvious performance bottlenecks in a small app.",
        "reward": 1120,
        "deadline": "2026-10-08"
    },
    {
        "title": "ML Project Debugging",
        "description": "Need help debugging a small machine-learning college project.",
        "reward": 1295,
        "deadline": "2026-10-08"
    },
    {
        "title": "Python Data Cleaning",
        "description": "Looking for help cleaning a CSV dataset for a student project.",
        "reward": 1470,
        "deadline": "2026-10-08"
    },
    {
        "title": "Model Evaluation",
        "description": "Need help selecting and calculating evaluation metrics for an ML model.",
        "reward": 1645,
        "deadline": "2026-10-08"
    },
    {
        "title": "Scikit Learn Help",
        "description": "Need assistance implementing a basic scikit-learn pipeline.",
        "reward": 1820,
        "deadline": "2026-10-08"
    },
    {
        "title": "Pandas Analysis",
        "description": "Looking for help analyzing a dataset with pandas.",
        "reward": 1995,
        "deadline": "2026-10-08"
    },
    {
        "title": "NLP Preprocessing",
        "description": "Need help preprocessing text data for a student NLP project.",
        "reward": 2170,
        "deadline": "2026-10-08"
    },
    {
        "title": "Computer Vision Demo",
        "description": "Need assistance building a small computer-vision prototype.",
        "reward": 2345,
        "deadline": "2026-10-08"
    },
    {
        "title": "Prompt Engineering",
        "description": "Looking for help improving prompts for a student AI application.",
        "reward": 2520,
        "deadline": "2026-10-08"
    },
    {
        "title": "LLM API Integration",
        "description": "Need help integrating an LLM API into a college project.",
        "reward": 2695,
        "deadline": "2026-10-08"
    },
    {
        "title": "RAG Prototype",
        "description": "Need assistance building a small retrieval-augmented generation demo.",
        "reward": 2870,
        "deadline": "2026-10-08"
    },
    {
        "title": "Vector Search Demo",
        "description": "Looking for help creating a basic vector-search prototype.",
        "reward": 3045,
        "deadline": "2026-10-08"
    },
    {
        "title": "Data Visualization",
        "description": "Need useful visualizations for a machine-learning dataset.",
        "reward": 3220,
        "deadline": "2026-10-08"
    },
    {
        "title": "Feature Engineering",
        "description": "Need guidance implementing features for a student ML dataset.",
        "reward": 3395,
        "deadline": "2026-10-08"
    },
    {
        "title": "Model Report",
        "description": "Need help explaining ML experiment results in a student report.",
        "reward": 3570,
        "deadline": "2026-10-08"
    },
    {
        "title": "Jupyter Notebook Cleanup",
        "description": "Looking for help organizing a messy ML notebook.",
        "reward": 3745,
        "deadline": "2026-10-08"
    },
    {
        "title": "Classification Project",
        "description": "Need assistance implementing a basic classification experiment.",
        "reward": 3920,
        "deadline": "2026-10-08"
    },
    {
        "title": "Regression Project",
        "description": "Need help debugging a regression model for coursework.",
        "reward": 4095,
        "deadline": "2026-10-08"
    },
    {
        "title": "TensorFlow Setup",
        "description": "Need help getting a small TensorFlow project running locally.",
        "reward": 4270,
        "deadline": "2026-10-08"
    },
    {
        "title": "PyTorch Training Loop",
        "description": "Looking for help fixing a PyTorch training loop.",
        "reward": 4445,
        "deadline": "2026-10-08"
    },
    {
        "title": "AI Demo UI",
        "description": "Need a simple interface for demonstrating a student AI model.",
        "reward": 4620,
        "deadline": "2026-10-08"
    },
    {
        "title": "Arduino Debugging",
        "description": "Need help debugging an Arduino sensor project.",
        "reward": 4795,
        "deadline": "2026-10-08"
    },
    {
        "title": "ESP32 Project Help",
        "description": "Looking for assistance with an ESP32-based college project.",
        "reward": 4970,
        "deadline": "2026-10-08"
    },
    {
        "title": "Sensor Interfacing",
        "description": "Need help interfacing a sensor with a microcontroller.",
        "reward": 444,
        "deadline": "2026-10-08"
    },
    {
        "title": "I2C Debugging",
        "description": "Need assistance troubleshooting I2C communication in a prototype.",
        "reward": 619,
        "deadline": "2026-10-08"
    },
    {
        "title": "SPI Setup",
        "description": "Looking for help connecting an SPI peripheral to a microcontroller.",
        "reward": 794,
        "deadline": "2026-10-08"
    },
    {
        "title": "UART Debugging",
        "description": "Need help diagnosing UART communication issues.",
        "reward": 969,
        "deadline": "2026-10-08"
    },
    {
        "title": "PCB Review",
        "description": "Need someone to review a small student PCB design.",
        "reward": 1144,
        "deadline": "2026-10-08"
    },
    {
        "title": "KiCad Schematic",
        "description": "Looking for help drawing a clean KiCad schematic.",
        "reward": 1319,
        "deadline": "2026-10-08"
    },
    {
        "title": "Gerber Check",
        "description": "Need assistance checking Gerber files before fabrication.",
        "reward": 1494,
        "deadline": "2026-10-08"
    },
    {
        "title": "Embedded C Bug",
        "description": "Need help debugging an Embedded C program.",
        "reward": 1669,
        "deadline": "2026-10-08"
    },
    {
        "title": "PWM Control",
        "description": "Looking for help implementing PWM control for a student prototype.",
        "reward": 1844,
        "deadline": "2026-10-08"
    },
    {
        "title": "OLED Display",
        "description": "Need help interfacing a small OLED display with a microcontroller.",
        "reward": 2019,
        "deadline": "2026-10-08"
    },
    {
        "title": "Rotary Encoder",
        "description": "Need assistance reading a rotary encoder reliably.",
        "reward": 2194,
        "deadline": "2026-10-08"
    },
    {
        "title": "ADC Reading",
        "description": "Looking for help interpreting ADC readings from a sensor.",
        "reward": 2369,
        "deadline": "2026-10-08"
    },
    {
        "title": "Motor Driver",
        "description": "Need help wiring and controlling a small DC motor safely.",
        "reward": 2544,
        "deadline": "2026-10-08"
    },
    {
        "title": "Bluetooth ESP32",
        "description": "Need assistance sending sensor data over Bluetooth using ESP32.",
        "reward": 2719,
        "deadline": "2026-10-08"
    },
    {
        "title": "IoT Prototype",
        "description": "Looking for help building a small IoT proof of concept.",
        "reward": 2894,
        "deadline": "2026-10-08"
    },
    {
        "title": "Power Supply Check",
        "description": "Need help reviewing the power section of a student circuit.",
        "reward": 3069,
        "deadline": "2026-10-08"
    },
    {
        "title": "Soldering Help",
        "description": "Looking for someone experienced with basic PCB soldering.",
        "reward": 3244,
        "deadline": "2026-10-08"
    },
    {
        "title": "Microcontroller Documentation",
        "description": "Need concise documentation for an embedded student project.",
        "reward": 3419,
        "deadline": "2026-10-08"
    },
    {
        "title": "Line Follower",
        "description": "Need help debugging a line-following robot.",
        "reward": 3594,
        "deadline": "2026-10-08"
    },
    {
        "title": "Obstacle Avoidance",
        "description": "Looking for assistance tuning an obstacle-avoidance robot.",
        "reward": 3769,
        "deadline": "2026-10-08"
    },
    {
        "title": "Robot CAD",
        "description": "Need a simple CAD model for a student robot chassis.",
        "reward": 3944,
        "deadline": "2026-10-08"
    },
    {
        "title": "Servo Control",
        "description": "Need help controlling multiple servos from a microcontroller.",
        "reward": 4119,
        "deadline": "2026-10-08"
    },
    {
        "title": "Robot Wiring",
        "description": "Looking for help cleaning up wiring on a student robot.",
        "reward": 4294,
        "deadline": "2026-10-08"
    },
    {
        "title": "PID Tuning",
        "description": "Need assistance tuning PID control for a small robot.",
        "reward": 4469,
        "deadline": "2026-10-08"
    },
    {
        "title": "Motor Calibration",
        "description": "Need help calibrating motors for consistent movement.",
        "reward": 4644,
        "deadline": "2026-10-08"
    },
    {
        "title": "Robot Sensor Fusion",
        "description": "Looking for help combining readings from two robot sensors.",
        "reward": 4819,
        "deadline": "2026-10-08"
    },
    {
        "title": "Bluetooth Robot",
        "description": "Need help controlling a small robot over Bluetooth.",
        "reward": 4994,
        "deadline": "2026-10-08"
    },
    {
        "title": "Robot Documentation",
        "description": "Need help documenting the design and testing of a student robot.",
        "reward": 468,
        "deadline": "2026-10-08"
    },
    {
        "title": "Robotic Arm Demo",
        "description": "Looking for assistance with a small robotic-arm demonstration.",
        "reward": 643,
        "deadline": "2026-10-08"
    },
    {
        "title": "Ultrasonic Sensor",
        "description": "Need help using ultrasonic sensors for distance measurement.",
        "reward": 818,
        "deadline": "2026-10-08"
    },
    {
        "title": "IR Sensor Array",
        "description": "Need help calibrating an IR sensor array.",
        "reward": 993,
        "deadline": "2026-10-08"
    },
    {
        "title": "Robot Simulation",
        "description": "Looking for help setting up a simple robot simulation.",
        "reward": 1168,
        "deadline": "2026-10-08"
    },
    {
        "title": "Robot Presentation",
        "description": "Need help explaining a robotics project clearly in slides.",
        "reward": 1343,
        "deadline": "2026-10-08"
    },
    {
        "title": "Chassis Design",
        "description": "Need a lightweight chassis concept for a student robot.",
        "reward": 1518,
        "deadline": "2026-10-08"
    },
    {
        "title": "Robot Troubleshooting",
        "description": "Looking for someone to diagnose a non-working robot prototype.",
        "reward": 1693,
        "deadline": "2026-10-08"
    },
    {
        "title": "Autonomous Navigation",
        "description": "Need help with basic autonomous navigation logic.",
        "reward": 1868,
        "deadline": "2026-10-08"
    },
    {
        "title": "Robot Competition Prep",
        "description": "Looking for testing and debugging help before a student competition.",
        "reward": 2043,
        "deadline": "2026-10-08"
    },
    {
        "title": "Robot BOM",
        "description": "Need help preparing a bill of materials for a student robot.",
        "reward": 2218,
        "deadline": "2026-10-08"
    },
    {
        "title": "Lab Report Formatting",
        "description": "Need help formatting a college laboratory report professionally.",
        "reward": 2393,
        "deadline": "2026-10-08"
    },
    {
        "title": "Research Summary",
        "description": "Looking for help turning research notes into a concise summary.",
        "reward": 2568,
        "deadline": "2026-10-08"
    },
    {
        "title": "Literature Review Structure",
        "description": "Need guidance organizing a literature review for a student project.",
        "reward": 2743,
        "deadline": "2026-10-08"
    },
    {
        "title": "Technical Report Editing",
        "description": "Need proofreading and clarity improvements for a technical report.",
        "reward": 2918,
        "deadline": "2026-10-08"
    },
    {
        "title": "Abstract Editing",
        "description": "Looking for help making a project abstract concise and clear.",
        "reward": 3093,
        "deadline": "2026-10-08"
    },
    {
        "title": "References Formatting",
        "description": "Need help formatting references consistently in a report.",
        "reward": 3268,
        "deadline": "2026-10-08"
    },
    {
        "title": "Project Introduction",
        "description": "Need help improving the introduction of a college project report.",
        "reward": 3443,
        "deadline": "2026-10-08"
    },
    {
        "title": "Methodology Writing",
        "description": "Looking for help clearly describing a project methodology.",
        "reward": 3618,
        "deadline": "2026-10-08"
    },
    {
        "title": "Results Section Editing",
        "description": "Need help presenting experimental results clearly.",
        "reward": 3793,
        "deadline": "2026-10-08"
    },
    {
        "title": "Conclusion Editing",
        "description": "Need help writing a concise conclusion for a project report.",
        "reward": 3968,
        "deadline": "2026-10-08"
    },
    {
        "title": "Research Poster Text",
        "description": "Need concise text for a student research poster.",
        "reward": 4143,
        "deadline": "2026-10-08"
    },
    {
        "title": "Case Study Writing",
        "description": "Looking for help structuring a college case study.",
        "reward": 4318,
        "deadline": "2026-10-08"
    },
    {
        "title": "Technical Proofreading",
        "description": "Need proofreading for grammar and technical clarity.",
        "reward": 4493,
        "deadline": "2026-10-08"
    },
    {
        "title": "Citation Cleanup",
        "description": "Need help checking citation formatting in a student document.",
        "reward": 4668,
        "deadline": "2026-10-08"
    },
    {
        "title": "Report Table Cleanup",
        "description": "Looking for help making tables in a report consistent.",
        "reward": 4843,
        "deadline": "2026-10-08"
    },
    {
        "title": "Project Documentation",
        "description": "Need readable documentation for a student engineering project.",
        "reward": 317,
        "deadline": "2026-10-08"
    },
    {
        "title": "Seminar Notes",
        "description": "Need help turning seminar notes into structured study material.",
        "reward": 492,
        "deadline": "2026-10-08"
    },
    {
        "title": "Presentation Script",
        "description": "Looking for help creating speaker notes from existing slides.",
        "reward": 667,
        "deadline": "2026-10-08"
    },
    {
        "title": "Research Outline",
        "description": "Need help organizing sections for a student research paper.",
        "reward": 842,
        "deadline": "2026-10-08"
    },
    {
        "title": "Essay Editing",
        "description": "Need proofreading and structure suggestions for a college essay.",
        "reward": 1017,
        "deadline": "2026-10-08"
    },
    {
        "title": "Calculus Doubt Session",
        "description": "Need a short tutoring session for calculus concepts before an assignment.",
        "reward": 1192,
        "deadline": "2026-10-08"
    },
    {
        "title": "Linear Algebra Help",
        "description": "Looking for help understanding a difficult linear algebra problem set.",
        "reward": 1367,
        "deadline": "2026-10-08"
    },
    {
        "title": "Probability Assignment",
        "description": "Need guidance understanding probability assignment questions.",
        "reward": 1542,
        "deadline": "2026-10-08"
    },
    {
        "title": "Data Structures Doubts",
        "description": "Looking for help understanding trees and graph problems.",
        "reward": 1717,
        "deadline": "2026-10-08"
    },
    {
        "title": "Operating Systems Doubts",
        "description": "Need help understanding process scheduling concepts.",
        "reward": 1892,
        "deadline": "2026-10-08"
    },
    {
        "title": "DBMS Assignment Help",
        "description": "Looking for conceptual guidance on a database assignment.",
        "reward": 2067,
        "deadline": "2026-10-08"
    },
    {
        "title": "Computer Networks Help",
        "description": "Need help understanding subnetting for coursework.",
        "reward": 2242,
        "deadline": "2026-10-08"
    },
    {
        "title": "Digital Electronics Doubts",
        "description": "Looking for help with digital electronics assignment concepts.",
        "reward": 2417,
        "deadline": "2026-10-08"
    },
    {
        "title": "Signals Systems Help",
        "description": "Need tutoring on a difficult signals and systems topic.",
        "reward": 2592,
        "deadline": "2026-10-08"
    },
    {
        "title": "DSP Problem Solving",
        "description": "Looking for help understanding DSP numerical problems.",
        "reward": 2767,
        "deadline": "2026-10-08"
    },
    {
        "title": "Microprocessor Doubts",
        "description": "Need help understanding an 8086 programming assignment.",
        "reward": 2942,
        "deadline": "2026-10-08"
    },
    {
        "title": "Control Systems Help",
        "description": "Looking for tutoring on control-systems block diagrams.",
        "reward": 3117,
        "deadline": "2026-10-08"
    },
    {
        "title": "Economics Assignment",
        "description": "Need conceptual guidance for a college economics assignment.",
        "reward": 3292,
        "deadline": "2026-10-08"
    },
    {
        "title": "Accounting Problem Help",
        "description": "Looking for help understanding an accounting problem set.",
        "reward": 3467,
        "deadline": "2026-10-08"
    },
    {
        "title": "Statistics Doubts",
        "description": "Need help understanding hypothesis testing for coursework.",
        "reward": 3642,
        "deadline": "2026-10-08"
    },
    {
        "title": "Physics Numericals",
        "description": "Looking for tutoring on difficult physics numericals.",
        "reward": 3817,
        "deadline": "2026-10-08"
    },
    {
        "title": "Chemistry Concepts",
        "description": "Need help understanding concepts for a chemistry assignment.",
        "reward": 3992,
        "deadline": "2026-10-08"
    },
    {
        "title": "Engineering Mechanics",
        "description": "Looking for help with engineering mechanics problems.",
        "reward": 4167,
        "deadline": "2026-10-08"
    },
    {
        "title": "Discrete Mathematics",
        "description": "Need help understanding discrete mathematics exercises.",
        "reward": 4342,
        "deadline": "2026-10-08"
    },
    {
        "title": "Numerical Methods",
        "description": "Looking for guidance on numerical-methods coursework.",
        "reward": 4517,
        "deadline": "2026-10-08"
    },
    {
        "title": "Calculus Tutoring",
        "description": "Need a one-hour tutoring session covering integration techniques.",
        "reward": 4692,
        "deadline": "2026-10-08"
    },
    {
        "title": "Algebra Tutoring",
        "description": "Looking for help revising algebra before an exam.",
        "reward": 4867,
        "deadline": "2026-10-08"
    },
    {
        "title": "Statistics Tutoring",
        "description": "Need a student tutor for statistics concepts.",
        "reward": 341,
        "deadline": "2026-10-08"
    },
    {
        "title": "Probability Tutoring",
        "description": "Looking for help with conditional probability and Bayes theorem.",
        "reward": 516,
        "deadline": "2026-10-08"
    },
    {
        "title": "Geometry Tutoring",
        "description": "Need help understanding coordinate geometry problems.",
        "reward": 691,
        "deadline": "2026-10-08"
    },
    {
        "title": "Discrete Math Tutoring",
        "description": "Looking for help with graphs, logic, and combinatorics.",
        "reward": 866,
        "deadline": "2026-10-08"
    },
    {
        "title": "Number Theory Help",
        "description": "Need a tutoring session on basic number theory.",
        "reward": 1041,
        "deadline": "2026-10-08"
    },
    {
        "title": "Differential Equations",
        "description": "Looking for help solving introductory differential equations.",
        "reward": 1216,
        "deadline": "2026-10-08"
    },
    {
        "title": "Optimization Problems",
        "description": "Need guidance on basic optimization problems.",
        "reward": 1391,
        "deadline": "2026-10-08"
    },
    {
        "title": "Matrix Algebra",
        "description": "Looking for help understanding matrix operations.",
        "reward": 1566,
        "deadline": "2026-10-08"
    },
    {
        "title": "Fourier Series Help",
        "description": "Need tutoring on Fourier series and transforms.",
        "reward": 1741,
        "deadline": "2026-10-08"
    },
    {
        "title": "Complex Analysis Basics",
        "description": "Looking for help understanding introductory complex analysis.",
        "reward": 1916,
        "deadline": "2026-10-08"
    },
    {
        "title": "Vector Calculus",
        "description": "Need help with gradient, divergence, and curl concepts.",
        "reward": 2091,
        "deadline": "2026-10-08"
    },
    {
        "title": "Numerical Integration",
        "description": "Looking for help understanding numerical integration.",
        "reward": 2266,
        "deadline": "2026-10-08"
    },
    {
        "title": "Probability Revision",
        "description": "Need a quick revision session before a probability quiz.",
        "reward": 2441,
        "deadline": "2026-10-08"
    },
    {
        "title": "Statistics Visualization",
        "description": "Need help choosing charts for a statistics assignment.",
        "reward": 2616,
        "deadline": "2026-10-08"
    },
    {
        "title": "Math Presentation",
        "description": "Looking for help making a math topic understandable in slides.",
        "reward": 2791,
        "deadline": "2026-10-08"
    },
    {
        "title": "Formula Sheet",
        "description": "Need help organizing a concise formula sheet for revision.",
        "reward": 2966,
        "deadline": "2026-10-08"
    },
    {
        "title": "Math Problem Review",
        "description": "Looking for someone to review my solutions for mistakes.",
        "reward": 3141,
        "deadline": "2026-10-08"
    },
    {
        "title": "Exam Revision Session",
        "description": "Need a focused tutoring session for an upcoming math exam.",
        "reward": 3316,
        "deadline": "2026-10-08"
    },
    {
        "title": "Resume Review",
        "description": "Looking for a peer to review my software internship resume.",
        "reward": 3491,
        "deadline": "2026-10-08"
    },
    {
        "title": "ATS Resume Check",
        "description": "Need help identifying obvious ATS issues in a student resume.",
        "reward": 3666,
        "deadline": "2026-10-08"
    },
    {
        "title": "LinkedIn Profile Review",
        "description": "Need feedback on the clarity of a student LinkedIn profile.",
        "reward": 3841,
        "deadline": "2026-10-08"
    },
    {
        "title": "GitHub Profile Cleanup",
        "description": "Looking for help organizing a student GitHub profile.",
        "reward": 4016,
        "deadline": "2026-10-08"
    },
    {
        "title": "Portfolio Review",
        "description": "Need feedback on my developer portfolio.",
        "reward": 4191,
        "deadline": "2026-10-08"
    },
    {
        "title": "Mock SDE Interview",
        "description": "Looking for a peer mock interview for an entry-level software role.",
        "reward": 4366,
        "deadline": "2026-10-08"
    },
    {
        "title": "DSA Mock Interview",
        "description": "Need a timed DSA interview practice session.",
        "reward": 4541,
        "deadline": "2026-10-08"
    },
    {
        "title": "Behavioral Mock Interview",
        "description": "Looking for behavioral interview practice with feedback.",
        "reward": 4716,
        "deadline": "2026-10-08"
    },
    {
        "title": "Project Explanation Practice",
        "description": "Need someone to challenge me on explaining my projects.",
        "reward": 4891,
        "deadline": "2026-10-08"
    },
    {
        "title": "Cover Letter Review",
        "description": "Need proofreading for an internship cover letter.",
        "reward": 365,
        "deadline": "2026-10-08"
    },
    {
        "title": "Job Search Setup",
        "description": "Looking for help organizing a job-search tracker.",
        "reward": 540,
        "deadline": "2026-10-08"
    },
    {
        "title": "GitHub README",
        "description": "Need help writing clear README files for student projects.",
        "reward": 715,
        "deadline": "2026-10-08"
    },
    {
        "title": "Technical Profile Bio",
        "description": "Looking for help writing a concise developer bio.",
        "reward": 890,
        "deadline": "2026-10-08"
    },
    {
        "title": "Resume Bullet Editing",
        "description": "Need help making project bullets concise and specific.",
        "reward": 1065,
        "deadline": "2026-10-08"
    },
    {
        "title": "Interview Question Practice",
        "description": "Looking for a partner to practice common technical questions.",
        "reward": 1240,
        "deadline": "2026-10-08"
    },
    {
        "title": "System Design Basics",
        "description": "Need a beginner-friendly system design practice session.",
        "reward": 1415,
        "deadline": "2026-10-08"
    },
    {
        "title": "Coding Contest Practice",
        "description": "Looking for a partner for timed competitive-programming practice.",
        "reward": 1590,
        "deadline": "2026-10-08"
    },
    {
        "title": "Internship Application Review",
        "description": "Need another student to review an internship application.",
        "reward": 1765,
        "deadline": "2026-10-08"
    },
    {
        "title": "Career Roadmap Review",
        "description": "Looking for a peer discussion on an early software career roadmap.",
        "reward": 1940,
        "deadline": "2026-10-08"
    },
    {
        "title": "Portfolio Deployment",
        "description": "Need help deploying a static developer portfolio.",
        "reward": 2115,
        "deadline": "2026-10-08"
    },
    {
        "title": "Blog Article",
        "description": "Need a student writer for a short technical blog article.",
        "reward": 2290,
        "deadline": "2026-10-08"
    },
    {
        "title": "Technical Blog Editing",
        "description": "Looking for help editing a draft technical blog.",
        "reward": 2465,
        "deadline": "2026-10-08"
    },
    {
        "title": "Campus Newsletter",
        "description": "Need help writing a short campus newsletter section.",
        "reward": 2640,
        "deadline": "2026-10-08"
    },
    {
        "title": "Event Announcement",
        "description": "Need concise copy for a college event announcement.",
        "reward": 2815,
        "deadline": "2026-10-08"
    },
    {
        "title": "Instagram Caption",
        "description": "Looking for engaging captions for a student society page.",
        "reward": 2990,
        "deadline": "2026-10-08"
    },
    {
        "title": "YouTube Script",
        "description": "Need a short script for a student educational video.",
        "reward": 3165,
        "deadline": "2026-10-08"
    },
    {
        "title": "Podcast Script",
        "description": "Looking for help outlining a student podcast episode.",
        "reward": 3340,
        "deadline": "2026-10-08"
    },
    {
        "title": "Club Description",
        "description": "Need a clear description for a college club profile.",
        "reward": 3515,
        "deadline": "2026-10-08"
    },
    {
        "title": "Project Description",
        "description": "Need help writing a concise description of a student project.",
        "reward": 3690,
        "deadline": "2026-10-08"
    },
    {
        "title": "Event Host Script",
        "description": "Looking for a script for hosting a college event.",
        "reward": 3865,
        "deadline": "2026-10-08"
    },
    {
        "title": "Speech Draft",
        "description": "Need help structuring a short college speech.",
        "reward": 4040,
        "deadline": "2026-10-08"
    },
    {
        "title": "Newsletter Editing",
        "description": "Need proofreading for a student newsletter.",
        "reward": 4215,
        "deadline": "2026-10-08"
    },
    {
        "title": "Product Description",
        "description": "Looking for copy for a student-made product listing.",
        "reward": 4390,
        "deadline": "2026-10-08"
    },
    {
        "title": "Social Media Calendar",
        "description": "Need help drafting a one-week content calendar.",
        "reward": 4565,
        "deadline": "2026-10-08"
    },
    {
        "title": "Technical Explainer",
        "description": "Need a simple explanation of a technical topic for beginners.",
        "reward": 4740,
        "deadline": "2026-10-08"
    },
    {
        "title": "Study Guide Writing",
        "description": "Looking for help turning notes into a concise study guide.",
        "reward": 4915,
        "deadline": "2026-10-08"
    },
    {
        "title": "FAQ Writing",
        "description": "Need FAQs written for a student application or event.",
        "reward": 389,
        "deadline": "2026-10-08"
    },
    {
        "title": "Interview Questions",
        "description": "Need thoughtful interview questions for a college podcast.",
        "reward": 564,
        "deadline": "2026-10-08"
    },
    {
        "title": "Proofreading",
        "description": "Looking for grammar and clarity checks on a student article.",
        "reward": 739,
        "deadline": "2026-10-08"
    },
    {
        "title": "Creative Writing Feedback",
        "description": "Need constructive feedback on a short student story.",
        "reward": 914,
        "deadline": "2026-10-08"
    },
    {
        "title": "Hindi Translation",
        "description": "Need a short student announcement translated into Hindi.",
        "reward": 1089,
        "deadline": "2026-10-08"
    },
    {
        "title": "English Proofreading",
        "description": "Looking for proofreading of a college application in English.",
        "reward": 1264,
        "deadline": "2026-10-08"
    },
    {
        "title": "Spanish Translation",
        "description": "Need a short non-sensitive event description translated into Spanish.",
        "reward": 1439,
        "deadline": "2026-10-08"
    },
    {
        "title": "French Translation",
        "description": "Looking for help translating a short student club description into French.",
        "reward": 1614,
        "deadline": "2026-10-08"
    },
    {
        "title": "German Translation",
        "description": "Need a short project summary translated into German.",
        "reward": 1789,
        "deadline": "2026-10-08"
    },
    {
        "title": "Japanese Translation",
        "description": "Looking for help translating a simple student event description.",
        "reward": 1964,
        "deadline": "2026-10-08"
    },
    {
        "title": "Korean Translation",
        "description": "Need a short social media announcement translated into Korean.",
        "reward": 2139,
        "deadline": "2026-10-08"
    },
    {
        "title": "Tamil Translation",
        "description": "Looking for help translating a campus announcement into Tamil.",
        "reward": 2314,
        "deadline": "2026-10-08"
    },
    {
        "title": "Bengali Translation",
        "description": "Need a short event notice translated into Bengali.",
        "reward": 2489,
        "deadline": "2026-10-08"
    },
    {
        "title": "Marathi Translation",
        "description": "Looking for help translating a student society message into Marathi.",
        "reward": 2664,
        "deadline": "2026-10-08"
    },
    {
        "title": "Punjabi Translation",
        "description": "Need a short cultural-event announcement translated into Punjabi.",
        "reward": 2839,
        "deadline": "2026-10-08"
    },
    {
        "title": "Telugu Translation",
        "description": "Looking for help translating a college notice into Telugu.",
        "reward": 3014,
        "deadline": "2026-10-08"
    },
    {
        "title": "Gujarati Translation",
        "description": "Need a short student event description translated into Gujarati.",
        "reward": 3189,
        "deadline": "2026-10-08"
    },
    {
        "title": "Malayalam Translation",
        "description": "Looking for help translating a club announcement into Malayalam.",
        "reward": 3364,
        "deadline": "2026-10-08"
    },
    {
        "title": "Kannada Translation",
        "description": "Need a short college event notice translated into Kannada.",
        "reward": 3539,
        "deadline": "2026-10-08"
    },
    {
        "title": "Pronunciation Practice",
        "description": "Looking for a language partner for conversational pronunciation practice.",
        "reward": 3714,
        "deadline": "2026-10-08"
    },
    {
        "title": "Conversation Practice",
        "description": "Need a partner to practice spoken English for interviews.",
        "reward": 3889,
        "deadline": "2026-10-08"
    },
    {
        "title": "Vocabulary Help",
        "description": "Looking for help building vocabulary for a language exam.",
        "reward": 4064,
        "deadline": "2026-10-08"
    },
    {
        "title": "Presentation Translation",
        "description": "Need a short student presentation translated into another language.",
        "reward": 4239,
        "deadline": "2026-10-08"
    },
    {
        "title": "Bilingual Poster Copy",
        "description": "Need bilingual copy for a college cultural event poster.",
        "reward": 4414,
        "deadline": "2026-10-08"
    },
    {
        "title": "Event Volunteer",
        "description": "Need a volunteer to help manage registrations at a campus event.",
        "reward": 4589,
        "deadline": "2026-10-08"
    },
    {
        "title": "Registration Desk",
        "description": "Looking for someone to handle check-ins during a student workshop.",
        "reward": 4764,
        "deadline": "2026-10-08"
    },
    {
        "title": "Stage Management",
        "description": "Need help coordinating speakers and performers backstage.",
        "reward": 4939,
        "deadline": "2026-10-08"
    },
    {
        "title": "Event Logistics",
        "description": "Looking for help moving and organizing event materials.",
        "reward": 413,
        "deadline": "2026-10-08"
    },
    {
        "title": "Audience Coordination",
        "description": "Need someone to guide attendees during a college event.",
        "reward": 588,
        "deadline": "2026-10-08"
    },
    {
        "title": "Speaker Coordination",
        "description": "Looking for help coordinating student-event speakers.",
        "reward": 763,
        "deadline": "2026-10-08"
    },
    {
        "title": "Quiz Master",
        "description": "Need someone to host a small college quiz.",
        "reward": 938,
        "deadline": "2026-10-08"
    },
    {
        "title": "Event Photographer",
        "description": "Looking for a photographer for a student society event.",
        "reward": 1113,
        "deadline": "2026-10-08"
    },
    {
        "title": "Event Videographer",
        "description": "Need video coverage for a campus workshop.",
        "reward": 1288,
        "deadline": "2026-10-08"
    },
    {
        "title": "Decoration Help",
        "description": "Need students to help decorate a venue for a college event.",
        "reward": 1463,
        "deadline": "2026-10-08"
    },
    {
        "title": "Anchoring Help",
        "description": "Looking for a confident student to anchor an event.",
        "reward": 1638,
        "deadline": "2026-10-08"
    },
    {
        "title": "Registration Form Setup",
        "description": "Need help creating an online registration form.",
        "reward": 1813,
        "deadline": "2026-10-08"
    },
    {
        "title": "Event Schedule",
        "description": "Looking for help organizing the timeline for a student event.",
        "reward": 1988,
        "deadline": "2026-10-08"
    },
    {
        "title": "Sponsorship Deck",
        "description": "Need help preparing a sponsorship presentation.",
        "reward": 2163,
        "deadline": "2026-10-08"
    },
    {
        "title": "Event Budget Sheet",
        "description": "Looking for help organizing a small event budget.",
        "reward": 2338,
        "deadline": "2026-10-08"
    },
    {
        "title": "Guest Welcome",
        "description": "Need someone to welcome guests at a campus function.",
        "reward": 2513,
        "deadline": "2026-10-08"
    },
    {
        "title": "Workshop Assistant",
        "description": "Looking for an assistant for a hands-on student workshop.",
        "reward": 2688,
        "deadline": "2026-10-08"
    },
    {
        "title": "Crowd Flow Planning",
        "description": "Need help planning attendee movement for a campus event.",
        "reward": 2863,
        "deadline": "2026-10-08"
    },
    {
        "title": "Event Feedback Form",
        "description": "Need help creating a concise post-event feedback form.",
        "reward": 3038,
        "deadline": "2026-10-08"
    },
    {
        "title": "Event Recap",
        "description": "Looking for someone to write a short recap after a college event.",
        "reward": 3213,
        "deadline": "2026-10-08"
    },
    {
        "title": "Instagram Strategy",
        "description": "Need help planning content for a small student organization.",
        "reward": 3388,
        "deadline": "2026-10-08"
    },
    {
        "title": "Hashtag Research",
        "description": "Looking for relevant hashtags for a college event campaign.",
        "reward": 3563,
        "deadline": "2026-10-08"
    },
    {
        "title": "Social Media Audit",
        "description": "Need a basic audit of a student club's social media page.",
        "reward": 3738,
        "deadline": "2026-10-08"
    },
    {
        "title": "Reel Ideas",
        "description": "Looking for short-form video ideas for a student society.",
        "reward": 3913,
        "deadline": "2026-10-08"
    },
    {
        "title": "Content Calendar",
        "description": "Need a one-week social content calendar for a campus event.",
        "reward": 4088,
        "deadline": "2026-10-08"
    },
    {
        "title": "Community Outreach",
        "description": "Looking for ideas and execution help for student outreach.",
        "reward": 4263,
        "deadline": "2026-10-08"
    },
    {
        "title": "Email Campaign Copy",
        "description": "Need concise copy for a student event email campaign.",
        "reward": 4438,
        "deadline": "2026-10-08"
    },
    {
        "title": "Campus Promotion",
        "description": "Need help promoting a student event across campus channels.",
        "reward": 4613,
        "deadline": "2026-10-08"
    },
    {
        "title": "Social Caption Writing",
        "description": "Looking for captions for a series of student event posts.",
        "reward": 4788,
        "deadline": "2026-10-08"
    },
    {
        "title": "Engagement Ideas",
        "description": "Need ideas for increasing engagement on a student society page.",
        "reward": 4963,
        "deadline": "2026-10-08"
    },
    {
        "title": "Club Branding",
        "description": "Looking for help defining a consistent visual identity for a student club.",
        "reward": 437,
        "deadline": "2026-10-08"
    },
    {
        "title": "Campaign Concept",
        "description": "Need a creative campaign concept for a campus initiative.",
        "reward": 612,
        "deadline": "2026-10-08"
    },
    {
        "title": "Survey Promotion",
        "description": "Looking for help getting students to participate in a survey.",
        "reward": 787,
        "deadline": "2026-10-08"
    },
    {
        "title": "Event Teaser",
        "description": "Need a short teaser campaign for an upcoming college event.",
        "reward": 962,
        "deadline": "2026-10-08"
    },
    {
        "title": "Student Community Post",
        "description": "Need copy for a community announcement.",
        "reward": 1137,
        "deadline": "2026-10-08"
    },
    {
        "title": "Social Media Scheduling",
        "description": "Looking for help organizing posts for the next week.",
        "reward": 1312,
        "deadline": "2026-10-08"
    },
    {
        "title": "Content Repurposing",
        "description": "Need help turning an event recording into multiple short posts.",
        "reward": 1487,
        "deadline": "2026-10-08"
    },
    {
        "title": "Campus Influencer Outreach",
        "description": "Looking for help drafting outreach messages to student creators.",
        "reward": 1662,
        "deadline": "2026-10-08"
    },
    {
        "title": "Poll Questions",
        "description": "Need engaging poll questions for a student community.",
        "reward": 1837,
        "deadline": "2026-10-08"
    },
    {
        "title": "Campaign Report",
        "description": "Need a simple summary of social campaign performance.",
        "reward": 2012,
        "deadline": "2026-10-08"
    },
    {
        "title": "Pitch Deck Review",
        "description": "Need feedback on a student startup pitch deck.",
        "reward": 2187,
        "deadline": "2026-10-08"
    },
    {
        "title": "Business Model Canvas",
        "description": "Looking for help structuring a business model canvas.",
        "reward": 2362,
        "deadline": "2026-10-08"
    },
    {
        "title": "Market Research",
        "description": "Need basic desk research for a student startup idea.",
        "reward": 2537,
        "deadline": "2026-10-08"
    },
    {
        "title": "Competitor Research",
        "description": "Looking for help comparing competitors for a college project.",
        "reward": 2712,
        "deadline": "2026-10-08"
    },
    {
        "title": "Startup Landing Page",
        "description": "Need a simple landing page for a student startup concept.",
        "reward": 2887,
        "deadline": "2026-10-08"
    },
    {
        "title": "Customer Survey",
        "description": "Need help designing a short customer discovery survey.",
        "reward": 3062,
        "deadline": "2026-10-08"
    },
    {
        "title": "Survey Analysis",
        "description": "Looking for help summarizing responses from a student startup survey.",
        "reward": 3237,
        "deadline": "2026-10-08"
    },
    {
        "title": "Pricing Brainstorm",
        "description": "Need a structured brainstorming session around pricing options.",
        "reward": 3412,
        "deadline": "2026-10-08"
    },
    {
        "title": "Pitch Practice",
        "description": "Looking for someone to challenge a student startup pitch.",
        "reward": 3587,
        "deadline": "2026-10-08"
    },
    {
        "title": "Business Presentation",
        "description": "Need help polishing a startup presentation.",
        "reward": 3762,
        "deadline": "2026-10-08"
    },
    {
        "title": "Market Sizing",
        "description": "Need help understanding TAM, SAM, and SOM for a project.",
        "reward": 3937,
        "deadline": "2026-10-08"
    },
    {
        "title": "Startup Logo",
        "description": "Looking for a simple logo concept for a student venture.",
        "reward": 4112,
        "deadline": "2026-10-08"
    },
    {
        "title": "Founder Profile",
        "description": "Need help writing a concise founder profile.",
        "reward": 4287,
        "deadline": "2026-10-08"
    },
    {
        "title": "Business & Entrepreneurship — Product Description",
        "description": "Need clear copy for a student startup product.",
        "reward": 4462,
        "deadline": "2026-10-08"
    },
    {
        "title": "Customer Persona",
        "description": "Looking for help creating customer personas from interview notes.",
        "reward": 4637,
        "deadline": "2026-10-08"
    },
    {
        "title": "Business Spreadsheet",
        "description": "Need help structuring a basic startup financial spreadsheet.",
        "reward": 4812,
        "deadline": "2026-10-08"
    },
    {
        "title": "Idea Validation",
        "description": "Looking for a peer to challenge assumptions in a startup idea.",
        "reward": 4987,
        "deadline": "2026-10-08"
    },
    {
        "title": "Startup Website Copy",
        "description": "Need concise copy for a student startup website.",
        "reward": 461,
        "deadline": "2026-10-08"
    },
    {
        "title": "Investor FAQ",
        "description": "Need help preparing answers to common pitch questions.",
        "reward": 636,
        "deadline": "2026-10-08"
    },
    {
        "title": "Demo Day Prep",
        "description": "Looking for feedback before a student startup demo day.",
        "reward": 811,
        "deadline": "2026-10-08"
    },
    {
        "title": "Figma Landing Page",
        "description": "Need a clean Figma design for a student project landing page.",
        "reward": 986,
        "deadline": "2026-10-08"
    },
    {
        "title": "Mobile App Wireframe",
        "description": "Looking for wireframes for a small student mobile app.",
        "reward": 1161,
        "deadline": "2026-10-08"
    },
    {
        "title": "UX Review",
        "description": "Need a usability review of a student application.",
        "reward": 1336,
        "deadline": "2026-10-08"
    },
    {
        "title": "Design System",
        "description": "Need a small reusable design system for a student project.",
        "reward": 1511,
        "deadline": "2026-10-08"
    },
    {
        "title": "User Flow",
        "description": "Looking for help mapping a user flow for an app feature.",
        "reward": 1686,
        "deadline": "2026-10-08"
    },
    {
        "title": "Dashboard Design",
        "description": "Need a simple dashboard design for a college project.",
        "reward": 1861,
        "deadline": "2026-10-08"
    },
    {
        "title": "Onboarding Screens",
        "description": "Need onboarding screen designs for a student app.",
        "reward": 2036,
        "deadline": "2026-10-08"
    },
    {
        "title": "Figma Prototype",
        "description": "Looking for a clickable prototype for a student project.",
        "reward": 2211,
        "deadline": "2026-10-08"
    },
    {
        "title": "UX Research Plan",
        "description": "Need help creating a basic user research plan.",
        "reward": 2386,
        "deadline": "2026-10-08"
    },
    {
        "title": "Usability Testing",
        "description": "Looking for students to test a prototype and provide feedback.",
        "reward": 2561,
        "deadline": "2026-10-08"
    },
    {
        "title": "Wireframe Review",
        "description": "Need another designer to review low-fidelity wireframes.",
        "reward": 2736,
        "deadline": "2026-10-08"
    },
    {
        "title": "App Navigation",
        "description": "Need help improving navigation structure in a mobile app.",
        "reward": 2911,
        "deadline": "2026-10-08"
    },
    {
        "title": "Form UX",
        "description": "Looking for better UX for a multi-step form.",
        "reward": 3086,
        "deadline": "2026-10-08"
    },
    {
        "title": "Empty State Design",
        "description": "Need creative empty-state screens for a student application.",
        "reward": 3261,
        "deadline": "2026-10-08"
    },
    {
        "title": "Error State Design",
        "description": "Need clear error-state designs for a web app.",
        "reward": 3436,
        "deadline": "2026-10-08"
    },
    {
        "title": "Accessibility Review",
        "description": "Looking for a basic accessibility review of a student UI.",
        "reward": 3611,
        "deadline": "2026-10-08"
    },
    {
        "title": "Color Palette",
        "description": "Need help selecting a consistent UI color palette.",
        "reward": 3786,
        "deadline": "2026-10-08"
    },
    {
        "title": "Typography Pairing",
        "description": "Looking for typography recommendations for a student project.",
        "reward": 3961,
        "deadline": "2026-10-08"
    },
    {
        "title": "Design Handoff",
        "description": "Need help preparing Figma designs for developer handoff.",
        "reward": 4136,
        "deadline": "2026-10-08"
    },
    {
        "title": "Portfolio Case Study",
        "description": "Need help presenting a student design project as a case study.",
        "reward": 4311,
        "deadline": "2026-10-08"
    },
    {
        "title": "Unity Bug Fix",
        "description": "Need help fixing a small Unity project bug.",
        "reward": 4486,
        "deadline": "2026-10-08"
    },
    {
        "title": "Godot Prototype",
        "description": "Looking for help building a tiny Godot game prototype.",
        "reward": 4661,
        "deadline": "2026-10-08"
    },
    {
        "title": "Game UI Design",
        "description": "Need interface assets for a student game project.",
        "reward": 4836,
        "deadline": "2026-10-08"
    },
    {
        "title": "2D Game Art",
        "description": "Looking for simple 2D assets for a college game project.",
        "reward": 310,
        "deadline": "2026-10-08"
    },
    {
        "title": "Game Sound Effects",
        "description": "Need original sound effects for a small student game.",
        "reward": 485,
        "deadline": "2026-10-08"
    },
    {
        "title": "Game Level Design",
        "description": "Looking for help designing one beginner-friendly game level.",
        "reward": 660,
        "deadline": "2026-10-08"
    },
    {
        "title": "Unity UI",
        "description": "Need a simple menu UI implemented in Unity.",
        "reward": 835,
        "deadline": "2026-10-08"
    },
    {
        "title": "Game Testing",
        "description": "Looking for testers to find bugs in a student game.",
        "reward": 1010,
        "deadline": "2026-10-08"
    },
    {
        "title": "Game Trailer Edit",
        "description": "Need a short trailer edited from gameplay footage.",
        "reward": 1185,
        "deadline": "2026-10-08"
    },
    {
        "title": "Pixel Art",
        "description": "Need pixel-art assets for a student game.",
        "reward": 1360,
        "deadline": "2026-10-08"
    },
    {
        "title": "Game Character Concept",
        "description": "Looking for a character concept for a small game.",
        "reward": 1535,
        "deadline": "2026-10-08"
    },
    {
        "title": "Game Mechanics Review",
        "description": "Need feedback on mechanics in a student game prototype.",
        "reward": 1710,
        "deadline": "2026-10-08"
    },
    {
        "title": "Godot UI",
        "description": "Need help creating a simple UI scene in Godot.",
        "reward": 1885,
        "deadline": "2026-10-08"
    },
    {
        "title": "Unity Animation",
        "description": "Looking for help implementing a basic character animation.",
        "reward": 2060,
        "deadline": "2026-10-08"
    },
    {
        "title": "Game Documentation",
        "description": "Need concise documentation for a student game project.",
        "reward": 2235,
        "deadline": "2026-10-08"
    },
    {
        "title": "Level Playtest",
        "description": "Looking for someone to playtest a level and report issues.",
        "reward": 2410,
        "deadline": "2026-10-08"
    },
    {
        "title": "Game Menu Music",
        "description": "Need a short original loop for a student game's menu.",
        "reward": 2585,
        "deadline": "2026-10-08"
    },
    {
        "title": "Leaderboard Feature",
        "description": "Need help implementing a simple local leaderboard.",
        "reward": 2760,
        "deadline": "2026-10-08"
    },
    {
        "title": "Game Save System",
        "description": "Looking for help implementing a basic save system.",
        "reward": 2935,
        "deadline": "2026-10-08"
    },
    {
        "title": "Game Project Cleanup",
        "description": "Need help organizing assets and scripts in a student game.",
        "reward": 3110,
        "deadline": "2026-10-08"
    },
    {
        "title": "Presentation Practice",
        "description": "Need a peer to listen to a college presentation and give feedback.",
        "reward": 3285,
        "deadline": "2026-10-08"
    },
    {
        "title": "Interview Speaking",
        "description": "Looking for practice answering interview questions clearly.",
        "reward": 3460,
        "deadline": "2026-10-08"
    },
    {
        "title": "Debate Practice",
        "description": "Need a partner for structured debate practice.",
        "reward": 3635,
        "deadline": "2026-10-08"
    },
    {
        "title": "Anchoring Practice",
        "description": "Looking for feedback on stage anchoring delivery.",
        "reward": 3810,
        "deadline": "2026-10-08"
    },
    {
        "title": "Speech Practice",
        "description": "Need feedback on a short college speech.",
        "reward": 3985,
        "deadline": "2026-10-08"
    },
    {
        "title": "English Speaking",
        "description": "Looking for a conversation partner to practice spoken English.",
        "reward": 4160,
        "deadline": "2026-10-08"
    },
    {
        "title": "Group Discussion",
        "description": "Need a partner to practice group-discussion topics.",
        "reward": 4335,
        "deadline": "2026-10-08"
    },
    {
        "title": "Impromptu Speaking",
        "description": "Looking for practice with impromptu speaking prompts.",
        "reward": 4510,
        "deadline": "2026-10-08"
    },
    {
        "title": "Storytelling Practice",
        "description": "Need feedback on a short storytelling performance.",
        "reward": 4685,
        "deadline": "2026-10-08"
    },
    {
        "title": "Voice Modulation",
        "description": "Looking for coaching on voice modulation for presentations.",
        "reward": 4860,
        "deadline": "2026-10-08"
    },
    {
        "title": "Stage Confidence",
        "description": "Need practice to become more comfortable speaking on stage.",
        "reward": 334,
        "deadline": "2026-10-08"
    },
    {
        "title": "Pitch Delivery",
        "description": "Looking for feedback on delivering a startup pitch.",
        "reward": 509,
        "deadline": "2026-10-08"
    },
    {
        "title": "Demo Presentation",
        "description": "Need a peer to review a technical project demonstration.",
        "reward": 684,
        "deadline": "2026-10-08"
    },
    {
        "title": "Meeting Facilitation",
        "description": "Looking for practice facilitating a student team meeting.",
        "reward": 859,
        "deadline": "2026-10-08"
    },
    {
        "title": "Negotiation Practice",
        "description": "Need a partner for a basic negotiation role-play.",
        "reward": 1034,
        "deadline": "2026-10-08"
    },
    {
        "title": "Professional Introduction",
        "description": "Need feedback on a concise professional introduction.",
        "reward": 1209,
        "deadline": "2026-10-08"
    },
    {
        "title": "Elevator Pitch",
        "description": "Looking for help practicing a 30-second personal pitch.",
        "reward": 1384,
        "deadline": "2026-10-08"
    },
    {
        "title": "Q&A Practice",
        "description": "Need someone to challenge me with questions after a presentation.",
        "reward": 1559,
        "deadline": "2026-10-08"
    },
    {
        "title": "Public Speaking Video Review",
        "description": "Looking for feedback on a recorded presentation.",
        "reward": 1734,
        "deadline": "2026-10-08"
    },
    {
        "title": "Communication Practice",
        "description": "Need a practice partner for clearer professional communication.",
        "reward": 1909,
        "deadline": "2026-10-08"
    },
    {
        "title": "Football Practice Partner",
        "description": "Looking for a college student to practice football drills.",
        "reward": 2084,
        "deadline": "2026-10-08"
    },
    {
        "title": "Basketball Practice",
        "description": "Need a practice partner for shooting drills.",
        "reward": 2259,
        "deadline": "2026-10-08"
    },
    {
        "title": "Badminton Partner",
        "description": "Looking for a regular badminton practice partner.",
        "reward": 2434,
        "deadline": "2026-10-08"
    },
    {
        "title": "Table Tennis Partner",
        "description": "Need a partner for a few table-tennis practice sessions.",
        "reward": 2609,
        "deadline": "2026-10-08"
    },
    {
        "title": "Cricket Net Practice",
        "description": "Looking for a practice partner for cricket nets.",
        "reward": 2784,
        "deadline": "2026-10-08"
    },
    {
        "title": "Running Partner",
        "description": "Need a campus running partner for evening practice.",
        "reward": 2959,
        "deadline": "2026-10-08"
    },
    {
        "title": "Gym Form Check",
        "description": "Looking for a knowledgeable gym partner to check exercise form.",
        "reward": 3134,
        "deadline": "2026-10-08"
    },
    {
        "title": "Boxing Pad Work",
        "description": "Need a partner for light boxing pad-work practice.",
        "reward": 3309,
        "deadline": "2026-10-08"
    },
    {
        "title": "Yoga Partner",
        "description": "Looking for a partner for beginner yoga sessions.",
        "reward": 3484,
        "deadline": "2026-10-08"
    },
    {
        "title": "Dance Fitness",
        "description": "Need a partner for a college fitness challenge.",
        "reward": 3659,
        "deadline": "2026-10-08"
    },
    {
        "title": "Chess Practice",
        "description": "Looking for a chess practice partner before a tournament.",
        "reward": 3834,
        "deadline": "2026-10-08"
    },
    {
        "title": "Carrom Partner",
        "description": "Need a partner for campus carrom practice.",
        "reward": 4009,
        "deadline": "2026-10-08"
    },
    {
        "title": "Volleyball Practice",
        "description": "Looking for players for casual volleyball practice.",
        "reward": 4184,
        "deadline": "2026-10-08"
    },
    {
        "title": "Swimming Practice",
        "description": "Need a swimming practice partner at a campus facility.",
        "reward": 4359,
        "deadline": "2026-10-08"
    },
    {
        "title": "Fitness & Sports — Sports Photography",
        "description": "Looking for someone to photograph a student sports session.",
        "reward": 4534,
        "deadline": "2026-10-08"
    },
    {
        "title": "Fitness Routine Review",
        "description": "Need feedback on a beginner workout routine.",
        "reward": 4709,
        "deadline": "2026-10-08"
    },
    {
        "title": "Warmup Routine",
        "description": "Looking for help designing a warmup for a student sports team.",
        "reward": 4884,
        "deadline": "2026-10-08"
    },
    {
        "title": "Tournament Registration",
        "description": "Need help organizing registrations for a small sports event.",
        "reward": 358,
        "deadline": "2026-10-08"
    },
    {
        "title": "Sports Event Poster",
        "description": "Need a poster for an inter-college sports event.",
        "reward": 533,
        "deadline": "2026-10-08"
    },
    {
        "title": "Team Jersey Design",
        "description": "Looking for a simple jersey design for a student sports team.",
        "reward": 708,
        "deadline": "2026-10-08"
    },
    {
        "title": "Outfit Styling",
        "description": "Need help choosing an outfit for a college formal event.",
        "reward": 883,
        "deadline": "2026-10-08"
    },
    {
        "title": "College Fest Outfit",
        "description": "Looking for styling ideas for a college cultural fest.",
        "reward": 1058,
        "deadline": "2026-10-08"
    },
    {
        "title": "Thrift Outfit Hunt",
        "description": "Need help finding a coordinated thrift-store outfit.",
        "reward": 1233,
        "deadline": "2026-10-08"
    },
    {
        "title": "Wardrobe Organization",
        "description": "Looking for help organizing a small student wardrobe.",
        "reward": 1408,
        "deadline": "2026-10-08"
    },
    {
        "title": "Fashion Photography",
        "description": "Need a student photographer for a simple fashion shoot.",
        "reward": 1583,
        "deadline": "2026-10-08"
    },
    {
        "title": "Costume Design",
        "description": "Looking for costume ideas for a college theatre performance.",
        "reward": 1758,
        "deadline": "2026-10-08"
    },
    {
        "title": "Stage Makeup",
        "description": "Need help with basic stage makeup for a student performance.",
        "reward": 1933,
        "deadline": "2026-10-08"
    },
    {
        "title": "Hair Styling",
        "description": "Looking for a simple hairstyle for a college event.",
        "reward": 2108,
        "deadline": "2026-10-08"
    },
    {
        "title": "Accessory Styling",
        "description": "Need help coordinating accessories with an outfit.",
        "reward": 2283,
        "deadline": "2026-10-08"
    },
    {
        "title": "Fashion Sketch",
        "description": "Looking for a fashion sketch for a student design project.",
        "reward": 2458,
        "deadline": "2026-10-08"
    },
    {
        "title": "Outfit Illustration",
        "description": "Need an illustrated outfit concept for a college project.",
        "reward": 2633,
        "deadline": "2026-10-08"
    },
    {
        "title": "Thrift Listing Photos",
        "description": "Need clean photos for listing second-hand clothes.",
        "reward": 2808,
        "deadline": "2026-10-08"
    },
    {
        "title": "Clothing Repair",
        "description": "Looking for basic help repairing a loose button or seam.",
        "reward": 2983,
        "deadline": "2026-10-08"
    },
    {
        "title": "Custom T-Shirt Concept",
        "description": "Need a custom T-shirt concept for a student group.",
        "reward": 3158,
        "deadline": "2026-10-08"
    },
    {
        "title": "Shoe Styling",
        "description": "Looking for advice on matching shoes with an event outfit.",
        "reward": 3333,
        "deadline": "2026-10-08"
    },
    {
        "title": "College Farewell Styling",
        "description": "Need help planning a farewell outfit.",
        "reward": 3508,
        "deadline": "2026-10-08"
    },
    {
        "title": "Traditional Outfit Styling",
        "description": "Looking for styling help for a cultural college event.",
        "reward": 3683,
        "deadline": "2026-10-08"
    },
    {
        "title": "Minimal Wardrobe Plan",
        "description": "Need help creating versatile outfits from a small wardrobe.",
        "reward": 3858,
        "deadline": "2026-10-08"
    },
    {
        "title": "Fashion Reel",
        "description": "Looking for help shooting a short outfit reel.",
        "reward": 4033,
        "deadline": "2026-10-08"
    },
    {
        "title": "Costume Prop Help",
        "description": "Need help sourcing or making simple costume accessories.",
        "reward": 4208,
        "deadline": "2026-10-08"
    },
    {
        "title": "Hostel Meal Prep",
        "description": "Looking for simple meal-prep ideas suitable for a student hostel.",
        "reward": 4383,
        "deadline": "2026-10-08"
    },
    {
        "title": "Recipe Photography",
        "description": "Need photographs of a few homemade student recipes.",
        "reward": 4558,
        "deadline": "2026-10-08"
    },
    {
        "title": "Budget Recipes",
        "description": "Need inexpensive recipe ideas for college students.",
        "reward": 4733,
        "deadline": "2026-10-08"
    },
    {
        "title": "Cooking Partner",
        "description": "Looking for a partner to cook a simple meal together.",
        "reward": 4908,
        "deadline": "2026-10-08"
    },
    {
        "title": "Baking Help",
        "description": "Need help baking a small batch of cookies for a college event.",
        "reward": 382,
        "deadline": "2026-10-08"
    },
    {
        "title": "Snack Stall Menu",
        "description": "Need help planning a small menu for a campus snack stall.",
        "reward": 557,
        "deadline": "2026-10-08"
    },
    {
        "title": "Recipe Card Design",
        "description": "Looking for recipe cards for a student cooking club.",
        "reward": 732,
        "deadline": "2026-10-08"
    },
    {
        "title": "Food Reel",
        "description": "Need help shooting a short recipe reel.",
        "reward": 907,
        "deadline": "2026-10-08"
    },
    {
        "title": "Meal Planning",
        "description": "Looking for help planning simple weekly student meals.",
        "reward": 1082,
        "deadline": "2026-10-08"
    },
    {
        "title": "Kitchen Organization",
        "description": "Need help organizing a small hostel kitchen setup.",
        "reward": 1257,
        "deadline": "2026-10-08"
    },
    {
        "title": "Mocktail Recipes",
        "description": "Looking for creative non-alcoholic drink ideas for a campus event.",
        "reward": 1432,
        "deadline": "2026-10-08"
    },
    {
        "title": "Cooking Workshop",
        "description": "Need an assistant for a beginner student cooking workshop.",
        "reward": 1607,
        "deadline": "2026-10-08"
    },
    {
        "title": "Food Blog Writing",
        "description": "Looking for someone to write a short student food blog post.",
        "reward": 1782,
        "deadline": "2026-10-08"
    },
    {
        "title": "Cafe Menu Design",
        "description": "Need a simple menu design for a college cafe event.",
        "reward": 1957,
        "deadline": "2026-10-08"
    },
    {
        "title": "Recipe Translation",
        "description": "Need a recipe translated into clear English.",
        "reward": 2132,
        "deadline": "2026-10-08"
    },
    {
        "title": "Food Presentation",
        "description": "Looking for help plating food for a student photography project.",
        "reward": 2307,
        "deadline": "2026-10-08"
    },
    {
        "title": "Baking Decoration",
        "description": "Need help decorating a small batch of cupcakes.",
        "reward": 2482,
        "deadline": "2026-10-08"
    },
    {
        "title": "Canteen Survey",
        "description": "Looking for help collecting student feedback about canteen items.",
        "reward": 2657,
        "deadline": "2026-10-08"
    },
    {
        "title": "Food Budget Sheet",
        "description": "Need help creating a basic food-budget spreadsheet.",
        "reward": 2832,
        "deadline": "2026-10-08"
    },
    {
        "title": "Cooking Video Edit",
        "description": "Looking for help editing a short cooking tutorial.",
        "reward": 3007,
        "deadline": "2026-10-08"
    }
]

count=0

for i, hustle in enumerate(HUSTLES, start=1):
    try:
        response = requests.post(
            URL,
            headers=HEADERS,
            json=hustle,
            timeout=30,
        )

        print(
            f"[{i}/500] "
            f"{response.status_code} - "
            f"{hustle['title']}"
        )

        if not response.ok:
            print("  Response:", response.text)
        
        count+=1
        print(f"Count: {count}")

    except requests.RequestException as e:
        print(f"[{i}/500] REQUEST ERROR - {hustle['title']}")
        print("  Error:", e)
        break

    # Wait 3 seconds before sending the next request.
    if i < len(HUSTLES):
        time.sleep(3)
