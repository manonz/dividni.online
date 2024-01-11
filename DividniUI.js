//const svc = "http://localhost:5000/api";
const svc = "https://academicintegrity.cs.auckland.ac.nz/duc/api";

const choices =
{
   questionType: "Numerical",
   variantCount: "200",
   targetPlatform: "Moodle",
};

const numericalQuestionTemplate = "dXNpbmcgU3lzdGVtOwp1c2luZyBTeXN0ZW0uVGV4dDsKCm5hbWVzcGFjZSBVdGlsaXRpZXMuQ291cnNlcwp7CiAgIHB1YmxpYyBwYXJ0aWFsIGNsYXNzIFFIZWxwZXIgOiBJUUhlbHBlcgogICB7CiAgICAgIHB1YmxpYyBzdGF0aWMgUXVlc3Rpb25CYXNlIFF1YWRyYXRpY0Fuc3dlclEoUmFuZG9tIHJhbmRvbSwgYm9vbCBpc1Byb29mKQogICAgICB7CiAgICAgICAgIHZhciBxID0gbmV3IE51bWVyaWNhbFF1ZXN0aW9uKHJhbmRvbSwgaXNQcm9vZik7CiAgICAgICAgIHEuSWQgPSAiUXVhZHJhdGljQW5zd2VyUSI7IC8vIFRoZSBJZCBpcyB1c2VkIGluIGVycm9yLXJlcG9ydGluZy4gUGxlYXNlIGxldCBpdCBiZSBtZWFuaW5nZnVsIGFuZCB1bmlxdWUuCiAgICAgICAgIHEuTWFya3MgPSAyOwogICAgICAgICBpbnQgYSA9IHJhbmRvbS5OZXh0KDIsIDUpOwogICAgICAgICBpbnQgYiA9IHJhbmRvbS5OZXh0KDYsIDEwKTsKICAgICAgICAgaW50IHggPSByYW5kb20uTmV4dCgyLCAxMCk7CiAgICAgICAgIGludCBjID0gYSp4KnggKyBiKng7CiAgICAgICAgIHEuU3RlbSA9ICQiV2hhdCBpcyB0aGUgcG9zaXRpdmUgeCB2YWx1ZSB0aGF0IHNhdGlzZmllcyB0aGUgZXF1YXRpb24ge2F9eDxzdXA+Mjwvc3VwPiArIHtifXggLSB7Y30/IjsKICAgICAgICAgcS5BbnNHVEUgPSBxLkFuc0xURSA9IHguVG9TdHJpbmcoKTsKICAgICAgICAgcmV0dXJuIHE7CiAgICAgIH0gLy8gUXVhZHJhdGljQW5zd2VyUQogICB9IC8vIGNsYXNzCn0gLy8gbmFtZXNwYWNlCg==";
const shortTextQuestionTemplate = "dXNpbmcgU3lzdGVtOwoKbmFtZXNwYWNlIFV0aWxpdGllcy5Db3Vyc2VzCnsKICAgcHVibGljIHBhcnRpYWwgY2xhc3MgUUhlbHBlciA6IElRSGVscGVyCiAgIHsKICAgICAgcHVibGljIHN0YXRpYyBRdWVzdGlvbkJhc2UgQm9uZHNGaXJzdE5hbWUoUmFuZG9tIHJhbmRvbSwgYm9vbCBpc1Byb29mKQogICAgICB7CiAgICAgICAgIHZhciBxID0gbmV3IFNob3J0VGV4dFF1ZXN0aW9uKHJhbmRvbSwgaXNQcm9vZik7CiAgICAgICAgIHEuSWQgPSAiQm9uZHNGaXJzdE5hbWUiOyAvLyBUaGUgSWQgaXMgdXNlZCBpbiBlcnJvci1yZXBvcnRpbmcuIFBsZWFzZSBsZXQgaXQgYmUgbWVhbmluZ2Z1bCBhbmQgdW5pcXVlLgogICAgICAgICBxLk1hcmtzID0gMjsKICAgICAgICAgLy8gRG8gbWFrZSB1c2Ugb2YgInJhbmRvbSIgdG8gY3JlYXRlIHZhcmlhdGlvbnMuCiAgICAgICAgIHEuU3RlbSA9IHN0cmluZy5Gb3JtYXQoIldoYXQgaXMgQm9uZCdzIGZpcnN0IG5hbWU/Iik7CiAgICAgICAgIHEuQW5zd2Vycy5BZGQoIkphbWVzIik7CiAgICAgICAgIHEuQW5zd2Vycy5BZGQoIkppbSIpOwogICAgICAgICBxLkFuc3dlcnMuQWRkKCJKaW1taWUiKTsKICAgICAgICAgcS5BbnN3ZXJzLkFkZCgiSmltbXkiKTsKICAgICAgICAgcmV0dXJuIHE7CiAgICAgIH0gLy8gQm9uZHNGaXJzdE5hbWUKICAgfSAvLyBjbGFzcwp9IC8vIG5hbWVzcGFjZQo=";
const truthQuestionTemplate = "dXNpbmcgU3lzdGVtOwp1c2luZyBTeXN0ZW0uVGV4dDsKCm5hbWVzcGFjZSBVdGlsaXRpZXMuQ291cnNlcwp7CiAgIHB1YmxpYyBwYXJ0aWFsIGNsYXNzIFFIZWxwZXIgOiBJUUhlbHBlcgogICB7CiAgICAgIHB1YmxpYyBzdGF0aWMgUXVlc3Rpb25CYXNlIEFwcGxlc0FuZE9yYW5nZXNRKFJhbmRvbSByYW5kb20sIGJvb2wgaXNQcm9vZikKICAgICAgewogICAgICAgICB2YXIgcSA9IG5ldyBUcnV0aFF1ZXN0aW9uKHJhbmRvbSwgaXNQcm9vZik7CiAgICAgICAgIHEuSWQgPSAiQXBwbGVzQW5kT3Jhbmdlc1EiOyAvLyBUaGUgSWQgaXMgdXNlZCBpbiBlcnJvci1yZXBvcnRpbmcuIFBsZWFzZSBsZXQgaXQgYmUgbWVhbmluZ2Z1bCBhbmQgdW5pcXVlLgogICAgICAgICBxLk1hcmtzID0gMjsKICAgICAgICAgaW50IGFwcGxlQ250MSA9IDEsIG9yYW5nZUNudDEgPSAxLCAgYXBwbGVDbnQyID0gMSwgb3JhbmdlQ250MiA9IDE7CiAgICAgICAgIHdoaWxlIChhcHBsZUNudDEqb3JhbmdlQ250MiA9PSBhcHBsZUNudDIqb3JhbmdlQ250MSkKICAgICAgICAgewogICAgICAgICAgICBhcHBsZUNudDEgPSByYW5kb20uTmV4dCgyLCA2KTsKICAgICAgICAgICAgb3JhbmdlQ250MSA9IHJhbmRvbS5OZXh0KDYsIDEwKTsKICAgICAgICAgICAgYXBwbGVDbnQyID0gcmFuZG9tLk5leHQoMTAsIDE1KTsKICAgICAgICAgICAgb3JhbmdlQ250MiA9IHJhbmRvbS5OZXh0KDE1LCAyMCk7CiAgICAgICAgIH0KICAgICAgICAgaW50IGFwcGxlUHJpY2UgPSAyICogcmFuZG9tLk5leHQoNCwgOSk7CiAgICAgICAgIGludCBvcmFuZ2VQcmljZSA9IDIgKiByYW5kb20uTmV4dCgxMSwgMTkpOwogICAgICAgICBpbnQgdG90YWxQcmljZTEgPSBhcHBsZUNudDEgKiBhcHBsZVByaWNlICsgb3JhbmdlQ250MSAqIG9yYW5nZVByaWNlOwogICAgICAgICBpbnQgdG90YWxQcmljZTIgPSBhcHBsZUNudDIgKiBhcHBsZVByaWNlICsgb3JhbmdlQ250MiAqIG9yYW5nZVByaWNlOwoKICAgICAgICAgcS5TdGVtID0gJCJBdCBQcmFuY2luZyBQb255LCB5b3UgY2FuIGJ1eSB7YXBwbGVDbnQxfSBhcHBsZXMgYW5kIHtvcmFuZ2VDbnQxfSBvcmFuZ2VzIGZvciB7dG90YWxQcmljZTF9IENhc3RhcnM7IHlvdSBjYW4gYWxzbyBidXkge2FwcGxlQ250Mn0gYXBwbGVzIGFuZCB7b3JhbmdlQ250Mn0gb3JhbmdlcyBmb3Ige3RvdGFsUHJpY2UyfSBDYXN0YXJzLiBXaGF0IGlzIHRoZSBwcmljZSBvZiBhIHNpbmdsZSBhcHBsZSwgZXhwcmVzc2VkIGluIENhc3RhcnM/IjsKICAgICAgICAgcS5BZGRDb3JyZWN0cygKICAgICAgICAgICAgYXBwbGVQcmljZS5Ub1N0cmluZygpCiAgICAgICAgICk7CiAgICAgICAgIHEuQWRkSW5jb3JyZWN0cygKICAgICAgICAgICAgb3JhbmdlUHJpY2UuVG9TdHJpbmcoKSwKICAgICAgICAgICAgKG9yYW5nZVByaWNlICsgMSkuVG9TdHJpbmcoKSwKICAgICAgICAgICAgKG9yYW5nZVByaWNlIC0gMSkuVG9TdHJpbmcoKSwKICAgICAgICAgICAgKG9yYW5nZVByaWNlICsgMikuVG9TdHJpbmcoKSwKICAgICAgICAgICAgKG9yYW5nZVByaWNlIC0gMikuVG9TdHJpbmcoKSwKICAgICAgICAgICAgKGFwcGxlUHJpY2UgKyAxKS5Ub1N0cmluZygpLAogICAgICAgICAgICAoYXBwbGVQcmljZSAtIDEpLlRvU3RyaW5nKCksCiAgICAgICAgICAgIChhcHBsZVByaWNlICsgMikuVG9TdHJpbmcoKSwKICAgICAgICAgICAgKGFwcGxlUHJpY2UgLSAyKS5Ub1N0cmluZygpCiAgICAgICAgICk7CiAgICAgICAgIHJldHVybiBxOwogICAgICB9IC8vIEFwcGxlc0FuZE9yYW5nZXNRCiAgIH0gLy8gY2xhc3MKfSAvLyBuYW1lc3BhY2UK";
const xyzQuestionTemplate = "dXNpbmcgU3lzdGVtOwoKbmFtZXNwYWNlIFV0aWxpdGllcy5Db3Vyc2VzCnsKICAgcHVibGljIHBhcnRpYWwgY2xhc3MgUUhlbHBlciA6IElRSGVscGVyCiAgIHsKICAgICAgcHVibGljIHN0YXRpYyBRdWVzdGlvbkJhc2UgTmF0aW9uYWxDYXBpdGFsc01DUShSYW5kb20gcmFuZG9tLCBib29sIGlzUHJvb2YpCiAgICAgIHsKICAgICAgICAgdmFyIHEgPSBuZXcgWHl6UXVlc3Rpb24ocmFuZG9tLCBpc1Byb29mKTsgLy8gQ2hhbmdlIFh5elF1ZXN0aW9uIHRvIFRydXRoUXVlc3Rpb24gZm9yIHNpbmdsZS1yZXNwb25zZQogICAgICAgICBxLklkID0gIk5hdGlvbmFsQ2FwaXRhbHNNQ1EiOyAvLyBUaGUgSWQgaXMgdXNlZCBpbiBlcnJvci1yZXBvcnRpbmcuIFBsZWFzZSBsZXQgaXQgYmUgbWVhbmluZ2Z1bCBhbmQgdW5pcXVlLgogICAgICAgICBxLk1hcmtzID0gMjsKICAgICAgICAgcS5TdGVtID0gIldoaWNoIG9mIHRoZSBmb2xsb3dpbmcgY2l0aWVzIGFyZSBuYXRpb25hbCBjYXBpdGFscz8iOwogICAgICAgICBxLkFkZENvcnJlY3RzKAogICAgICAgICAgICAiTG9uZG9uIiwKICAgICAgICAgICAgIlBhcmlzIiwKICAgICAgICAgICAgIk1hZHJpZCIsCiAgICAgICAgICAgICJCZWlqaW5nIiwKICAgICAgICAgICAgIkJydXNzZWxzIiwKICAgICAgICAgICAgIk1vc2NvdyIKICAgICAgICAgKTsKICAgICAgICAgcS5BZGRJbmNvcnJlY3RzKAogICAgICAgICAgICAiSXN0YW5idWwiLAogICAgICAgICAgICAiQXVja2xhbmQiLAogICAgICAgICAgICAiU3lkbmV5IiwKICAgICAgICAgICAgIk11bWJhaSAoQm9tYmF5KSIsCiAgICAgICAgICAgICJUb3JvbnRvIiwgCiAgICAgICAgICAgICJMdWJsaW4iIAogICAgICAgICApOwogICAgICAgICByZXR1cm4gcTsKICAgICAgfSAvLyBOYXRpb25hbENhcGl0YWxzTUNRCiAgIH0gLy8gY2xhc3MKfSAvLyBuYW1lc3BhY2UK";

