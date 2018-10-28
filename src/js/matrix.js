const validation = require('./validation');
const calculation = require('./calculation');

function parseList(idList) {
  const List = document.getElementById(idList);
  const { childNodes: childNodesList } = List;
  const { length: lengthList } = childNodesList;
  const arr = new Array(lengthList);
  const index = (idList === 'criterions') ? 1 : 0;
  for (let i = 0; i < arr.length; i++) {
    arr[i] = childNodesList[i].childNodes[index].value;
  }
  return arr;
}

function getObjCount() {
  const List = document.getElementById('criterions');
  const { childNodes: childNodesList } = List;
  const { length: lengthList } = childNodesList;
  const arr = new Array(lengthList);
  let count = 0;
  for (let i = 0; i < arr.length; i++) {
    if (childNodesList[i].childNodes[0].checked) count += 1;
  }
  return count;
}

function createObjMatrix(arrAlt, str) {
  const wrapperForMatrix = document.createElement('div');
  wrapperForMatrix.classList.add('objMatrix', 'center');
  const divForMatrix = document.createElement('div');
  divForMatrix.classList.add('objMatrix', 'center');

  const oneSpan = document.createElement('span');
  oneSpan.classList.add('span-matrix', 'center', 'inputData', 'inputData_strong');
  const oneInput = document.createElement('input');
  oneInput.classList.add('center', 'inputData');
  oneInput.style.borderWidth = '2px';

  for (let i = 0; i <= (arrAlt.length + 1); i++) {
    const oneRowDiv = document.createElement('div');
    oneRowDiv.style.width = '402px';

    for (let j = 0; j <= 2; j++) {
      const spanForAdd = oneSpan.cloneNode(true);
      const inputForAdd = oneInput.cloneNode(true);
      inputForAdd.style.width = '130px';
      inputForAdd.style.height = '40px';
      inputForAdd.style.fontSize = '14px';
      if ((i === 0) && (j === 0)) {
        const checkbox = document.createElement('input');
        const span = document.createElement('span');
        span.classList.add('spanForImage');
        const label = document.createElement('label');
        label.classList.add('label');
        checkbox.setAttribute('type', 'checkbox');
        checkbox.style.position = 'absolute';
        checkbox.classList.add('upDown');
        checkbox.checked = true;
        oneRowDiv.style.position = 'relative';
        checkbox.style.top = '13px';
        checkbox.style.left = '60px';
        label.appendChild(checkbox);
        label.appendChild(span);
        oneRowDiv.appendChild(label);
      }
      if ((i === 0) && (j === 1)) {
        spanForAdd.innerHTML = str;
      } else if ((i === 0) && (j === 2)) {
        spanForAdd.innerHTML = 'Нормированное значение';
      } else if ((j === 0) && (i === (arrAlt.length + 1))) {
        spanForAdd.innerHTML = 'Сумма';
      } else if ((j === 0) && (i !== 0)) {
        spanForAdd.innerHTML = arrAlt[i - 1];
      }

      if (i === 0 || j === 0) {
        oneRowDiv.style.display = 'table';
        oneRowDiv.style.margin = '0 auto';
        oneRowDiv.appendChild(spanForAdd);
      } else {
        if (j === 2 || ((j === 1) && (i === (arrAlt.length + 1)))) {
          inputForAdd.disabled = true;
        }
        oneRowDiv.appendChild(inputForAdd);
      }
    }
    divForMatrix.appendChild(oneRowDiv);
  }
  wrapperForMatrix.appendChild(divForMatrix);
  return wrapperForMatrix;
}

