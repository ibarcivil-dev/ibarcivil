// IBAR Premium Webzine Mock Database
// Purpose: High-quality editorial content for local server-side rendering

export type ArticleStatus = 'draft' | 'review' | 'scheduled' | 'published' | 'archived';

export interface Author {
  id: string;
  name: string;
  slug: string;
  avatarUrl: string;
  bio: string;
  specialization: string;
  currentInterests: string[];
  recommendedReading: { title: string; url: string; author: string }[];
}

export interface Issue {
  id: string;
  number: number;
  title: string;
  description: string;
  coverUrl: string;
  theme: string;
  editorNote: string;
  publishedAt: string;
}

export interface Topic {
  id: string;
  name: string;
  slug: string;
  description: string;
}

export interface Article {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  excerpt: string;
  content: string; // Markdown
  coverUrl: string;
  authorId: string;
  issueId?: string;
  topicId?: string;
  status: ArticleStatus;
  featured: boolean;
  homepagePriority: number;
  readingTime: number; // in minutes
  publishedAt: string;
  isPerspective?: boolean; // Helpers for layout routing
}

export interface Collection {
  id: string;
  name: string;
  slug: string;
  description: string;
  coverUrl: string;
  articleIds: string[];
}

export interface EditorNote {
  id: string;
  title: string;
  content: string;
  publishedAt: string;
}

export interface Recommendation {
  id: string;
  title: string;
  url: string;
  curatorName: string;
  commentary: string;
  publishedAt: string;
}

export interface HomepageConfig {
  heroArticleId: string;
  featuredEssayIds: string[];
  issueSpotlightId: string;
  archiveHighlightId: string;
  editorsNoteId: string;
}

// ----------------------------------------------------
// Mock Data Pre-populations
// ----------------------------------------------------

export const MOCK_AUTHORS: Author[] = [
  {
    id: 'author-1',
    name: 'Elena Rostova',
    slug: 'elena-rostova',
    avatarUrl: '/images/authors/elena.jpg',
    bio: 'Elena Rostova is a philosopher and essayist focusing on the intersections of technology, phenomenology, and public space. Previously, she lectured on continental philosophy at the Sorbonne and curated archives for the Baltic Cultural Centre.',
    specialization: 'Philosophy & Society',
    currentInterests: [
      'Early Byzantine masonry and spatial politics',
      'The phenomenology of waiting in transit corridors',
      'Analogue archiving as a form of cultural resistance'
    ],
    recommendedReading: [
      { title: 'The Poetics of Space', url: '#', author: 'Gaston Bachelard' },
      { title: 'The Human Condition', url: '#', author: 'Hannah Arendt' }
    ]
  },
  {
    id: 'author-2',
    name: 'Arthur Vance',
    slug: 'arthur-vance',
    avatarUrl: '/images/authors/arthur.jpg',
    bio: 'Arthur Vance is a science writer and historian of ideas. He spent a decade investigating the sociology of scientific laboratories before turning his attention to how modern institutions define "expertise" and "truth".',
    specialization: 'Science & Epistemology',
    currentInterests: [
      'Quantum decoherence theory and its metaphors',
      'The early records of the Royal Society',
      'Pre-industrial stellar navigation devices'
    ],
    recommendedReading: [
      { title: 'Against Method', url: '#', author: 'Paul Feyerabend' },
      { title: 'The Structure of Scientific Revolutions', url: '#', author: 'Thomas Kuhn' }
    ]
  },
  {
    id: 'author-3',
    name: 'Sarah Jenkins',
    slug: 'sarah-jenkins',
    avatarUrl: '/images/authors/sarah.jpg',
    bio: 'Sarah Jenkins is a cultural critic and digital historian. She examines the impact of speed on human perception, memory storage, and artistic movements, arguing that the internet is rebuilding our cognitive cartography.',
    specialization: 'Culture & Technology',
    currentInterests: [
      'Early hypertext systems and non-linear novels',
      'The anthropology of absolute speed in modern trading',
      'The preservation of silent cinema and nitrate film degradation'
    ],
    recommendedReading: [
      { title: 'Understanding Media', url: '#', author: 'Marshall McLuhan' },
      { title: 'Technics and Civilization', url: '#', author: 'Lewis Mumford' }
    ]
  },
  {
    id: 'author-4',
    name: 'Marc Dubois',
    slug: 'marc-dubois',
    avatarUrl: '/images/authors/marc.jpg',
    bio: 'Marc Dubois writes about post-growth economics, suburban history, and political rhetoric. A former policy researcher, he advocates for structural deceleration and the architectural design of common lands.',
    specialization: 'Politics & Economics',
    currentInterests: [
      'Post-growth economic models and degrowth metrics',
      'The rhetoric of "state of emergency" in modern legislation',
      'Suburban rail line geography and communal commons'
    ],
    recommendedReading: [
      { title: 'Small Is Beautiful', url: '#', author: 'E. F. Schumacher' },
      { title: 'The Great Transformation', url: '#', author: 'Karl Polanyi' }
    ]
  }
];