const defaultMessage = "<h3 style='text-align: center;'>Question preview or compilation errors will be shown here</h3>";

function ShowNoSection() {
   document.getElementById("standardSection").style.display = "none";
   document.getElementById("mcqSection").style.display = "none";
   document.getElementById("advancedSection").style.display = "none";
   document.getElementById("standardDownload").style.display = "none";
   document.getElementById("mcqDownload").style.display = "none";
   document.getElementById("advancedDownload").style.display = "none";
}

function ShowStandardSection() {
   ShowNoSection();
   document.getElementById("standardSection").style.display = "block";
   document.getElementById("standardDownload").style.display = "block";
}

function ShowMCQSection() {
   ShowNoSection();
   document.getElementById("mcqSection").style.display = "block";
   document.getElementById("mcqDownload").style.display = "block";
}

function ShowAdvancedSection() {
   ShowNoSection();
   document.getElementById("advancedSection").style.display = "block";
   document.getElementById("advancedDownload").style.display = "block";
}

function ChooseQuestionType() {
   choices.questionType = document.getElementById("questionTypeSelector").value;
   ShowQuestionTemplate(choices.questionType);
   ShowResults(defaultMessage);
}

function ChooseVariantCount() {
   choices.variantCount = document.getElementById("variantCountSelector").value;
}

