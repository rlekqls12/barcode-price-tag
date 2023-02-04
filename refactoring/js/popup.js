class PopupConstant {
  static DEFAULT_POPUP_LAYOUT = `<div class="fixed z-50 top-0 w-full h-full">
    <div class="absolute top-0 w-full h-full bg-black opacity-50 select-none" @click=""></div>
    <div class="relative w-full h-full flex items-center justify-center">
      <div class="absolute w-80 h-96 bg-white p-2 grid grid-rows-6 rounded">
        <div class="row-span-1">
          <div class="flex mb-1">
            <span class="text-xl font-bold">Item</span>
            <div class="flex-1 text-right">
              <svg
                data-id="close"
                xmlns="http://www.w3.org/2000/svg"
                width="20px"
                height="20px"
                viewBox="-3.5 0 19 19"
                fill="#000000"
                class="inline cursor-pointer"
              >
                <path
                  d="M11.383 13.644A1.03 1.03 0 0 1 9.928 15.1L6 11.172 2.072 15.1a1.03 1.03 0 1 1-1.455-1.456l3.928-3.928L.617 5.79a1.03 1.03 0 1 1 1.455-1.456L6 8.261l3.928-3.928a1.03 1.03 0 0 1 1.455 1.456L7.455 9.716z"
                />
              </svg>
            </div>
          </div>
          <hr />
          <div class="flex gap-4">
            <label for="select-item-type">Type</label>
            <select id="select-item-type" data-id="select-item-type" class="flex-1 pr-1 text-right">
              ${Object.entries(ItemConstant.TYPE).map(([key, value]) => `<option value="${key}">${value}</option>`)}
            </select>
          </div>
        </div>
        <div data-id="layout-item-input" class="row-span-4 overflow-y-auto">
        <!-- item input layout -->
        </div>
        <div class="row-span-1 flex flex-row gap-2 items-end justify-center">
          <button data-id="create" class="w-48 h-fit px-2 py-1 border-transparent border-2 rounded-md text-white bg-sky-500">Create</button>
          <button data-id="close" class="w-24 h-fit px-2 py-1 border-transparent border-2 rounded-md text-white bg-slate-500">Close</button>
        </div>
      </div>
    </div>
  </div>`;

  static ADD_POPUP_TYPE = {
    [ItemConstant.TYPE.TEXT]: `<p>ItemText</p>`,
    [ItemConstant.TYPE.BARCODE]: `<p>ItemBarcode</p>`,
    [ItemConstant.TYPE.QR]: `<p>ItemQr</p>`,
    [ItemConstant.TYPE.IMAGE]: `<p>ItemImage</p>`,
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
    popup.addEventListener("click", (e) => {
      const dataId = e.target.getAttribute("data-id") || e.target.parentNode.getAttribute("data-id");

      if (dataId === "create") {
        // TODO: 입력값 유효성 검사하기

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

    const itemInputLayout = popup.querySelector('div[data-id="layout-item-input"]');
    itemInputLayout.innerHTML = PopupConstant.ADD_POPUP_TYPE[type];

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