export const MOCK_ISSUES: Issue[] = [
  {
    id: 'issue-12',
    number: 12,
    title: 'The Architecture of Patience',
    description: 'In this issue, we explore the slow construction of permanence in a culture obsessed with the instantaneous. From cathedral-thinking to the preservation of digital memory, we argue for the deceleration of human endeavor.',
    coverUrl: '/images/issues/cover-12.jpg',
    theme: 'Deceleration and Permanence',
    editorNote: `We live in an era that measures progress in milliseconds. The algorithms that guide our days are optimized for instantaneous response, treating hesitation as a system failure. In this issue, we wanted to look in the opposite direction. 
    
    We examine what it means to build things that outlast their creators. Elena Rostova investigates the physical architecture of anticipation, while Arthur Vance questions whether the hyper-specialization of modern knowledge has made it impossible to cultivate deep wisdom. 
    
    This is an invitation to pause, to look at the foundations under our feet, and to ask: what are we building that will matter a century from now?`,
    publishedAt: '2026-05-15T00:00:00Z'
  },
  {
    id: 'issue-11',
    number: 11,
    title: 'The Speed of Silence',
    description: 'An inquiry into silence as a scarce resource, the commercialization of quietness, and the politics of noise in the digital landscape.',
    coverUrl: '/images/issues/cover-11.jpg',
    theme: 'Silence and Noise',
    editorNote: `Silence is no longer merely the absence of sound; it has become a luxury commodity. As the modern world grows noisier, we find ourselves paying premium rates for isolation. In this issue, our writers explore who gets to be quiet and who is forced to hear the constant hum of the machine.`,
    publishedAt: '2026-02-10T00:00:00Z'
  }
];

export const MOCK_TOPICS: Topic[] = [
  { id: 'topic-tech', name: 'Technology', slug: 'technology', description: 'Essays on hypertext, speed, and how systems reconfigure the mind.' },
  { id: 'topic-society', name: 'Society', slug: 'society', description: 'Observations on public space, communities, and the infrastructure of daily life.' },
  { id: 'topic-philosophy', name: 'Philosophy', slug: 'philosophy', description: 'Long-form thinking on phenomenology, ethics, and the history of ideas.' },
  { id: 'topic-science', name: 'Science', slug: 'science', description: 'Inquiries into epistemological shifts, scientific discovery, and limits of knowledge.' },
  { id: 'topic-culture', name: 'Culture', slug: 'culture', description: 'Dissections of literature, memory storage, and artistic movements.' },
  { id: 'topic-politics', name: 'Politics', slug: 'politics', description: 'The rhetoric of emergency, governance systems, and economic alternatives.' }
];