function ChooseTargetPlatform() {
   choices.targetPlatform = document.getElementById("targetPlatformSelector").value;
}

function ShowQuestionTemplate(questionType) {
   const qTextArea = document.getElementById("qTextArea");
   switch (questionType) {
      case "Numerical":
         qTextArea.value = atob(numericalQuestionTemplate);
         document.getElementById("questionName").value = "QuadraticAnswerQ";
         break;
      case "Short Text":
         qTextArea.value = atob(shortTextQuestionTemplate);
         document.getElementById("questionName").value = "BondsFirstName";
         break;
      case "Single-response MCQ":
         qTextArea.value = atob(truthQuestionTemplate);
         document.getElementById("questionName").value = "ApplesAndOrangesQ";
         break;
      case "Multiple-response MCQ (XYZ)":
         qTextArea.value = atob(xyzQuestionTemplate);
         document.getElementById("questionName").value = "NationalCapitalsMCQ";
         break;
   }
}

function ShowResults(text) {
   const iframe = document.getElementById("resultsIFrame");
   const htmlSrc = encodeURI(DivWrap(text));
   iframe.src = 'data:text/html;charset=utf-8,' + htmlSrc;
}

function DivWrap(text) {
   const wrapped = "<div style='font-family: Arial, Helvetica, sans-serif; color: lightgray;'>" + text + "</div>";
   return wrapped;
}

