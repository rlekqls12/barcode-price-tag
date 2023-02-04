(() => {
  const CONSTANT = {
    ITEM_LAYOUT: document.querySelector('div[data-layout="items"]'),
  };

  const dataInfo = {
    items: [],
  };

  window.addEventListener("DOMContentLoaded", () => {
    // connect event
    document.body
      .querySelector('div[data-id="add-item"]')
      .addEventListener("click", showItemPopup);

    // default items
    const textItem = createItem(ItemConstant.TYPE.TEXT);
    textItem.data.data = "example text";
    drawItem(textItem);
  });

  function createItem(type) {
    const newItem = new Item(type);
    connectItem(newItem);
    return newItem;
  }

  function connectItem(item) {
    // TODO: 기본적인 이벤트 연결 설정하기 [CHANGE, STATE_CHANGE, EDIT, DELETE]
  }

  function drawItem(item) {
    dataInfo.items.push(item);
    CONSTANT.ITEM_LAYOUT.appendChild(item.element.target);
  }

  async function showItemPopup(item) {
    const isEdit = item instanceof Item;
    const newItem = await Popup.showItemPopup(item);

    if (newItem instanceof Item && isEdit === false) {
      drawItem(newItem);
    }
  }
})();
