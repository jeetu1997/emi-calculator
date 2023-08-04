export const loanState = {
  name: "Home Loan",
  loan: {
    min: 100000,
    max: 10000000,
    initial: 5050000,
    range: ["1L", "25L", "50L", "75L", "1CR"],
  },
  interest: {
    min: 4,
    max: 24,
    initial: 10,
    range: ["4%", "8%", "12%", "16%", "20%", "24%"],
  },
  tenure: {
    min: 5,
    max: 30,
    initial: 10,
    range: ["5Y", "10Y", "15Y", "20Y", "25Y", "30Y"],
  },
};
