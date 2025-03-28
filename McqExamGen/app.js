const baseUrl = "https://academicintegrity.cs.auckland.ac.nz/exgen/api";
function Clear() {
   document.getElementById("prologueFile").value = "";
   document.getElementById("epilogueFile").value = "";
   document.getElementById("answerSheetSvg").value = "";
   document.getElementById("questionsZip").value = "";
   document.getElementById("paperCount").value = 1;
   document.getElementById("startId").value = 0;
   document.getElementById("proof").checked = false;
   document.getElementById("useDefaultAnswerSheet").checked = false;
   document.getElementById("combineAll").checked = false;
   document.getElementById("finalProof").checked = false;
   document.getElementById("newQuestionFiles").value = "";
}

window.onload = function () {
   Clear();
   const paperCountInput = document.getElementById("paperCount");
   paperCountInput.addEventListener("input", () => {
     let val = parseInt(paperCountInput.value, 10);
     if (val > 2000 || val < 1) {
       paperCountInput.value = 2000;
       alert("Paper count not valid!");
     }
   });
 
   const startIdInput = document.getElementById("startId");
   startIdInput.addEventListener("input", () => {
     let val = startIdInput.value;
     if (val.length > 12 || val < 0) {
       startIdInput.value = val.slice(0, 12);
       alert("Start ID not valid!");
     }
   });

   fetch(`${baseUrl}/Version`).then(response=> response.text()).then(
    version => {
       document.getElementById("version").textContent = "v" + version;
    });
};

