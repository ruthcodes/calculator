$(document).ready(function(){
  $(window).focus();
  // grab all buttons, and text fields that need updating
  const runningTotalHTML = document.querySelector('#runningTotal');
  const totalHTML = document.querySelector('#total');
  const calculatorButtons = ['Enter'];
  //array to store users inputs
  let sumList = [];
  let currentNumber;

  function updateDisplay(text){
    totalHTML.innerHTML = text;
  }
  document.querySelectorAll('button').forEach(button => {
    calculatorButtons.push(button.dataset.val);
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
      //entering a number after pressing equals
      if (runningTotalHTML.innerHTML === ''){
        currentNumber = e;
      } else {
        currentNumber = currentNumber ? currentNumber.concat(e) : e
      }
      updateDisplay(currentNumber)
      return
    }
    /*    handle decimals    */
    if (e === "."){
      if (!currentNumber){
        currentNumber = "0."
        updateDisplay(currentNumber)
        return
      }
      //check that the number is not already a float
      if (currentNumber.match(/\./gi)){
        return
      } else {
        currentNumber = currentNumber.concat(e);
        updateDisplay(currentNumber)
        return
      }
    }
    /*    handle symbols    */
    if (["+", "-", "*", "/"].includes(e)){
      if(currentNumber){
        sumList.push(currentNumber)
      }
      sumList.push(e);
      // if last 2 items both operators, only keep the most recent
      if (["+", "-", "*", "/", "=", "Enter"].includes(sumList[sumList.length-2])){
        sumList.splice(sumList.length-2, 1)
      }
      currentNumber = undefined;
      runningTotalHTML.innerHTML = sumList.join('');

      updateDisplay(getTotal())

    }
    /*    handle enter    */
    if (["=", "Enter"].includes(e)){
      if(currentNumber){
        sumList.push(currentNumber)
      }
      updateDisplay(getTotal())
      currentNumber = getTotal();
      sumList = [];
      runningTotalHTML.innerHTML = '';
    }
  }
})
