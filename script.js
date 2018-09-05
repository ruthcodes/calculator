$(document).ready(function(){
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
    //probably change this to data-value, and update that on HTML to be what you need (so button shows ÷ but the data-val is /)
    console.log(e.target.innerHTML);
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


})
