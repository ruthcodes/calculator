$(document).ready(function(){
  $(window).focus();

  var currentNumber;
  var savedNumber;
  var savedSymbol;
  var newValue;
  var finalTotal;
  var runningTotal;
  var lastPressSym;
  var nums = [0,1,2,3,4,5,6,7,8,9,"."];
  var syms = ["+","-","x","÷"];
  var sumList = [];

  window.addEventListener('keydown', function(event) {
    if (event.keyCode == 13) {
      event.preventDefault();
    }

    switch(event.keyCode){
      case 49:
      case 97:
        $('#one').trigger('click');
        break;
      case 50:
      case 98:
        $('#two').trigger('click');
        break;
      case 51:
      case 99:
        $('#three').trigger('click');
        break;
      case 52:
      case 100:
        $('#four').trigger('click');
        break;
      case 53:
      case 101:
        $('#five').trigger('click');
        break;
      case 54:
      case 102:
        $('#six').trigger('click');
        break;
      case 55:
      case 103:
        $('#seven').trigger('click');
        break;
      case 56:
      case 104:
        $('#eight').trigger('click');
        break;
      case 57:
      case 105:
        $('#nine').trigger('click');
        break;
      case 48:
      case 96:
        $('#zero').trigger('click');
        break;
      case 190:
      case 110:
        $('#dot').trigger('click');
        break;
      case 107:
        $('#add').trigger('click');
        break;
      case 187:
      case 13:
        $('#equals').trigger('click');
        break;
      case 109:
        $('#minus').trigger('click');
        break;
      case 111:
      case 191:
        $('#divide').trigger('click');
        break;
      case 106:
        $('#times').trigger('click');
        break;
    }
  });

  function rounding(number){
    var numAsStr = number.toString();
    var index;
    // if it's a decimal
    if (numAsStr.includes('.')){
      // find position of decimal
      index = numAsStr.indexOf('.');
      // if decimal is further along than 7, the number is too big
      if (index > 7){
        return "Too Long";
      }
      // max characters on screen minus index, if it's 0 means that all numbers beyond decimal would display off screen, so round up to an int e.g. 45678438.91. then recurse to check it's not too long and return if it's OK
      if (8-index <= 0){
        number = Math.round(number);
        rounding(number);
        // whole number including before and after decimal point to 9 or less characters e.g. 43567.5687 i=5, so toFixed(3) gives 43567.569
      } else {
        number = +number.toFixed(8-index);
      }
      // if it's not a decimal, try and round it, error out if it's longer than 8
    } else {
      number = Math.round(number);
      if (numAsStr.length > 8){
        return "Too Long";
      }
    }
    return number;
  };

  function lenCheck(n, len){
    n = n.toString();
    if (n.length > len){
      runningTotal = "Too Long";
      return n = "Too Long";
    } else {
      return n;
    }
  };


  //click handler
  $('button').on("click",function () {
    newValue = $(this).data('val');

    if (newValue != "="){
      sumList.push(newValue);
    }



    function parseSymSwitch(){

      savedNumber = Big(savedNumber);

      switch(savedSymbol){
        case "+":
          finalTotal = savedNumber.plus(currentNumber);
          break;
        case "-":
          finalTotal = savedNumber.minus(currentNumber);
          break;
        case "x":
          finalTotal = savedNumber.times(currentNumber);
          break;
        case "÷":
          finalTotal = savedNumber.div(currentNumber);
          break;
      }
      finalTotal = +finalTotal.toString();
    }

    function numOrSym(){
      // logic for numbers after pressing equals
      if (savedSymbol == "=" && nums.includes(newValue)){
        sumList = [newValue];
        currentNumber = newValue;
        savedNumber = null;
        savedSymbol = null;
        finalTotal = null;
        runningTotal = newValue;
        lastPressSym = false;
        $("#total").html(lenCheck(currentNumber, 8));
      }
      // logic for all times not as above
      else{
        // updating the sub line that displays on the calc
        if (!runningTotal){
          runningTotal = newValue;
        } else {
          runningTotal = "" + runningTotal + newValue;
        }
        // logic for when you receive a number
        if (nums.includes(newValue)){
          if (!currentNumber || currentNumber == 0){
            currentNumber = newValue;
          } else {
            currentNumber = "" + currentNumber + newValue;
          }

          $("#total").html(lenCheck(currentNumber, 8));

          lastPressSym = false;
        }

        if(syms.includes(newValue)){
          // if no symbol has been pressed yet, save this one
          if (!savedSymbol){

            savedNumber = parseFloat(currentNumber);
            currentNumber = 0;

            // if you've pressed a symbol previously, change it to whatever symbol was just pressed
          } else if (lastPressSym){
            sumList.pop();
            sumList.pop();
            sumList.push(newValue);
            savedSymbol = newValue;
            runningTotal = runningTotal.split('');
            runningTotal.pop();
            runningTotal.pop();
            runningTotal.push(savedSymbol);
            runningTotal = runningTotal.join('');

            // if there is a savedSymbol but it wasnt the last thing pressed (e.g. 9 + 6, now pressing *)
          } else {
            if (savedNumber && currentNumber){
              // work out the sum and output it
              parseSymSwitch();
              // update the saved symbol to the most recent one pressed


              $("#total").html(rounding(finalTotal));
              // new saved number is now the result of the sum
              savedNumber = finalTotal;
              sumList = [];
              sumList.push(finalTotal);
              // and there is no current number, next number pressed will be this
              currentNumber = 0;
            }
          }
          // if syms list includes the value then the last thing that was pressed is a symbol
          lastPressSym = true;
          //update saved symbol to most recent on pressed
          savedSymbol = newValue;
        }


      }

      // stops from displaying 'undefined' on screen subline when it has been wiped ready for next sum
      if (runningTotal != null){
        $("#currentNum").html(lenCheck(runningTotal,20));
      }

    }


    if (newValue === "AC"){
      sumList = [];
      currentNumber = 0;
      savedNumber = null;
      savedSymbol = null;
      finalTotal = null;
      runningTotal = null;
      $("#total").html(lenCheck(currentNumber, 8));
      $("#currentNum").html(" ");
    } else if (newValue === "CE"){
      currentNumber = 5318008;
      savedNumber = null;
      savedSymbol = null;
      finalTotal = null;
      runningTotal = currentNumber;
      $("#total").html(currentNumber);
      $("#currentNum").html(runningTotal);
    } else {
      numOrSym();
    }

    if(newValue === "="){
      done = true;
      // if sumlist doesn't have any symbols in it (comparing 2 arrays)
      // after typing = you can press as many numbers as you want, will keep appending until a symbol is pressed
      if (!syms.some(v => sumList.indexOf(v) >= 0)){
        $("#total").html(lenCheck(currentNumber, 8));
        $("#currentNum").html(" ");
      }
      // if there's a sum to do, do it and change symbol to =
      if (savedNumber && currentNumber){
        parseSymSwitch();
        savedSymbol = "=";


        $("#total").html(rounding(finalTotal));


        $("#currentNum").html(" ");
        currentNumber = finalTotal;
        runningTotal = finalTotal;
        // empty out the sum list and push to it the new total, the result of the sum
        sumList = [];
        sumList.push(finalTotal);
      };

    }

  });

});