function ShowVersion() {
   const uri = `${svc}/Version`;
   const fetchPromise = fetch(uri);
   const streamPromise = fetchPromise.then((response) => response.text());
   streamPromise.then((data) => {
      document.getElementById("version").innerText = data;
   });
}

function PreviewBase(qText, endpoint) {
   const jsonifiedCode = JSON.stringify(qText);

   const uri = `${svc}/${endpoint}`;
   const fetchPromise = fetch(uri, {
      method: 'POST',
      headers: {
         "Content-Type": "application/json; charset=UTF-8",
      },
      body: jsonifiedCode,
   });

   const streamPromise = fetchPromise.then((response) => {
      const contentType = response.headers.get("Content-Type");
      if (contentType.startsWith("application/json"))
         return response.json();
      return response.text();
   });

   streamPromise.then((data) => {
      ShowResults(data);
      let previewBtn = document.getElementById("previewBtn");
      previewBtn.innerHTML = `<span class="fw-bold h5">Preview</span>`;
      previewBtn = document.getElementById("previewMarkupBtn");
      previewBtn.innerHTML = `<span class="fw-bold h5">Preview</span>`;
      previewBtn = document.getElementById("previewMcqBtn");
      previewBtn.innerHTML = `<span class="fw-bold h5">Preview</span>`;
   });
}

function Preview() {
   const previewBtn = document.getElementById("previewBtn");
   previewBtn.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> <span class=" fw-bold h5"> Loading...</span>`;
   const qText = document.getElementById("qTextArea").value;
   PreviewBase(qText, 'Preview');
}

function PreviewMarkup() {
   const previewBtn = document.getElementById("previewMarkupBtn");
   previewBtn.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> <span class=" fw-bold h5"> Loading...</span>`;
   const qText = tinymce.get("qText").getContent();
   PreviewBase(qText, 'PreviewMarkup');
}

