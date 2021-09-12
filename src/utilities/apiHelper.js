import moment from 'moment';

const parseCategories = (categories) => {
  let categoryGroups = [];
  let processedGroups = [];

  categories.forEach(category => {
    let groupId = category.categoryGroupId;
    let groupName = category.categoryGroupName;

    let cat = {
      categoryId: category.categoryId,
      categoryName: category.categoryName
    };

    if (processedGroups.find(groupNum => { return groupNum == groupId})) {
      // if we've already parsed the categoryGroup, add this category to the list
      categoryGroups.find(group => group.groupId == groupId).categories.push(cat);
    } else {
      // new categoryGroup
      let group = {
        groupId: groupId,
        groupName: groupName,
        displayOrder: category.displayOrder,
        categories: [cat]
      };

      categoryGroups.push(group);
      processedGroups.push(groupId);
    }
  });

  return categoryGroups;
}

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

export {
  parseCategories,
  parseCashFlow
}