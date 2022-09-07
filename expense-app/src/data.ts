export enum ReportType {
  INCOME = 'income',
  EXPENSE = 'expense',
}

export const data: Data = {
  report: [
    {
      id: 'uuid1',
      source: 'Salary',
      amount: 7500,
      created_at: new Date(),
      updated_at: new Date(),
      type: ReportType.INCOME,
    },
    {
      id: 'uuid2',
      source: 'YouTube',
      amount: 2500,
      created_at: new Date(),
      updated_at: new Date(),
      type: ReportType.INCOME,
    },
    {
      id: 'uuid3',
      source: 'Food',
      amount: 500,
      created_at: new Date(),
      updated_at: new Date(),
      type: ReportType.EXPENSE,
    },
  ],
};

// interface Data {
//   report: {
//     id: string;
//     source: string;
//     amount: number;
//     create_at: Date;
//     updated_at: Date;
//     type: 'income' | 'expense';  --> can use an enum which is doing the same thing
//   }[];
// }

interface Data {
  report: {
    id: string;
    source: string;
    amount: number;
    created_at: Date;
    updated_at: Date;
    type: ReportType;
  }[];
}

// data.report.push({
//   id: 'uuid',
//   source: 'Salary',
//   amount: 7500,
//   create_at: new Date(),
//   updated_at: new Date(),
//   type: 'expense',
// });