export const MOCK_ARTICLES: Article[] = [
  {
    id: 'art-1',
    slug: 'tyranny-of-convenience',
    title: 'The Tyranny of Convenience',
    subtitle: 'On the quiet erosion of human friction and the value of difficulty.',
    excerpt: 'In our relentless pursuit of frictionless living, we have quietly outsourced the very friction that makes us human. When everything is easy, nothing remains meaningful.',
    coverUrl: '/images/articles/convenience.jpg',
    authorId: 'author-1', // Elena Rostova
    issueId: 'issue-12',
    topicId: 'topic-philosophy',
    status: 'published',
    featured: true,
    homepagePriority: 10,
    readingTime: 18,
    publishedAt: '2026-05-15T08:00:00Z',
    content: `We live in an age of architectural and logistical miracles designed to perform a single function: to eliminate resistance. From one-click purchases to algorithmic feeds that deliver answers before we have finished formulating questions, the modern economy is organized around the ideal of absolute convenience. 

Yet, there is a quiet, unexamined catastrophe in this relentless removal of friction. Friction is not merely an obstacle to be overcome; it is the very medium through which we encounter the world. It is the resistance of the wood that teaches the carpenter; it is the slow difficulty of translation that reveals the depth of a text; it is the physical inconvenience of distance that renders the arrival significant.

When we outsource difficulty, we do not merely save time. We outsource the labor of attention.

### I. The Frictionless Self

Consider the act of navigation. To walk through an unfamiliar city with a paper map requires a continuous engagement with the landscape. You must align the paper lines with the physical corners, look up at the street signs, note the slope of the hill, and tolerate the brief, instructive anxiety of being lost. In doing so, the city becomes a place—an accumulation of landmarks, smells, and memories.

To navigate the same city with a GPS system is a different cognitive act entirely. You are no longer in the city; you are in the blue dot, adjusting your physical body to keep the dot aligned with a glowing path. The surroundings recede into a blurry background. The convenience of the tool has bypassed the cognitive friction of orientation. When you arrive, you have traveled, but you have not experienced the space. You have arrived without having been anywhere.

> "Friction is the very contact patch where the mind meets the hard edge of reality. Without it, we do not slide cleanly through life; we float above it."

This suspension of engagement extends to our intellectual lives. The difficulty of finding an out-of-print book in a library, of tracking down a citation through dusty journals, of waiting weeks for a letter to arrive—these were not merely technical inefficiencies. They were periods of intellectual incubation. The delay was part of the process. In the silence between the question and the answer, the mind was forced to wander, to make unexpected connections, to prepare itself for what it might find.

Now, the answer is instantaneous. But because we did not work to find it, we do not know what to do with it. The expert is no longer someone who has wrestled with a discipline; the expert is someone who knows which terms to type into a search bar.

### II. The Subtraction of Community

The political consequences of this convenience are equally severe. A community is, by its very nature, an inconvenient arrangement. It requires sharing spaces with people we did not choose, listening to opinions that irritate us, and participating in slow, bureaucratic processes of compromise. 

The digital world offers us the convenience of community without its burdens. We can join groups of like-minded individuals with a single click and leave them just as easily when the conversation becomes uncomfortable. We can block, mute, and delete the people who introduce friction into our feeds. 

But a community without friction is not a community at all; it is a hall of mirrors. It feels comfortable, but it is ultimately fragile. When a real crisis arises—one that cannot be muted or swiped away—we find ourselves without the social muscles required to cooperate across differences. We have forgotten how to sit in a room with people who disagree with us and work toward a common goal.

### III. The Reclaiming of Difficulty

To resist the tyranny of convenience is not to advocate for a return to pre-industrial hardship. It is to recognize that some forms of difficulty are worth preserving because they are the conditions of human growth.

We must build spaces, both physical and digital, that invite pause. We must design tools that do not hide their mechanisms behind a sleek interface, but invite us to understand how they work. We must learn to value the long way, the slow read, the difficult conversation.

For it is in the friction of life—in the awkward, demanding, and resistant moments—that we leave our mark, and where the world leaves its mark on us.`
  },
  {
    id: 'art-2',
    slug: 'last-useful-expert',
    title: 'The Last Useful Expert',
    subtitle: 'On the death of mentorship in the age of infinite search.',
    excerpt: 'In the age of search, we have confused access to information with the acquisition of understanding. The true cost of our search engines is the death of the mentor.',
    coverUrl: '/images/articles/expert.jpg',
    authorId: 'author-2', // Arthur Vance
    issueId: 'issue-12',
    topicId: 'topic-science',
    status: 'published',
    featured: true,
    homepagePriority: 9,
    readingTime: 14,
    publishedAt: '2026-05-10T08:00:00Z',
    content: `There was a time when to learn a craft, a science, or a philosophy was to place oneself in the orbit of an expert. You did not merely read their books; you watched how they sharpened their tools, how they listened to a patient's heartbeat, how they paused before answering a difficult question. Learning was an act of mimicry, of slowly absorbing a way of being in the world.

Today, we have replaced the expert with the database. If you want to know how to perform a surgical procedure, build a house, or read a Kantian text, you do not seek out a master; you seek out a search box. 

But search engines do not teach; they reveal. And in confusing the two, we are witnessing the quiet death of mentorship.

### The Illusion of Autodidactism

The internet has democratized information, but it has also flattened it. When every piece of data is equally accessible, the hierarchy of significance disappears. The student who searches for information online is presented with a million results, but no map of how they relate to one another. They do not know which sources are fundamental and which are peripheral, which ideas have stood the test of time and which are passing intellectual fads.

The mentor provides this map. They do not merely hand you information; they tell you what to ignore. They guide you through the wilderness of the libraries, steering you away from the dead ends and the shallow waters, pointing you toward the deep currents of thought.

Without this guidance, the modern student becomes a collector of fragments. They know many things, but they understand very little. They have access to the blueprints, but they have never seen a house built.

> "A search engine can tell you what is true according to a thousand websites, but it cannot tell you how to live with that truth."

### The Tacit Dimensions of Craft

What is lost when mentorship disappears is what Michael Polanyi called "tacit knowledge"—the things we know but cannot say. You cannot write a manual on how to balance a violin bow, how to read the mood of a negotiating room, or how to detect the subtle scent of an impending laboratory failure. These are things that can only be transmitted through shared attention, in the presence of a master.

When we rely entirely on digitized instructions, we lose the tacit dimension. Our knowledge becomes dry, academic, and rigid. We can follow the recipe, but we cannot cook. We can write the code, but we do not understand the system.

To preserve the expert is to preserve the human chain of transmission. It is to recognize that some things cannot be uploaded to a server, but must be handed down, person to person, in the quiet spaces of shared labor.`
  },
  {
    id: 'art-3',
    slug: 'city-built-for-waiting',
    title: 'A City Built for Waiting',
    subtitle: 'An inquiry into the architecture of modern anticipation.',
    excerpt: 'Modern infrastructure is designed to eliminate delay, yet we spend more time waiting than ever before. An inquiry into the architecture of modern anticipation.',
    coverUrl: '/images/articles/waiting.jpg',
    authorId: 'author-1', // Elena Rostova
    issueId: 'issue-12',
    topicId: 'topic-society',
    status: 'published',
    featured: false,
    homepagePriority: 5,
    readingTime: 12,
    publishedAt: '2026-05-08T08:00:00Z',
    content: `Step into a modern transit hub—an airport terminal, a subway platform, a bus station—and you are looking at the true monuments of our civilization. These are not spaces designed for dwelling; they are spaces designed for waiting. 

We are told that modern technology is a machine for saving time, yet our daily landscape is dominated by places designed to warehouse human bodies in transition. The airport lounge, the doctors waiting room, the traffic jam, the supermarket queue—these are the sites where the speed of our society runs aground.

But the nature of waiting has changed. It is no longer a period of quiet reflection, but a space to be filled with the nervous activity of the screen.

### The Commercialization of the Gap

In the past, to wait was to be bored. And boredom, though uncomfortable, was an essential intellectual resource. In the empty spaces of the day, the mind was forced to look inward, to day-dream, to process the events of the week. 

Today, the gap has been financialized. Every moment of delay is an opportunity for advertising, a chance to sell a coffee, a book, or a digital subscription. The waiting room is filled with screens broadcasting news feeds; the airport terminal is a shopping mall with runways attached. 

Even when we wait in silence, we do not wait alone. We pull out our phones, diving into the endless scroll of social feeds, ensuring that we are never, even for a second, left with our own thoughts. We have eliminated the empty spaces, but in doing so, we have eliminated the rooms where the subconscious does its work.

### The Politics of the Queue

Waiting is not merely a logistical necessity; it is a display of power. Who waits, and how long they wait, is a direct reflection of their social standing.

The wealthy pay to bypass the queue. They buy priority tickets, hire private drivers, and wait in exclusive lounges where the noise of the crowd is filtered out. The poor wait in the wind at bus stops, stand in long lines at municipal offices, and wait months for basic medical appointments.

A democratic city is one that respects the time of all its citizens. It is a city that designs its public spaces not just to move bodies as quickly as possible, but to make the moments of waiting comfortable, dignified, and community-focused. We need parks with benches, libraries with reading rooms, and plazas where we can gather and wait together, watching the world go by.`
  },
  {
    id: 'art-4',
    slug: 'what-happens-when-nobody-knows-anything',
    title: 'What Happens When Nobody Knows Anything',
    subtitle: 'The collapse of epistemological trust in public discourse.',
    excerpt: 'When authority is flattened and every source is suspect, we enter a post-epistemic state where volume replaces validity.',
    coverUrl: '/images/articles/noise.jpg',
    authorId: 'author-3', // Sarah Jenkins
    issueId: 'issue-11',
    topicId: 'topic-politics',
    status: 'published',
    featured: false,
    homepagePriority: 8,
    readingTime: 9,
    publishedAt: '2026-04-18T08:00:00Z',
    isPerspective: true, // Opinion/Perspective
    content: `We are swimming in information, yet we are drowning in doubt. The institutions that once certified truth—the universities, the major newspapers, the scientific establishments—have seen their foundations crumble under a wave of skepticism.

This is not merely a crisis of fake news; it is a deeper shift in how we know what we know. We have entered a post-epistemic state where the distinction between a fact and an opinion has been flattened. 

When authority is decentralized, trust does not disappear; it becomes tribal. We no longer ask, "Is this claim backed by evidence?" We ask, "Is the person making this claim on my side?"

### The Noise of the Crowd

In the digital arena, the loudest voice wins. The algorithms that govern our public squares do not optimize for accuracy; they optimize for engagement. And nothing drives engagement like outrage, fear, and certainty.

The cautious expert, who speaks in probabilities and qualifies their statements, is drowned out by the confident amateur, who promises simple solutions to complex problems. In this environment, to hesitate is to look weak; to revise an opinion is to admit defeat.

The result is a public discourse that is both incredibly noisy and entirely stagnant. We argue constantly, but we never persuade one another. We accumulate data, but we lose the shared vocabulary needed to make sense of it.

### The Rebuilding of Trust

If we are to survive this epistemological collapse, we must learn to value intellectual humility. We must rebuild institutions that are transparent about their methods, willing to admit error, and insulated from commercial pressure.

We must also change our habits as readers. We must seek out writing that values nuance over noise, and learn to appreciate the silence that follows a hard question, rather than demanding an instant answer.`
  },
  {
    id: 'art-5',
    slug: 'the-silence-between-crises',
    title: 'The Silence Between Crises',
    subtitle: 'On the manufactured urgency of the digital attention cycle.',
    excerpt: 'The news cycle demands constant alarm. We have lost the ability to examine the slow tectonic shifts that shape our world in the quiet intervals.',
    coverUrl: '/images/articles/silence.jpg',
    authorId: 'author-4', // Marc Dubois
    issueId: 'issue-11',
    topicId: 'topic-politics',
    status: 'published',
    featured: false,
    homepagePriority: 7,
    readingTime: 8,
    publishedAt: '2026-03-01T08:00:00Z',
    isPerspective: true, // Opinion/Perspective
    content: `The modern news cycle is an emergency machine. Every hour brings a new alert, a new scandal, a new catastrophe that demands our immediate outrage. We live in a state of chronic alarm, jumping from one crisis to the next without time to breathe, let alone think.

But the most important stories of our time do not happen in a flash. They do not fit into a push notification. They are the slow, silent movements of history—the gradual warming of the oceans, the steady decline of institutional trust, the quiet reorganization of working life by digital tools.

By focusing entirely on the sudden noise, we miss the slow, defining changes. We need a journalism that covers the silence between the crises.

### The Architecture of Distraction

The constant alarm is not an accident; it is the business model of the digital attention economy. Platforms are paid for our eyeballs, and nothing grabs our attention like danger. 

This has forced the media into a cycle of permanent escalation. To be heard above the noise, every event must be framed as unprecedented, every disagreement as a civil war, every setback as an apocalypse. 

But when everything is a crisis, nothing is. The alarm bell rings so often that we become deaf to it. We burn out, retreating into apathy or cynicism, leaving the decisions to those who profit from the chaos.

### Decelerating the Mind

To understand the world, we must learn to ignore the immediate. We must cultivate a deliberate ignorance of the daily chatter in favor of the weekly review, the monthly essay, the historical volume.

We must demand a public media that is funded not by clicks, but by subscription, giving writers the time to investigate, to sit with a subject, and to explain not just what happened, but why it matters in the long run. We need to value quiet intervals, for they are the only spaces where wisdom can grow.`
  },
  {
    id: 'art-6',
    slug: 'the-subtraction-economy',
    title: 'The Subtraction Economy',
    subtitle: 'Why the future of design lies in what we choose to remove.',
    excerpt: 'As the physical and digital landscapes become saturated with features, true luxury is redefined by silence, simplicity, and empty space.',
    coverUrl: '/images/articles/subtraction.jpg',
    authorId: 'author-4', // Marc Dubois
    issueId: 'issue-12',
    topicId: 'topic-culture',
    status: 'published',
    featured: false,
    homepagePriority: 4,
    readingTime: 11,
    publishedAt: '2026-05-12T08:00:00Z',
    content: `Every year, the gadgets we buy become more complex, the websites we visit become noisier, and the products we use acquire more features. We are trained to believe that addition equals progress, that more choice is always better than less.

But we are reaching a point of cognitive overload. The modern consumer is exhausted by options, constantly managing notifications, settings, and updates. 

In this environment of excess, the most radical act a designer or business can perform is subtraction. True luxury is no longer defined by what is included, but by what has been carefully left out.

### The Luxury of the Blank Space

Look at the history of typography. In the early days of print, space was expensive, so pages were packed with dense columns of text. But as paper became cheaper, designers discovered the power of margins. White space was not wasted space; it was the element that allowed the text to be read with ease and dignity.

We need a similar discovery in our digital lives. We need interfaces that do not fight for our attention with alerts and pop-ups, but offer a quiet surface for reading. We need products that do only one thing, but do it exceptionally well.

A publication that values its readers is one that demonstrates restraint. It does not fill its pages with related links, share buttons, and video ads. It gives you the article, and nothing else. It respects your time enough to let you finish.`
  }
];

