/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
let argArr = [];
let argArrString = [];
let jsx;
let jsx2;
let scriptTag;
let scriptTag2;
let testing;
let testing2;
let timeElapsed;
let timeElapsed2;
let arr = [];
let arr2 = [];
let inputArgs = [];
let chartLabel = 0;
let chartLabelArr = [];
let setDisplay = false;
let editor2;
let submit = document.querySelector('.submit');
let errorMsg = document.querySelector('.errorMsg');
let errorMsg2 = document.querySelector('.errorMsg2');
let codearea2 = document.getElementById('codearea2');
let addSolutionButton = document.querySelector('.add_2nd_solution');
let reset = document.querySelector('.reset');
const modal = document.getElementById('modal');
const btn = document.getElementById('btn');
const span = document.getElementById('close');

//-----------modal----------//
btn.onclick = function() {
    modal.style.display = 'block';
    btn.style.visibility = 'hidden';
};
span.onclick = function() {
    modal.style.display = 'none';
    btn.style.visibility = 'visible';
};

//-----------generate chart----------//
function chart() {
    var ctx = document.getElementById('myChart');
    var myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: chartLabelArr,
            datasets: [
                {
                    label: 'Time Elapsed Solution1',
                    data: arr,
                    borderColor: 'green',
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
                ],
                xAxes: [
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

function chartTwoSolution() {
    var ctx = document.getElementById('myChart');
    var myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: chartLabelArr,
            datasets: [
                {
                    label: 'Time Elapsed Solution1',
                    data: arr,
                    borderColor: 'green',
                    fill: false
                },
                {
                    label: 'Time Elapsed Solution2',
                    data: arr2,
                    borderColor: '#ef7b5f',
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
                ],
                xAxes: [
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

//---------codearea editor----------//
const editor = CodeMirror.fromTextArea(document.getElementById('codearea'), {
    lineNumbers: true,
    mode: 'javascript',
    theme: 'lucario',
    lineWrapping: true,
    matchBrackets: true,
    autoCloseTags: true
});

//---------codearea2 editor----------//
const changeDisplay = () => {
    if (setDisplay === false) {
        codearea2.style.display = 'block';
        errorMsg2.style.display = 'block';
        setDisplay = true;
        editor2 = CodeMirror.fromTextArea(
            document.getElementById('codearea2'),
            {
                lineNumbers: true,
                mode: 'javascript',
                theme: 'lucario',
                lineWrapping: true,
                matchBrackets: true,
                autoCloseTags: true
            }
        );
        chartTwoSolution();
        addSolutionButton.innerHTML = 'remove 2nd solution';
        submit.innerHTML = 'call solutions';
    } else {
        editor2.toTextArea();
        codearea2.style.display = 'none';
        errorMsg2.style.display = 'none';
        setDisplay = false;
        chart();
        addSolutionButton.innerHTML = 'Add 2nd solution';
        submit.innerHTML = 'call solution';
    }
};
addSolutionButton.addEventListener('click', changeDisplay);

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

    if (editor2) {
        jsx2 = editor2.getValue();
        scriptTag2 = document.createElement('script');
        scriptTag2.setAttribute('id', 'toEval2');
        scriptTag2.textContent = jsx2;
    }

    try {
        //----------create function from user input in codearea------------//
        let body = scriptTag.textContent;
        if (body.length > 0) {
            let wrap = s => '{ return ' + body + ' };'; //return the block having function expression
            //ignore comments in the code
            body = body.replace(
                /(?:\/\*(?:[\s\S]*?)\*\/)|(?:[\s;]+\/\/(?:.*)$)/gm,
                ''
            );
            // const count_forLoops = (body.match(/for/g) || []).length;
            // console.log('for loops: ', count_forLoops);
            let func = new Function(wrap(body));
            console.log('func is: ', func);
            testing = func.apply(null, argArrString);
            //--------calculate time elapsed-------------
            let t1 = performance.now();
            let t = testing(inputArgs[0], inputArgs[1]);
            let t2 = performance.now();
            timeElapsed = t2 - t1;
            arr.push(timeElapsed);
            errorMsg.value = `Output: ${t}`;
        }

        //----------create function from user input in codearea------------//
        if (scriptTag2) {
            let body2 = scriptTag2.textContent;
            //ignore comments in the code
            body2 = body2.replace(
                /(?:\/\*(?:[\s\S]*?)\*\/)|(?:[\s;]+\/\/(?:.*)$)/gm,
                ''
            );
            if (body2.length > 0) {
                let wrap2 = s => '{ return ' + body2 + ' };'; //return the block having function expression
                let func2 = new Function(wrap2(body2));
                testing2 = func2.apply(null, argArrString);
                //--------calculate time elapsed-------------
                let _t1 = performance.now();
                let _t = testing2(inputArgs[0], inputArgs[1]);
                let _t2 = performance.now();
                timeElapsed2 = _t2 - _t1;
                arr2.push(timeElapsed2);

                errorMsg2.value = `Output: ${_t}`;
            }
        }

        //---------------reset arg array length----------------------------//
        argArrString.length = 0;
        inputArgs.length = 0;

        //----------------------draw chart-------------------------------//
        setDisplay ? chartTwoSolution() : chart();
    } catch (err) {
        errorMsg.value = 'OOPSY DAISY Error: ' + err.message;
        console.log(errorMsg);
    }
};

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

function chartTest(argArr) {
    if (argArr.length === 1) {
        chartLabel = argArr[0];
        chartLabelArr.push(chartLabel);
    } else {
        for (let i = 0; i < argArr.length; i++) {
            chartLabel = argArr[i];
        }
        chartLabelArr.push(chartLabel);
    }
}

function calcArrLength(arr) {
    let count = 0;
    for (let i = 0; i < arr.length; i++) {
        if (typeof parseInt(arr[i]) === 'number') {
            count++;
        } else if (Array.isArray(JSON.parse(arr[i]))) {
            calcArrLength(JSON.parse(arr[i]));
        } else {
            alert(
                'Please use only arrays and/or numbers as function arguments'
            );
        }
    }
    return count;
}

function resetChart() {
    // console.log('reset');
    // argArr.length = 0;
    arr.length = 0;
    arr2.length = 0;
    chartLabelArr.length = 0;
    // arr.push(0);
    // arr2.push(0);
    setDisplay ? chartTwoSolution() : chart();
}

setDisplay ? chartTwoSolution() : chart();

submit.addEventListener('click', clickHandler);
reset.addEventListener('click', resetChart);
