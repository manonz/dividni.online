const dom = {
   zipInput: document.getElementById('zipInput'),
   txtInput: document.getElementById('txtInput'),
   processButton: document.getElementById('process'),
   prevButton: document.getElementById('prev'),
   nextButton: document.getElementById('next'),
   download: document.getElementById('download'),
   imageContainer: document.getElementById('image'),
   loadingOverlay: document.getElementById('loading'),
   resultImage: document.getElementById('resultImage'),
   markerCanvas: document.getElementById('markerCanvas')
};


dom.prevButton.addEventListener('click', () => handleNavigation(-1));
dom.nextButton.addEventListener('click', () => handleNavigation(1));

//global variables
let currentIndex = 0;
let items = [];
let txtData = [];

dom.processButton.addEventListener('click', async () => {
   txtData = [];

   if (!dom.zipInput.files[0] || !dom.txtInput.files[0]) {
      alert("You need upload both ZIP and TXT file.");
      return;
   }
   dom.resultImage.src = "Loader.svg";
   try {
      [items, txtData] = await Promise.all([
         processZipFile(dom.zipInput.files[0]),
         processTXTfile(dom.txtInput.files[0])
      ]);


      const imgsIndexs = new Set(items.map(item => item.index));

      const txtIndex = Array.from({ length: txtData.length }, (_, i) => i);

      const missingIndices = txtIndex.filter(i => !imgsIndexs.has(i)).map(i => String(i).padStart(6, '0'));


      if (missingIndices.length > 0) {
         alert(`Missing images：${missingIndices.join(", ")}, you may need to check the files.`);
      }

      currentIndex = 0;

      updateUI();
   } catch (error) {
      alert(`error: ${error.message}`);
   }
});

//use JSZip to process the zip file, return ImageURL Array
async function processZipFile(zipFile) {
   const zip = new JSZip();
   const arrayBuffer = await zipFile.arrayBuffer();
   const content = await zip.loadAsync(arrayBuffer);
   const itemsArray = [];
   const imageNames = Object.keys(content.files);

   await Promise.all(imageNames.map(async (image) => {
      const entry = content.files[image];
      if (entry.dir) {
         return;
      }

      if (image.toLocaleLowerCase().endsWith(".jpg") || image.toLocaleLowerCase().endsWith(".jpeg")) {
         const baseName = image.split('/').pop();
         const num = baseName.split(".")[0];
         const index = parseInt(num, 10);
         const blob = await entry.async('blob');
         const imageUrl = URL.createObjectURL(blob);
         itemsArray.push({
            index: index,
            image: imageUrl
         });
      }
   }));
   itemsArray.sort((a, b) => a.index - b.index);
   return itemsArray;
}

async function processTXTfile(txtFile) {
   return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = function (event) {
         const text = event.target.result;
         const splitText = text.split("\r\n").filter(line => line.trim() !== '');
         resolve(splitText);
      };
      reader.readAsText(txtFile);
   });
}


const studentIdArea = {
   startX: 22,
   startY: 141,
   totalWidth: 328,
   totalHeight: 175,
   columns: 18,
   rows: 10
};

//current student ID set to undefined
let currentStudentID = new Array(studentIdArea.columns).fill(undefined);

const scriptVersionArea = {
   startX: 371,
   startY: 141,
   totalWidth: 218,
   totalHeight: 175,
   columns: 12,
   rows: 10
};

//current script version set to undefined
let currentScriptVersion = new Array(scriptVersionArea.columns).fill(undefined);

const answerArea = {
   startY: 443,
   totalHeight: 345,
   columns:
      [
         //row1
         { startX: 52, totalWidth: 109 },
         //row2
         { startX: 191, totalWidth: 109 },
         //row3
         { startX: 330, totalWidth: 109 },
         //row4
         { startX: 469, totalWidth: 109 }
      ],
   questionsPerColumn: 20,
   optionsPerQuestion: 6
};

//current answer, set 2 false 
let currentAnswer = [];
for (let i = 0; i < answerArea.columns.length; i++) {
   currentAnswer[i] = [];
   for (let q = 0; q < answerArea.questionsPerColumn; q++) {
      currentAnswer[i][q] = new Array(answerArea.optionsPerQuestion).fill(false);
   }
}


