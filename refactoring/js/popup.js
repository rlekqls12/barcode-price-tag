class PopupConstant {
  static DEFAULT_POPUP_LAYOUT = `<div>
    <select data-id="select-item-type"></select>
    <div data-id="layout-item-input"></div>
    <button data-id="create">Create</button>
    <button data-id="close">Close</button>
  </div>`;

  static ADD_POPUP_TYPE = {
    [ItemConstant.TYPE.TEXT]: ``,
    [ItemConstant.TYPE.BARCODE]: ``,
    [ItemConstant.TYPE.QR]: ``,
    [ItemConstant.TYPE.IMAGE]: ``,
  };

  static connectInputToData(layoutItemInput, initData = {}) {
    const data = { ...initData };

    Object.keys(data).forEach((key) => {
      layoutItemInput
        // TODO: DOM이랑 데이터랑 어떤 이름(key)으로 연결할건지 정하기
        .querySelector(`input[data-id="${key}"]`)
        .addEventListener((e) => {
          data[key] = e.target.value;
        });
    });

    return data;
  }
}

class Popup {
  static async showItemPopup(item) {
    const isEdit = item instanceof Item;
    let data,
      type = ItemConstant.TYPE.TEXT,
      resolveFunction;
    const promise = new Promise((resolve) => (resolveFunction = resolve));

    const template = document.createElement("template");
    template.innerHTML = PopupConstant.DEFAULT_POPUP_LAYOUT;
    const popup = template.content.firstChild;

    const itemInputLayout = popup.querySelector('div[data-id="layout-item-input"]');
    itemInputLayout.innerHTML = PopupConstant.ADD_POPUP_TYPE[type];
    itemInputLayout.addEventListener("click", (e) => {
      const dataId = e.target.getAttribute("data-id");

      if (dataId === "create") {
        popup.remove();
        if (isEdit) {
          item.data = data; // TODO: 반응형 안 깨지게 저장해야함 (item.data를 Object.definePropertyKey로 만들기 [그럼 원본 데이터는 어디에 저장할지 생각해보기])
          resolveFunction(item);
        } else {
          const newItem = new Item(type);
          newItem.data = data; // TODO: 반응형 안 깨지게 저장해야함 (item.data를 Object.definePropertyKey로 만들기 [그럼 원본 데이터는 어디에 저장할지 생각해보기])
          resolveFunction(newItem);
        }
      }
      if (dataId === "close") {
        popup.remove();
        resolveFunction(null);
      }
    });

    const selectItemType = popup.querySelector('select[data-id="select-item-type"]');
    selectItemType.addEventListener("change", (e) => {
      type = e.target.value;
      const changedItemType = PopupConstant.ADD_POPUP_TYPE[type];

      itemInputLayout.replaceChildren();
      itemInputLayout.innerHTML = changedItemType;

      setTimeout(() => {
        data = PopupConstant.connectInputToData(itemInputLayout, {});
      }, 0);
    });

    if (isEdit) {
      data = PopupConstant.connectInputToData(itemInputLayout, item.data);
    } else {
      data = PopupConstant.connectInputToData(itemInputLayout, {});
    }

    document.body.appendChild(popup);

    return promise;
  }
}