function createMatrix(arr, str) {
  const wrapperForMatrix = document.createElement('div');
  wrapperForMatrix.classList.add('matrix', 'center');
  const divForMatrix = document.createElement('div');
  divForMatrix.classList.add('matrix', 'center');

  const oneInput = document.createElement('input');
  const oneSpan = document.createElement('span');
  oneSpan.classList.add('span-matrix', 'center', 'inputData', 'inputData_strong');
  oneInput.classList.add('center', 'inputData');
  oneInput.style.borderWidth = '2px';

  oneInput.disabled = true;

  for (let i = 0; i <= (arr.length + 1); i++) {
    const oneRowDiv = document.createElement('div');
    oneRowDiv.style.width = `${134 * (arr.length + 4)}px`;
    for (let j = 0; j <= (arr.length + 3); j++) {
      const inputForAdd = oneInput.cloneNode(true);
      const spanForAdd = oneSpan.cloneNode(true);
      inputForAdd.style.width = '130px';
      inputForAdd.style.height = '40px';
      inputForAdd.style.fontSize = '14px';
      if (i < j && j < (arr.length + 1)) {
        inputForAdd.disabled = false;
      }
      if (i === j && i !== arr.length + 1) {
        inputForAdd.value = '1/1';
      }
      if (j === 0 && i === arr.length + 1) {
        spanForAdd.innerHTML = 'Сумма';
      }
      if ((i === 0) && (j === 0)) {
        spanForAdd.innerHTML = str;
      } else if ((i === 0) && (j === (arr.length + 3))) {
        spanForAdd.innerHTML = 'Вектор приоритетов';
      } else if ((i === 0) && (j === (arr.length + 1))) {
        spanForAdd.innerHTML = 'Произведение';
      } else if ((i === 0) && (j === (arr.length + 2))) {
        spanForAdd.innerHTML = `Корень (1/${arr.length})`;
      } else if (i === 0) {
        spanForAdd.innerHTML = arr[j - 1];
      } else if (j === 0 && i !== arr.length + 1) {
        spanForAdd.innerHTML = arr[i - 1];
      }
      if (i !== 0 && j !== 0) {
        oneRowDiv.appendChild(inputForAdd);
      } else {
        oneRowDiv.style.display = 'table';
        oneRowDiv.style.margin = '0 auto';
        oneRowDiv.appendChild(spanForAdd);
      }
    }
    divForMatrix.appendChild(oneRowDiv);
  }
  wrapperForMatrix.appendChild(divForMatrix);
  return wrapperForMatrix;
}

function createResultMatrix(arrAlt, arrCri, arrAllNormalized, arrWeightCri) {
  const wrapperForMatrix = document.createElement('div');
  wrapperForMatrix.classList.add('matrix', 'center');
  const divForMatrix = document.createElement('div');
  divForMatrix.classList.add('matrix', 'center');
  divForMatrix.style.width = `${134 * (arrCri.length + 1)}px`;
  const oneSpan = document.createElement('span');
  oneSpan.classList.add('span-matrix', 'center', 'inputData');

  let oneRowDiv = document.createElement('div');
  oneRowDiv.style.width = `${134 * arrCri.length}px`;
  oneRowDiv.style.float = 'right';

  const spanHeaderForAdd = oneSpan.cloneNode(true);
  spanHeaderForAdd.style.height = '20px';
  spanHeaderForAdd.style.width = `${134 * arrCri.length}px`;
  spanHeaderForAdd.classList.add('inputData_strong');
  spanHeaderForAdd.innerHTML = 'Векторы приоритетов';

  oneRowDiv.style.display = 'table';
  oneRowDiv.style.margin = '0 auto';
  oneRowDiv.appendChild(spanHeaderForAdd);
  divForMatrix.appendChild(oneRowDiv);

  for (let i = 0; i <= (arrAlt.length + 1); i++) {
    oneRowDiv = document.createElement('div');
    oneRowDiv.style.clear = 'both';
    oneRowDiv.style.width = `${130 * (arrCri.length + 1)}px`;
    for (let j = 0; j <= (arrCri.length); j++) {
      const spanForAdd = oneSpan.cloneNode(true);

      if (i === 0 && j !== 0) {
        spanForAdd.innerHTML = arrCri[j - 1];
        spanForAdd.classList.add('inputData_strong');
      } else if (i !== 0 && j === 0 && i !== (arrAlt.length + 1)) {
        spanForAdd.innerHTML = arrAlt[i - 1];
        spanForAdd.classList.add('inputData_strong');
      } else if (i === (arrAlt.length + 1) && j === 0) {
        spanForAdd.innerHTML = 'Веса критериев';
        spanForAdd.classList.add('inputData_strong');
      } else if (!(i === 0 && j === 0) && !(i === (arrAlt.length + 1))) {
        spanForAdd.innerHTML = arrAllNormalized[j - 1][i - 1];
      } else if (!(i === 0 && j === 0)) {
        spanForAdd.innerHTML = arrWeightCri[j - 1];
      }
      oneRowDiv.style.display = 'table';
      oneRowDiv.style.margin = '0 auto';
      oneRowDiv.appendChild(spanForAdd);
    }
    divForMatrix.appendChild(oneRowDiv);
  }
  wrapperForMatrix.appendChild(divForMatrix);
  return wrapperForMatrix;
}

function getHeightTab(cri, alt) {
  let height = 44 * (cri + 2) + 10 + 105 + 45;
  height += (44 * (alt + 2) + 15 + 120) * cri - 5 + 60 - 100 * getObjCount();
  return height;
}

function getMatrixTab(tabPanel, criCount, altCount) {
  return tabPanel.insert(1, {
    title: 'Матрицы попарных сравнений',
    id: 'matricesTab',
    closable: true,
    bodyStyle: 'background-image: url(img/content.png);',
    width: 1100,
    items: [{
      bodyStyle: 'background-image: url(img/content.png);',
      html: '<section id="matrixBlock"><section>',
      padding: '10',
      border: 0,
      height: getHeightTab(criCount, altCount),
    }],
  });
}