export const MOCK_COLLECTIONS: Collection[] = [
  {
    id: 'coll-1',
    name: 'The Tyranny of Convenience',
    slug: 'tyranny-of-convenience-series',
    description: 'A curated series of essays examining the hidden costs of frictionless living, from the death of cognitive orientation to the erosion of local community ties.',
    coverUrl: '/images/collections/convenience-series.jpg',
    articleIds: ['art-1', 'art-3', 'art-6']
  },
  {
    id: 'coll-2',
    name: 'The Epistemic Shift',
    slug: 'epistemic-shift-series',
    description: 'Inquiries into how scientific and cultural knowledge is preserved, altered, and contested in the digital era, focusing on the death of traditional expertise.',
    coverUrl: '/images/collections/epistemic-series.jpg',
    articleIds: ['art-2', 'art-4', 'art-5']
  }
];

export const MOCK_EDITOR_NOTES: EditorNote[] = [
  {
    id: 'note-1',
    title: 'On the Necessity of Boring Books',
    content: `I spent the weekend reading a translation of a Byzantine chronicle from the eleventh century. It was, by any modern standard, an incredibly boring book. It listed tax disputes, the names of forgotten court officials, and weather anomalies in long, dry paragraphs.

Yet, by the third hour, something shifted. The lack of narrative speed forced my mind to slow down. I began to notice the rhythm of the language, the strange anxieties of the writer, the sheer distance of that vanished world. 

Modern publishing is terrified of boring the reader. Every book must have a hook, every paragraph must drive the plot, every essay must deliver a takeaway. But in eliminating the slow, difficult, and dry passages, we have eliminated the space where deep intellectual travel occurs. We must learn, once again, to read boring books.`,
    publishedAt: '2026-05-14T10:00:00Z'
  },
  {
    id: 'note-2',
    title: 'The Sound of a Pen on Paper',
    content: `There is a physical difference in how we formulate thoughts when writing with a pen versus typing on a keyboard. The keyboard encourages speed; it allows the fingers to keep pace with the first, unformed impulse of the brain. 

The pen, however, demands deceleration. Because erasing is messy, you must think the sentence through to its end before committing it to the page. The physical resistance of the paper creates a micro-pause, a small room for reflection, before the word is born. We should write our first drafts in ink.`,
    publishedAt: '2026-04-20T10:00:00Z'
  }
];

