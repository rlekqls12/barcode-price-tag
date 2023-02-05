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
            <label for="popup-select-item-type">Type</label>
            <select id="popup-select-item-type" data-id="select-item-type" class="flex-1 pr-1 text-right">
              ${Object.entries(ItemConstant.TYPE).map(([key, value]) => `<option value="${key}">${value}</option>`)}
            </select>
          </div>
        </div>
        <div data-id="layout-item-input" class="row-span-4 overflow-y-auto">
        <!-- item input layout -->
        </div>
        <div class="row-span-1 flex flex-row gap-2 items-end justify-center">
          <button data-id="create" class="w-48 h-fit px-2 py-1 border-transparent border-2 rounded-md text-white bg-sky-500 hover:bg-sky-400">Create</button>
          <button data-id="close" class="w-24 h-fit px-2 py-1 border-transparent border-2 rounded-md text-white bg-slate-500 hover:bg-slate-400">Close</button>
        </div>
      </div>
    </div>
  </div>`;

  static ADD_POPUP_TYPE = {
    [ItemConstant.TYPE.TEXT]: `
      <div class="flex gap-4">
        <label for="popup-fontSize">Font Size</label>
        <div class="flex-1 text-right">
          <input id="popup-fontSize" data-id="fontSize" type="number" value="14" max="999" min="1" maxlength="3" class="w-20 text-right" oninput="onMaxLengthInput(this, 3)" />
        </div>
      </div>
      <div class="flex gap-4">
        <label for="popup-color">Color</label>
        <div class="flex-1 text-right">
          <input id="popup-color" data-id="color" value="#000000" class="w-20 text-right" />
          <img src onerror="initColorPicker('#popup-color')" />
        </div>
      </div>
    `,
    [ItemConstant.TYPE.BARCODE]: `<p>ItemBarcode</p>`,
    [ItemConstant.TYPE.QR]: `<p>ItemQr</p>`,
    [ItemConstant.TYPE.IMAGE]: `<p>ItemImage</p>`,
  };

  static getInputData(layoutItemInput, initOptions = {}) {
    const options = { ...initOptions };

    const inputs = layoutItemInput.querySelectorAll(`*[data-id]`);
    [...inputs].forEach((input) => {
      const key = input.getAttribute("data-id");
      options[key] = input.value;
    });

    return options;
  }

  static validateInputs(options) {
    // TODO: 유효성검사
    return options;
  }
}

class Popup {
  static async showItemPopup(item) {
    let type = ItemConstant.TYPE.TEXT,
      resolveFunction;
    const promise = new Promise((resolve) => (resolveFunction = resolve));

    const template = document.createElement("template");
    template.innerHTML = PopupConstant.DEFAULT_POPUP_LAYOUT;
    const popup = template.content.firstChild;
    popup.addEventListener("click", (e) => {
      const dataId = e.target.getAttribute("data-id") || e.target.parentNode.getAttribute("data-id");

      if (dataId === "create") {
        if (item instanceof Item === false) item = new Item(type);

        let options = PopupConstant.getInputData(itemInputLayout, item.data.options);
        options = PopupConstant.validateInputs(options);
        item.data.options = options;

        popup.remove();
        resolveFunction(item);
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
    });

    document.body.appendChild(popup);

    return promise;
  }
}