function getCalcButton(params) {
  const calcButton = document.createElement('input');

  calcButton.setAttribute('id', 'calcButton');
  calcButton.setAttribute('type', 'button');
  calcButton.tabIndex = '-1';
  calcButton.value = 'Решить';
  calcButton.classList.add('button');
  calcButton.classList.add('marginTop');

  return calcButton;
}

function getResButton(params) {
  const resButton = document.createElement('input');

  resButton.setAttribute('id', 'resButton');
  resButton.setAttribute('type', 'button');
  resButton.tabIndex = '-1';
  resButton.disabled = true;
  resButton.value = 'Перейти к результатам';
  resButton.classList.add('resButton');

  return resButton;
}

function setResultTab(tabPanel) {
  let resultTab = Ext.getCmp('resultTab');
  if (!resultTab) {
    resultTab = tabPanel.add({
      title: 'Итоговые результаты',
      id: 'resultTab',
      closable: true,
      bodyStyle: 'background-image: url(img/content.png);',
      width: 1100,
      items: [{
        bodyStyle: 'background-image: url(img/content.png);',
        html: calculation.getSectionResult().innerHTML,
        padding: '10',
        border: 0,
      }],
    });
  }
  tabPanel.setActiveTab(resultTab);
}

function createMatrixs(tabPanel) {
  const valid = validation.init();
  if (valid.isRightListValues('criterions') && valid.isRightListValues('alternatives')) {
    let matrixBlock = document.getElementById('matrixBlock');
    if (document.getElementById('matrixs')) {
      matrixBlock.removeChild(document.getElementById('matrixs'));
    }
    const sectionMatrix = document.createElement('section');
    sectionMatrix.setAttribute('id', 'matrixs');
    const arrCri = parseList('criterions');
    const arrAlt = parseList('alternatives');
    const matrices = Ext.getCmp('matricesTab');

    if (matrices) {
      tabPanel.remove(matrices);
    }
    const matrixTab = getMatrixTab(tabPanel, arrCri.length, arrAlt.length);
    tabPanel.setActiveTab(matrixTab);

    matrixBlock = document.getElementById('matrixBlock');
    const matrixCri = createMatrix(arrCri, 'Критерии');
    sectionMatrix.appendChild(matrixCri);
    let matrix;
    for (let i = 0; i < arrCri.length; i++) {
      if (valid.isObjectMatrix(i)) {
        matrix = createObjMatrix(arrAlt, arrCri[i]);
      } else {
        matrix = createMatrix(arrAlt, arrCri[i]);
      }
      sectionMatrix.appendChild(matrix);
    }

    const calcButton = getCalcButton();
    sectionMatrix.appendChild(calcButton);

    const resButton = getResButton();
    sectionMatrix.appendChild(resButton);
    matrixBlock.appendChild(sectionMatrix);

    document.getElementById('calcButton').onclick = function () {
      calculation.run(tabPanel, parseList, createResultMatrix);
    };
    document.getElementById('resButton').onclick = function () {
      setResultTab(tabPanel);
    };
  }
}

function createList(idDivForList, idButton, idList) {
  const divForList = document.getElementById(idDivForList);
  const oldList = document.getElementById(idList);
  if (oldList) {
    divForList.removeChild(oldList);
  }
  const count = +document.getElementById(idButton).value;
  const list = document.createElement('ol');
  list.setAttribute('id', idList);
  const li = document.createElement('li');
  li.style.position = 'relative';

  if (idList === 'criterions') {
    const checkbox = document.createElement('input');
    checkbox.setAttribute('type', 'checkbox');
    checkbox.style.position = 'absolute';
    checkbox.style.top = '1px';
    checkbox.style.left = '1px';
    checkbox.tabIndex = '-1';
    li.appendChild(checkbox);
  }

  const input = document.createElement('input');
  input.classList.add('center', 'inputDataList');
  input.style.width = '300px';
  input.maxLength = '30';
  input.setAttribute('type', 'text');
  li.appendChild(input);

  for (let i = 0; i < count; i++) {
    const liForAdd = li.cloneNode(true);
    list.appendChild(liForAdd);
  }

  divForList.appendChild(list);
}

