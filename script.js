$(document).ready(function(){
  $(window).focus();
  // buttons added to this dynamically,
  const calculatorButtons = [];
  //array to store users inputs
  let sumList = [];
  let currentNumber;

  // grab all buttons, and text fields that need updating
  const buttons = document.querySelectorAll('button');
  let runningTotalHTML = document.querySelector('#runningTotal');
  let totalHTML = document.querySelector('#total');

  buttons.forEach(button => {
    calculatorButtons.push(button.innerHTML);
    button.addEventListener("click", getValue)
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

  function getValue(e){
    handleInput(e.target.dataset.val)
  }

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
        return +first.div(second).toString()
        break;
      case "*":
          return +first.times(second).toString()
          break;
    }
  }

  function getTotal(){
    if (sumList.length < 3){
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
      // concat to current or create a new current, and display that
      currentNumber = currentNumber ? currentNumber.concat(e) : e
      totalHTML.innerHTML = currentNumber
    }

    /*    handle decimals    */

    if (e === "."){
      if (!currentNumber){
        console.log("there wasnt a number")
        currentNumber = "0."
        totalHTML.innerHTML = currentNumber
      } else {
        //check that the number is not already a float
        if (currentNumber.match(/\./gi)){
          return
        } else {
          currentNumber = currentNumber.concat(e);
          totalHTML.innerHTML = currentNumber
        }
      }
    }

    /*    handle symbols    */

    let symbols = ["+", "-", "*", "/", "="]
    // if entered a symbol
    if (symbols.includes(e)){
      sumList.push(currentNumber)
      sumList.push(e);
      currentNumber = undefined;
      if (sumList.length >= 3){
        totalHTML.innerHTML = getTotal();
        runningTotalHTML.innerHTML = sumList.join('');
      }

    }
  }
})
