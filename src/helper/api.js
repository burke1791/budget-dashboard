import moment from 'moment';

export const parseCashFlow = (cashFlowArr) => {
  return cashFlowArr.map(cashFlow => {
    let month = moment(cashFlow.transactionMonth);

    return {
      month: month,
      cashFlowIn: cashFlow.cashFlowIn,
      cashFlowOut: cashFlow.cashFlowOut,
      unassignedTransactions: cashFlow.unassignedTransactionCount
    };
  });
}