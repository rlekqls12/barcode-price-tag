const ItemConstantType = {
  TEXT: "TEXT",
  BARCODE: "BARCODE",
  QR: "QR",
  IMAGE: "IMAGE",
};

class ItemConstant {
  static DETAULT_DATA = {
    render: { x: 0, y: 0, w: 0, h: 0 },
    data: "",
    options: {},
  };
  static DETAULT_TYPE_DATA_OPTIONS = {
    [ItemConstantType.TEXT]: { fontSize: 14, color: "#000000" },
    [ItemConstantType.BARCODE]: { type: "CODE128", color: "#000000" },
    [ItemConstantType.QR]: { color: "#000000" },
    [ItemConstantType.IMAGE]: { type: "src" },
  };

  static TYPE = ItemConstantType;

  static EVENT = {
    CHANGE: "CHANGE",
    STATE_CHANGE: "STATE_CHANGE",
    DELETE: "DELETE",
  };

  static ELEMENT_EVENT = {
    HOVER: "HOVER",
    SELECT: "SELECT",
    EDIT: "EDIT",
    DELETE: "DELETE",
  };

  static STATE = {
    NONE: "NONE",
    HOVER: "HOVER",
    SELECT: "SELECT",
  };

  static checkAvailType(types, type) {
    if (type in types === false) {
      const textTypes = Object.keys(types).join(", ");
      throw new TypeError(`'${type}' is not include [${textTypes}]`);
    }
  }
}

class Item {
  // ------------------------------------ [Base]
  id = null; // random
  type = null; // item type
  data = null; // item data
  // ------------------------------------ [Render]
  element = null; // item element
  imageData = null; // rendered image data (canvas)
  zIndex = 0; // item depth
  // ------------------------------------ [Listener]
  listeners = {}; // listeners

  constructor(type) {
    ItemConstant.checkAvailType(ItemConstant.TYPE, type);

    const id = Math.random().toString(16).slice(2, 6).toUpperCase();
    const data = Object.assign(ItemConstant.DETAULT_DATA, {
      options: ItemConstant.DETAULT_TYPE_DATA_OPTIONS[type],
    });
    const itemElement = new ItemElement(id, type);
    itemElement.updateData(data);

    this.id = id;
    this.type = type;
    this.data = data;
    this.element = itemElement;

    this.#addElementEventListener(ItemConstant.ELEMENT_EVENT.HOVER);
    this.#addElementEventListener(ItemConstant.ELEMENT_EVENT.SELECT);
    this.#addElementEventListener(ItemConstant.ELEMENT_EVENT.EDIT);
    this.#addElementEventListener(ItemConstant.ELEMENT_EVENT.DELETE);

    // TODO: 먼저 ELEMENT 부분 다 만들고 canvas 들어가기 (아이템 생성 및 수정은 popup.js에서, 생성popup, 수정key-valuePopup 두 개 만들기)
    // 기본 데이터 삽입 및 element 생성 및 기본 값이랑 이벤트 연결 후 렌더링 1회 실행
    // 데이터 감시해서 변경 시 render 발생시키기
    // 외부에서는 CHANGE 발생하면 모든 아이템의 imageData 다시 그리게하고
    // STATE_CHANGE 발생하면 인터렉션 영역 다시 그리게 하기
  }

  addEventListener(type, callback) {
    ItemConstant.checkAvailType(ItemConstant.EVENT, type);

    if (Array.isArray(this.listeners[type]) === false) {
      this.listeners[type] = [];
    }
    this.listeners[type].push(callback);
  }

  removeEventListener(type, callback) {
    ItemConstant.checkAvailType(ItemConstant.EVENT, type);

    if (Array.isArray(this.listeners[type]) === false) return;

    const callbackIndex = this.listeners[type].findIndex((f) => f === callback);
    if (callbackIndex) this.listeners[type].splice(callbackIndex, 1);
  }

  render() {
    return this.imageData;
  }

  #addElementEventListener = (type) => {
    this.element.addEventListener(
      type,
      this.#elementEventCallback.bind(this, type)
    );
  };
  #elementEventCallback = (type, data) => {
    switch (type) {
      case ItemConstant.ELEMENT_EVENT.HOVER:
        break;
      case ItemConstant.ELEMENT_EVENT.SELECT:
        break;
      case ItemConstant.ELEMENT_EVENT.EDIT:
        break;
      case ItemConstant.ELEMENT_EVENT.DELETE:
        break;
    }
  };
}

class ItemElement {
  element = null; // dom element
  listeners = {}; // listeners

  constructor(id, type) {
    const textId = id.slice(0, 4);
    const textType = type[0] + type.slice(1).toLowerCase();
    const textElement = `<div data-id="${id}" class="rounded shadow-lg">
    <div class="bg-sky-500 cursor-default p-2">
      <span class="font-bold text-xl text-white">${textType}</span>
      <span class="text-sm text-slate-200">#${textId}</span>
      <div class="inline-block float-right">
        <div data-id="edit" title="Edit" class="inline">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20px"
            height="20px"
            viewBox="0 0 24 24"
            fill="none"
            class="inline cursor-pointer"
          >
            <path
              d="M15 6.5L17.5 9M4 20V17.5L16.75 4.75C17.4404 4.05964 18.5596 4.05964 19.25 4.75V4.75C19.9404 5.44036 19.9404 6.55964 19.25 7.25L6.5 20H4Z"
              stroke="#000000"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </div>
        <div data-id="delete" title="Delete" class="inline">
          <svg
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
    </div>
    <div data-id="data-layout" class="p-2 cursor-default text-white font-bold"></div>
    </div>`;

    const template = document.createElement("template");
    template.innerHTML = textElement;
    this.element = template.content.firstChild;
  }

  updateState(state) {
    // border
  }

  updateData(data) {
    `<span class="cursor-pointer bg-sky-500 rounded-full px-2">X32</span>`;
  }

  addEventListener(type, callback) {
    ItemConstant.checkAvailType(ItemConstant.ELEMENT_EVENT, type);

    if (Array.isArray(this.listeners[type]) === false) {
      this.listeners[type] = [];
    }
    this.listeners[type].push(callback);
  }

  insert(parent) {
    parent.appendChild(this.element);
  }

  remove() {
    return this.element?.remove();
  }
}
