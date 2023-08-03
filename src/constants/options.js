import { homeLoan, carLoan } from "./loanState";

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
      },
      {
        id: 4,
        name: "Wedding/Holiday/Travel Abroad",
      },
      {
        id: 5,
        name: "Medical Expenses/Personal Requirement",
      },
      {
        id: 6,
        name: "Against Securities/Mutual Fund/Fixed Deposit",
      },
      {
        id: 7,
        name: "Buy Household Goods/Gadgets",
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
