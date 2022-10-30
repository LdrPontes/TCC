export const colors: string[] = [
  '#FF0000',
  '#FF7F00',
  '#FFFF00',
  '#00FF00',
  '#0000FF',
  '#4B0082',
  '#9400D3',
]


let nextIndex = 0;
export const getNextColor = () => {
  const color =  colors[nextIndex];
  nextIndex++;
  if (nextIndex >= colors.length) {
    nextIndex = 0;
  }
  return color;
}

export const resetColors = () => {
  nextIndex = 0;
}