export const MOCK_RECOMMENDATIONS: Recommendation[] = [
  {
    id: 'rec-1',
    title: 'The Shallows: What the Internet Is Doing to Our Brains',
    url: '#',
    curatorName: 'Sarah Jenkins',
    commentary: 'Nicholas Carr\'s classic remains the most articulate warning about the cognitive fragmentation caused by digital media. A necessary read for anyone interested in preserving depth.',
    publishedAt: '2026-05-01T00:00:00Z'
  },
  {
    id: 'rec-2',
    title: 'Silence: In the Age of Noise',
    url: '#',
    curatorName: 'Elena Rostova',
    commentary: 'Erling Kagge, an explorer who walked to the South Pole in complete isolation, writes a beautiful, sparse meditation on finding quietness in a hyper-connected world.',
    publishedAt: '2026-04-10T00:00:00Z'
  }
];

export const MOCK_HOMEPAGE_CONFIG: HomepageConfig = {
  heroArticleId: 'art-1', // The Tyranny of Convenience
  featuredEssayIds: ['art-2', 'art-6'], // The Last Useful Expert, The Subtraction Economy
  issueSpotlightId: 'issue-12', // Issue 12
  archiveHighlightId: 'art-3', // A City Built for Waiting
  editorsNoteId: 'note-1' // On the Necessity of Boring Books
};

