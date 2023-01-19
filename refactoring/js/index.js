(() => {
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
    const itemLayout = document.querySelector('div[data-layout="items"]');
    itemLayout.appendChild(item.element.target);
  }
})();
