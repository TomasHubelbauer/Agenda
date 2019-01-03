window.addEventListener('load', _ => {
  const debugDiv = document.querySelector('#debugDiv');
  const editorTextArea = document.querySelector('#editorTextArea');
  const submitButton = document.querySelector('#submitButton');
  const itemsDiv = document.querySelector('#itemsDiv');
  
  submitButton.addEventListener('click', _ => {
    submit();
  });
  
  editorTextArea.addEventListener('keypress', event => {
    if (event.key === '\n' && (event.ctrlKey || event.metaKey)) {
      submit();
    }
  });

  function onEditButtonClick(event) {
    const id = event.currentTarget.dataset['id'];
    const text = prompt('', localStorage.getItem(id));
    if (text === null) {
      return;
    }
    
    localStorage.setItem(id, text);
    render();
  }
  
  function onDeleteButtonClick(event) {
    const id = event.currentTarget.dataset['id'];
    if (!confirm(`Delete item '${localStorage.getItem(id)}'?`)) {
      return;
    }
    
    localStorage.removeItem(id);
    render();
  }
  
  function onMoveUpButtonClick(event) {
    const id = event.currentTarget.dataset['id'];
    const ids = iterate();
    const index = ids.indexOf(Number(id));
    const otherId = ids[index - 1].toString();
    const other = localStorage.getItem(otherId);
    localStorage.setItem(otherId, localStorage.getItem(id));
    localStorage.setItem(id, other);
    render();
  }
  
  function onMoveDownButtonClick(event) {
    const id = event.currentTarget.dataset['id'];
    const ids = iterate();
    const index = ids.indexOf(Number(id));
    const otherId = ids[index + 1].toString();
    const other = localStorage.getItem(otherId);
    localStorage.setItem(otherId, localStorage.getItem(id));
    localStorage.setItem(id, other);
    render();
  }
  
  function iterate() {
    return Object.keys(localStorage).map(Number).filter(Number.isSafeInteger).sort();
  }
  
  function submit() {
    if (!editorTextArea.value) {
      return;
    }
    
    const ids = iterate();
    const id = ids.length === 0 ? 1 : Math.max(...ids) + 1;
    localStorage.setItem(id, editorTextArea.value);
    editorTextArea.value = '';
    render();
  }
  
  function render() {
    itemsDiv.innerHTML = '';
    const fragment = document.createDocumentFragment();
    
    const ids = iterate();
    for (let index = 0; index < ids.length; index++) {
      const id = ids[index];
      const [title, ...description] = localStorage.getItem(id).split('\n');

      const editButton = document.createElement('button');
      editButton.textContent = '✎';
      editButton.dataset['id'] = id;
      editButton.addEventListener('click', onEditButtonClick);
      
      const deleteButton = document.createElement('button');
      deleteButton.textContent = '🗑';
      deleteButton.dataset['id'] = id;
      deleteButton.addEventListener('click', onDeleteButtonClick);
      
      const moveUpButton = document.createElement('button');
      moveUpButton.textContent = '▲';
      moveUpButton.disabled = index === 0;
      moveUpButton.dataset['id'] = id;
      moveUpButton.addEventListener('click', onMoveUpButtonClick);

      const moveDownButton = document.createElement('button');
      moveDownButton.textContent = '▼';
      moveDownButton.disabled = index === ids.length - 1;
      moveDownButton.dataset['id'] = id;
      moveDownButton.addEventListener('click', onMoveDownButtonClick);
      
      const itemSummary = document.createElement('summary');
      itemSummary.textContent = title;
      itemSummary.appendChild(editButton);
      itemSummary.appendChild(deleteButton);
      itemSummary.appendChild(moveUpButton);
      itemSummary.appendChild(moveDownButton);
      
      const itemDetails = document.createElement('details');
      itemDetails.appendChild(itemSummary);
      
      for (const line of description) {
        const lineP = document.createElement('p');
        lineP.textContent = line;
        itemDetails.appendChild(lineP);
      }
      
      const debugLineP = document.createElement('p');
      debugLineP.textContent = `ID: ${id}`;
      itemDetails.appendChild(debugLineP);

      fragment.appendChild(itemDetails);
    }
    
    itemsDiv.appendChild(fragment);
  }
  
  render();
});
