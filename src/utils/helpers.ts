export const getRandomArbitrary = (min: number, max: number) => {
  return Math.random() * (max - min) + min;
};

export const getRandomInt = (min: number, max: number) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const getRandomCapitalLetter = () => {
  return String.fromCharCode(65 + Math.floor(Math.random() * 26));
};

export const getRandomLetter = () => {
  return String.fromCharCode(97 + Math.floor(Math.random() * 26));
};
