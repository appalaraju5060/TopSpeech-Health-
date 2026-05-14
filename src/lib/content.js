// Single static lesson. Real product would fetch this per-day from a backend.
// Focused on the R sound (rhotacism). Words chosen for the classic R/W substitution
// pattern that real Speech-Language Pathologists target first.

export const lesson = {
  title: 'The R Sound',
  subtitle: '4 exercises · about 5 minutes',
  programName: 'Rhotacism · Week 1',
  cards: [
    {
      id: 'listen-rabbit',
      type: 'listen-repeat',
      word: 'rabbit',
      phonetic: '/ˈræbɪt/',
      coachLine: "Tongue tip curls back. Let it growl gently.",
      hint: "Try saying the R alone first — rrrr — then add the word."
    },
    {
      id: 'word-select-rabbit',
      type: 'word-select',
      prompt: 'Which one did you hear?',
      options: [
        { value: 'wabbit', label: 'wabbit' },
        { value: 'rabbit', label: 'rabbit' }
      ],
      correct: 'rabbit',
      nudge: 'Listen again — the R has a soft growl. The W is rounded lips.'
    },
    {
      id: 'mirror-rrrr',
      type: 'mirror',
      sound: 'rrrr',
      instruction: 'Look at where the tongue goes. Hold the sound for 3 seconds.',
      coachLine: 'The tip of your tongue lifts back, just behind your top teeth.'
    },
    {
      id: 'sentence-red-barn',
      type: 'sentence',
      sentence: 'The rabbit ran around the red barn.',
      // word indices that contain the R target sound
      targetIndices: [1, 2, 3, 5, 6],
      coachLine: 'Take it slowly. Pause between R-words if it helps.',
      hint: 'You can tap any word to hear how it should sound.'
    }
  ]
}
