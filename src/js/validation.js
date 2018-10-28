function showWarnMsg(msg) {
  Ext.MessageBox.show({
    title: 'Внимание!',
    msg,
    buttons: Ext.MessageBox.OK,
    icon: Ext.MessageBox.WARNING,
  });
}

function doFocus(cell, msg) {
  cell.focus();
  cell.select();

  showWarnMsg(msg);
}

function init() {
  const criCount = +document.getElementById('criterionsCount').value;
  const altCount = +document.getElementById('alternativesCount').value;

  return {
    isRightCounts() {
      const isValid = ((criCount >= 2) && (altCount >= 3) && (criCount <= 10) && (altCount <= 10));

      return isValid;
    },

    isRightListValues(listId, IsNotCheck) {
      const list = document.getElementById(listId);
      let isValid = true;
      if (list) {
        const { childNodes: childNodesList } = list;
        const index = (listId === 'criterions') ? 1 : 0;

        for (let i = 0; i < childNodesList.length; i++) {
          isValid = !!childNodesList[i].childNodes[index].value;

          if (!isValid) {
            if (!IsNotCheck) {
              showWarnMsg('Заполните все поля');
            }
            return false;
          }
        }

        return true;
      }

      showWarnMsg('Вы еще не ввели данные');
      return false;
    },

    isObjectMatrix(index) {
      const List = document.getElementById('criterions');
      const { childNodes: childNodesList } = List;

      return !!childNodesList[index].childNodes[0].checked;
    },

    isRightObjValue(cell) {
      const value = +cell.value;
      const INVALID_MESSAGE = 'Введите число!';
      const isValid = (!isNaN(value) && isFinite(value) && cell.value !== '');

      if (isValid) { return true; }

      doFocus(cell, INVALID_MESSAGE);
      return false;
    },

    isRightValue(cell) {
      const { value } = cell;
      const arr = value.split('');
      const INVALID_MESSAGE = 'Введите корректное значение в данной ячейке!';
      let isValid = false;

      if (arr.length === 1) {
        const arrNumber = +arr[0];

        isValid = (arrNumber <= 9 && arrNumber > 0);
      }

      if (arr.length === 3) {
        const first = +arr[0];
        const second = arr[1];
        const third = +arr[2];

        isValid = ((first <= 9 && third <= 9) && (first > 0 && third > 0) && (second === '/')
          && (first === 1 || third === 1));
      }

      if (isValid) { return true; }

      doFocus(cell, INVALID_MESSAGE);
      return false;
    },
  };
}

module.exports = {
  init,
  showWarnMsg,
};
