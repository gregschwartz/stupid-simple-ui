export function titleCaseSentence(s) {
  if(s === undefined || s === null) { return s; }
  if(s === "") { return null; }

  let words = [""];
  let lastLetterWasCapital = false;
  for(var i=0; i<s.length; i++) {//iterate through the string
    const letter = s[i];

    //if capital letter
    if(letter.match(/[A-Z]/)) {
      if(lastLetterWasCapital) {
        //if previous letter was capitalized: add to previous word
        words[words.length-1] += letter;
      } else {
        //else: start new word with this letter
        words.push(letter);
      }
      lastLetterWasCapital = true;
    } else if (letter === "-" || letter === "_" || letter === " ") {
      //if underscore, dash, or space: start new word with this letter
      words.push("");
      lastLetterWasCapital = false;
    } else {
      //if e.g. number, lowercase letter, etc: continue
      words[words.length-1] += letter;
      lastLetterWasCapital = false;
    }
  }

  words = words.map(function(word) {
    if(word.length === 0) {return "";}
    return word[0].toUpperCase() + word.slice(1);
  });

  return words.join(" ");
}