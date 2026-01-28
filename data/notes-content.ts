export interface Note {
  id: number;
  title: string;
  content: string;
  type: 'personal' | 'teaching' | 'prophecy';
  category: string;
  tags: string[];
  author: string;
  date: string;
  isPrivate: boolean;
  scripture?: string;
  relatedEvent?: string;
}

export const notes: Note[] = [
  {
    id: 1,
    title: 'Sunday Service Notes - January 14, 2024',
    content: `# Walking in Faith

Today's message focused on what it means to walk by faith and not by sight.

## Key Points:
- Faith requires action, not just belief
- Trusting God's timing is crucial
- Our testimony grows through trials

## Scripture References:
- Hebrews 11:1 - "Now faith is confidence in what we hope for..."
- 2 Corinthians 5:7 - "For we live by faith, not by sight"

## Personal Reflection:
This message reminded me that faith is not passive. It requires stepping out even when we can't see the full picture.`,
    type: 'teaching',
    category: 'Sermon Notes',
    tags: ['faith', 'trust', 'walking'],
    author: 'Pastor John Smith',
    date: '2024-01-14',
    isPrivate: false,
    scripture: 'Hebrews 11:1',
    relatedEvent: 'Sunday Worship Service',
  },
  {
    id: 2,
    title: 'Personal Prayer Journal Entry',
    content: `Lord, thank you for your faithfulness today. I felt your presence during worship and I'm grateful for the peace you've given me.

Prayer requests:
- Guidance for upcoming decisions
- Healing for my friend Sarah
- Wisdom in relationships`,
    type: 'personal',
    category: 'Prayer',
    tags: ['prayer', 'gratitude', 'personal'],
    author: 'Anonymous',
    date: '2024-01-15',
    isPrivate: true,
  },
  {
    id: 3,
    title: 'Prophecy Received - January 2024',
    content: `The Lord says, "I am bringing a season of restoration and renewal. Trust in My timing, for I am working all things together for your good. Prepare your hearts for what I am about to do."

This word was received during our prayer meeting on January 15, 2024.`,
    type: 'prophecy',
    category: 'Prophecy Archive',
    tags: ['prophecy', 'restoration', 'renewal'],
    author: 'Ministry Team',
    date: '2024-01-15',
    isPrivate: false,
    scripture: 'Romans 8:28',
  },
  {
    id: 4,
    title: 'Bible Study Notes - Romans Chapter 1',
    content: `# Romans Chapter 1 Study

## Context:
Paul's letter to the Romans introduces the gospel and establishes the foundation of Christian doctrine.

## Key Themes:
- The power of the gospel
- Righteousness from God
- The universal need for salvation

## Application:
Understanding that we all need God's grace helps us approach others with humility and love.`,
    type: 'teaching',
    category: 'Bible Study',
    tags: ['bible-study', 'romans', 'doctrine'],
    author: 'Pastor Sarah Johnson',
    date: '2024-01-12',
    isPrivate: false,
    scripture: 'Romans 1:16-17',
  },
  {
    id: 5,
    title: 'Worship Night Reflection',
    content: `Tonight's worship was powerful. The presence of God was tangible.

Songs that moved me:
- "Great is Thy Faithfulness"
- "How Great Thou Art"
- "In Christ Alone"

I felt God speaking to me about trusting Him more deeply.`,
    type: 'personal',
    category: 'Worship',
    tags: ['worship', 'reflection', 'personal'],
    author: 'Anonymous',
    date: '2024-01-13',
    isPrivate: true,
  },
];

export const noteCategories = [
  'All',
  'Sermon Notes',
  'Bible Study',
  'Prayer',
  'Worship',
  'Prophecy Archive',
  'Personal',
];

export const noteTags = [
  'faith',
  'trust',
  'prayer',
  'worship',
  'prophecy',
  'bible-study',
  'doctrine',
  'restoration',
  'renewal',
  'personal',
  'gratitude',
  'walking',
];