function createInputData() {
  if (document.getElementById('matrixs')) {
    const matrixBlock = document.getElementById('matrixBlock');
    const matrixs = document.getElementById('matrixs');
    matrixBlock.removeChild(matrixs);
  }
  if (document.getElementById('resultContent')) {
    const main = document.getElementById('main');
    const resultContent = document.getElementById('resultContent');
    main.removeChild(resultContent);
  }
  const valid = validation.init();

  if (valid.isRightCounts()) {
    const dataCri = document.getElementById('dataCri');
    const dataAlt = document.getElementById('dataAlt');
    createList('listCri', 'criterionsCount', 'criterions');
    createList('listAlt', 'alternativesCount', 'alternatives');
    dataCri.style.display = 'block';
    dataAlt.style.display = 'block';
  } else {
    validation.showWarnMsg('Данные введены неверно: \n1) количество критериев должно быть больше либо равно 2;\n'
      + '2) количество альтернатив должно быть больше либо равно 3;\n'
      + '3) оба значения должны быть меньше либо равны 10.');
  }
}

function enterData(tabPanel, setTestCounts, setTestValues) {
  const matricesTab = Ext.getCmp('matricesTab');
  const resultTab = Ext.getCmp('resultTab');
  const IsNeedCheck = !!document.getElementById('criterions');
  let IsExistCri;
  let IsExistAlt;
  if (IsNeedCheck) {
    IsExistCri = !!parseList('criterions').join('').replace(/\s/g, '');
    IsExistAlt = !!parseList('alternatives').join('').replace(/\s/g, '');
  }

  if (matricesTab || resultTab || IsExistCri || IsExistAlt) {
    Ext.MessageBox.show({
      title: 'Предупреждение!',
      msg: 'Все текущие данные будут утеряны. Продолжить?',
      buttons: Ext.MessageBox.YESNO,
      icon: Ext.MessageBox.WARNING,
      fn(btn) {
        if (btn === 'yes') {
          if (matricesTab) {
            tabPanel.remove(matricesTab);
          }
          if (resultTab) {
            tabPanel.remove(resultTab);
          }
          if (Ext.isFunction(setTestCounts)) setTestCounts();
          createInputData();
          if (Ext.isFunction(setTestValues)) setTestValues();
        }
      },
    });
  } else {
    if (Ext.isFunction(setTestCounts)) setTestCounts();
    createInputData();
    if (Ext.isFunction(setTestValues)) setTestValues();
  }
}

function loadListData(idList, arrTest) {
  const List = document.getElementById(idList);
  const { childNodes: childNodesList } = List;
  const { length: lengthList } = childNodesList;
  const arr = new Array(lengthList);
  const index = (idList === 'criterions') ? 1 : 0;
  for (let i = 0; i < arr.length; i++) {
    childNodesList[i].childNodes[index].value = arrTest[i];
  }
}

function loadMatrixData(matrixValues) {
  const matrixBlock = document.getElementById('matrixs');
  const { childNodes: allMatrixs } = matrixBlock;
  for (let div = 0; div < (allMatrixs.length - 2); div++) {
    const wrapperForMatrix = allMatrixs.item(div);
    const divForMatrix = wrapperForMatrix.childNodes[0];
    const isObj = divForMatrix.classList.contains('objMatrix');
    const { childNodes: rowsInMatrix } = divForMatrix;
    const lengthMatrix = rowsInMatrix.length - 2;
    const lengthCols = (isObj) ? 1 : lengthMatrix;
    const isUp = matrixValues[div].direction;
    if (isObj) {
      const checkBox = rowsInMatrix.item(0).childNodes[0].childNodes[0];
      checkBox.checked = !(isUp === 'bottom');
    }
    for (let i = 1; i <= lengthMatrix; i++) {
      const currentRow = rowsInMatrix.item(i);
      if (isObj) {
        currentRow.childNodes[1].value = matrixValues[div].values[i - 1];
      } else {
        for (let j = i; j < lengthCols; j++) {
          currentRow.childNodes[j + 1].value = matrixValues[div].values[i - 1][j - i];
        }
      }
    }
  }
}

function setCheck(arr) {
  const List = document.getElementById('criterions');
  const childNodesList = List.childNodes;
  for (let i = 0; i < childNodesList.length; i++) {
    childNodesList[i].childNodes[0].checked = arr[i];
  }
}

function loadTestData(tabPanel, data) {
  const criterionsCount = document.getElementById('criterionsCount');
  const alternativesCount = document.getElementById('alternativesCount');
  const criterions = data.inputData.criterions.values;
  const arrObject = data.inputData.criterions.object;
  const { alternatives } = data.inputData;
  const { matrixValues } = data;

  return {
    setCounts() {
      criterionsCount.value = criterions.length;
      alternativesCount.value = alternatives.length;
    },

    setValues() {
      loadListData('criterions', criterions);
      loadListData('alternatives', alternatives);
      setCheck(arrObject);
      createMatrixs(tabPanel);
      loadMatrixData(matrixValues);
      calculation.run(tabPanel, parseList, createResultMatrix);
    },
  };
}

module.exports = {
  loadTestData,
  createMatrixs,
  parseList,
  enterData,
  createResultMatrix,
};
