import 'styles';
const validation = require('./validation');
const matrix = require('./matrix');

Ext.onReady(() => {
  const tabPanel = Ext.create('Ext.tab.Panel', {
    width: 1100,
    padding: 10,
    layout: {
      type: 'hbox',
      align: 'stretch',
      pack: 'center',
    },
    items: [{
      title: 'Входные данные',
      layout: {
        type: 'hbox',
        align: 'stretch',
      },
      items: [{
        xtype: 'panel',
        layout: {
          type: 'vbox',
          align: 'stretch',
          pack: 'center',
        },
        items: [{
          border: 0,
          xtype: 'panel',
          height: 200,
          width: 300,
          bodyStyle: 'background-image: url(img/content.png);',
          html: '<section id="inputContent" class="inputContent"><section id="inputBlock">'
            + '<table class="table"><tr><td><label for="criterionsCount">Кол-во критериев: </label>'
            + '</td><td><input type="number" class="inputData center" id="criterionsCount" value="2"'
            + 'max="10" min="2"></td></tr><tr><td><label for="alternativesCount">Кол-во альтернатив:'
            + '</label></td><td><input type="number" class="inputData center" id="alternativesCount"'
            + 'value="3" max="10" min="3"></td></tr></table><input id="enterData" tabIndex = "-1"'
            + 'class="button" type="button" value="Ввести данные"></section></section><input type='
            + '"button" tabIndex = "-1" id="createMatrixs"  class="button" value="Создать матрицы">',
        }, {
          border: 0,
          xtype: 'panel',
          height: 120,
          width: 300,
          bodyStyle: 'background-image: url(img/content.png);',
          layout: {
            type: 'vbox',
            align: 'stretch',
            pack: 'end',
          },
          items: [{
            bodyStyle: 'background-image: url(img/content.png);',
            border: 0,
            xtype: 'panel',
            html: '<input type="button" tabIndex = "-1" id="loadTestData" '
              + 'class="loadTestButton" value="Загрузить тестовые данные">',
          }],
        }],
      }, {
        xtype: 'panel',
        title: 'Критерии',
        height: 300,
        width: 400,
        bodyStyle: 'background-image: url(img/content.png);',
        layout: {
          type: 'vbox',
          align: 'stretch',
          pack: 'center',
        },
        items: [{
          bodyStyle: 'background-image: url(img/content.png);',
          border: 0,
          height: 300,
          margin: 20,
          xtype: 'panel',
          html: '<div id="dataCri" class="data"><div id="criterionsBlock" class="dataBlock toLeft">'
            + '<div id="listCri"></div></div><p class="clr center"><small><em>Поставьте галочку'
            + 'напротив критерия, если нужно вписать объективные значения</em></small></p></div>',
        }],
      }, {
        xtype: 'panel',
        title: 'Альтернативы',
        height: 300,
        width: 400,
        bodyStyle: 'background-image: url(img/content.png);',
        layout: {
          type: 'vbox',
          align: 'stretch',
          pack: 'center',
        },
        items: [{
          bodyStyle: 'background-image: url(img/content.png);',
          border: 0,
          height: 300,
          margin: 20,
          xtype: 'panel',
          html: '<div id="dataAlt" class="data"><div id="alternativesBlock" class="dataBlock toRight">'
            + '</div><div id="listAlt"></div></div></div>',
        }],
      }],
    }],
    renderTo: 'tabPanel',
  });

  function getTestData() {
    Ext.Ajax.request({
      url: 'data/test.json',
      success(response) {
        const data = JSON.parse(response.responseText);
        const testValues = matrix.loadTestData(tabPanel, data);
        matrix.enterData(tabPanel, testValues.setCounts, testValues.setValues);
      },
      failure() {
        validation.showWarnMsg('Request failed!');
      },
    });
  }

  function readInfo() {
    const readWindow = Ext.create('Ext.window.Window', {
      title: 'Метод анализа иерархий',
      items: [{
        border: 0,
        bodyStyle: 'background-image: url(img/content.png);',
        xtype: 'panel',
        html: '<section class="description"><p class="textIndent">Суть метода в попарном '
          + 'сравнении по качественной шкале, с последующим преобразованием в баллы:</p>'
          + '<ul class="listToRight"><li>равно, безразлично = 1;</li><li>немного лучше '
          + '(хуже) = 3 (1/3);</li><li>лучше (хуже) = 5 (1/5);</li><li>значительно лучше '
          + '(хуже) = 7 (1/7);</li><li>принципиально лучше (хуже) = 9 (1/9).</li></ul>'
          + '<p class="textIndent">При промежуточном мнении используются промежуточные '
          + 'баллы 2, 4, 6, 8.</p><p class="textIndent"><em>a<sub>ij</sub></em> – отношение'
          + ' критерия i к критерию j.</p><p class="textIndent">Составляем аналогичные матрицы'
          + ' сравнения вариантов (альтернатив) по каждому критерию.</p><p class="textIndent">'
          + 'СИ является индексом согласованности для сгенерированных случайным образом величин'
          + ' по шкале от одного до девяти положительной обратно симметрической матрицы. '
          + 'В следующей таблице приведены средние (модельные) значения СИ для матриц порядка '
          + 'n = 1:15.</p><table class="center table-si"><caption>Таблица 1. Индексы согласованности'
          + '</caption><tr><td>n</td><td>1</td><td>2</td><td>3</td><td>4</td><td>5</td><td>6</td><td>'
          + '7</td><td>8</td><td>9</td><td>10</td><td>11</td><td>12</td><td>13</td><td>14</td><td>15'
          + '</td></tr><tr><td>СИ</td><td>0</td><td>0</td><td>0,58</td><td>0,9</td><td>1,12</td><td>'
          + '1,24</td><td>1,32</td><td>1,41</td><td>1,45</td><td>1,49</td><td>1,51</td><td>1,48</td>'
          + '<td>1,56</td><td>1,57</td><td>1,59</td></tr></table></section>',
      }],
    });

    readWindow.show();
  }

  document.getElementById('enterData').addEventListener('click', () => {
    matrix.enterData(tabPanel);
  });
  document.getElementById('loadTestData').addEventListener('click', getTestData);
  document.getElementById('createMatrixs').addEventListener('click', () => {
    matrix.createMatrixs(tabPanel);
  });
  document.getElementById('readInfo').addEventListener('click', readInfo);
});
