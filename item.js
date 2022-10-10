class Item {
  id = null;
  element = null;
  type = null;
  data = null;

  constructor(type = "text", data = { x: 0, y: 0, text: "", fontSize: 14 }) {
    // type available check
    const availableTypes = ["text", "barcode", "qr"];
    if (availableTypes.includes(type) === false) {
      throw new Error(`${type} is not includes [${availableTypes.join(", ")}]`);
    }

    // set id
    this.id = Math.random().toString(16).slice(2);

    // clone item element
    const originalItem = document.querySelector('div[data-id="item"]');
    this.element = originalItem.cloneNode(true);
    this.element.removeAttribute("data-id");
    this.element.classList.add(`item-type-${type}`);

    // append item
    const itemListDOM = document.querySelector("#item-list");
    itemListDOM.appendChild(this.element);

    // set type
    this.type = type;

    // set data
    this.data = data;

    // init event listener
    this.#initEventListener();
  }

  #initEventListener() {
    this.element.addEventListener("click", (event) => {
      // get item dom
      const currentItemDOM = event.currentTarget;
      // get clicked dom data-id
      const clickedDOM = event.target;
      let targetDOM = clickedDOM;
      let dataID = targetDOM.getAttribute("data-id");
      if (dataID === null) {
        targetDOM = clickedDOM.parentNode;
        dataID = targetDOM.getAttribute("data-id");
      }

      // data-id = event-layout-toggle
      if (dataID === "event-layout-toggle") {
        // toggle visible event layout
        const itemControlLayout = currentItemDOM.querySelector(
          ".item-layout-control"
        );
        itemControlLayout.classList.toggle("hide");

        // toggle text
        const span = targetDOM.querySelector("span");
        span.textContent = span.textContent === "▼" ? "▲" : "▼";
      }
    });
  }

  modify() {}
  delete() {}
  editData(key, value) {}
}
