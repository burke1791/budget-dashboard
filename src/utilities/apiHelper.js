
const processCategories = (categories) => {
  let categoryGroups = [];
  let processedGroups = [];

  categories.forEach(category => {
    let groupId = category.categoryGroup.categoryGroupId;
    let groupName = category.categoryGroup.categoryGroupName;

    if (processedGroups.find(groupNum => { return groupNum == groupId})) {
      let cat = {
        categoryId: category.categoryId,
        categoryName: category.categoryName
      };

      categoryGroups.find(group => group.groupId == groupId).categories.push(cat);
    } else {
      let cat = {
        categoryId: category.categoryId,
        categoryName: category.categoryName
      };

      let group = {
        groupId: groupId,
        groupName: groupName,
        categories: [cat]
      };

      categoryGroups.push(group);
      processedGroups.push(groupId);
    }
  });

  return categoryGroups;
}

export {
  processCategories
}