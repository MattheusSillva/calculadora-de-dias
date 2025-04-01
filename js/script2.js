const inputFrom = document.querySelector("#date-from");
const inputTo = document.querySelector("#date-to");
const calcBtn = document.querySelector("#calc-btn");
const spanBeginning = document.querySelector("#span-date-beggining");
const spanFinal = document.querySelector("#span-date-final");
const daysResult = document.querySelector("#days-result-p");
const divResults = document.querySelector(".results");
const displayParagraph = document.querySelector("#display-paragraph");
const titleInHolidayCase = document.querySelector("#holiday-case-title");
const currentYear = new Date().getFullYear();

const carnivalBtn = document.querySelector("#carnival");
const easterBtn = document.querySelector("#easter");
const mothersDayBtn = document.querySelector("#mothers-day");
const christmasBtn = document.querySelector("#christmas");
const newYear = document.querySelector("#new-year");

currentFullDate = new Date();
currentFullDate.setUTCHours(0, 0, 0, 0);

const millSecsInOneDay = 24 * 60 * 60 * 1000;

const createItems = (dateFrom, dateTo, daysRemaining, token, passed) => {
  if (!token) {
    if (daysRemaining == 0) { 
      displayParagraph.innerText = `0 dias faltantes é o que deseja? Caso contrário, adicione valores válidos e tente novamente.`;
      daysResult.innerText = `${daysRemaining}`;
    } else {
      displayParagraph.innerText = `Entre ${dateFrom.getUTCDate()}/${dateFrom.getUTCMonth() + 1}/${dateFrom.getUTCFullYear()} e ${dateTo.getUTCDate()}/${dateTo.getUTCMonth() + 1}/${dateTo.getUTCFullYear()}:`;
      titleInHolidayCase.innerText = "Passaram-se em torno de:"
      // spanBeginning.innerText = `${dateFrom.getUTCDate()}/${dateFrom.getUTCMonth() + 1}/${dateFrom.getUTCFullYear()}`;
      // spanFinal.innerText = `${dateTo.getUTCDate()}/${dateTo.getUTCMonth() + 1}/${dateTo.getUTCFullYear()}`;
      daysResult.innerText = `${daysRemaining} dias.`;
    }
    
  } 
  else if (token && passed) {
    displayParagraph.innerText = `Parece que o(a) ${token} ja passou! Para o(a) próximo: `
    daysResult.innerText = `${daysRemaining} dias.`
    titleInHolidayCase.innerText = "Faltam em torno de:"
  }
  else if(token) {
    displayParagraph.innerText = `Para o(a) ${token}: `
    daysResult.innerText = `${daysRemaining} dias.`
    titleInHolidayCase.innerText = "Faltam em torno de:"
  }

  divResults.classList.remove("hide");
};

const calcHolidayDates = (holidayDate, token, passed) => {
  const timeRemaining = holidayDate - currentFullDate;
  const daysRemaining = Math.ceil(timeRemaining / millSecsInOneDay);

  createItems(currentFullDate, holidayDate, daysRemaining, token, passed);
}

const calcDate = () => {
  const dateFrom = new Date(inputFrom.value || currentFullDate);
  dateFrom.setUTCHours(0, 0, 0, 0);
  console.log(dateFrom)
  const dateTo = new Date(inputTo.value || currentFullDate);
  dateTo.setUTCHours(0, 0, 0, 0);
  console.log(dateTo)

  const timeRemaining = Math.ceil(dateTo - dateFrom);
  const daysRemaining = Math.abs(timeRemaining / millSecsInOneDay);

  createItems(dateFrom, dateTo, daysRemaining);
};

const getTheNextHoliday = (token, holidayName) => {
  fetch(`https://date.nager.at/api/v3/PublicHolidays/${currentYear + 1}/BR`)
  .then(response => response.json())
  .then(data => {
    const holidayDate = new Date((data.find(feriado => feriado.localName === `${holidayName}`).date));
    const passed = true;
      calcHolidayDates(holidayDate, token, passed)
  })
  .catch(error => console.error("Erro ao buscar feriados:", error));
}

const isThisHolidayPassed = (token, holidayName) => {
  fetch(`https://date.nager.at/api/v3/PublicHolidays/${currentYear}/BR`)
  .then(response => response.json())
  .then(data => {
    const holidayDate = new Date((data.find(feriado => feriado.localName === `${holidayName}`).date));
    if (currentFullDate > holidayDate) {
      getTheNextHoliday(token, holidayName);
    } else {
      calcHolidayDates(holidayDate, token)
    }
  })
  .catch(error => console.error("Erro ao buscar feriados:", error));
}

carnivalBtn.addEventListener("click", () => {
    const token = "carnaval";
    const holidayName = "Carnaval";

    isThisHolidayPassed(token, holidayName);
})

easterBtn.addEventListener("click", () => {
  const token = "páscoa";
  const holidayName = "Domingo de Páscoa";

  isThisHolidayPassed(token, holidayName);
})

mothersDayBtn.addEventListener("click", () => {
    const firstOfMay = new Date(currentYear, 4, 1);

    const firstSundayOfMay = new Date(firstOfMay);
    firstSundayOfMay.setDate(1 + (7 - firstOfMay.getDay()) % 7);

    const diaDasMaes = new Date(firstSundayOfMay);
    diaDasMaes.setDate(firstSundayOfMay.getDate() + 7);

    const token = "dia das mães"

    if (currentFullDate > diaDasMaes) {
      
    const firstOfMay = new Date(currentYear + 1, 4, 1);

    const firstSundayOfMay = new Date(firstOfMay);
    firstSundayOfMay.setDate(1 + (7 - firstOfMay.getDay()) % 7);

    const diaDasMaes = new Date(firstSundayOfMay);
    diaDasMaes.setDate(firstSundayOfMay.getDate() + 7);

    const token = "dia das mães"
      console.log("ja passou");
      
    } else {
      calcHolidayDates(diaDasMaes, token);
    }

    console.log(diaDasMaes);
})

christmasBtn.addEventListener("click", () => {
  const token = "natal";
  const holidayName = "Natal";
  
  isThisHolidayPassed(token, holidayName);
})

newYear.addEventListener("click", () => {
  const newYearDate = new Date(`${currentYear + 1}/1/1`);
  const token = "ano novo";
  calcHolidayDates(newYearDate, token);
})

calcBtn.addEventListener("click", () => {
  calcDate();
});
