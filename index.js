/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
let argArr = [];
let argArrString = [];
let jsx;
let jsx2;
let scriptTag;
let scriptTag2;
let applyFuncArguments;
let applyFuncArguments2;
let timeElapsed;
let timeElapsed2;
let timeElapsedArr = [];
let timeElapsedArr2 = [];
let inputArgs = [];
let setDisplay = false;
let editor2;
let error = false;
let error2 = false;
let submit = document.querySelector('.submit');
let errorMsg = document.querySelector('.errorMsg');
let errorMsg2 = document.querySelector('.errorMsg2');
let codearea = document.getElementById('codearea');
let codearea2 = document.getElementById('codearea2');
let addSolutionButton = document.querySelector('.add_2nd_solution');
let reset = document.querySelector('.reset');
const modal = document.getElementById('modal');
const showModal = document.getElementById('showModal');
const span = document.getElementById('close');

//-----------modal----------//
showModal.onclick = function() {
    modal.style.display = 'block';
    showModal.style.visibility = 'hidden';
};
span.onclick = function() {
    modal.style.display = 'none';
    showModal.style.visibility = 'visible';
};

//-----------generate chart----------//
function chart() {
    var ctx = document.getElementById('myChart');
    var myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: argArr,
            datasets: [
                {
                    label: 'Time Elapsed Solution1',
                    data: timeElapsedArr,
                    borderColor: 'green',
                    fill: false
                }
            ]
        },
        options: {
            responsive: true,
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
            defaults: {
                scale: {
                    ticks: { min: 0 }
                }
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
            labels: argArr,
            datasets: [
                {
                    label: 'Time Elapsed Solution1',
                    data: timeElapsedArr,
                    borderColor: 'green',
                    fill: false
                },
                {
                    label: 'Time Elapsed Solution2',
                    data: timeElapsedArr2,
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
            defaults: {
                scale: {
                    ticks: { min: 0 }
                }
            },
            events: ['click']
        }
    });
}

//---------codearea editor----------//
let editor = CodeMirror.fromTextArea(document.getElementById('codearea'), {
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
        addSolutionButton.innerHTML = 'hide 2nd solution';
        submit.innerHTML = 'run solutions';
    } else {
        editor2.toTextArea();
        codearea2.style.display = 'none';
        errorMsg2.style.display = 'none';
        setDisplay = false;
        chart();
        addSolutionButton.innerHTML = 'add a 2nd solution';
        submit.innerHTML = 'run solution';
    }
};
addSolutionButton.addEventListener('click', changeDisplay);

//--------------click handler on RUN--------------------//
let clickHandler = () => {
    error = false;
    error2 = false;
    // e.preventDefault();
    getFirstInput();
    getSecondInput();

    document.createElement('script').remove;
    //get editor text value and ignore 'comments'
    jsx = editor
        .getValue()
        .replace(/(?:\/\*(?:[\s\S]*?)\*\/)|([^\\:]|^)\/\/.*$/gm, '');
    scriptTag = document.createElement('script');
    scriptTag.setAttribute('id', 'toEval');
    scriptTag.textContent = jsx;

    if (editor2) {
        jsx2 = editor2
            .getValue()
            .replace(/(?:\/\*(?:[\s\S]*?)\*\/)|([^\\:]|^)\/\/.*$/gm, '');
        scriptTag2 = document.createElement('script');
        scriptTag2.setAttribute('id', 'toEval2');
        scriptTag2.textContent = jsx2;
    }

    try {
        //----------create function from user input in codearea------------//
        let body = scriptTag.textContent;
        body = body.replace(/^\s*/gm, '');
        if (body.length > 0) {
            let wrap = () => '{ return ' + body + ' };'; //return the block having function expression
            // const count_forLoops = (body.match(/for/g) || []).length;
            let func = new Function(wrap(body));
            applyFuncArguments = func.apply(null, argArrString);
            //--------calculate time elapsed-------------
            let t1 = performance.now();
            let funcOutput = applyFuncArguments(inputArgs[0], inputArgs[1]);
            let t2 = performance.now();
            timeElapsed = t2 - t1;
            timeElapsedArr.push(timeElapsed);
            error
                ? (errorMsg.style.color = 'red')
                : (errorMsg.style.color = 'green');
            errorMsg.value = `Output: ${funcOutput}`;
        }
    } catch (err) {
        errorMsg.value = 'OOPSY DAISY Error: ' + err.message;
        error = true;
        error
            ? (errorMsg.style.color = 'red')
            : (errorMsg.style.color = 'green');
        console.log(errorMsg);
    }

    try {
        //----------create function from user input in codearea------------//
        if (scriptTag2) {
            let body2 = scriptTag2.textContent;
            body2 = body2.replace(/^\s*/gm, '');
            if (body2.length > 0) {
                let wrap2 = () => '{ return ' + body2 + ' };'; //return the block having function expression
                let func2 = new Function(wrap2(body2));
                applyFuncArguments2 = func2.apply(null, argArrString);
                //--------calculate time elapsed-------------
                let _t1 = performance.now();
                let _funcOutput = applyFuncArguments2(
                    inputArgs[0],
                    inputArgs[1]
                );
                let _t2 = performance.now();
                timeElapsed2 = _t2 - _t1;
                timeElapsedArr2.push(timeElapsed2);
                error2
                    ? (errorMsg2.style.color = 'red')
                    : (errorMsg2.style.color = '#ef7b5f');
                errorMsg2.value = `Output: ${_funcOutput}`;
            }
        }
        //---------------reset arg array length----------------------------//
        argArrString.length = 0;
        inputArgs.length = 0;
        //----------------------draw chart-------------------------------//
        setDisplay ? chartTwoSolution() : chart();
    } catch (err) {
        errorMsg2.value = 'OOPSY DAISY Error: ' + err.message;
        error2 = true;
        error2
            ? (errorMsg2.style.color = 'red')
            : (errorMsg2.style.color = '#ef7b5f');
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
    timeElapsedArr.length = 0;
    timeElapsedArr2.length = 0;
    setDisplay ? chartTwoSolution() : chart();
}

setDisplay ? chartTwoSolution() : chart();
submit.addEventListener('click', clickHandler);
reset.addEventListener('click', resetChart);
