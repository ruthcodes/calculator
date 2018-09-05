$(document).ready(function(){
  // focus window so keyboard entries trigger immediately without a click
  $(window).focus();
  // buttons added to this dynamically,
  // except for these as the value is different to what is listed on the button (e.g. ÷ vs. /)
  const calculatorButtons = ["Enter", "*", "/"];

  // grab all buttons on the Calculator
  const buttons = document.querySelectorAll('button');

  buttons.forEach(button => {
    // populate array of buttons on page
    calculatorButtons.push(button.innerHTML);
    // add listener for click on each button
    button.addEventListener("click", getValue)
  })
  //get value of button clicked
  function getValue(e){
    console.log(e.target.dataset.val);
  }
  // add listener to handle key inputs instead of clicks
  window.addEventListener('keydown', function(e) {
    if (e.keyCode === 13) {
      e.preventDefault();
    }
    // if keyboard entry is a button on calc
    if (calculatorButtons.includes(e.key)){
      console.log(e.key);
    }
  });
  //array to store users inputs
  const runningTotal = [];



})
