import { homeLoan, carLoan, personalLoan, lapLoan } from "./loanState";

export const options = [
  {
    id: 1,
    name: "Loan",
    items: [
      {
        id: 1,
        name: "Buying a House",
        state: homeLoan,
      },
      {
        id: 2,
        name: "Buying a Car",
        state: carLoan,
      },
      {
        id: 3,
        name: "Education/Higher Studies",
        state: personalLoan,
      },
      {
        id: 4,
        name: "Wedding/Holiday/Travel Abroad",
        state: personalLoan,
      },
      {
        id: 5,
        name: "Medical Expenses/Personal Requirement",
        state: personalLoan,
      },
      {
        id: 6,
        name: "Against Securities/Mutual Fund/Fixed Deposit",
        state: lapLoan,
      },
      {
        id: 7,
        name: "Buy Household Goods/Gadgets",
        state: personalLoan,
      },
    ],
  },
  {
    id: 2,
    name: "Cards",
    items: [
      {
        id: 1,
        name: "Lifestyle",
      },
      {
        id: 2,
        name: "Travel & Fuel",
      },
      {
        id: 3,
        name: "Shopping",
      },
      {
        id: 4,
        name: "Rewards",
      },
    ],
  },
];
