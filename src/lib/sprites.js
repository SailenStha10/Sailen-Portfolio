/**
 * Pixel-art sprites as strings. Letters map to palette entries in PixelSprite.
 *   h hair/shoes   s skin   e eyes   b shirt (accent)   p trousers
 *   g gadget grey  c screen / glow   o orange   . empty
 */
export const PLAYER_BODY = [
  '...hhhhhh...',
  '..hhhhhhhh..',
  '..hssssssh..',
  '..hsessesh..',
  '..hssssssh..',
  '...hssssh...',
  '....ssss....',
  '..bbbbbbbb..',
  '.sbbbbbbbbs.',
  '.sbbbbbbbbs.',
  '..bbbbbbbb..',
  '..pppppppp..',
];
export const LEGS_A = ['..ppp..ppp..', '..ppp..ppp..', '..hhh..hhh..'];
export const LEGS_B = ['..pp....pp..', '.pp......pp.', '.hh......hh.'];

/** Props drawn on top of the body, as [x, y, key]. One per character class. */
export const PROPS = {
  laptop: [
    [3, 7, 'c'], [4, 7, 'c'], [5, 7, 'c'], [6, 7, 'c'], [7, 7, 'c'], [8, 7, 'c'],
    [2, 8, 'g'], [3, 8, 'g'], [4, 8, 'g'], [5, 8, 'g'], [6, 8, 'g'], [7, 8, 'g'], [8, 8, 'g'], [9, 8, 'g'],
  ],
  book: [
    [2, 8, 'o'], [3, 8, 'o'], [4, 8, 'o'], [5, 8, 'g'], [6, 8, 'o'], [7, 8, 'o'], [8, 8, 'o'], [9, 8, 'o'],
    [2, 9, 'o'], [3, 9, 'o'], [4, 9, 'o'], [5, 9, 'g'], [6, 9, 'o'], [7, 9, 'o'], [8, 9, 'o'], [9, 9, 'o'],
  ],
  brush: [
    [11, 4, 'o'], [11, 5, 'g'], [11, 6, 'g'], [11, 7, 'g'], [11, 8, 'g'], [11, 9, 'g'],
  ],
  mic: [
    [10, 3, 'g'], [11, 3, 'g'], [10, 4, 'g'], [11, 4, 'g'], [10, 5, 'g'], [10, 6, 'g'], [10, 7, 'g'], [10, 8, 'g'],
  ],
};

/** 8×8 coin. */
export const COIN = [
  '..oooo..',
  '.oooooo.',
  'oooggooo',
  'ooogoooo',
  'ooogoooo',
  'oooggooo',
  '.oooooo.',
  '..oooo..',
];

/** Small icons used for inventory slots (8×8). */
export const HEART = [
  '.oo..oo.',
  'oooooooo',
  'oooooooo',
  'oooooooo',
  '.oooooo.',
  '..oooo..',
  '...oo...',
  '........',
];