function userConfirm(message) {
   return new Promise((resolve) => {
     const confirmModal = document.getElementById("confirmModal");
     const confirmMessage = document.getElementById("confirmMessage");
     const yesBtn = document.getElementById("confirmYesBtn");
     const noBtn = document.getElementById("confirmNoBtn");
     confirmMessage.textContent = message;
     confirmModal.style.display = "flex";
     yesBtn.onclick = null;
     noBtn.onclick = null;
     yesBtn.onclick = () => { confirmModal.style.display = "none"; resolve(true); };
     noBtn.onclick = () => { confirmModal.style.display = "none"; resolve(false); };
   });
 }
 
 let currentPreviewId = null;
 let currentCmdLineOrder = [];
 
 document.getElementById("answerSheetSvg").addEventListener("change", function () {
   const defaultCheckbox = document.getElementById("useDefaultAnswerSheet");
   if (this.files.length > 0) {
      defaultCheckbox.checked = false;
     defaultCheckbox.disabled = true;
   } else {
     defaultCheckbox.disabled = false;
   }
 });
 
 function upload() {
   const loader = document.getElementById("loader");
   const previewLoader= document.getElementById("previewLoader");
   const previewContainer = document.getElementById("a4PreviewContainer");
   const a4PreviewEmbed = document.getElementById("a4PreviewEmbed");
   loader.style.display = "block";
   previewLoader.style.display = "inline";
   a4PreviewEmbed.style.display = "none";
   
   const prologueFile = document.getElementById("prologueFile").files[0];
   const epilogueFile = document.getElementById("epilogueFile").files[0];
   const answerSheetSvg = document.getElementById("answerSheetSvg").files[0];
   const questionsZip = document.getElementById("questionsZip").files[0];
   if (!questionsZip) {
     showMessage("You need upload a ZIP file with questions.");
     loader.style.display = "none";
     previewLoader.style.display = "none";
     return;
   }
   const formData = new FormData();
   if (prologueFile) formData.append("PrologueFile", prologueFile);
   if (epilogueFile) formData.append("EpilogueFile", epilogueFile);
   if (answerSheetSvg) formData.append("AnswerSheetSvg", answerSheetSvg);
   formData.append("QuestionsZip", questionsZip);
   formData.append("Proof", document.getElementById("proof").checked);
   formData.append("NoPageBreak", true);
   formData.append("UseDefaultAnswerSheet", document.getElementById("useDefaultAnswerSheet").checked);
   
   const xhr = new XMLHttpRequest();
    xhr.open("POST", `${baseUrl}/GenerateMcqPreview`, true);
   xhr.onreadystatechange = function () {
     if (xhr.readyState === XMLHttpRequest.DONE) {
       if (xhr.status === 200) {
         const response = JSON.parse(xhr.responseText);
         currentPreviewId = response.previewId;
         currentCmdLineOrder = response.cmdLineOrder || [];
         renderDraggableList(currentCmdLineOrder);
         previewContainer.style.display = "block";
         a4PreviewEmbed.src = response.mcqPaperPath + "?t=" + Date.now();
         a4PreviewEmbed.onload = function() {
           loader.style.display = "none";
           previewLoader.style.display = "none";
           a4PreviewEmbed.style.display = "block";
         };
       } else {
         loader.style.display = "none";
         previewLoader.style.display = "none";
       }
     }
   };
   xhr.send(formData);
 }
 
 
 
 function generateFinalExam() {
   const finalResultDiv = document.getElementById("finalResult");
   finalResultDiv.innerHTML = "";
   const previewId = currentPreviewId;
   if (!previewId) {
     return;
   }
 
   const sortableList = document.getElementById('sortable-list');
   const questionOrder = Array.from(sortableList.querySelectorAll('li')).map(li => li.getAttribute("data-filename").trim());
 
   const hasQuestions = questionOrder.some(item => item.endsWith('.cs'));
   if (!hasQuestions) {
     return;
   }
 
   const paperCount = document.getElementById("paperCount").value;
   const startId = document.getElementById("startId").value;
   const proof = document.getElementById("finalProof").checked;
   const useDefault = document.getElementById("useDefaultAnswerSheet").checked;
   const combineAllPapers = document.getElementById("combineAll").checked;
 
   const formData = new FormData();
   formData.append("PreviewId", previewId);
   formData.append("PaperCount", paperCount);
   questionOrder.forEach(item => {
     formData.append("QuestionOrder", item);
   });
   if (startId) formData.append("StartId", startId);
   formData.append("Proof", proof);
   formData.append("UseDefaultAnswerSheet", useDefault);
   formData.append("CombineAllPapers", combineAllPapers);
 
   const loader = document.getElementById("finalLoader");
   loader.style.display = "inline";
 
    fetch(`${baseUrl}/GenerateFinalMcq`, {
     method: "POST",
     body: formData
   })
     .then(response => {
       loader.style.display = "none";
       if (!response.ok) {
         return response.text().then(text => { throw new Error(text); });
       }
       return response.json();
     })
     .then(data => {
       if (!data.finalMcqZipUrl) {
         throw new Error("Error duing processing.");
       }
       let html = `<p><a href="${data.finalMcqZipUrl}" target="_blank" style="color:blue; font-weight:bold;">Download MCQ Exam</a></p>`;
       finalResultDiv.innerHTML = html;
     })
     .catch(err => {
       loader.style.display = "none";
       finalResultDiv.innerHTML = `<pre>${err.message}</pre>`;
     });
 }
 
 function renderDraggableList(items) {
   const sortableList = document.getElementById('sortable-list');
   sortableList.innerHTML = "";
   items.forEach(item => {
     const li = document.createElement('li');
     li.draggable = true;
 
     if (item.trim() === ".xx") {
       li.textContent = "--- Page Break ---";
     } else {
       li.textContent = item;
     }
     li.setAttribute("data-filename", item);
 
     li.addEventListener('contextmenu', async (e) => {
       e.preventDefault();
       if (item.trim() === ".xx") {
         li.remove();
       } else {
         const isConfirm = await userConfirm("Do you want remove this question?");
         if (isConfirm) {
           deleteQuestionFile(item.trim(), li);
         }
       }
     });
     sortableList.appendChild(li);
   });
   bindDragAndDrop(sortableList);
 }
 
 function bindDragAndDrop(sortableList) {
   let placeholder = null;
   let draggingItem = null;
   sortableList.addEventListener('dragstart', (e) => {
     draggingItem = e.target;
     e.dataTransfer.setData('text/plain', '');
     e.target.classList.add('dragging');
     placeholder = document.createElement('div');
     placeholder.classList.add('placeholder');
     sortableList.appendChild(placeholder);
   });
   sortableList.addEventListener('dragover', (e) => {
     e.preventDefault();
     const afterElement = getDragAfterElement(sortableList, e.clientY);
     if (afterElement == null) {
       sortableList.appendChild(placeholder);
     } else {
       sortableList.insertBefore(placeholder, afterElement);
     }
   });
   sortableList.addEventListener('dragend', (e) => {
     e.target.classList.remove('dragging');
     if (placeholder) {
       if (placeholder.nextSibling) {
         sortableList.insertBefore(draggingItem, placeholder.nextSibling);
       } else {
         sortableList.appendChild(draggingItem);
       }
       placeholder.remove();
       placeholder = null;
       draggingItem = null;
     }
   });
   function getDragAfterElement(container, y) {
     const draggableElements = [...container.querySelectorAll('li:not(.dragging)')];
     return draggableElements.reduce((closest, child) => {
       const box = child.getBoundingClientRect();
       const offset = y - box.top - (box.height / 2);
       if (offset < 0 && offset > closest.offset) {
         return { offset: offset, element: child };
       } else {
         return closest;
       }
     }, { offset: Number.NEGATIVE_INFINITY }).element;
   }
 }
 
 function addPageBreak() {
   const sortableList = document.getElementById('sortable-list');
   const li = document.createElement('li');
   li.draggable = true;
   li.textContent = "--- Page Break ---";
   li.setAttribute("data-filename", ".xx");
   li.addEventListener('contextmenu', (e) => {
     e.preventDefault();
     li.remove();
   });
   sortableList.appendChild(li);
 }
 
 function uploadNewQuestions() {
   if (!currentPreviewId) {
     return;
   }
   const fileInput = document.getElementById("newQuestionFiles");
   const files = fileInput.files;
   if (!files || files.length === 0) {
     return;
   }
   let existingNames = new Set(currentCmdLineOrder.filter(name => name !== ".xx"));
   let selectedNames = new Set();
   for (let i = 0; i < files.length; i++) {
     const file = files[i];
     if (!file.name.endsWith(".cs")) {
       return;
     }
     if (existingNames.has(file.name)) {
       showMessage("File " + file.name + " already exists.");
       return;
     }
     if (selectedNames.has(file.name)) {
       return;
     }
     selectedNames.add(file.name);
   }
   const formData = new FormData();
   formData.append("previewId", currentPreviewId);
   for (let i = 0; i < files.length; i++) {
     formData.append("files", files[i]);
   }
   const loader = document.getElementById("loader");
   loader.style.display = "inline";
    fetch(`${baseUrl}/UploadQuestions`, {
     method: "POST",
     body: formData
   })
     .then(response => {
       loader.style.display = "none";
       if (!response.ok) {
         return response.text().then(text => { throw new Error(text); });
       }
       return response.text();
     })
     .then(data => {
       for (let i = 0; i < files.length; i++) {
         const li = document.createElement("li");
         li.draggable = true;
         li.textContent = files[i].name;
         li.setAttribute("data-filename", files[i].name);
         li.addEventListener('contextmenu', async (e) => {
           e.preventDefault();
           const isConfirm = await userConfirm("Do you want remove this question?");
           if (isConfirm) {
             deleteQuestionFile(files[i].name, li);
           }
         });
         document.getElementById("sortable-list").appendChild(li);
       }
       fileInput.value = "";
     })
     .catch(error => {
       console.error(error);
     });
 }
 
 function deleteQuestionFile(fileName, liElement) {
   if (!currentPreviewId) {
     return;
   }
    const url = `${baseUrl}/DeleteQuestion?previewId=${encodeURIComponent(currentPreviewId)}&filename=${encodeURIComponent(fileName)}`;
   fetch(url, { method: "DELETE" })
     .then(response => {
       if (!response.ok) {
         return response.text().then(text => { throw new Error(text); });
       }
       return response.text();
     })
     .then(data => {
       liElement.remove();
     })
     .catch(error => {
       showMessage(error);
       console.error(error);
     });
 }
 
