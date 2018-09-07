$(document).ready(function(){
  $(window).focus();
  // grab all buttons, and text fields that need updating
  const runningTotalHTML = document.querySelector('#runningTotal');
  const totalHTML = document.querySelector('#total');
  const calculatorButtons = ['Enter'];
  //array to store users inputs
  let sumList = [];
  let currentNumber;
  let pressedEnter = false;

  function updateDisplay(text){
    totalHTML.innerHTML = text;
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
          return "Error, divide by 0"
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
       (sumList.length === 3 && sumList[sumList.length-1] === "=")){
      return sumList[0];
    }
    // evaluate first sum in list
    let runningTotal = evaluate(sumList.slice(0,3));
    // loop through remainder of list, evaluating against and updating the runningTotal
    for (let i = 3; i < sumList.length - 2; i += 2){
      let nextTotal = [runningTotal,sumList[i],sumList[i+1]];
      runningTotal = evaluate(nextTotal)
    }
    return runningTotal;
  }

  function handleInput(e){
    /*    handle numbers    */
    if(!Number.isNaN(parseInt(e))){

      if (pressedEnter){
        currentNumber = e;
        pressedEnter = false;
      } else {
        currentNumber = currentNumber ? currentNumber+e : e
      }
      updateDisplay(currentNumber)
      return
    }
    /*    handle decimals    */
    if (e === "."){
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
    /*    handle symbols    */
    if (["+", "-", "*", "/", "=", "Enter"].includes(e)){
      if(currentNumber){
        sumList.push(currentNumber)
      }
      if(!currentNumber && sumList.length<1){
        return
      }
      sumList.push(e);
      
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
        runningTotalHTML.innerHTML = sumList.join('');
        updateDisplay(getTotal())
      }
    }
    /*   handle (.)(.)   */
    if (e === "flip"){
      currentNumber = 5318008;
      sumList = [];
      updateDisplay(currentNumber)
      runningTotalHTML.innerHTML = sumList.join('');
      const flip = document.querySelector("#flip")
      flip.classList.add("flip")
      setTimeout(() => {
        flip.classList.remove("flip")
      }, 2500)
    }
    /*    handle clear    */
    if (e === "AC"){
      currentNumber = 0;
      sumList = [];
      updateDisplay(currentNumber)
      runningTotalHTML.innerHTML = sumList.join('');
    }
  }
})
