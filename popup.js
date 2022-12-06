/**
 * @typedef {'text' | 'barcode' | 'qr' | 'image'} ItemType
 */

function openAddItemPopup() {
  resetAddItemPopup();

  const popup = document.querySelector("#item-popup-layout");
  popup.style.display = "flex";
}

function closeAddItemPopup() {
  const popup = document.querySelector("#item-popup-layout");
  popup.style.display = "none";

  resetAddItemPopup();
}

function resetAddItemPopup() {
  const popup = document.querySelector("#item-popup-layout");

  const inputLayouts = popup.querySelectorAll(".item-popup-input-layout");
  inputLayouts.forEach((inputLayout) => {
    inputLayout.style.display = "";
  });

  const imageDataInput = popup.querySelector('input[data-id="item-popup-input-data"]');
  imageDataInput.type = 'text';

  const inputs = popup.querySelectorAll("input");
  inputs.forEach((input) => {
    input.value = "";
  });

  const selects = popup.querySelectorAll("select");
  selects.forEach((select) => {
    if (select.getAttribute("data-id") === "item-popup-select-item-type") {
      select.value = "text";
      showAddItemPopupLayout("text");
      return;
    }
    select.value = "";
  });
}

/**
 * @param {ItemType} layout
 */
function showAddItemPopupLayout(layout) {
  const popup = document.querySelector("#item-popup-layout");

  const inputLayouts = popup.querySelectorAll(".item-popup-input-layout");
  inputLayouts.forEach((inputLayout) => {
    if (inputLayout.getAttribute("data-id").endsWith(layout)) {
      inputLayout.style.display = "";
    } else {
      inputLayout.style.display = "none";
    }
  });
}

function addItemWithPopup() {
  const popup = document.querySelector("#item-popup-layout");

  // selected item type
  const itemTypeSelect = popup.querySelector(
    'select[data-id="item-popup-select-item-type"]'
  );
  const selectedType = itemTypeSelect.value;

  // selected item input layout
  const selectedItemInputLayout = popup.querySelector(
    `div[data-id="item-popup-input-layout-${selectedType}"]`
  );

  // get item child element function
  const getElement = (tag, dataId) =>
    selectedItemInputLayout.querySelector(`${tag}[data-id="${dataId}"]`);

  const itemData = { x: 0, y: 0 };
  if (selectedType === "text") {
    const textValue = getElement("input", "item-popup-input-text").value;
    const fontSizeValue = getElement(
      "input",
      "item-popup-input-font-size"
    ).valueAsNumber;

    itemData.text = textValue || initItemData.text.text;
    itemData.fontSize = fontSizeValue || initItemData.text.fontSize;
  }
  if (selectedType === "barcode") {
    const dataValue = getElement("input", "item-popup-input-data").value;
    const typeValue = getElement(
      "select",
      "item-popup-select-barcode-type"
    ).value;

    itemData.data = dataValue || initItemData.barcode.data;
    itemData.type = typeValue || initItemData.barcode.type;
  }
  if (selectedType === "qr") {
    const dataValue = getElement("input", "item-popup-input-data").value;

    itemData.data = dataValue || initItemData.qr.data;
  }
  if (selectedType === "image") {
    const dataValue = getElement("input", "item-popup-input-data").value;
    const widthValue = getElement("input", "item-popup-input-width").value;
    const heightValue = getElement("input", "item-popup-input-height").value;
    const typeValue = getElement(
      "select",
      "item-popup-select-image-type"
    ).value;

    itemData.data = dataValue || initItemData.image.data;
    itemData.width = dataValue || initItemData.image.width;
    itemData.height = dataValue || initItemData.image.height;
    itemData.type = typeValue || initItemData.image.type;
  }

  const newItem = new Item(selectedType, itemData);
  newItem.setDeleteEventListener((item) => {
    // remove element
    item.element.remove();

    // remove item in itemlist
    const $id = item.id;
    const itemIndex = globalData.itemList.findIndex((item) => item.id === $id);
    globalData.itemList.splice(itemIndex, 1);

    // reset data
    item.id = null;
    item.element = null;
    item.type = null;
    item.data = null;
  })
  globalData.itemList.push(newItem);

  closeAddItemPopup();
}

window.addEventListener("DOMContentLoaded", () => {
  const popup = document.querySelector("#item-popup-layout");

  // close
  const closePopupButton = popup.querySelector(
    'div[data-id="event-popup-close"]'
  );
  closePopupButton.addEventListener("click", closeAddItemPopup);

  // item type select
  const itemTypeSelect = popup.querySelector(
    'select[data-id="item-popup-select-item-type"]'
  );
  itemTypeSelect.addEventListener("change", (event) => {
    const value = event.target.value;
    showAddItemPopupLayout(value);
  });

  // add item button
  const addItemButton = popup.querySelector(
    'button[data-id="event-popup-add-item"]'
  );
  addItemButton.addEventListener("click", addItemWithPopup);
});
