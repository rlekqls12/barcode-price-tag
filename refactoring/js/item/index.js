class ItemConstant {
  static TYPE = {
    TEXT: "TEXT",
    BARCODE: "BARCODE",
    QR: "QR",
    IMAGE: "IMAGE",
  };

  static EVENT = {
    CHANGE: "CHANGE",
    STATE_CHANGE: "STATE_CHANGE",
    EDIT: "EDIT",
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

  static DETAULT_DATA = {
    render: { x: 0, y: 0, w: 0, h: 0 },
    data: "",
    options: {},
  };

  static DETAULT_TYPE_DATA_OPTIONS = {
    [ItemConstant.TYPE.TEXT]: { fontSize: 14, color: "#000000" },
    [ItemConstant.TYPE.BARCODE]: { type: "CODE128", color: "#000000" },
    [ItemConstant.TYPE.QR]: { color: "#000000" },
    [ItemConstant.TYPE.IMAGE]: { type: "src" },
  };
}

class Item {
  // ------------------------------------ [Base]
  /**
   * id: getter
   * type: getter
   * data: getter, setter
   */
  // ------------------------------------ [Render]
  element = null; // item element
  imageData = null; // rendered image data (canvas)
  zIndex = 0; // item depth
  // ------------------------------------ [Listener]
  listeners = {}; // listeners

  constructor(type) {
    checkAvailType(ItemConstant.TYPE, type);

    const id = Math.random().toString(16).slice(2, 6).toUpperCase();
    const data = Object.assign(ItemConstant.DETAULT_DATA, {
      options: ItemConstant.DETAULT_TYPE_DATA_OPTIONS[type],
    });
    const itemElement = new ItemElement(id, type);
    itemElement.updateData(data);

    Object.defineProperties(this, {
      id: { get: () => id },
      type: { get: () => type },
    });
    this.data = observable(data, itemElement.updateData.bind(itemElement));
    this.element = itemElement;

    this.#addElementEventListener(ItemConstant.ELEMENT_EVENT.HOVER);
    this.#addElementEventListener(ItemConstant.ELEMENT_EVENT.SELECT);
    this.#addElementEventListener(ItemConstant.ELEMENT_EVENT.EDIT);
    this.#addElementEventListener(ItemConstant.ELEMENT_EVENT.DELETE);

    // TODO: 먼저 ELEMENT 부분 다 만들고 canvas 들어가기 (아이템 생성 및 수정은 popup.js에서, 생성popup, 수정key-valuePopup 두 개 만들기)
    // 기본 데이터 삽입 및 element 생성 및 기본 값이랑 이벤트 연결 후 렌더링 1회 실행
    // 데이터 감시해서 변경 시 index.js에서 render 발생시키기
    // index.js에서는 CHANGE 발생하면 모든 아이템의 imageData 다시 그리게하고
    // STATE_CHANGE 발생하면 index.js에서 canvas.js 인터렉션 영역 다시 그리게 하기
    // element hover 및 select 시 state_change 이벤트 발생시키고, index.js에서는 element의 updateState로 상태변경 표시하기 (hover 및 select 데이터는 index.js에서 가지고 컨트롤하기)
  }

  addEventListener(type, callback) {
    checkAvailType(ItemConstant.EVENT, type);

    if (Array.isArray(this.listeners[type]) === false) {
      this.listeners[type] = [];
    }
    this.listeners[type].push(callback);
  }

  removeEventListener(type, callback) {
    checkAvailType(ItemConstant.EVENT, type);

    if (Array.isArray(this.listeners[type]) === false) return;

    const callbackIndex = this.listeners[type].findIndex((f) => f === callback);
    if (callbackIndex) this.listeners[type].splice(callbackIndex, 1);
  }

  render() {
    // TODO: 데이터 가지고 canvas 임시로 만들어서 imageData 그리기
    return this.imageData;
  }

  #addElementEventListener = (type) => {
    this.element.addEventListener(type, this.#elementEventCallback.bind(this, type));
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
  target = null; // dom element
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
    <div data-id="data-layout" class="p-1 pt-0 cursor-default text-white font-bold"></div>
    </div>`;

    const template = document.createElement("template");
    template.innerHTML = textElement;
    this.target = template.content.firstChild;
  }

  updateState(state) {
    // border
  }

  updateData(data) {
    const dataKeyValueMappings = [];

    const dataEntries = [...Object.entries(data), ...Object.entries(data.options)];
    dataEntries.forEach(([key, value]) => {
      if (key === "render") return;
      if (key === "options") return;

      const keyValueMap = this.#keyValueMapping(key, value);
      dataKeyValueMappings.push(keyValueMap);
    });

    const dataLayout = this.target.querySelector('div[data-id="data-layout"]');
    dataLayout.replaceChildren();
    dataKeyValueMappings.forEach((keyValueMap) => {
      dataLayout.innerHTML += `<span class="inline-block cursor-pointer bg-sky-500 rounded-full text-xs px-2 mr-1">${keyValueMap}</span>`;
    });
  }

  #keyValueMapping = (key, value) => {
    const abbreviateKeyMap = {
      fontSize: "font",
      color: "color",
    };
    const abbreviateKey = (abbreviateKeyMap[key] ?? key).toUpperCase();
    return `${abbreviateKey}-${value}`;
  };

  addEventListener(type, callback) {
    checkAvailType(ItemConstant.ELEMENT_EVENT, type);

    if (Array.isArray(this.listeners[type]) === false) {
      this.listeners[type] = [];
    }
    this.listeners[type].push(callback);
  }
}