//get data;
function updateUIFromRowData(rowDataLine) {
   const studentIDLength = 18;
   const sep1 = 1;
   const scriptVersionLength = 12;
   const sep2 = 1;
   const answerDataLength = 160;

   let studentIDStr = rowDataLine.substring(0, 18).padEnd(studentIDLength, " ");
   let scriptVersionStr = rowDataLine.substring(studentIDLength + sep1, studentIDLength + sep1 + scriptVersionLength).padEnd(scriptVersionLength, " ");
   let answerStr = rowDataLine.substring(studentIDLength + sep1 + scriptVersionLength + sep2, studentIDLength + sep1 + scriptVersionLength + sep2 + answerDataLength);

   for (let i = 0; i < studentIdArea.columns; i++) {
      let ch = studentIDStr[i];
      if (ch === ' ') {
         currentStudentID[i] = undefined;
      } else {
         currentStudentID[i] = parseInt(ch, 10);
      }
   }


   for (let i = 0; i < scriptVersionArea.columns; i++) {
      let ch = scriptVersionStr[i];
      if (ch === ' ') {
         currentScriptVersion[i] = undefined;
      } else {
         currentScriptVersion[i] = parseInt(ch, 10);
      }
   }


   const totalQuestions = 80;
   if (answerStr.length < totalQuestions * 2) {
      for (let col = 0; col < answerArea.columns.length; col++) {
         for (let q = 0; q < answerArea.questionsPerColumn; q++) {
            currentAnswer[col][q] = new Array(answerArea.optionsPerQuestion).fill(false);
         }
      }
   } else {
      for (let i = 0; i < totalQuestions; i++) {
         let code = answerStr.substr(i * 2, 2);
         let num = parseInt(code, 10);
         let binaryStr = num.toString(2).padStart(6, '0');
         let colIndex = Math.floor(i / answerArea.questionsPerColumn);
         let questionIndex = i % answerArea.questionsPerColumn;
         for (let opt = 0; opt < answerArea.optionsPerQuestion; opt++) {
            let bit = binaryStr[5 - opt];
            currentAnswer[colIndex][questionIndex][opt] = (bit === '1');
         }
      }
   }
}

const markerCtx = dom.markerCanvas.getContext('2d');
function drawAllGrids() {
   markerCtx.clearRect(0, 0, dom.markerCanvas.width, dom.markerCanvas.height);

   //student ID
   {
      const cellWidth = studentIdArea.totalWidth / studentIdArea.columns;
      const cellHeight = studentIdArea.totalHeight / studentIdArea.rows;
      markerCtx.strokeStyle = 'red';
      markerCtx.lineWidth = 1;
      currentStudentID.forEach((selectedRow, col) => {
         if (selectedRow !== undefined) {
            const x = studentIdArea.startX + col * cellWidth;
            const y = studentIdArea.startY + selectedRow * cellHeight;
            markerCtx.strokeRect(x, y, cellWidth, cellHeight);
         }
      });
   }

   //Script Version
   {
      const cellWidth = scriptVersionArea.totalWidth / scriptVersionArea.columns;
      const cellHeight = scriptVersionArea.totalHeight / scriptVersionArea.rows;
      markerCtx.strokeStyle = 'red';
      markerCtx.lineWidth = 1;
      currentScriptVersion.forEach((selectedRow, col) => {
         if (selectedRow !== undefined) {
            const x = scriptVersionArea.startX + col * cellWidth;
            const y = scriptVersionArea.startY + selectedRow * cellHeight;
            markerCtx.strokeRect(x, y, cellWidth, cellHeight);
         }
      });
   }

   //anwsers
   {
      answerArea.columns.forEach((colDef, colIndex) => {
         const cellWidth = colDef.totalWidth / answerArea.optionsPerQuestion;
         const cellHeight = answerArea.totalHeight / answerArea.questionsPerColumn;
         markerCtx.strokeStyle = 'red';
         markerCtx.lineWidth = 1;
         for (let q = 0; q < answerArea.questionsPerColumn; q++) {
            for (let opt = 0; opt < answerArea.optionsPerQuestion; opt++) {
               if (currentAnswer[colIndex][q][opt]) {
                  const x = colDef.startX + opt * cellWidth;
                  const y = answerArea.startY + q * cellHeight;
                  markerCtx.strokeRect(x, y, cellWidth, cellHeight);
               }
            }
         }
      });
   }
}

//build new line
function generateNewLine() {
   let studentIDStr = currentStudentID
      .map(val => (val === undefined ? " " : String(val)))
      .join("")
      .padEnd(18, " ");
   let scriptVersionStr = currentScriptVersion
      .map(val => (val === undefined ? " " : String(val)))
      .join("")
      .padEnd(12, " ");

   let totalQuestions = answerArea.questionsPerColumn * answerArea.columns.length;
   let answerParts = [];
   for (let i = 0; i < totalQuestions; i++) {
      let colIndex = Math.floor(i / answerArea.questionsPerColumn);
      let questionIndex = i % answerArea.questionsPerColumn;
      let boolArr = currentAnswer[colIndex][questionIndex];
      let binaryStr = boolArr.slice().reverse().map(b => (b ? "1" : "0")).join("");
      let dec = parseInt(binaryStr, 2);
      let format = dec.toString().padStart(2, "0");
      answerParts.push(format);
   }
   let answerStr = answerParts.join("").padEnd(160, "0");
   return studentIDStr + " " + scriptVersionStr + " " + answerStr;
}

