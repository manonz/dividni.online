class Variable {
  constructor(id, type) {
    this._id = "@" + id.trim();
    this.type = type;
  }

  get id() {
    return this._id;
  }

  set id(id) {
    this._id = "@" + id.trim();
  }
}

class ExpressionVariable extends Variable {
  constructor(id, expression) {
    super(id, "expression");
    this.expression = expression.trim();
  }
}

class RandomVariable extends Variable {
  constructor(id, min, max, multiplier = 1) {
    super(id, "random");
    this.min = parseInt(min, 10);
    this.max = parseInt(max, 10);
    // Converted to a string so we can check if it's a double or an int on the server
    this.multiplier = multiplier.toString();
  }
}

class ChoiceVariable extends Variable {
  constructor(id, choicesString) {
    super(id, "choice");
    this._choices = choicesString.split("|");
  }

  get choices() {
    return this._choices;
  }

  set choices(choices) {
    this._choices = choices.split("|");
  }
}

class LambdaVariable extends Variable {
  constructor(id, returnType, lambdaCode) {
    super(id, "lambda");
    this.lambdaCode = lambdaCode;
    this._returnType = isValidReturnType(returnType) ? returnType : "string";
  }

  get returnType() {
    return this._returnType;
  }

  set returnType(returnType) {
    this._returnType = isValidReturnType(returnType) ? returnType : "string";
  }
}

let variables = [
  new RandomVariable("randomExample", 1, 10),
  new ChoiceVariable("choiceExample", "bananas|apples|oranges"),
  new ExpressionVariable("expressionExample", "@randomExample * 4"),
  new LambdaVariable(
    "lambdaExample",
    "string",
    '() => { switch (choiceExample) { case "banana": return "yellow"; case "apples": return "red"; default: return "orange"; } }'
  ),
];

const draggable = new Draggable.Sortable(document.getElementById('variables-list'), {
  draggable: 'li',
});

function isValidName(n) {
  const validVariableNameRegex = /^[a-zA-Z_][a-zA-Z0-9_]*$/;

  return (
    !variables.find((v) => v.id.toLowerCase() === `@${n.toLowerCase()}`) &&
    validVariableNameRegex.test(n)
  );
}


function getContentWithMentionsProcessed(expression) {
  const mentionRegex = /@(\w+)/g

  return expression.replace(mentionRegex, (match, mention) => {
    const variable = variables.find((v) => v.id === mention)
    if (variable) {
      return `<span class="mention" data-mention="${match}">${match}</span>`
    } else {
      return match;
    }
   
  });
}

function validateRandomVariable(isEditing = false) {
  let modalValid = 1;

  const nameField = document.getElementById("random-var-name");
  const minField = document.getElementById("random-min");
  const maxField = document.getElementById("random-max");
  const multiplierField = document.getElementById("random-multiplier");
  [nameField, minField, maxField, multiplierField].forEach((field) => {
    document.getElementById(field.id + "Error").innerText = "";
  });

  const nameVal = getSanitisedValue(nameField);
  const min = Number(getSanitisedValue(minField));
  const max = Number(getSanitisedValue(maxField));
  const multiplierVal = getSanitisedValue(multiplierField);

  [nameField, minField, maxField].forEach((field) => {
    const val = getSanitisedValue(field);
    if (!val || !val?.length) {
      applyError(field.id, "This field is required.", false);
      modalValid = 0;
    }

    if (!isEditing && field === nameField && nameVal && !isValidName(nameVal)) {
      applyError(
        field.id,
        "Name must be unique and should not contain any special characters or spaces.",
        false
      );
      modalValid = 0;
    }

    if (
      (field === minField || field === maxField) &&
      !isValidNumber(getSanitisedValue(field), true)
    ) {
      applyError(field.id, "Must be a 32-bit integer.", false);
      modalValid = 0;
    }
  });

  if (
    multiplierVal &&
    multiplierVal?.length &&
    !isValidNumber(multiplierVal, false)
  ) {
    applyError(
      multiplierField.id,
      "Must be a 32-bit integer or a double.",
      false
    );
    modalValid = 0;
  }

  if (min >= max) {
    applyError(
      minField.id,
      "Min must be less than max.",
      false
    );
    modalValid = 0;
  }

  if (modalValid === 1) {
    return {
      name: nameVal,
      min,
      max,
      multiplier: multiplierVal || undefined,
    }
  } else {
    return null;
  }

}

