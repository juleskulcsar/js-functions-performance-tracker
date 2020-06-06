let argArr = [];
let argArrString = [];
let jsx;
let scriptTag;
let testing;
let timeElapsed;
let arr = [];
let inputArgs = [];
let chartLabel = 0;
let chartLabelArr = [];
let submit = document.getElementById('submit');
let errorMsg = document.getElementById('errorMsg');

//-----------generate chart----------//
function chart() {
  var ctx = document.getElementById('myChart');
  var myChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: chartLabelArr,
      datasets: [
        {
          label: 'Time Elapsed',
          data: arr,
          borderColor: 'rgb(223, 117, 20)',
          fill: false
        }
      ]
    },
    options: {
      scales: {
        yAxes: [
          {
            ticks: {
              beginAtZero: true
            }
          }
        ]
      },
      tooltips: {
        mode: 'point'
      },
      title: {
        display: true,
        text: 'Performance Visualisation',
        fontSize: 20,
        fontColor: '#CBDAE5'
      },
      events: ['click']
    }
  });
}
//-----------generate chart----------//

//---------codearea editor----------//
const editor = CodeMirror.fromTextArea(document.getElementById('codearea'), {
  lineNumbers: true,
  mode: 'javascript',
  theme: 'lucario',
  lineWrapping: true,
  matchBrackets: true,
  autoCloseTags: true
});
//---------codearea editor----------//

//--------------click handler on RUN--------------------//
let clickHandler = () => {
  // e.preventDefault();
  getFirstInput();
  getSecondInput();
  chartTest(argArr);

  chartLabel = 0;

  document.createElement('script').remove;
  jsx = editor.getValue();
  scriptTag = document.createElement('script');
  scriptTag.setAttribute('id', 'toEval');
  scriptTag.textContent = jsx;

  try {
    //----------create function from user input in codearea------------//
    let body = scriptTag.textContent;
    let wrap = s => '{ return ' + body + ' };'; //return the block having function expression
    let func = new Function(wrap(body));
    //----------create function tfrom user input in codearea------------//

    testing = func.apply(null, argArrString);
    //--------calculate time elapsed-------------
    let t1 = performance.now();
    let t = testing(inputArgs[0], inputArgs[1]);
    let t2 = performance.now();
    timeElapsed = t2 - t1;
    arr.push(timeElapsed);
    //--------calculate time elapsed-------------

    argArrString.length = 0;
    inputArgs.length = 0;
    errorMsg.value = `Output: ${t}`;

    //------draw chart---------//
    chart();
    //------draw chart---------//
  } catch (err) {
    errorMsg.value = 'Error: ' + err.message;
    console.log(errorMsg);
  }
};
//--------------click handler on RUN--------------------//

//-----------get func args from input field-------------//
function getFirstInput() {
  let inputVal = document.getElementById('arg1').value;
  if (inputVal !== '' && Array.isArray(JSON.parse(inputVal)) === true) {
    argArrString.push(inputVal);
    let arrLength = calcArrLength(JSON.parse(inputVal));
    argArr.push(arrLength);
    inputArgs.push(JSON.parse(inputVal));
  } else if (inputVal !== '' && typeof parseInt(inputVal) === 'number') {
    argArrString.push(inputVal);
    argArr.push(parseInt(inputVal));
    inputArgs.push(parseInt(inputVal));
  }
  return argArr;
}

function getSecondInput() {
  let inputVal = document.getElementById('arg2').value;
  if (inputVal !== '' && Array.isArray(JSON.parse(inputVal)) === true) {
    argArrString.push(inputVal);
    let arrLength = calcArrLength(JSON.parse(inputVal));
    argArr.push(arrLength);
    inputArgs.push(JSON.parse(inputVal));
  } else if (inputVal !== '' && typeof parseInt(inputVal) === 'number') {
    argArrString.push(inputVal);
    argArr.push(parseInt(inputVal));
    inputArgs.push(parseInt(inputVal));
  }
  return argArr;
}
//-----------get func args from input field-------------//

function chartTest(argArr) {
  if (argArr.length === 1) {
    chartLabel = argArr[0];
    chartLabelArr.push(chartLabel);
  } else {
    for (let i = 0; i < argArr.length; i++) {
      chartLabel += argArr[i];
    }
    chartLabelArr.push(chartLabel);
  }
}

chart();

function calcArrLength(arr) {
  let count = 0;
  for (let i = 0; i < arr.length; i++) {
    if (typeof parseInt(arr[i]) === 'number') {
      count++;
    } else if (Array.isArray(JSON.parse(arr[i]))) {
      calcArrLength(JSON.parse(arr[i]));
    } else {
      alert('Please use only arrays and/or numbers as function arguments');
    }
  }
  return count;
}

submit.addEventListener('click', clickHandler);
