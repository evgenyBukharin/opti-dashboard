const graphsData = [
	{
		heading: "Общее (услуги)",
		currentValue: 400000,
		allValue: 900000,
	},
	{
		heading: "Продвижение и реклама",
		currentValue: 0,
		allValue: 200000,
	},
	{
		heading: "Поддержка - Правки",
		currentValue: 0,
		allValue: 50000,
	},
	{
		heading: "БУС сайты",
		currentValue: 36000,
		allValue: 1200000,
	},
	{
		heading: "Б24 CRM",
		currentValue: 944000,
		allValue: 800000,
	},
	{
		heading: "Лицензии (повторно)",
		currentValue: 168000,
		allValue: 1000000,
	},
	{
		heading: "Тендеры",
		currentValue: 0,
		allValue: 1000000,
	},
];

const graphsDataQuarter = {
	heading: "Выполнение плана по направлениям",
	allValue: 5230000,
	currentValue: 1905144,
};

const graphsDataYear = {
	heading: "Выполнение плана по направлениям",
	allValue: 15230000,
	currentValue: 1905144,
};

const months = [
	"января",
	"февраля",
	"марта",
	"апреля",
	"мая",
	"июня",
	"июля",
	"августа",
	"сентября",
	"октября",
	"ноября",
	"декабря",
];

const quarters = [1, 1, 1, 2, 2, 2, 3, 3, 3, 4, 4, 4];

const quartersReverse = {
	1: [0, 1, 2],
	2: [3, 4, 5],
	3: [6, 7, 8],
	4: [9, 10, 11],
};

const graphsList = document.querySelector(".plan__graphs");

class RowGraph {
	constructor(properties) {
		this.heading = properties.heading;
		this.currentValue = properties.currentValue;
		this.allValue = properties.allValue;
	}
	formatNumber(value) {
		return new String(value).replace(/(\d)(?=(\d{3})+$)/g, "$1 ");
	}
	getHtmlNode() {
		let newGraph = document.createElement("div");
		newGraph.classList = "plan__container-graph";
		newGraph.innerHTML = `
			<h4 class="title plan__title-graph">${this.heading}</h4>
			<div class="plan__row-graph">
				<div class="plan__graph" data-current="${this.currentValue}">
					<div class="plan__track"></div>
				</div>
				<h5 class="title plan__text-all" data-all="${this.allValue}">${this.formatNumber(this.allValue)} руб.</h5>
			</div>
		`;

		let track = newGraph.querySelector(".plan__track");
		let widthPersent = (this.currentValue / this.allValue) * 100;
		if (widthPersent !== 0) {
			if (widthPersent > 95) {
				track.classList.add("plan__track-toleft");
			}
			track.style.width = widthPersent + "%";
			track.setAttribute("data-width", Math.round(widthPersent) + "%");
		} else {
			track.style.width = "4px";
			track.setAttribute("data-width", 0 + "%");
		}
		return newGraph;
	}
}

