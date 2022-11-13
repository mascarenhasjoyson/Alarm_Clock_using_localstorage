const currentTime = document.querySelector("h1"),
  selectMenu = document.querySelectorAll("select"),
  content = document.querySelector(".content"),
  alarmName = document.getElementById("alarm-name"),
  form1 = document.querySelector("form"),
  alarmStop = document.getElementById("stopbtn"),
  setAlarmBtn = document.querySelector(".setbtn");

//Code to set and stop alarms.
let alarmTime,
  para,
  ringTone = new Audio("./alarm.mp3");
alarmStop.classList.add("hide");

for (let i = 12; i > 0; i--) {
  i = i < 10 ? "0" + i : i;
  let option = `<option value="${i}">${i}</option>`;
  selectMenu[0].firstElementChild.insertAdjacentHTML("afterend", option);
}

for (let i = 59; i >= 0; i--) {
  i = i < 10 ? "0" + i : i;
  let option = `<option value="${i}">${i}</option>`;
  selectMenu[1].firstElementChild.insertAdjacentHTML("afterend", option);
}

for (let i = 2; i > 0; i--) {
  let ampm = i == 1 ? "AM" : "PM";
  let option = `<option value="${ampm}">${ampm}</option>`;
  selectMenu[2].firstElementChild.insertAdjacentHTML("afterend", option);
}

setInterval(() => {
  let date = new Date(),
    h = date.getHours(),
    m = date.getMinutes(),
    s = date.getSeconds(),
    ampm = "AM";

  if (h > 12) {
    h = h - 12;
    ampm = "PM";
  }
  h = h == 0 ? 12 - h : h;

  h = h < 10 ? "0" + h : h;
  m = m < 10 ? "0" + m : m;
  s = s < 10 ? "0" + s : s;

  currentTime.innerText = `${h}:${m}:${s} ${ampm}`;

  let arr = getCrudData();
  if (arr != null) {
    let k = 0;
    for (i = 0; i < arr.length / 2; i++) {
      alarmTime = arr[k + 1];
      if (alarmTime == `${h}:${m} ${ampm}`) {
        para = k;
        ringTone.play();
        ringTone.loop = true;
        alarmStop.classList.remove("hide");
        document.body.style.backgroundImage= "url('1.gif')";
      }
      k = k + 2;
    }
  }
}, 1000);

alarmStop.addEventListener("click", (e) => {
  ringTone.pause();
  alarmStop.classList.add("hide");
  deleteData(para);
  document.body.style.background= "#6555f1";
});

//code for localstorage

function getCrudData() {
  let arr = JSON.parse(localStorage.getItem("alarm"));
  return arr;
}

function setCrudData(arr) {
  localStorage.setItem("alarm", JSON.stringify(arr));
}

let id = "no";
selectData();
setAlarmBtn.addEventListener("click", (e) => {
  e.preventDefault();
  let time = `${selectMenu[0].value}:${selectMenu[1].value} ${selectMenu[2].value}`;
  if (
    alarmName.value == "" ||
    time.includes("Hour") ||
    time.includes("Minute") ||
    time.includes("AM/PM")
  ) {
    return alert(
      "Please enter valid alarm name and select a valid time to set Alarm!"
    );
  }
  alarmTime = time;
  let alarmTitle = alarmName.value;
  let alarmData = time;
  if (id == "no") {
    let arr = getCrudData();
    if (arr == null) {
      let data = [alarmTitle, alarmData];
      setCrudData(data);
    } else {
      arr.push(alarmTitle, alarmData);
      setCrudData(arr);
    }
  } else {
    let arr = getCrudData();
    arr[id] = alarmTitle;
    arr[id + 1] = alarmData;
    setCrudData(arr);
    id = "no";
  }
  document.getElementById("alarm-name").value = "";
  selectData();
});

function selectData() {
  let arr = getCrudData();
  if (arr != null) {
    let srno = 1;
    let tablebody = "";
    let k = 0;
    for (i = 0; i < arr.length / 2; i++) {
      tablebody =
        tablebody +
        `
                    <tr>
                    <td class="text-center">${srno}</td>
                    <td>${arr[k]}</td>
                    <td>${arr[k + 1]}</td>
                    <td class="text-center"><ion-icon style="cursor:pointer; text-align:center" name="create-outline" onclick="editData(${k})"></ion-icon></td>
                    <td class="text-center"><ion-icon name="trash-outline" style="cursor:pointer;" onclick="deleteData(${k})"></ion-icon></td>
                    </tr>
                    `;
      srno++;
      k = k + 2;
    }
    document.getElementById("alarm-tbody").innerHTML = tablebody;
  }
}

function editData(rid) {
  id = rid;
  let arr = getCrudData();
  document.getElementById("alarm-name").value = arr[rid];
  let temp = arr[rid + 1],
    text = temp.split(":"),
    text2 = text[1],
    text3 = text2.split(" ");
  selectMenu[0].value = text[0];
  selectMenu[1].value = text3[0];
  selectMenu[2].value = text3[1];
}

function deleteData(rid) {
  let arr = getCrudData();
  arr.splice(rid, 2);
  setCrudData(arr);
  selectData();
}

function getCrudData() {
  let arr = JSON.parse(localStorage.getItem("alarm"));
  return arr;
}

function setCrudData(arr) {
  localStorage.setItem("alarm", JSON.stringify(arr));
}

function clearAll() {
  localStorage.clear();
  document.getElementById("alarm-tbody").innerHTML = "";
}
