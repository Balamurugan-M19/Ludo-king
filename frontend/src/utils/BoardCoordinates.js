export const MAIN_PATH = [
  // RED path out of base
  { r: 6, c: 1 }, { r: 6, c: 2 }, { r: 6, c: 3 }, { r: 6, c: 4 }, { r: 6, c: 5 },
  // Up towards Green
  { r: 5, c: 6 }, { r: 4, c: 6 }, { r: 3, c: 6 }, { r: 2, c: 6 }, { r: 1, c: 6 }, { r: 0, c: 6 },
  // Around Green base
  { r: 0, c: 7 }, { r: 0, c: 8 },
  // Green path down
  { r: 1, c: 8 }, { r: 2, c: 8 }, { r: 3, c: 8 }, { r: 4, c: 8 }, { r: 5, c: 8 },
  // Towards Yellow
  { r: 6, c: 9 }, { r: 6, c: 10 }, { r: 6, c: 11 }, { r: 6, c: 12 }, { r: 6, c: 13 }, { r: 6, c: 14 },
  // Around Yellow base
  { r: 7, c: 14 }, { r: 8, c: 14 },
  // Yellow path left
  { r: 8, c: 13 }, { r: 8, c: 12 }, { r: 8, c: 11 }, { r: 8, c: 10 }, { r: 8, c: 9 },
  // Down towards Blue
  { r: 9, c: 8 }, { r: 10, c: 8 }, { r: 11, c: 8 }, { r: 12, c: 8 }, { r: 13, c: 8 }, { r: 14, c: 8 },
  // Around Blue base
  { r: 14, c: 7 }, { r: 14, c: 6 },
  // Blue path up
  { r: 13, c: 6 }, { r: 12, c: 6 }, { r: 11, c: 6 }, { r: 10, c: 6 }, { r: 9, c: 6 },
  // Towards Red
  { r: 8, c: 5 }, { r: 8, c: 4 }, { r: 8, c: 3 }, { r: 8, c: 2 }, { r: 8, c: 1 }, { r: 8, c: 0 },
  // Around Red base to complete loop
  { r: 7, c: 0 }, { r: 6, c: 0 }
];

export const SAFE_SQUARES = [0, 8, 13, 21, 26, 34, 39, 47];

export const HOME_STRETCH = {
  RED: [
    { r: 7, c: 1 }, { r: 7, c: 2 }, { r: 7, c: 3 }, { r: 7, c: 4 }, { r: 7, c: 5 }, { r: 7, c: 6 } // last is home
  ],
  GREEN: [
    { r: 1, c: 7 }, { r: 2, c: 7 }, { r: 3, c: 7 }, { r: 4, c: 7 }, { r: 5, c: 7 }, { r: 6, c: 7 }
  ],
  YELLOW: [
    { r: 7, c: 13 }, { r: 7, c: 12 }, { r: 7, c: 11 }, { r: 7, c: 10 }, { r: 7, c: 9 }, { r: 7, c: 8 }
  ],
  BLUE: [
    { r: 13, c: 7 }, { r: 12, c: 7 }, { r: 11, c: 7 }, { r: 10, c: 7 }, { r: 9, c: 7 }, { r: 8, c: 7 }
  ]
};

export const BASE_POSITIONS = {
  RED: [ { r: 2, c: 2 }, { r: 2, c: 3 }, { r: 3, c: 2 }, { r: 3, c: 3 } ],
  GREEN: [ { r: 2, c: 11 }, { r: 2, c: 12 }, { r: 3, c: 11 }, { r: 3, c: 12 } ],
  YELLOW: [ { r: 11, c: 11 }, { r: 11, c: 12 }, { r: 12, c: 11 }, { r: 12, c: 12 } ],
  BLUE: [ { r: 11, c: 2 }, { r: 11, c: 3 }, { r: 12, c: 2 }, { r: 12, c: 3 } ]
};

export const getCoordinates = (color, position, index) => {
  if (position === -1) {
    return BASE_POSITIONS[color][index];
  }
  if (position >= 0 && position <= 51) {
    return MAIN_PATH[position];
  }
  if (position >= 100 && position <= 105) {
    return HOME_STRETCH.RED[position - 100];
  }
  if (position >= 200 && position <= 205) {
    return HOME_STRETCH.GREEN[position - 200];
  }
  if (position >= 300 && position <= 305) {
    return HOME_STRETCH.YELLOW[position - 300];
  }
  if (position >= 400 && position <= 405) {
    return HOME_STRETCH.BLUE[position - 400];
  }
  return { r: 7, c: 7 }; // center fallback
};