function PreviewMcqMarkup() {
   const previewBtn = document.getElementById("previewMcqBtn");
   previewBtn.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> <span class=" fw-bold h5"> Loading...</span>`;
   const qText = tinymce.get("mcqText").getContent();
   const isXyz = document.getElementById("mrMcqCheckbox").checked;
   if (isXyz)
      PreviewBase(qText, "PreviewMcqXyzMarkup");
   else
      PreviewBase(qText, "PreviewMcqTruthMarkup");
}

function DownloadQuestionbank() {
   const downloadBtn = document.getElementById("downloadBtn");
   downloadBtn.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> <span class=" fw-bold h5"> Downloading...</span>`;
   const qText = document.getElementById("qTextArea").value;
   const endpoint = "DownloadQuestionBank";
   DownloadQuestionbankBase(qText, endpoint);
}

function DownloadQuestionbankMarkup() {
   const downloadBtn = document.getElementById("downloadMarkupBtn");
   downloadBtn.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> <span class=" fw-bold h5"> Downloading...</span>`;
   const qText = tinymce.get("qText").getContent();
   const endpoint = "DownloadQuestionBankMarkup";
   DownloadQuestionbankBase(qText, endpoint);
}

function DownloadQuestionbankMcqMarkup() {
   const downloadBtn = document.getElementById("downloadMcqBtn");
   downloadBtn.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> <span class=" fw-bold h5"> Downloading...</span>`;
   const qText = tinymce.get("mcqText").getContent();
   const isXyz = document.getElementById("mrMcqCheckbox").checked;
   if (isXyz)
      DownloadQuestionbankBase(qText, "DownloadQuestionBankMcqXyzMarkup");
   else
      DownloadQuestionbankBase(qText, "DownloadQuestionBankMcqTruthMarkup");
}

function DownloadQuestionbankBase(qText, endpoint) {
   let questionName = document.getElementById("questionName").value;
   questionName = questionName.replace(/[\W]+/g, "");
   if (questionName === null || questionName.match(/^\s*$/) !== null)
      questionName = "QuestionName";
   const questionbankParameters =
   {
      code: qText,
      variants: choices.variantCount,
      platform: choices.targetPlatform,
      name: questionName,
   };
   const jsonified = JSON.stringify(questionbankParameters);
   const uri = `${svc}/${endpoint}`;
   const fetchPromise = fetch(uri, {
      method: 'POST',
      headers: {
         "Content-Type": "application/json; charset=UTF-8",
      },
      body: jsonified,
   });

   const streamPromise = fetchPromise.then((response) => {
      return response.blob();
   });

   streamPromise.then(blob => URL.createObjectURL(blob))
      .then(url => {
         const a = document.createElement('a');
         a.href = url;
         a.download = questionName;
         a.click();
         window.URL.revokeObjectURL(url);
         a.remove();
         let downloadBtn = document.getElementById("downloadBtn");
         downloadBtn.innerHTML = `<span class="fw-bold h5">Download Question Bank</span>`;
         downloadBtn = document.getElementById("downloadMarkupBtn");
         downloadBtn.innerHTML = `<span class="fw-bold h5">Download Question Bank</span>`;
         downloadBtn = document.getElementById("downloadMcqBtn");
         downloadBtn.innerHTML = `<span class="fw-bold h5">Download Question Bank</span>`;
      });
}

function CopyCodeToAdvanced() {
   const qText = tinymce.get("qText").getContent();
   CopyCodeToAdvancedBase(qText, "GetCode");
}

function CopyMcqCodeToAdvanced() {
   const qText = tinymce.get("mcqText").getContent();
   const isXyz = document.getElementById("mrMcqCheckbox").checked;
   if (isXyz)
      CopyCodeToAdvancedBase(qText, "GetMcqXyzCode");
   else
      CopyCodeToAdvancedBase(qText, "GetMcqTruthCode");
}

function CopyCodeToAdvancedBase(qText, endpoint) {
   const jsonifiedCode = JSON.stringify(qText);

   const uri = `${svc}/${endpoint}`;
   const fetchPromise = fetch(uri, {
      method: 'POST',
      headers: {
         "Content-Type": "application/json; charset=UTF-8",
      },
      body: jsonifiedCode,
   });

   const streamPromise = fetchPromise.then((response) => {
      const contentType = response.headers.get("Content-Type");
      if (contentType.startsWith("application/json"))
         return response.json();
      return response.text();
   });

   streamPromise.then((data) => {
      const qTextArea = document.getElementById("qTextArea");
      qTextArea.value = data;
   });
}

function Initialize() {
   ShowStandardSection();
   document.getElementById("questionTypeSelector").value = choices.questionType;
   document.getElementById("variantCountSelector").value = choices.variantCount;
   document.getElementById("targetPlatformSelector").value = choices.targetPlatform;
   ShowQuestionTemplate(choices.questionType);
   ShowResults(defaultMessage);
   ShowVersion();
}

Initialize();