class SingleRowGraph {
	linesCount = 28;
	constructor(properties) {
		this.heading = properties.heading;
		this.currentValue = properties.currentValue;
		this.allValue = properties.allValue;
	}
	get widthPersent() {
		return (this.currentValue / this.allValue) * 100;
	}
	get remainingValue() {
		return this.allValue - this.currentValue;
	}
	formatNumber(value) {
		return new String(value).replace(/(\d)(?=(\d{3})+$)/g, "$1 ");
	}
	getHtmlNode(mode) {
		let newGraph = document.createElement("div");
		newGraph.classList = "plan__row-graph-single";
		newGraph.innerHTML = `
			<div class="plan__container-graph">
				<h4 class="title plan__title-graph">Выполнение плана по направлениям</h4>
				<div class="plan__row-graph">
					<div class="plan__graph" data-current="${this.currentValue}">
						<div class="plan__track"></div>
					</div>
					<h5 class="title plan__text-all" data-all="${this.allValue}">${this.formatNumber(this.remainingValue)} руб.</h5>
					<div class="plan__dateline">
						<span class="plan__text-dateline plan__text-dateline-start"></span>
						<span class="plan__text-dateline plan__text-dateline-end"></span>
					</div>
				</div>
			</div>
			<div class="plan__container-stats">
				<div class="plan__stat plan__stat-done">
					<h4 class="title plan__title-stat">Выполнено</h4>
					<h2 class="title plan__title-h2">
						<span class="plan__text-value-stat">${this.formatNumber(this.currentValue)}</span>
						<span class="plan__text-currency-stat">руб.</span>
					</h2>
				</div>
				<div class="plan__stat plan__stat-remaining">
					<h4 class="title plan__title-stat">Осталось</h4>
					<h2 class="title plan__title-h2">
						<span class="plan__text-value-stat">${this.formatNumber(this.remainingValue)}</span>
						<span class="plan__text-currency-stat">руб.</span>
					</h2>
				</div>
				<div class="plan__stat plan__stat-persentage">
					<h4 class="title plan__title-stat">Выполнение плана</h4>
					<h2 class="title plan__title-h2">
						<span class="plan__text-value-stat">${Math.round(this.widthPersent)}</span>
						<span class="plan__text-currency-stat">%</span>
					</h2>
				</div>
			</div>
		`;
		// рисуем график
		let track = newGraph.querySelector(".plan__track");
		if (this.widthPersent !== 0) {
			if (this.widthPersent > 95) {
				track.classList.add("plan__track-toleft");
			}
			track.style.width = this.widthPersent + "%";
			track.setAttribute("data-width", Math.round(this.widthPersent) + "%");
		} else {
			track.style.width = "4px";
			track.setAttribute("data-width", 0 + "%");
		}

		// рисуем черточки
		const dateline = newGraph.querySelector(".plan__dateline");
		for (let i = 0; i < this.linesCount; i++) {
			let span = document.createElement("span");
			span.classList = "plan__line";
			dateline.appendChild(span);
		}

		// считаем даты
		if (mode == "quarter") {
			let date = new Date();
			let currentMonthId = date.getMonth();
			let currentQuarter = quarters[currentMonthId];
			let firstDay = new Date(date.getFullYear(), quartersReverse[currentQuarter][0], 1);
			let lastDay = new Date(date.getFullYear(), quartersReverse[currentQuarter][2] + 1, 0);
			let firstDayText = "1 " + months[firstDay.getMonth()];
			let lastDayText =
				getLastDayOfMonth(lastDay.getFullYear(), lastDay.getMonth()).getDate() +
				" " +
				months[lastDay.getMonth()];
			newGraph.querySelector(".plan__text-dateline-start").innerHTML = firstDayText;
			newGraph.querySelector(".plan__text-dateline-end").innerHTML = lastDayText;
		}
		if (mode == "year") {
			newGraph.querySelector(".plan__text-dateline-start").innerHTML = "1 января";
			newGraph.querySelector(".plan__text-dateline-end").innerHTML = "31 декября";
		}
		return newGraph;
	}
}

function getLastDayOfMonth(year, month) {
	return new Date(year, month + 1, 0);
}

function init() {
	graphsData.forEach((obj) => {
		graphsList.appendChild(new RowGraph(obj).getHtmlNode());
	});
	graphsList.insertAdjacentElement("afterend", new SingleRowGraph(graphsDataYear).getHtmlNode("year"));
	graphsList.insertAdjacentElement("afterend", new SingleRowGraph(graphsDataQuarter).getHtmlNode("quarter"));
}

// const progressBars = document.querySelectorAll(".plan__graph");
// if (progressBars) {
// 	progressBars.forEach((bar) => {
//
// 	});
// } else {
// 	console.log("no progressbars");
// }

// const singleGraphs = document.querySelectorAll(".plan__row-graph-single");
// if (singleGraphs) {
// 	singleGraphs.forEach((bar) => {});
// }

init();
