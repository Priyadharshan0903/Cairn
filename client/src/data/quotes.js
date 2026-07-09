/**
 * Curated motivation quotes, grouped by tone. Kept tasteful and short to match
 * Cairn's calm, editorial voice. Attribution is included where it's a real quote.
 */
export const TONES = [
  { key: 'calm', label: 'Calm', hint: 'Gentle & reflective' },
  { key: 'stoic', label: 'Stoic', hint: 'Steady & clear-eyed' },
  { key: 'grit', label: 'Grit', hint: 'Direct & disciplined' },
  { key: 'playful', label: 'Playful', hint: 'Light & encouraging' },
];

export const QUOTES = {
  calm: [
    { text: 'A journey of a thousand miles begins with one stone on the pile.', by: 'Lao Tzu' },
    { text: 'Little by little, a little becomes a lot.', by: 'Tanzanian proverb' },
    { text: 'Rivers know this: there is no hurry. We shall get there some day.', by: 'A. A. Milne' },
    { text: 'The best time to plant a tree was twenty years ago. The second best time is now.', by: 'Proverb' },
    { text: 'Fall seven times, stand up eight.', by: 'Japanese proverb' },
    { text: 'Nature does not hurry, yet everything is accomplished.', by: 'Lao Tzu' },
  ],
  stoic: [
    { text: 'You have power over your mind — not outside events. Realize this, and you will find strength.', by: 'Marcus Aurelius' },
    { text: 'We suffer more often in imagination than in reality.', by: 'Seneca' },
    { text: 'First say to yourself what you would be; and then do what you have to do.', by: 'Epictetus' },
    { text: 'The impediment to action advances action. What stands in the way becomes the way.', by: 'Marcus Aurelius' },
    { text: 'No man is free who is not master of himself.', by: 'Epictetus' },
    { text: 'It is not that we have a short time to live, but that we waste a lot of it.', by: 'Seneca' },
  ],
  grit: [
    { text: 'Discipline is choosing between what you want now and what you want most.', by: 'Abraham Lincoln' },
    { text: 'Suffer the pain of discipline or suffer the pain of regret.', by: 'Jim Rohn' },
    { text: 'Small disciplines repeated with consistency lead to great achievements.', by: 'John C. Maxwell' },
    { text: "You don't have to be extreme, just consistent.", by: null },
    { text: 'Motivation gets you going, but discipline keeps you growing.', by: 'John C. Maxwell' },
    { text: 'The only workout you regret is the one you skipped.', by: null },
  ],
  playful: [
    { text: 'One stone at a time — the cairn still rises.', by: null },
    { text: "You're allowed to be both a masterpiece and a work in progress.", by: null },
    { text: 'Progress, not perfection.', by: null },
    { text: 'Show up. Future you is watching.', by: null },
    { text: 'Done is better than perfect — then do it again tomorrow.', by: null },
    { text: 'Tiny steps, big trails.', by: null },
  ],
};

/** Day-of-year, stable through the day, so the quote only rotates once daily. */
function dayOfYear(d = new Date()) {
  const start = new Date(d.getFullYear(), 0, 0);
  return Math.floor((d - start) / 86400000);
}

/**
 * Pick a quote for a tone. `offset` lets the "new quote" button cycle forward.
 * The base index is the day of year so everyone sees a stable quote each day.
 */
export function quoteFor(tone, offset = 0) {
  const list = QUOTES[tone] || QUOTES.calm;
  const idx = (dayOfYear() + offset) % list.length;
  return list[idx];
}
