const validation = require('./validation');
let sectionResult;

function findAttitudeConsistency(arrSumCols, arrNormalized) {
  const divAttitudeConsistency = document.createElement('table');
  divAttitudeConsistency.classList.add('attitudeConsistency');
  const pHeader = document.createElement('tr');
  pHeader.innerHTML = 'Оценка согласованности:';
  divAttitudeConsistency.appendChild(pHeader);
  const pLambda = document.createElement('tr');
  const pIs = document.createElement('tr');
  const pOs = document.createElement('tr');
  const arrSi = [0, 0, 0.58, 0.9, 1.12, 1.24, 1.32, 1.41, 1.45, 1.49, 1.51, 1.48, 1.56, 1.57, 1.59];
  let lambdaMax = 0;

  pLambda.innerHTML = '&lambda;max = ';
  for (let i = 0; i < arrSumCols.length; i++) {
    lambdaMax += arrSumCols[i] * arrNormalized[i];
    pLambda.innerHTML += `(${arrSumCols[i]}x${arrNormalized[i]})`;
    if (i !== (arrSumCols.length - 1)) {
      pLambda.innerHTML += ' + ';
    } else {
      pLambda.innerHTML += ` = ${+lambdaMax.toFixed(3)}`;
    }
  }
  divAttitudeConsistency.appendChild(pLambda);

  const { length: n } = arrSumCols;
  const is = Math.abs(lambdaMax - n) / (n - 1);
  pIs.innerHTML = `ИС = |&lambda;max - n| / (n - 1) = |${+lambdaMax.toFixed(3)} - ${n}| / (${n} - 1) = ${+is.toFixed(5)}`;
  divAttitudeConsistency.appendChild(pIs);

  const span = document.createElement('span');
  let symbol;
  const os = +(is / arrSi[n - 1]).toFixed(3);
  if (os < 0.1) {
    symbol = ' < 0.1';
    span.classList.add('rightOs');
  } else {
    symbol = ' >= 0.1';
    span.classList.add('wrongOs');
  }
  if (!isNaN(os)) {
    span.innerHTML = os + symbol;
  } else {
    span.innerHTML = os;
  }
  pOs.innerHTML = `ОС = ИС / СИ = ${+is.toFixed(5)} / ${arrSi[n - 1]} = `;
  pOs.appendChild(span);
  divAttitudeConsistency.appendChild(pOs);

  return divAttitudeConsistency;
}

function createReverseValue(cell) {
  let { value } = cell;

  if (value.length === 1) {
    return (`1/${value}`);
  }

  const first = value[0];
  const second = value[2];

  if (second === 1) {
    value = `${second}/${first}`;
  } else if (first === 1) {
    value = (first === 1) ? second : first;
  }

  return value;
}

function rang(arr) {
  const arrRanging = new Array(arr.length);
  const arrNumbers = new Array(arr.length);
  let max;
  let index;
  for (let i = 0; i < arr.length; i++) {
    arrNumbers[i] = +arr[i];
  }

  for (let j = 0; j < arrRanging.length; j++) {
    for (let k = 0; k < arrNumbers.length; k++) {
      if (arrRanging[k] === undefined) {
        max = arrNumbers[k];
        index = k;
        break;
      }
    }

    for (let i = 0; i < arrNumbers.length; i++) {
      if (max < arrNumbers[i] && arrRanging[i] === undefined) {
        max = arrNumbers[i];
        index = i;
      }
    }
    arrRanging[index] = j + 1;
  }
  return arrRanging;
}

