
/* returns random number between two interval includes min and max*/
export function randInt(min, max) { // min and max included 

    return Math.floor(Math.random() * (max - min + 1) + min)
}

/**
 * Generates a random color
 */
export function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }
  
  