import axios from "axios";
import Chart from "chart.js/auto";

// набор данных
const dashboardData = {
	mainTarget: 5230000,
	sellingPlanData: [
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
			allValue: 700000,
		},
		{
			heading: "Тендеры",
			currentValue: 0,
			allValue: 1000000,
		},
	],
	graphDataQuarter: {
		heading: "Выполнение плана по направлениям",
		allValue: 5230000,
		currentValue: 1905144,
	},
	graphDataYear: {
		heading: "Выполнение плана по направлениям",
		allValue: 15230000,
		currentValue: 1905144,
	},
	gridData: {
		mainDealsData: {
			firstTitle: "Общая сумма сделок",
			firstValue: 110157433,
			secondTitle: "Сумма выйгранных сделок",
			secondValue: 6321271,
			thirdTitle: "Сумма сделок в работе",
			thirdValue: 103836162,
		},
		rightColumnData: [
			{
				firstTitle: "Количество сделок Общее (услуги)",
				firstValue: 44,
				secondTitle: "Количество сделок",
				secondValue: 183,
				thirdTitle: "Конверсия, %",
				thirdValue: 24,
			},
			{
				firstTitle: "Количество сделок Б24 CRM",
				firstValue: 25,
				secondTitle: "Количество сделок",
				secondValue: 167,
				thirdTitle: "Конверсия, %",
				thirdValue: 15,
			},
			{
				firstTitle: "Количество сделок БУС сайты",
				firstValue: 8,
				secondTitle: "Количество сделок",
				secondValue: 107,
				thirdTitle: "Конверсия, %",
				thirdValue: 7,
			},
		],
		companiesFromLeads: 6,
		dealsCountByYears: [
			{
				year: 2023,
				value: 127,
			},
			{
				year: 2022,
				value: 182,
			},
			{
				year: 2021,
				value: 197,
			},
			{
				year: 2020,
				value: 223,
			},
			{
				year: 2019,
				value: 233,
			},
		],
		dealsCountData: [
			{
				title: "Сделки",
				value: 612,
				subtitle: "Выполнено всего",
			},
			{
				title: "Часы разработки",
				value: 2871,
				subtitle: "Текущий год",
			},
			{
				title: "Сделки",
				value: "108/8",
				subtitle: "Год/месяц",
			},
			{
				title: "Часы разработки",
				value: 450,
				subtitle: "Предыдущий месяц",
			},
			{
				title: "Сделки",
				value: 19,
				subtitle: "В работе (сумма больше 0)",
			},
			{
				title: "Часы разработки",
				value: 330,
				subtitle: "Текущий месяц",
			},
		],
		lineChartData: [
			{
				month: "Январь",
				value: 4700,
			},
			{
				month: "Февраль",
				value: 4756,
			},
			{
				month: "Март",
				value: 4723,
			},
			{
				month: "Апрель",
				value: 4792,
			},
			{
				month: "Май",
				value: 4771,
			},
			{
				month: "Июнь",
				value: 4857,
			},
			{
				month: "Июль",
				value: 4869,
			},
		],
		devsData: [
			{
				name: "Дарья Колесникова",
				tasks: 127,
				expired: 127,
				hours: 289,
			},
			{
				name: "Евгений Бухарин",
				tasks: 127,
				expired: 127,
				hours: 289,
			},
			{
				name: "Анастасия Вергеева",
				tasks: 127,
				expired: 127,
				hours: 289,
			},
			{
				name: "Асель Кулибаева",
				tasks: 127,
				expired: 127,
				hours: 289,
			},
			{
				name: "Анна Киприянова",
				tasks: 0,
				expired: 0,
				hours: 0,
			},
		],
	},
};

const singleMonths = [
	"январь",
	"февраль",
	"март",
	"апрель",
	"май",
	"июнь",
	"июль",
	"август",
	"сентябрь",
	"октябрь",
	"ноябрь",
	"декабрь",
];

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

const mainTargetEl = document.querySelector(".plan__text-value");
const graphsList = document.querySelector(".plan__graphs");
const currYearEl = document.querySelector(".plan__text-period-year");
const dealsCountEl = document.querySelector(".board__item-4-gapped");
const dealsCountByYearsEl = document.querySelector(".board__item-6-4");
const companiesFromLeadsEl = document.querySelector(".board__title-companiesFromLeads");
const mainDealsDataEl = document.querySelector(".board__item-mainDealsData");
const rightColumnElements = document.querySelector(".board__item-6-column").querySelectorAll(".board__item-6");
const devsDataEl = document.querySelector(".board__table");
const devsTitleEl = document.querySelector(".board__title-devs-month");

function formatNumber(value) {
	return new String(value).replace(/(\d)(?=(\d{3})+$)/g, "$1 ");
}