function findNormalizedValues() {
  const matrixBlock = document.getElementById('matrixs');
  const allMatrixs = matrixBlock.childNodes;
  const valid = validation.init();
  const arrAllNormalized = new Array(allMatrixs.length - 2);
  for (let div = 0; div < (allMatrixs.length - 2); div++) {
    const matrixWrap = allMatrixs.item(div);
    const matrixDiv = matrixWrap.childNodes[0];
    const isObj = matrixDiv.classList.contains('objMatrix');
    const rowsInMatrix = matrixDiv.childNodes;
    let isUp;
    if (isObj) {
      const firstRow = matrixDiv.childNodes[0];
      const label = firstRow.childNodes.item(0);
      const input = label.childNodes.item(0);
      isUp = input.checked;
    }

    const lengthMatrix = rowsInMatrix.length - 2;
    const lengthCols = (isObj) ? 1 : lengthMatrix;
    const arrSum = new Array(lengthMatrix);
    const arrComp = new Array(lengthMatrix);
    const arrSqrt = new Array(lengthMatrix);
    const arrSumCols = new Array(lengthMatrix);
    const arrNormalized = new Array(lengthMatrix);
    let sumRow;
    let sumCol;
    let compRow;
    let sumComp = 0;
    let currentRow;
    const resultCellSumComp = rowsInMatrix.item(lengthMatrix + 1).childNodes[lengthMatrix + 1];
    let sqrtRow;
    let sumSqrt = 0;
    const resultCellSumSqrt = rowsInMatrix.item(lengthMatrix + 1).childNodes[lengthMatrix + 2];
    const resultCellSumNorm = (isObj) ? rowsInMatrix.item(lengthMatrix + 1).childNodes[2]
      : rowsInMatrix.item(lengthMatrix + 1).childNodes[lengthMatrix + 3];

    for (let i = 1; i <= lengthMatrix; i++) {
      compRow = 1;
      currentRow = rowsInMatrix.item(i);
      const resultCellComp = currentRow.childNodes[lengthMatrix + 1];
      const resultCellSqrt = currentRow.childNodes[lengthMatrix + 2];
      for (let j = 1; j <= (lengthCols); j++) {
        const currentCell = currentRow.childNodes[j];
        const reverseCell = rowsInMatrix.item(j).childNodes[i];

        if (isObj) {
          if (!valid.isRightObjValue(currentCell)) {
            return false;
          }
        } else if (j > i) {
          if (!valid.isRightValue(currentCell)) {
            return false;
          }
          reverseCell.value = createReverseValue(currentCell);
        }
        compRow *= eval(currentCell.value);
      }
      if (!isObj) {
        sumComp += compRow;
        sqrtRow = compRow ** (1 / lengthMatrix);
        sumSqrt += sqrtRow;
        resultCellSqrt.value = +sqrtRow.toFixed(2);
        arrSqrt[i - 1] = +sqrtRow.toFixed(2);
        resultCellComp.value = +compRow.toFixed(2);
        arrComp[i - 1] = +compRow.toFixed(2);
      }
    }
    if (!isObj) {
      resultCellSumSqrt.value = +sumSqrt.toFixed(2);
      resultCellSumComp.value = +sumComp.toFixed(2);
    }

    for (let j = 1; j <= lengthCols; j++) {
      sumCol = 0;
      const resultColCell = rowsInMatrix.item(lengthMatrix + 1).childNodes[j];
      for (let i = 1; i <= (lengthMatrix); i++) {
        const currentCell = rowsInMatrix.item(i).childNodes[j];
        sumCol += eval(currentCell.value);
      }
      resultColCell.value = +sumCol.toFixed(2);
      arrSumCols[j - 1] = +sumCol.toFixed(2);
    }

    if (isObj) {
      for (let i = 1; i <= lengthMatrix; i++) {
        sumRow = 0;
        currentRow = rowsInMatrix.item(i);
        for (let j = 1; j <= (lengthCols); j++) {
          const currentCell = currentRow.childNodes[j];
          sumRow += eval(currentCell.value);
        }
        arrSum[i - 1] = sumRow;
      }

      let sumValues = 0;
      for (let i = 0; i < arrSum.length; i++) {
        sumValues += arrSum[i];
      }

      if (!isUp) {
        for (let i = 0; i < arrSum.length; i++) {
          arrSum[i] = sumValues / arrSum[i];
        }
        sumValues = 0;
        for (let i = 0; i < arrSum.length; i++) {
          sumValues += arrSum[i];
        }
      }

      let sumNorm = 0;
      let currentNorm;
      for (let i = 0; i < arrNormalized.length; i++) {
        currentNorm = arrSum[i] / sumValues;
        sumNorm += currentNorm;
        arrNormalized[i] = +(currentNorm).toFixed(3);
      }
      resultCellSumNorm.value = Math.round(sumNorm);
    } else {
      let sumNorm = 0;
      let currentNorm;
      for (let i = 0; i < arrNormalized.length; i++) {
        currentNorm = arrSqrt[i] / sumSqrt;
        sumNorm += currentNorm;
        arrNormalized[i] = +(currentNorm).toFixed(3);
      }
      resultCellSumNorm.value = Math.round(sumNorm);
    }

    const resultColl = (isObj) ? 2 : lengthMatrix + 3;
    for (let i = 1; i <= lengthMatrix; i++) {
      currentRow = rowsInMatrix.item(i);
      const resultCell = currentRow.childNodes.item(resultColl);
      resultCell.value = arrNormalized[i - 1];
    }

    if (!isObj) {
      const attitudeConsistency = findAttitudeConsistency(arrSumCols, arrNormalized);
      if (matrixWrap.childNodes[1]) {
        matrixWrap.removeChild(matrixWrap.childNodes[1]);
      }
      matrixWrap.appendChild(attitudeConsistency);
    }

    arrAllNormalized[div] = arrNormalized;
  }
  return arrAllNormalized;
}

