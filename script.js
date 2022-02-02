const startBtn = document.querySelector(".start");
const stopBtn = document.querySelector(".stop");
const resetBtn = document.querySelector(".reset");
const deleteBtn = document.querySelector(".delete");

const timeContainer = document.querySelector(".timeList");
const timeParent = document.querySelector(".times");

let hr = (min = sec = ms = "0" + 0);
let startTimer;
let isStart = false;
let timeList;
let id = 0;
document.onclick = (e) => {
	if (
		e.target.classList.contains("start") ||
		e.target.parentNode.classList.contains("start")
	) {
		start();
		e.target.classList.add("clicked");
	} else if (
		e.target.classList.contains("stop") ||
		e.target.parentNode.classList.contains("stop")
	) {
		stop();
	} else if (
		e.target.classList.contains("reset") ||
		e.target.parentNode.classList.contains("reset")
	) {
		reset();
	} else if (
		e.target.classList.contains("delete") ||
		e.target.parentNode.classList.contains("delete")
	) {
		deleteTime();
	}
};
// startBtn.onclick = () => {
// 	start();
// };
// stopBtn.onclick = () => {
// 	stop();
// };
// resetBtn.onclick = () => {
// 	reset();
// };
// deleteBtn.onclick = () => {
// 	deleteTime();
// };
window.onload = () => {
	timeList = JSON.parse(localStorage.getItem("timeList")) || [];
	if (timeList != "") {
		timeList.forEach((item) => {
			let html = `
            <li class="timeItem" data-id="${++id}">
                <span class="time-id">${id}.</span>
                <span class="time">${item}</span>
            </li>
        `;
			timeParent.innerHTML += html;
		});
		timeContainer.classList.add("show");
		let timeCurrentTimeItem = document.querySelector(
			"[data-id='" + id + "']"
		);
		let currentCurrentTime = timeParent.querySelector(".prevTime");
		if (currentCurrentTime != null) {
			currentCurrentTime.classList.remove("prevTime");
		}
		timeCurrentTimeItem.classList.add("prevTime");
		timeCurrentTimeItem.scrollIntoView({ behavior: "smooth" });
	} else {
		deleteBtn.classList.add("active");
	}
};
let start = () => {
	if (!isStart) {
		stopBtn.classList.remove("stopActive");
		startBtn.classList.add("active");
		startBtn.classList.add("clicked");
		startTimer = setInterval(() => {
			ms++;
			ms = ms < 10 ? "0" + ms : ms;

			if (ms == 100) {
				sec++;
				sec = sec < 10 ? "0" + sec : sec;
				ms = "0" + 0;
			}
			if (sec == 60) {
				min++;
				min = min < 10 ? "0" + min : min;
				sec = "0" + 0;
			}
			if (min == 60) {
				hr++;
				hr = hr < 10 ? "0" + hr : hr;
				min = "0" + 0;
			}

			putValue();
		}, 10);
		isStart = true;
		startBtn.blur();
	}
};

let stop = () => {
	if (isStart) {
		stopBtn.classList.add("stopActive");
		startBtn.classList.remove("active");
		clearInterval(startTimer);
		isStart = false;
		getCurrentValue();
		if (timeList.length != 0) {
			deleteBtn.classList.remove("active");
		}
		stopBtn.blur();
	}
};

let reset = () => {
	clearInterval(startTimer);
	hr = min = sec = ms = "0" + 0;
	startBtn.classList.remove("active");
	stopBtn.classList.add("stopActive");
	isStart = false;
	localStorage.removeItem("currentTime");
	resetBtn.blur();
	putValue();
};
let deleteTime = () => {
	timeParent.querySelectorAll(".timeItem").forEach((item) => {
		item.remove();
	});
	timeList = [];
	id = 0;
	if (timeList.length == 0) {
		deleteBtn.classList.add("active");
	}
	localStorage.setItem("timeList", JSON.stringify(timeList));
	timeContainer.classList.remove("show");
	deleteBtn.blur();
};
let putValue = () => {
	document.querySelector(".millisecond").innerHTML = ms;
	document.querySelector(".second").innerHTML = sec;
	document.querySelector(".minute").innerHTML = min;
	document.querySelector(".hour").innerHTML = hr;
};
let getCurrentValue = () => {
	let current_ms = document.querySelector(".millisecond").innerHTML;
	let current_sec = document.querySelector(".second").innerHTML;
	let current_min = document.querySelector(".minute").innerHTML;
	let current_hr = document.querySelector(".hour").innerHTML;
	let current_time =
		current_hr + ":" + current_min + ":" + current_sec + ":" + current_ms;
	timeList.push(current_time);
	localStorage.setItem("currentTime", JSON.stringify(current_time));
	let html = `
        <li class="timeItem" data-id="${++id}">
            <span class="time-id">${id}.</span>
            <span class="time">${current_time}</span>
        </li>
    `;
	timeParent.innerHTML += html;
	timeContainer.classList.add("show");
	let timeCurrentTimeItem = document.querySelector("[data-id='" + id + "']");
	let currentCurrentTime = timeParent.querySelector(".prevTime");
	if (currentCurrentTime != null) {
		currentCurrentTime.classList.remove("prevTime");
	}
	timeCurrentTimeItem.classList.add("prevTime");
	timeCurrentTimeItem.scrollIntoView({ behavior: "smooth" });
	localStorage.setItem("timeList", JSON.stringify(timeList));
	// console.log(timeList);
};
let currentTime = JSON.parse(localStorage.getItem("currentTime"));
if (currentTime != null) {
	let gotTime = currentTime.split(":");
	hr = gotTime[0];
	min = gotTime[1];
	sec = gotTime[2];
	ms = gotTime[3];
	putValue();
	startBtn.classList.add("clicked");
	stopBtn.classList.add("stopActive");
}
document.onkeydown = (e) => {
	if (e.keyCode == 32) {
		if (!isStart) {
			start();
		} else {
			stop();
			timeParent.scrollTo({
				top: timeParent.scrollHeight,
				behavior: "smooth",
			});
		}
	}
};
