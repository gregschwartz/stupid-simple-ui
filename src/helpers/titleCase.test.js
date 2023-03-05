import { titleCaseSentence } from './titleCase';

let correct = "Live Long And Prosper";
test('titleCaseSentence', () => {
  expect(titleCaseSentence("liveLongAndProsper")).toBe(correct);


  expect(titleCaseSentence("liveLong-AndProsper")).toBe(correct);
  expect(titleCaseSentence("liveLong_AndProsper")).toBe(correct);
});

test('underscores', () => {
  expect(titleCaseSentence("live_long_and_prosper")).toBe(correct);
  expect(titleCaseSentence("live_long_and_prosper")).toBe(correct);
  expect(titleCaseSentence("live_long-and-prosper")).toBe(correct);
});

test('dashes', () => {
  expect(titleCaseSentence("live-long-and-prosper")).toBe(correct);
});

test('multiple capital letters', () => {
expect(titleCaseSentence("HORRIBLE_PLACE")).toBe("Horrible Place");
expect(titleCaseSentence("HORRIBLE-PLACE")).toBe("Horrible Place");
expect(titleCaseSentence("HorriblePLACE")).toBe("Horrible Place");
});