function calculate(tabPanel, parseList, createResultMatrix) {
  const arrAllNormalized = findNormalizedValues();

  if (arrAllNormalized) {
    const arrWeightCri = arrAllNormalized[0];
    arrAllNormalized.shift();
    const main = document.getElementById('main');
    sectionResult = document.createElement('section');
    sectionResult.setAttribute('id', 'resultContent');
    sectionResult.classList.add('center');

    const arrCri = parseList('criterions');
    const arrAlt = parseList('alternatives');
    const infoMatrix = createResultMatrix(arrAlt, arrCri, arrAllNormalized, arrWeightCri);
    infoMatrix.id = 'infoBlock';
    sectionResult.appendChild(infoMatrix);

    let sum;
    const arrResult = new Array(arrAlt.length);
    const arrMatrix = new Array(arrAlt.length);
    for (let i = 0; i < arrAlt.length; i++) {
      arrMatrix[i] = new Array(arrCri.length);
    }

    for (let i = 0; i < arrAlt.length; i++) {
      for (let j = 0; j < arrCri.length; j++) {
        arrMatrix[i][j] = arrAllNormalized[j][i];
      }
    }

    for (let i = 0; i < arrAlt.length; i++) {
      sum = 0;
      for (let j = 0; j < arrCri.length; j++) {
        sum += arrMatrix[i][j] * arrWeightCri[j];
      }
      arrResult[i] = sum.toFixed(3);
    }
    const arrRanging = rang(arrResult);
    const wrapperForResult = document.createElement('div');
    wrapperForResult.classList.add('matrix', 'center');
    wrapperForResult.setAttribute('id', 'resultBlock');
    const divForMatrix = document.createElement('div');
    divForMatrix.classList.add('matrix', 'center');
    divForMatrix.style.marginTop = '15px';
    const oneSpan = document.createElement('span');
    oneSpan.classList.add('span-matrix', 'center', 'inputData');
    divForMatrix.style.width = `${134 * (arrAlt.length + 1)}px`;
    for (let i = 0; i <= 2; i++) {
      const oneRowDiv = document.createElement('div');
      oneRowDiv.style.width = `${134 * (arrAlt.length + 1)}px`;

      for (let j = 0; j < (arrAlt.length + 1); j++) {
        const spanForAdd = oneSpan.cloneNode(true);
        if (j === 0 && i === 0) {
          spanForAdd.innerHTML = 'Альтернативы';
          spanForAdd.classList.add('inputData_strong');
        } else if (j === 0 && i === 1) {
          spanForAdd.innerHTML = 'Глобальный приоритет';
          spanForAdd.classList.add('inputData_strong');
        } else if (j === 0 && i === 2) {
          spanForAdd.innerHTML = 'Место';
          spanForAdd.classList.add('inputData_strong');
        } else if (i === 0) {
          spanForAdd.innerHTML = arrAlt[j - 1];
        } else if (i === 1) {
          spanForAdd.innerHTML = arrResult[j - 1];
        } else {
          spanForAdd.innerHTML = arrRanging[j - 1];
        }
        if (arrRanging[j - 1] === 1) {
          spanForAdd.classList.add('victory');
        }
        oneRowDiv.appendChild(spanForAdd);
      }
      divForMatrix.appendChild(oneRowDiv);
    }
    wrapperForResult.appendChild(divForMatrix);

    if (document.getElementById('resultContent')) {
      main.removeChild(document.getElementById('resultContent'));
    }
    sectionResult.appendChild(wrapperForResult);

    const calcButton = document.getElementById('calcButton');
    calcButton.focus();

    const resButton = document.getElementById('resButton');
    resButton.removeAttribute('disabled');
    let resultTab = Ext.getCmp('resultTab');
    if (resultTab) {
      tabPanel.remove(resultTab);
    }
    resultTab = tabPanel.add({
      title: 'Итоговые результаты',
      id: 'resultTab',
      closable: true,
      bodyStyle: 'background-image: url(img/content.png);',
      width: 1100,
      items: [{
        bodyStyle: 'background-image: url(img/content.png);',
        html: sectionResult.innerHTML,
        padding: '10',
        border: 0,
      }],
    });
  }
}

function getSectionResult() {
  return sectionResult;
}

module.exports = {
  run: calculate,
  getSectionResult,
};
