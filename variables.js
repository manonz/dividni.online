class Variable {
  constructor(id, type) {
    this.id = "@" + id.trim();
    this.type = type;
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
    this.choices = choicesString.split("|");
  }
}

class LambdaVariable extends Variable {
  constructor(id, returnType, lambdaCode) {
    super(id, "lambda");
    this.lambdaCode = lambdaCode;
    this.returnType = isValidReturnType(returnType) ? returnType : "string";
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

function isValidName(n) {
  const validVariableNameRegex = /^[a-zA-Z_][a-zA-Z0-9_]*$/;

  return (
    !variables.find((v) => v.id.toLowerCase() === `@${n.toLowerCase()}`) &&
    validVariableNameRegex.test(n)
  );
}

function addRandomVariable(closeButton) {
  let modalValid = 1;

  const nameField = document.getElementById("random-var-name");
  const minField = document.getElementById("random-min");
  const maxField = document.getElementById("random-max");
  const multiplierField = document.getElementById("random-multiplier");
  [nameField, minField, maxField, multiplierField].forEach((field) => {
    document.getElementById(field.id + "Error").innerText = "";
  });

  const nameVal = getSanitisedValue(nameField);
  const min = getSanitisedValue(minField);
  const max = getSanitisedValue(maxField);
  const multiplierVal = getSanitisedValue(multiplierField);

  [nameField, minField, maxField].forEach((field) => {
    const val = getSanitisedValue(field);
    if (!val || !val?.length) {
      applyError(field.id, "This field is required.", false);
      modalValid = 0;
    }

    if (field === nameField && nameVal && !isValidName(nameVal)) {
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

  if (modalValid === 1) {
    let newVar;

    if (multiplierVal && multiplierVal?.length) {
      newVar = new RandomVariable(nameVal, min, max, multiplierVal);
    } else {
      newVar = new RandomVariable(nameVal, min, max);
    }

    addVariable(newVar);
    closeDialog(closeButton);
  }
}

function addChoiceVariable(closeButton) {
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

    if (field === nameField && nameVal && !isValidName(nameVal)) {
      applyError(
        field.id,
        "Name must be unique and should not contain any special characters or spaces.",
        false
      );
      modalValid = 0;
    }
  });

  if (modalValid === 1) {
    const newVar = new ChoiceVariable(nameVal, options);

    addVariable(newVar);
    closeDialog(closeButton);
  }
}

function isValidReturnType(value) {
  const validReturnTypes = ["int", "string", "double"];

  return Boolean(validReturnTypes.find((t) => t === value));
}

function addLambda(closeButton) {
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

    if (field === nameField && val && !isValidName(val)) {
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
    addVariable(
      new LambdaVariable(
        getSanitisedValue(nameField),
        getSanitisedValue(returnTypeField),
        lambdaContent
      )
    );

    closeDialog(closeButton);
  }
}

function addExpression(closeButton) {
  let modalValid = 1;

  const nameField = document.getElementById("expression-name");
  document.getElementById(nameField.id + "Error").innerText = "";
  document.getElementById("expression-editorError").innerText = "";

  const nameVal = getSanitisedValue(nameField);

  if (!nameVal || !nameVal?.length) {
    applyError(nameField.id, "This field is required.", false);
    modalValid = 0;
  }

  if (nameVal && !isValidName(nameVal)) {
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

  // Replace spans with variable names, make sure they points to valid variables
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
    addVariable(new ExpressionVariable(nameVal, replacedExpression));

    closeDialog(closeButton);
  }
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

    const deleteButton = document.createElement("delete");
    deleteButton.classList.add("delete-variable");
    deleteButton.innerText = "Delete";
    deleteButton.setAttribute("onclick", `removeVariable("${variable.id}");`);

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
    li.appendChild(deleteButton);
    list.appendChild(li);
  });
}

function addVariable(variableToAdd) {
  updateStatus(true, `Variable ${variableToAdd.id} added successfully.`);
  variables.push(variableToAdd);
  displayVariables();
}

function removeVariable(idToRemove) {
  const idxToRemove = variables.findIndex((v) => v.id === idToRemove);
  console.log(idxToRemove);
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
