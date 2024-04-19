let questionType = "Numerical";
let completeFormValid = 1;

const apiUrl = "https://academicintegrity.cs.auckland.ac.nz/duc/Converter";
//const apiUrl = "http://localhost:7074/Converter";

const getSanitisedValue = (field) => {
  if (!field || !field?.value) {
    return;
  }

  return DOMPurify.sanitize(field.value.trim());
};

function showVersion() {
  fetch(`${apiUrl}/Version`)
    .then((res) => res.text())
    .then(
      (versionNumber) =>
        (document.getElementById("dividni-version").innerText =
          `v${versionNumber}`)
    )
    .catch((err) => {
      console.error(`Error fetching version: ${err}`);
    });
}

function setSelectedQuestionType(type) {
  questionType = type;
}

function copyCodeBase(data, endpoint) {
  if (completeFormValid !== 1) {
    updateStatus(false, "Form errors. Please correct errors and try again.");
    return;
  }

  const ccElement = document.getElementById("dividni-version");
  ccElement.style.textDecoration = "underline";
  const controller = new AbortController();
  const timeout = setTimeout(() => {
    controller.abort();
  }, 5000);

  fetch(`${apiUrl}/${endpoint}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((res) => {
      const contentType = res.headers.get("Content-Type");
      if (contentType.startsWith("application/json")) {
        return res.json();
      }

      return res.text();
    })
    .then((data) => navigator.clipboard.writeText(data))
    .catch((error) => {
      console.error(error);
      updateStatus(false, `Error copying code: ${error}`);
    })
    .finally(() => {
      clearTimeout(timeout);
      ccElement.style.textDecoration = "none";
    });
}



function previewBase(data, endpoint) {
  if (completeFormValid !== 1) {
    updateStatus(false, "Form errors. Please correct errors and try again.");
    return;
  }

  const previewButton = document.getElementById("preview");
  previewButton.disabled = true;
  previewButton.classList.add("pill-button-loading");

  const loader = document.getElementById("preview-loading");
  loader.setAttribute("aria-label", "Preview loading...");

  const controller = new AbortController();
  const timeout = setTimeout(() => {
    controller.abort();
  }, 5000);

  fetch(`${apiUrl}/${endpoint}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((res) => {
      const contentType = res.headers.get("Content-Type");
      if (contentType.startsWith("application/json")) {
        return res.json();
      }

      return res.text();
    })
    .then((data) => showPreview(data))
    .catch((error) => {
      console.error(error);
      updateStatus(false, `Error previewing form: ${error}`);
    })
    .finally(() => {
      clearTimeout(timeout);
      clearLoadingPreview();
    });
}

function showPreview(data) {
  const iframe = document.getElementById("resultsIFrame");
  const htmlSrc = encodeURI(data);
  iframe.src = "data:text/html;charset=utf-8," + htmlSrc;
}

function previewMcqMarkup() {
  const multiChoice = document.getElementById("multipleChoiceCheckbox").checked;

  const formData = getMcqFormData();

  if (multiChoice) {
    previewBase(formData, "PreviewMcqXyzMarkup");
  } else {
    previewBase(formData, "PreviewMcqTruthMarkup");
  }
}

function clearLoadingPreview() {
  const previewButton = document.getElementById("preview");
  previewButton.disabled = false;
  previewButton.classList.remove("pill-button-loading");
  previewButton.style.cursor = "pointer";

  const loader = document.getElementById("preview-loading");
  loader.setAttribute("aria-label", "");
}

function updateStatus(isSuccess, message) {
  const banner = document.getElementById("status-banner");

  if (isSuccess) {
    banner.className = "banner-success";
  } else {
    banner.className = "banner-failure";
  }

  document.getElementById("status-banner__content").innerText = message;
}

function clearStatus() {
  document.getElementById("status-banner").className = "";

  document.getElementById("status-banner__content").innerText = "";
}

function applyError(fieldId, errorMessage, isForm = true) {
  // If it's not for a modal, then the main question form was invalid
  if (isForm) {
    completeFormValid = 0;
  }

  var errMessageId = fieldId + "Error";
  document.getElementById(errMessageId).innerText = errorMessage; //puts error in span tag
  document.getElementById(errMessageId).focus(); //puts focus on field with error
}

function downloadBase(data, endpoint) {
  if (completeFormValid !== 1) {
    updateStatus(false, "Form errors. Please correct errors and try again.");
    return;
  }

  const downloadButton = document.getElementById("download");
  downloadButton.disabled = true;
  downloadButton.classList.add("pill-button-loading");

  const loader = document.getElementById("download-loading");
  loader.setAttribute("aria-label", "Preview loading...");

  const controller = new AbortController();
  const timeout = setTimeout(() => {
    controller.abort();
  }, 5000);

  fetch(`${apiUrl}/${endpoint}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
    },
    body: JSON.stringify(data),
  })
    .then((res) => res.blob())
    .then((blob) => URL.createObjectURL(blob))
    .then((url) => {
      initiateDownload(url);
    })
    .catch((err) => {
      console.error(err);
      updateStatus(false, `Error previewing form: ${err}`);
    })
    .finally(() => {
      clearTimeout(timeout);
      clearDownloading();
    });
}

function clearDownloading() {
  const downloadButton = document.getElementById("download");
  downloadButton.disabled = false;
  downloadButton.classList.remove("pill-button-loading");
  downloadButton.style.cursor = "pointer";

  const loader = document.getElementById("download-loading");
  loader.setAttribute("aria-label", "");
}

function initiateDownload(url) {
  const a = document.createElement("a");
  a.href = url;
  const fileName =
    getSanitisedValue(document.getElementById("questionName")) ||
    "AutoGeneratedQ";
  a.download = fileName;
  a.click();
  window.URL.revokeObjectURL(url);
  a.remove();
}
