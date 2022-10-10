// global data
const globalData = {
  image: {
    width: 300,
    height: 150,
  },
  itemList: [],
};

window.addEventListener("DOMContentLoaded", () => {
  // add item - event listener
  const addItemButton = document.querySelector("#item-add");
  addItemButton.addEventListener("click", () => {
    // TODO: 팝업 보여주고 확인 누르면 아래 코드 실행해야함 new Item(type);
    const newItem = new Item();
    globalData.itemList.push(newItem);
  });
});