function addRandomVariable(closeButton) {
  const variableProperties = validateRandomVariable();

  if (!variableProperties) {
    return;
  }
  
  const {name, min, max, multiplier} = variableProperties;
  let newVar;

  if (multiplier && multiplier?.length) {
    newVar = new RandomVariable(name, min, max, multiplier);
  } else {
    newVar = new RandomVariable(name, min, max);
  }

  addVariable(newVar);
  closeDialog(closeButton);

}

function editRandomVariable(variableToEdit, closeButton) {
  const variableProperties = validateRandomVariable(true);

  if (!variableProperties) {
    return;
  }

  const {name, min, max, multiplier} = variableProperties;
  
  if (variableToEdit && variableToEdit instanceof RandomVariable) {
    variableToEdit.id = name;
    variableToEdit.min = min;
    variableToEdit.max = max;
    variableToEdit.multiplier = multiplier;

    editVariable(variableToEdit);
  } else {
    updateStatus(false, `Random variable ${variableToEdit.id} could not be found or edited.`);
  }

  closeDialog(closeButton);
}

function validateChoiceVariable(isEditing = false) {
  let modalValid = 1;

  const nameField = document.getElementById("choice-var-name");
  const optionsField = document.getElementById("choiceOptions");
  [nameField, optionsField].forEach((field) => {
    document.getElementById(field.id + "Error").innerText = "";
  });

  const nameVal = getSanitisedValue(nameField);
  const options = getSanitisedValue(optionsField);

  [nameField, optionsField].forEach((field) => {
    const val = getSanitisedValue(field);
    if (!val || !val?.length) {
      applyError(field.id, "This field is required.", false);
      modalValid = 0;
    }

    if (!isEditing && field === nameField && nameVal && !isValidName(nameVal)) {
      applyError(
        field.id,
        "Name must be unique and should not contain any special characters or spaces.",
        false
      );
      modalValid = 0;
    }
  });

  if (modalValid === 1) {
    return {
      name: nameVal,
      options,
    }
  } else {
    return null;
  }

}

function addChoiceVariable(closeButton) {
  const variableProperties = validateChoiceVariable();

  if (!variableProperties) {
    return;
  }
  
  const {name, options} = variableProperties;
  const newVar = new ChoiceVariable(name, options);

  addVariable(newVar);
  closeDialog(closeButton);
}

function editChoiceVariable(variableToEdit, closeButton) {
  const variableProperties = validateChoiceVariable(true);

  if (!variableProperties) {
    return;
  }
  
  const {name, options} = variableProperties;

  
  if (variableToEdit && variableToEdit instanceof ChoiceVariable) {
    variableToEdit.id = name;
    variableToEdit.choices = options;

    editVariable(variableToEdit);
  } else {
    updateStatus(false, `Choice variable ${variableToEdit.id} could not be found or edited.`);
  }

  closeDialog(closeButton);
}

function isValidReturnType(value) {
  const validReturnTypes = ["int", "string", "double"];

  return Boolean(validReturnTypes.find((t) => t === value));
}

function validateLambda(isEditing = false) {
  let modalValid = 1;

  const nameField = document.getElementById("lambda-name");
  const returnTypeField = document.getElementById("lambda-return-type");

  document.getElementById("lambda-editorError").innerText = "";

  [nameField, returnTypeField].forEach((field) => {
    document.getElementById(field.id + "Error").innerText = "";

    const val = getSanitisedValue(field);

    if (!val || !val?.length) {
      applyError(field.id, "This field is required.", false);
      modalValid = 0;
    }

    if (!isEditing && field === nameField && val && !isValidName(val)) {
      applyError(
        field.id,
        "Name must be unique and should not contain any special characters or spaces."
      );
      modalValid = 0;
    }

    if (field === returnTypeField && val && !isValidReturnType(val)) {
      applyError(
        field.id,
        "Not a valid return type. Value must be either int, string, or double."
      );
      modalValid = 0;
    }
  });

  const lambdaContent = DOMPurify.sanitize(lambdaEditor.getValue().trim());

  if (isContentEmpty(lambdaContent)) {
    applyError("lambda-editor", "This field should not be blank.");
    modalValid = 0;
  }

  if (modalValid === 1) {
    return {
      name: nameField,
      returnType: returnTypeField,
      lambdaContent
    }
  } else {
    return null;
  }
}

function addLambda(closeButton) {
  const variableProperties = validateLambda();

  if (!variableProperties) {
    return;
  }

  const {name, returnType, lambdaContent} = variableProperties;

  addVariable(
    new LambdaVariable(
      getSanitisedValue(name),
      getSanitisedValue(returnType),
      lambdaContent
    )
  );

  closeDialog(closeButton);
}

