let data = [];
axios.get("https://raw.githubusercontent.com/hexschool/js-training/main/travelAPI-lv1.json")
  .then(function (response) {
    data = response.data;
    dataUpdate();
  })
  .catch(function (error) {
    alert(error.message);
  })

let showData = [];
const ticketAddForm = document.querySelectorAll(".ticketAddForm input,.ticketAddForm select,.ticketAddForm textarea");
const imgLinkInput = document.querySelector("#imgUrl");
const areaInput = document.querySelector("#area");
const cardList = document.querySelector(".cardlist");
const ticketAddBtn = document.querySelector(".ticketadd-btn");
const dataSearchNum = document.querySelector(".search-count");
const dataFilter = document.querySelector(".filter");

// 新增資料
let isFormFinish = true;
const dataPush = () => {
  isFormFinish = true;
  let obj = {};
  ticketAddForm.forEach((item) => {
    if (item.value === "") {
      isFormFinish = false;
    };
    obj.id = data.length;
    obj[item.id] = item.value;

  });
  if (!isFormFinish) {
    alert("尚有欄位未填寫");
    return;
  };
  if (obj.rate < 1 || obj.rate > 10) {
    alert("套票星級範圍為1-10");
    isFormFinish = false;
    return;
  };
  data.push(obj);
  ticketAddForm.forEach((item) => item.value = "");
  alert("新增成功！")
};

// 資料筆數
const dataSearchCalc = (data) => {
  dataSearchNum.innerHTML = data.length;
};

// 渲染網頁
const renderData = (data) => {
  let str = "";
  data.forEach((item) => {
    str += `<div class="card-wrap"><div class="product-card"><div class="card_img"><img src="${item.imgUrl}" alt="img"><div class="rate-badge">${item.rate}</div></div><div class="area-badge">${item.area}</div><div class="card_text"><h2>${item.name}</h2><p>${item.description}</p><div class="card_price"><p><i class="bi bi-exclamation-circle-fill"></i>剩下最後${item.group}組</p><div class="price-wrap"><p>TWD</p><span class="price-sign">$</span><span class="price">${item.price}</span></div></div></div></div></div>`
  });
  cardList.innerHTML = str;
};

// 資料篩選
dataFilter.addEventListener("change", (e) => {
  if (e.target.value === "全部地區") {
    renderData(data);
    dataSearchCalc(data);
    return;
  }
  showData = data.filter((item) => item.area === e.target.value);
  renderData(showData);
  dataSearchCalc(showData);
});

// chart
const chartData = [];
const chartDataFormat = () => {
  chartData.length = 0;
  const obj = {};
  const num = data.length;
  data.forEach((item) => {
    if (obj[item.area]) {
      obj[item.area] += 1;
    } else {
      obj[item.area] = 1;
    };
  });
  // 自定義排序方法參考自GPT
  const order = ["台北", "台中", "高雄"];
  const arr = Object.keys(obj).sort((a, b) => order.indexOf(a) - order.indexOf(b));
  arr.forEach((item) => {
    const val = [];
    val.push(item, obj[item]);
    chartData.push(val);
  });
  chartRender();
};

const chartRender = () => {
  const chart = c3.generate({
    bindto: '#chart',
    data: {
      columns: chartData,
      type: 'donut',
      colors: {
        "台北": '#26BFC7',
        "台中": '#5151D3 ',
        "高雄": '#E68619'
      }
    },
    donut: {
      title: "套票地區比重",
      width: 10,
      label: {
        show: false
      }
    }
  });
};

// 輸入框初始化
const inputReset = () => {
  imgLinkInput.value = "https://images.unsplash.com/photo-1522383225653-ed111181a951?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1655&q=80";
  areaInput.value = "請選擇景點地區";
}

// 篩選器初始化
const filterReset = () => {
  dataFilter.value = "全部地區";
};

// 資料更新
const dataUpdate = () => {
  renderData(data);
  chartDataFormat();
  dataSearchCalc(data);
  inputReset();
};

// 新增按鈕監聽
ticketAddBtn.addEventListener("click", (e) => {
  dataPush();
  if (!isFormFinish) {
    return;
  };
  dataUpdate();
  filterReset();
});