function showMessage(message) {
   alert(message);
 }
 
 function reorderPreview() {
    if (!currentPreviewId) return;

    const loader = document.getElementById("loader");
    const previewIframe = document.getElementById("a4PreviewEmbed");
    loader.style.display = "block";
    previewIframe.style.display = "none"

   const sortableList = document.getElementById("sortable-list");
   const lis = sortableList.querySelectorAll("li");
   const newOrder = Array.from(lis).map(li => li.getAttribute("data-filename").trim());
   const proof = document.getElementById("proof").checked;
   const noPageBreak = true;
   const payload = {
     previewId: currentPreviewId,
     newOrder: newOrder,
     proof: proof,
     noPageBreak: noPageBreak
   };
 
    fetch(`${baseUrl}/ReorderPreview`, {
     method: "POST",
     headers: { "Content-Type": "application/json" },
     body: JSON.stringify(payload)
   })
   .then(res => {
     if (!res.ok) {
       return res.text().then(text => { throw new Error(text); });
     }
     return res.json();
   })
   .then(data => {
     const previewContainer = document.getElementById("a4PreviewContainer");
     const a4PreviewEmbed = document.getElementById("a4PreviewEmbed");
      a4PreviewEmbed.src = data.mcqPaperPath;
      a4PreviewEmbed.style.display = "block";
      previewContainer.style.display = "block";

      loader.style.display = "none";
 
     currentCmdLineOrder = data.cmdLineOrder || [];
     renderDraggableList(currentCmdLineOrder);
   })
      .catch(err => {
     console.error(err);
     showMessage(err);
   });
 }
 