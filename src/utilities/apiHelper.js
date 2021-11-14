import moment from 'moment';

const parseCashFlow = (cashFlowArr) => {
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

const parseCategorySpending = (categorySpending) => {
  const spendingObj = {};

  for (let category of categorySpending) {
    const groupId = category.categoryGroupId;

    const subCategory = {
      categoryId: category.categoryId,
      categoryName: category.categoryName,
      spent: category.spent
    };

    if (!(groupId in spendingObj)) {
      spendingObj[groupId] = {
        month: category.month,
        categoryGroupId: groupId,
        categoryGroupName: category.categoryGroupName,
        spent: category.spent,
        subCategories: [subCategory],
        displayOrder: category.displayOrder
      }
    } else {
      spendingObj[groupId].subCategories.push(subCategory);
      spendingObj[groupId].spent += category.spent;
    }
  }

  const arr = Object.values(spendingObj).sort((a, b) => a.displayOrder - b.displayOrder);
  return arr;
}

const calculateTotalUnassignedTransactions = (unassigned) => {
  return unassigned.reduce((prev, current) => prev + current.unassignedTransactions, 0);
}

export {
  parseCashFlow,
  parseCategorySpending,
  calculateTotalUnassignedTransactions
}