function editLambda(variableToEdit, closeButton) {
  const variableProperties = validateLambda(true);

  if (!variableProperties) {
    return;
  }

  const {name, returnType, lambdaContent} = variableProperties;

  if (variableToEdit && variableToEdit instanceof LambdaVariable) {
    variableToEdit.id = getSanitisedValue(name);
    variableToEdit.returnType = getSanitisedValue(returnType);
    variableToEdit.lambdaCode = lambdaContent;

    editVariable(variableToEdit);
  } else {
    updateStatus(false, `Lambda variable ${variableToEdit.id} could not be found or edited.`);
  }

  closeDialog(closeButton);

}

function validateExpression(isEditing = false) {
  let modalValid = 1;

  const nameField = document.getElementById("expression-name");
  document.getElementById(nameField.id + "Error").innerText = "";
  document.getElementById("expression-editorError").innerText = "";

  const nameVal = getSanitisedValue(nameField);

  if (!nameVal || !nameVal?.length) {
    applyError(nameField.id, "This field is required.", false);
    modalValid = 0;
  }

  if (!isEditing && nameVal && !isValidName(nameVal)) {
    applyError(
      nameField.id,
      "Name must be unique and should not contain any special characters or spaces."
    );
    modalValid = 0;
  }

  const expressionContent = getSanitisedEditorContent(expressionEditor);

  if (isContentEmpty(expressionContent)) {
    applyError("expression-editor", "This field should not be blank.");
    modalValid = 0;
  }

  const failedMentions = [];

  // Replace spans with variable names, make sure they point to valid variables
  let replacedExpression = expressionContent
    .replace(
      /<span class="mention" data-mention="(@\w+)">@\w+<\/span>/g,
      (match, mention) => {
        if (variables.find((v) => v.id === mention)) {
          return mention.substring(1);
        } else {
          failedMentions.push(mention);
          return match;
        }
      }
    )
    .trim();

  replacedExpression = DOMPurify.sanitize(replacedExpression, {
    ALLOWED_TAGS: [],
  });

  if (failedMentions.length) {
    applyError(
      "expression-editorError",
      `The following mentions were invalid: ${failedMentions.toString()}`
    );
    modalValid = 0;
  }

  if (modalValid === 1) {
    return {
      name: nameVal,
      replacedExpression,
    }
  } else {
    return null;
  }
}

function addExpression(closeButton) {
  const variableProperties = validateExpression();

  if (!variableProperties) {
    return;
  }

  const {name, replacedExpression} = variableProperties;

  addVariable(new ExpressionVariable(name, replacedExpression));

  closeDialog(closeButton);
}


function editExpression(variableToEdit, closeButton) {
  const variableProperties = validateExpression(true);

  if (!variableProperties) {
    return;
  }

  const {name, replacedExpression} = variableProperties;

  if (variableToEdit && variableToEdit instanceof ExpressionVariable) {
    variableToEdit.id = name;
    variableToEdit.expression = replacedExpression.trim();

    editVariable(variableToEdit);
  } else {
    updateStatus(false, `Expression variable ${variableToEdit.id} could not be found or edited.`);
  }

  closeDialog(closeButton);
}

function isValidNumber(n, checkIsInteger) {
  if (isNaN(n)) {
    return false;
  }

  const numVal = Number(n);

  if (checkIsInteger && !Number.isInteger(numVal)) {
    return false;
  }

  if (numVal <= -Math.pow(2, 31) || numVal >= Math.pow(2, 31)) {
    return false;
  }

  return true;
}

