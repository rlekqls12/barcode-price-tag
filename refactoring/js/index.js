(() => {
  const CONSTANT = {
    ITEM_LAYOUT: document.querySelector('div[data-layout="items"]'),
  };

  const dataInfo = {
    items: [],
  };

  window.addEventListener("DOMContentLoaded", () => {
    // default items
    const textItem = new Item(ItemConstant.TYPE.TEXT);
    textItem.data.data = "example text";
    dataInfo.items.push(textItem);
    drawItem(textItem);
  });

  /** @param {Item} item */
  function drawItem(item) {
    CONSTANT.ITEM_LAYOUT.appendChild(item.element.target);
  }
})();