//for download 
dom.download.addEventListener('click', function () {
   const orininFileName = dom.txtInput.files[0].name;
   const pureName = orininFileName.split('.').slice(0, -1).join('.');
   const newFileName = pureName + '_updated.txt';
   const page = items[currentIndex].index;
   txtData[page] = generateNewLine();
   let content = txtData.join("\r\n");
   let blob = new Blob([content], { type: "text/plain;charset=utf-8" });
   let url = URL.createObjectURL(blob);
   let a = document.createElement('a');
   a.href = url;
   a.download = newFileName;
   document.body.appendChild(a);
   a.click();
   document.body.removeChild(a);
});



function updateUI() {
   const item = items[currentIndex];
   dom.resultImage.src = item.image;

   dom.resultImage.onload = function () {
      dom.resultImage.style.pointerEvents = 'auto';
      dom.markerCanvas.width = 624;
      dom.markerCanvas.height = 888;
      const page = item.index;
      const txtLine = txtData[page] || "";
      updateUIFromRowData(txtLine);
      drawAllGrids();

   };
   dom.resultImage.style.pointerEvents = 'none';
}


function handleNavigation(direction) {
   let newIndex = currentIndex + direction;
   if (newIndex < 0) {
      newIndex = 0;
      alert("There are no more valid images before this.");

   }
   if (newIndex > items.length - 1) {
      newIndex = items.length - 1;
      alert("There are no more valid images remaining.")
   }
   currentIndex = newIndex;

   const page = items[currentIndex].index;
   updateUI();
}


dom.markerCanvas.addEventListener('click', function (event) {
   const rect = dom.markerCanvas.getBoundingClientRect();
   const clickX = event.clientX - rect.left;
   const clickY = event.clientY - rect.top;

   let handled = false;

   //student ID area
   if (clickX >= studentIdArea.startX && clickX <= studentIdArea.startX + studentIdArea.totalWidth &&
      clickY >= studentIdArea.startY && clickY <= studentIdArea.startY + studentIdArea.totalHeight) {
      const cellWidth = studentIdArea.totalWidth / studentIdArea.columns;
      const cellHeight = studentIdArea.totalHeight / studentIdArea.rows;
      const col = Math.floor((clickX - studentIdArea.startX) / cellWidth);
      const row = Math.floor((clickY - studentIdArea.startY) / cellHeight);

      if (currentStudentID[col] === row) {
         currentStudentID[col] = undefined;
      } else {
         currentStudentID[col] = row;
      }
      handled = true;
   }

   //script version area
   if (!handled && clickX >= scriptVersionArea.startX && clickX <= scriptVersionArea.startX + scriptVersionArea.totalWidth &&
      clickY >= scriptVersionArea.startY && clickY <= scriptVersionArea.startY + scriptVersionArea.totalHeight) {
      const cellWidth = scriptVersionArea.totalWidth / scriptVersionArea.columns;
      const cellHeight = scriptVersionArea.totalHeight / scriptVersionArea.rows;
      const col = Math.floor((clickX - scriptVersionArea.startX) / cellWidth);
      const row = Math.floor((clickY - scriptVersionArea.startY) / cellHeight);

      if (currentScriptVersion[col] === row) {
         currentScriptVersion[col] = undefined;
      } else {
         currentScriptVersion[col] = row;
      }
      handled = true;
   }

   //anwser area
   if (!handled && clickY >= answerArea.startY && clickY <= answerArea.startY + answerArea.totalHeight) {
      let answerColIndex = -1;
      answerArea.columns.forEach((colDef, idx) => {
         if (clickX >= colDef.startX && clickX <= colDef.startX + colDef.totalWidth) {
            answerColIndex = idx;
         }
      });
      if (answerColIndex !== -1) {
         const colDef = answerArea.columns[answerColIndex];
         const cellWidth = colDef.totalWidth / answerArea.optionsPerQuestion;
         const cellHeight = answerArea.totalHeight / answerArea.questionsPerColumn;
         const questionIndex = Math.floor((clickY - answerArea.startY) / cellHeight);
         const optionIndex = Math.floor((clickX - colDef.startX) / cellWidth);

         currentAnswer[answerColIndex][questionIndex][optionIndex] =
            !currentAnswer[answerColIndex][questionIndex][optionIndex];
         handled = true;
      }
   }
   if (handled) {
      drawAllGrids();
      const page = items[currentIndex].index;
      txtData[page] = generateNewLine();
   }
});