class RowGraph {
	constructor(properties) {
		this.heading = properties.heading;
		this.currentValue = properties.currentValue;
		this.allValue = properties.allValue;
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
				<h5 class="title plan__text-all" data-all="${this.allValue}">${formatNumber(this.allValue)} руб.</h5>
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
	calculateLeftPosition(start, end) {
		if (typeof start == "number" && typeof end == "number") {
			let now = new Date();
			let endYear = new Date(now.getFullYear(), 0, -1, 0, 0);
			let day = Math.round((now - endYear) / 1000 / 60 / 60 / 24);
			return (day / end) * 100;
		} else {
			let now = new Date();
			let endYear = new Date(now.getFullYear(), 0, -1, 0, 0);
			let todayDaysAfterYearStart = Math.round((now - endYear) / 1000 / 60 / 60 / 24);
			let startDaysAfterYearStart = Math.round((start - endYear) / 1000 / 60 / 60 / 24);
			let diff = todayDaysAfterYearStart - startDaysAfterYearStart;
			return (diff / 90) * 100;
		}
	}
	getHtmlNode(mode, linesCount) {
		let newGraph = document.createElement("div");
		newGraph.classList = "plan__row-graph-single";
		newGraph.innerHTML = `
			<div class="plan__container-graph">
				<h4 class="title plan__title-graph">Выполнение плана по направлениям</h4>
				<div class="plan__row-graph">
					<div class="plan__graph" data-current="${this.currentValue}">
						<div class="plan__track"></div>
					</div>
					<h5 class="title plan__text-all" data-all="${this.allValue}">${formatNumber(this.remainingValue)} руб.</h5>
					<div class="plan__container-dateline">
						<div class="plan__dateline">
						</div>
						<span class="plan__text-dateline plan__text-dateline-start"></span>
						<span class="plan__text-dateline plan__text-dateline-end"></span>
						<div class="plan__container-today">
							<div class="plan__text-today">Сегодня</div>
							<div class="plan__text-date-today"></div>
						</div>
					</div>
				</div>
			</div>
			<div class="plan__container-stats">
				<div class="plan__stat plan__stat-done">
					<h4 class="title plan__title-stat">Выполнено</h4>
					<h2 class="title plan__title-h2">
						<span class="plan__text-value-stat">${formatNumber(this.currentValue)}</span>
						<span class="plan__text-currency-stat">руб.</span>
					</h2>
				</div>
				<div class="plan__stat plan__stat-remaining">
					<h4 class="title plan__title-stat">Осталось</h4>
					<h2 class="title plan__title-h2">
						<span class="plan__text-value-stat">${formatNumber(this.remainingValue)}</span>
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
		for (let i = 0; i < linesCount; i++) {
			let span = document.createElement("span");
			span.classList = "plan__line";
			dateline.appendChild(span);
		}

		let date = new Date();
		const todayContainer = newGraph.querySelector(".plan__container-today");
		const todayText = newGraph.querySelector(".plan__text-date-today");
		// считаем даты
		if (mode == "quarter") {
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
			todayText.innerHTML = date.getDate() + " " + months[date.getMonth()];
			todayContainer.style.left = this.calculateLeftPosition(firstDay, lastDay) + "%";
		}
		if (mode == "year") {
			newGraph.querySelector(".plan__text-dateline-start").innerHTML = "1 января";
			newGraph.querySelector(".plan__text-dateline-end").innerHTML = "31 декабря";
			todayText.innerHTML = date.getDate() + " " + months[date.getMonth()];
			todayContainer.style.left = this.calculateLeftPosition(1, 365) + "%";
		}
		return newGraph;
	}
}

class DealsItem {
	constructor(properties) {
		this.title = properties.title;
		this.value = properties.value;
		this.subtitle = properties.subtitle;
	}
	getHtmlNode() {
		let newItem = document.createElement("div");
		newItem.classList = "board__item-inner";
		newItem.innerHTML = `
			<h5 class="title board__title-inner">${this.title}</h5>
			<h4 class="title board__title-value">${this.value}</h4>
			<h5 class="title board__title-inner board__title-inner-0">${this.subtitle}</h5>
			<div class="board__container-icon"></div>
		`;
		return newItem;
	}
}

class DealsByYears {
	constructor(properties) {
		this.year = properties.year;
		this.value = properties.value;
	}
	getHtmlNode() {
		let newItem = document.createElement("div");
		newItem.classList = "board__item-inner board__item-inner-blue board__item-inner-12";
		newItem.innerHTML = `
			<div class="board__item-inner-header">
				<h3 class="title board__title-header">Количество сделок, ${this.year}</h3>
			</div>
			<div class="board__item-inner-body">
				<h2 class="title board__title-body">${this.value}</h2>
			</div>
		`;
		return newItem;
	}
}

class MyltiGridItem {
	constructor(properties, colorsOrder, currency) {
		this.firstTitle = properties.firstTitle;
		this.firstValue = properties.firstValue;
		this.secondTitle = properties.secondTitle;
		this.secondValue = properties.secondValue;
		this.thirdTitle = properties.thirdTitle;
		this.thirdValue = properties.thirdValue;
		this.colorsOrder = colorsOrder;
		this.currency = currency;
	}
	getInnerHtml() {
		return `
			<div class="board__item-inner board__item-inner-${this.colorsOrder[0]} board__item-inner-12">
				<div class="board__item-inner-header">
					<h3 class="title board__title-header">${this.firstTitle}</h3>
				</div>
				<div class="board__item-inner-body">
					<h2 class="title board__title-body-main">${formatNumber(this.firstValue)} ${this.currency ? this.currency : ""}</h2>
				</div>
			</div>
			<div class="board__item-inner board__item-inner-${this.colorsOrder[1]} board__item-inner-6">
				<div class="board__item-inner-header">
					<h3 class="title board__title-header">${this.secondTitle}</h3>
				</div>
				<div class="board__item-inner-body">
					<h2 class="title board__title-body">${formatNumber(this.secondValue)} ${this.currency ? this.currency : ""}</h2>
				</div>
			</div>
			<div class="board__item-inner board__item-inner-${this.colorsOrder[2]} board__item-inner-6">
				<div class="board__item-inner-header">
					<h3 class="title board__title-header">${this.thirdTitle}</h3>
				</div>
				<div class="board__item-inner-body">
					<h2 class="title board__title-body">${formatNumber(this.thirdValue)} ${this.currency ? this.currency : ""}</h2>
				</div>
			</div>
		`;
	}
}

class DevRow {
	constructor(properties) {
		this.name = properties.name;
		this.tasks = properties.tasks;
		this.expired = properties.expired;
		this.hours = properties.hours;
	}
	getHtmlNode() {
		let newRow = document.createElement("div");
		newRow.classList = "board__row";
		newRow.innerHTML = `
			<div class="board__cell board__cell-name">${this.name}</div>
			<div class="board__cell board__cell-tasks">${this.tasks}</div>
			<div class="board__cell board__cell-expired">${this.expired}</div>
			<div class="board__cell board__cell-hours">${this.hours}</div>
		`;
		return newRow;
	}
}

function getLastDayOfMonth(year, month) {
	return new Date(year, month + 1, 0);
}

function drawChart(chartData) {
	const chartEl = document.getElementById("lineChart");
	if (chartEl) {
		new Chart(chartEl, {
			type: "line",
			data: {
				labels: chartData.map((row) => row.month),
				datasets: [
					{
						label: "Рост клиентской базы за " + new Date().getFullYear() + " год",
						data: chartData.map((row) => row.value),
						borderWidth: 1,
					},
				],
			},
			options: {
				scales: {
					x: {
						grid: {
							display: true,
						},
					},
					y: {
						grid: {
							display: true,
						},
					},
				},
			},
		});
	}
}

function init(dashboardData) {
	mainTargetEl.innerHTML = formatNumber(dashboardData.mainTarget);
	currYearEl.innerHTML = new Date().getFullYear();
	dashboardData.sellingPlanData.forEach((obj) => {
		graphsList.appendChild(new RowGraph(obj).getHtmlNode());
	});
	graphsList.insertAdjacentElement(
		"afterend",
		new SingleRowGraph(dashboardData.graphDataYear).getHtmlNode("year", 34)
	);
	graphsList.insertAdjacentElement(
		"afterend",
		new SingleRowGraph(dashboardData.graphDataQuarter).getHtmlNode("quarter", 10)
	);
	mainDealsDataEl.innerHTML = new MyltiGridItem(
		dashboardData.gridData.mainDealsData,
		["blue", "green", "yellow"],
		"руб."
	).getInnerHtml();

	for (let i = 0; i < rightColumnElements.length; i++) {
		rightColumnElements[i].innerHTML = new MyltiGridItem(dashboardData.gridData.rightColumnData[i], [
			"green",
			"blue",
			"yellow",
		]).getInnerHtml();
	}
	dashboardData.gridData.dealsCountData.forEach((obj) => {
		dealsCountEl.appendChild(new DealsItem(obj).getHtmlNode());
	});
	dashboardData.gridData.dealsCountByYears.forEach((obj) => {
		dealsCountByYearsEl.appendChild(new DealsByYears(obj).getHtmlNode());
	});
	dashboardData.gridData.devsData.forEach((obj) => {
		devsDataEl.appendChild(new DevRow(obj).getHtmlNode());
	});
	devsTitleEl.innerHTML = singleMonths[new Date().getMonth()];
	companiesFromLeadsEl.innerHTML = dashboardData.gridData.companiesFromLeads;
	drawChart(dashboardData.gridData.lineChartData);
}

init(dashboardData);

// axios
// 	.get("dashboardDataUrl")
// 	.catch((e) => {
// 		console.log(e);
// 	});
