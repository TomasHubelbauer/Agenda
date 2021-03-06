import getItems from './getItems.js';

export default function* getScheduledItems() {
  for (let item of getItems()) {
    if (item.archivedDate === undefined && item.notBeforeDate !== undefined && item.notBeforeDate > new Date()) {
      yield item;
    }
  }
}