// ----------------------------------------------------
// Public API Methods (Safe for Next.js Server Components)
// ----------------------------------------------------

export function getArticles(): Article[] {
  return MOCK_ARTICLES.filter(a => a.status === 'published');
}

export function getArticleBySlug(slug: string): Article | undefined {
  return MOCK_ARTICLES.find(a => a.slug === slug);
}

export function getPerspectives(): Article[] {
  return MOCK_ARTICLES.filter(a => a.isPerspective && a.status === 'published');
}

export function getEssays(): Article[] {
  return MOCK_ARTICLES.filter(a => !a.isPerspective && a.status === 'published');
}

export function getAuthors(): Author[] {
  return MOCK_AUTHORS;
}

export function getAuthorBySlug(slug: string): Author | undefined {
  return MOCK_AUTHORS.find(a => a.slug === slug);
}

export function getArticlesByAuthor(authorId: string): Article[] {
  return MOCK_ARTICLES.filter(a => a.authorId === authorId && a.status === 'published');
}

export function getIssues(): Issue[] {
  return MOCK_ISSUES;
}

export function getIssueById(id: string): Issue | undefined {
  return MOCK_ISSUES.find(i => i.id === id);
}

export function getArticlesByIssue(issueId: string): Article[] {
  return MOCK_ARTICLES.filter(a => a.issueId === issueId && a.status === 'published');
}

export function getTopics(): Topic[] {
  return MOCK_TOPICS;
}

export function getTopicBySlug(slug: string): Topic | undefined {
  return MOCK_TOPICS.find(t => t.slug === slug);
}

export function getArticlesByTopic(topicId: string): Article[] {
  return MOCK_ARTICLES.filter(a => a.topicId === topicId && a.status === 'published');
}

export function getCollections(): Collection[] {
  return MOCK_COLLECTIONS;
}

export function getCollectionBySlug(slug: string): Collection | undefined {
  return MOCK_COLLECTIONS.find(c => c.slug === slug);
}

export function getEditorNotes(): EditorNote[] {
  return MOCK_EDITOR_NOTES;
}

export function getEditorNoteById(id: string): EditorNote | undefined {
  return MOCK_EDITOR_NOTES.find(n => n.id === id);
}

export function getRecommendations(): Recommendation[] {
  return MOCK_RECOMMENDATIONS;
}

export function getHomepageConfig(): HomepageConfig {
  return MOCK_HOMEPAGE_CONFIG;
}
