$(document).ready(function(){
  $(window).focus();
  // grab all buttons, and text fields that need updating
  const runningTotalHTML = document.querySelector('#runningTotal');
  const totalHTML = document.querySelector('#total');
  const calculatorButtons = ['Enter'];
  const DIV_BY_ZERO_ERR = "Error, can't ÷ by 0";
  //array to store users inputs
  let sumList = [];
  let currentNumber;
  let pressedEnter = false;

  function updateDisplay(text){
    totalHTML.innerHTML = text;
    // only show final 20 items in sumList to prevent overflow
    runningTotalHTML.innerHTML = sumList.join('').slice(-20);
  }
  document.querySelectorAll('button').forEach(button => {
    calculatorButtons.push(button.dataset.val);
    button.addEventListener("click", (e) => handleInput(e.target.dataset.val))
  })
  // add listener to handle key inputs instead of clicks
  window.addEventListener('keydown', function(e) {
    if (e.keyCode === 13) {
      e.preventDefault();
    }
    // if keyboard entry is a button on calc
    if (calculatorButtons.includes(e.key)){
      handleInput(e.key)
    }
  });

  function evaluate(sum){
    let first = Big(parseFloat(sum[0]));
    let second = Big(parseFloat(sum[2]));

    switch(sum[1]) {
      case "+":
          return +first.plus(second).toString()
          break;
      case "-":
            return +first.minus(second).toString()
          break;
      case "/":
        if(sum[2] === "0"){
          return DIV_BY_ZERO_ERR
        }
        return +first.div(second).toString()
        break;
      case "*":
          return +first.times(second).toString()
          break;
    }
  }

  function getTotal(){
    if (sumList.length < 3 ||
       (sumList.length === 3 && ["+", "-", "*", "/", "=", "Enter"].includes(sumList[sumList.length-1]))){
      return sumList[0];
    }
    // evaluate first sum in list
    let nextEval = evaluate(sumList.slice(0,3));
    if(nextEval === DIV_BY_ZERO_ERR){
      currentNumber = undefined;
      sumList = [];
      return "DIV_BY_ZERO_ERR"
    } else {
      runningTotal = nextEval;
    }
    // loop through remainder of list, evaluating against and updating the runningTotal
    for (let i = 3; i < sumList.length - 2; i += 2){
      let nextTotal = [runningTotal,sumList[i],sumList[i+1]];
      runningTotal = evaluate(nextTotal)
    }
    return runningTotal;
  }

  function checkNumbers(e){
    if (checkLength()){
      return
    }
    if (pressedEnter){
      currentNumber = e;
      pressedEnter = false;
    } else {
      currentNumber = currentNumber ? currentNumber+e : e
    }
    updateDisplay(currentNumber)
    return
  }

  function checkDecimals(e){
    if (checkLength()){
      return
    }
    if (!currentNumber || pressedEnter){
      pressedEnter = false;
      currentNumber = "0."
      updateDisplay(currentNumber)
      return
    }
    //check that the number is not already a float
    if (currentNumber.toString().match(/\./gi)){
      return
    } else {
      currentNumber = currentNumber + e;
      updateDisplay(currentNumber)
      return
    }
  }

  function checkOperators(e){
    if(currentNumber){
      sumList.push(currentNumber)
    }
    if(!currentNumber && sumList.length<1){
      return
    }
    sumList.push(e);

    if (getTotal() === "DIV_BY_ZERO_ERR"){
      return updateDisplay(DIV_BY_ZERO_ERR)
    }

    if(getTotal().toString().length > 9){
      updateDisplay("Num too long!")
      currentNumber = undefined;
      sumList = [];
      return
    }
    if (["=", "Enter"].includes(e)){
      pressedEnter = true;
      updateDisplay(getTotal())
      currentNumber = getTotal();
      sumList = [];
      runningTotalHTML.innerHTML = '';
    } else {
      pressedEnter = false;
      // if last 2 items both operators, only keep the most recent
      if (["+", "-", "*", "/", "=", "Enter"].includes(sumList[sumList.length-2])){
        sumList.splice(sumList.length-2, 1)
      }
      currentNumber = undefined;
      updateDisplay(getTotal())
    }
    return
  }

  function checkSpin(e){
    currentNumber = 5318008;
    sumList = [];
    updateDisplay(currentNumber)
    const flip = document.querySelector("#flip")
    flip.classList.add("flip")
    setTimeout(() => {
      flip.classList.remove("flip")
    }, 2500)
  }

  function checkClear(e){
    currentNumber = 0;
    sumList = [];
    updateDisplay(currentNumber)
  }

  function checkLength(){
    if(currentNumber && currentNumber.length > 7){
      updateDisplay("Num too long!")
      currentNumber = undefined;
      sumList = [];
      return true;
    }
    return false;
  }

  function handleInput(e){
    if(!Number.isNaN(parseInt(e))){
      checkNumbers(e);
    } else if (e === "."){
      checkDecimals(e);
    } else if (["+", "-", "*", "/", "=", "Enter"].includes(e)){
      checkOperators(e);
    } else if (e === "flip"){
      checkSpin(e);
    } else if (e === "AC"){
      checkClear(e)
    } else {
      return
    }
  }
})