function displayVariables() {
  const list = document.getElementById("variables-list");
  list.innerText = "";

  variables.forEach((variable) => {
    const li = document.createElement("li");
    li.classList.add("variables-list__item");
    li.setAttribute("id", `${variable.id.substring(1)}-list__item`);

    const name = document.createElement("h4");
    name.classList.add("variables-list__item__heading");
    name.innerText = variable.id;

    const type = document.createElement("h5");
    type.classList.add("variables-list__item__subheading");
    type.innerText = variable.type;

    let value = document.createElement("p");
    value.classList.add("variables-list__item__content");

    let actions = document.createElement("div");
    actions.classList.add("variables-list__actions")

    const deleteButton = document.createElement("delete");
    deleteButton.classList.add("delete-variable");
    deleteButton.innerText = "Delete";
    deleteButton.setAttribute("onclick", `removeVariable("${variable.id}");`);

    const editButton = document.createElement("edit");
    editButton.classList.add("delete-variable");
    editButton.innerText = "Edit";
    editButton.setAttribute("onclick", `openEditorModal(this, "${variable.id}");`);

    actions.appendChild(editButton);
    actions.appendChild(deleteButton);

    switch (variable.type) {
      case "random":
        value.innerText = `Min: ${variable.min}, Max: ${variable.max}, Multiplier: ${variable.multiplier}`;
        break;
      case "choice":
        value.innerText = variable.choices.join("\n");
        break;
      case "expression":
        value.innerHTML = DOMPurify.sanitize(variable.expression);
        break;
      case "lambda":
        value = document.createElement("code");
        value.innerHTML = DOMPurify.sanitize(variable.lambdaCode);
        break;
    }

    li.appendChild(name);
    li.appendChild(type);
    li.appendChild(value);
    li.appendChild(actions);
    list.appendChild(li);
  });
}

function addVariable(variableToAdd) {
  updateStatus(true, `Variable ${variableToAdd.id} added successfully.`);
  variables.push(variableToAdd);
  displayVariables();
}

function editVariable(variableToEdit) {
  updateStatus(true, `Variable ${variableToEdit.id} edited successfully.`);
  displayVariables();
}

function removeVariable(idToRemove) {
  const idxToRemove = variables.findIndex((v) => v.id === idToRemove);
  if (idxToRemove > -1) {
    variables = [
      ...variables.slice(0, idxToRemove),
      ...variables.slice(idxToRemove + 1),
    ];
    updateStatus(true, `Variable ${idToRemove} removed successfully.`);
    document.getElementById(`${idToRemove.substring(1)}-list__item`).remove();
  } else {
    updateStatus(false, `Variable ${idToRemove} could not be found.`);
  }
}

function openEditorModal(element, variableId) {
  const variableToEdit = variables.find(v => v.id === variableId);

  openModal(element);
  let title;
  let button;
  let nameField;
  let savedHandler;

  switch (variableToEdit.type) {
    case "random":
        replaceDialog('dialog2', undefined, 'random-var-name');

        nameField = document.getElementById("random-var-name");
        const minField = document.getElementById("random-min");
        const maxField = document.getElementById("random-max");
        const multiplierField = document.getElementById("random-multiplier");
        title = document.getElementById("dialog2_label");
        button = document.getElementById("process-random");

        minField.value = variableToEdit.min;
        maxField.value = variableToEdit.max;
        multiplierField.value = variableToEdit.multiplier;
        title.innerText = "Edit Random Variable";
        savedHandler = button.onclick;
        button.onclick = () => { editRandomVariable(variableToEdit, button); button.onclick = savedHandler; };

        break;

      case "choice":
        replaceDialog('dialog3', undefined, 'dialog3_close_btn');

        nameField = document.getElementById("choice-var-name");
        const optionsField = document.getElementById("choiceOptions");
        title = document.getElementById("dialog3_label");
        button = document.getElementById("process-choice");

        optionsField.value = variableToEdit.choices.join("|");
        title.innerText = "Edit Choice Variable";
        savedHandler = button.onclick;
        button.onclick = () => { editChoiceVariable(variableToEdit, button); button.onclick = savedHandler; };
        
        break;
      case "expression":
        replaceDialog('dialog4', undefined, 'expression-name');

        nameField = document.getElementById("expression-name");
        title = document.getElementById("dialog4_label");
        button = document.getElementById("process-expression");

        expressionEditor.setData(getContentWithMentionsProcessed(variableToEdit.expression));

        title.innerText = "Edit Mathematical Expression";
        savedHandler = button.onclick;
        button.onclick = () => { editExpression(variableToEdit, button); button.onclick = savedHandler; };
        break;
      case "lambda":
        replaceDialog('dialog5', undefined, 'lambda-name');

        nameField = document.getElementById("lambda-name");
        const returnTypeField = document.getElementById("lambda-return-type");
        title = document.getElementById("dialog5_label");
        button = document.getElementById("process-lambda");

        returnTypeField.value = variableToEdit.returnType;
        title.innerText = "Edit Lambda Variable";

        lambdaEditor.session.setValue(variableToEdit.lambdaCode);
        savedHandler = button.onclick;
        button.onclick = () => { editLambda(variableToEdit, button); button.onclick = savedHandler; };
        break;
    
  }
  nameField.value = `${variableToEdit.id.substring(1)}`;
  button.innerText = "OK";
  
}
