tinymce.init({
   selector: 'textarea#qText',
   plugins: [
      'code, preview, image, link, searchreplace, dividnicodes'
   ],
   toolbar: 'code | bold italic | link | image | searchreplace | dividni_codes',
   init_instance_callback: function (editor) {
      editor.setContent(getSampleQuetionText());
   },
   height: "640",
});

tinymce.PluginManager.add('dividnicodes', function (editor, url) {
   let openDialogRandom = function () {
      return editor.windowManager.open({
         title: 'Dividni Random',
         body: {
            type: 'panel',
            items: [
               {
                  type: 'input',
                  name: 'randMin',
                  label: 'Minimum'
               },
               {
                  type: 'input',
                  name: 'randMax',
                  label: 'Maximum'
               },
               {
                  type: 'input',
                  name: 'multiplier',
                  label: 'Multiplier (default is 1)'
               },
            ]
         },
         buttons: [
            {
               type: 'cancel',
               text: 'Close'
            },
            {
               type: 'submit',
               text: 'Save',
               primary: true
            }
         ],
         onSubmit: function (api) {
            let data = api.getData();
            if (data.multiplier === "")
               data.multiplier = 1;
            let parameters = editor.dom.get("parameters");
            while (!parameters) {
               const root = editor.dom.getRoot();
               parameters = editor.dom.add(root, 'p', { id: 'parameters', style: 'background-color: lightgray;' });
            }
            editor.dom.add(parameters, 'span', { class: 'dividni_random', style: 'color: red;' }, `@Random|${data.randMin}|${data.randMax}|${data.multiplier}`);
            editor.dom.add(parameters, 'br');
            api.close();
         }
      });
   };
   let openDialogChoice = function () {
      return editor.windowManager.open({
         title: 'Dividni Choice',
         body: {
            type: 'panel',
            items: [
               {
                  type: 'input',
                  name: 'choices',
                  label: 'Choices (separated by |)'
               }
            ]
         },
         buttons: [
            {
               type: 'cancel',
               text: 'Close'
            },
            {
               type: 'submit',
               text: 'Save',
               primary: true
            }
         ],
         onSubmit: function (api) {
            let data = api.getData();
            let parameters = editor.dom.get("parameters");
            while (!parameters) {
               const root = editor.dom.getRoot();
               parameters = editor.dom.add(root, 'p', { id: 'parameters', style: 'background-color: lightgray;' });
            }
            editor.dom.add(parameters, 'span', { class: 'dividni_choice', style: 'color: red;' }, `@Choice|${data.choices}`);
            editor.dom.add(parameters, 'br');
            api.close();
         }
      });
   };
   let openDialogExpression = function () {
      return editor.windowManager.open({
         title: 'Dividni Expression',
         body: {
            type: 'panel',
            items: [
               {
                  type: 'input',
                  name: 'expression',
                  label: 'Expression'
               }
            ]
         },
         buttons: [
            {
               type: 'cancel',
               text: 'Close'
            },
            {
               type: 'submit',
               text: 'Save',
               primary: true
            }
         ],
         onSubmit: function (api) {
            let data = api.getData();
            let expressions = editor.dom.get("expressions");
            while (!expressions) {
               const root = editor.dom.getRoot();
               expressions = editor.dom.add(root, 'p', { id: 'expressions', style: 'background-color: lightgray;' });
            }
            editor.dom.add(expressions, 'span', { class: 'dividni_expression', style: 'color: red;' }, `@Expression|${data.expression}`);
            editor.dom.add(expressions, 'br');
            api.close();
         }
      });
   };
   let openDialogReference = function () {
      return editor.windowManager.open({
         title: 'Dividni Reference',
         body: {
            type: 'panel',
            items: [
               {
                  type: 'input',
                  name: 'reference',
                  label: 'Reference'
               }
            ]
         },
         buttons: [
            {
               type: 'cancel',
               text: 'Close'
            },
            {
               type: 'submit',
               text: 'Save',
               primary: true
            }
         ],
         onSubmit: function (api) {
            let data = api.getData();
            editor.insertContent(`<span class='dividni_reference' style='color: red; background-color: pink;'>@${data.reference.replace(/@/g, "")}</span> `);
            api.close();
         }
      });
   };
   let openDialogAnswerNumerical = function () {
      return editor.windowManager.open({
         title: 'Dividni Numerical Answer',
         body: {
            type: 'panel',
            items: [
               {
                  type: 'input',
                  name: 'answers',
                  label: 'Answer'
               },
               {
                  type: 'input',
                  name: 'margin',
                  label: 'Error margin (default is 0)'
               }
            ]
         },
         buttons: [
            {
               type: 'cancel',
               text: 'Close'
            },
            {
               type: 'submit',
               text: 'Save',
               primary: true
            }
         ],
         onSubmit: function (api) {
            let data = api.getData();
            if (data.margin === "")
               data.margin = 0;
            let ans = editor.dom.get("answer");
            while (!ans) {
               const root = editor.dom.getRoot();
               ans = editor.dom.add(root, 'p', { id: 'answer', style: 'background-color: lightgreen;' });
            }
            editor.dom.add(ans, 'span', { class: 'dividni_answer_numerical', style: 'color: red;' }, `@AnswerNumerical|${data.answers}|${data.margin}`);
            editor.dom.add(ans, 'br');
            api.close();
         }
      });
   };
   let openDialogAnswerText = function () {
      return editor.windowManager.open({
         title: 'Dividni Short-Text Answer(s)',
         body: {
            type: 'panel',
            items: [
               {
                  type: 'input',
                  name: 'answers',
                  label: 'Answer(s) (separated by |)'
               },
            ]
         },
         buttons: [
            {
               type: 'cancel',
               text: 'Close'
            },
            {
               type: 'submit',
               text: 'Save',
               primary: true
            }
         ],
         onSubmit: function (api) {
            let data = api.getData();
            let ans = editor.dom.get("answer");
            while (!ans) {
               const root = editor.dom.getRoot();
               ans = editor.dom.add(root, 'p', { id: 'answer', style: 'background-color: lightgray;' });
            }
            editor.dom.add(ans, 'span', { class: 'dividni_answer_text', style: 'color: red;' }, `@AnswerText|${data.answers}`);
            editor.dom.add(ans, 'br');
            api.close();
         }
      });
   };
   editor.ui.registry.addIcon('dividni', '<svg width="24" height="24" viewBox="0 0 160 160"><defs> <clipPath id="dee-cut"> <polyline points="70 60 70 105 80 105 80 60 90 60 90 16 118 16 118 120 100 140 75 148 50 140 33 120 33 80 70 60" fill="none" stroke-width="0.1" stroke="black" /> </clipPath> </defs> <g id="dee" clip-path="url(#dee-cut)" stroke="#000000" stroke-width="20" > <line x1="105" y1="105" x2="105" y2="20" /> <circle cx="75" cy="105" r="30" fill="none" /> </g>   <circle id="dot" cx="75" cy="40" r="10" fill="#000000" /> </svg>');
   editor.ui.registry.addMenuButton('dividni_codes', {
      text: '',
      icon: 'dividni',
      fetch: function (callback) {
         var items = [
            {
               type: 'menuitem',
               text: 'Random',
               onAction: function () {
                  openDialogRandom();
               }
            },
            {
               type: 'menuitem',
               text: 'Choice',
               onAction: function () {
                  openDialogChoice();
               }
            },
            {
               type: 'separator',
            },
            {
               type: 'menuitem',
               text: 'Expression',
               onAction: function () {
                  openDialogExpression();
               }
            },
            {
               type: 'separator',
            },
            {
               type: 'menuitem',
               text: 'Reference',
               onAction: function () {
                  openDialogReference();
               }
            },
            {
               type: 'separator',
            },
            {
               type: 'menuitem',
               text: 'Answer',
               getSubmenuItems: function () {
                  return [
                     {
                        type: 'menuitem',
                        text: 'Numerical',
                        onAction: function () {
                           openDialogAnswerNumerical();
                        },
                     },
                     {
                        type: 'menuitem',
                        text: 'Text',
                        onAction: function () {
                           openDialogAnswerText();
                        },
                     },
                  ];
               },
            }
         ];
         callback(items);
      }

   });
   return {
      getMetadata: function () {
         return {
            name: 'Dividni',
            url: 'https://dividni.com'
         };
      }
   };
});

const getSampleQuetionText = () => {
   const b64 = "PHAgaWQ9InBhcmFtZXRlcnMiIHN0eWxlPSJiYWNrZ3JvdW5kLWNvbG9yOiBsaWdodGdyYXk7Ij48YnIvPjwvcD4KPHAgaWQ9ImV4cHJlc3Npb25zIiBzdHlsZT0iYmFja2dyb3VuZC1jb2xvcjogbGlnaHRncmF5OyI+PGJyLz48L3A+CjxwPlF1ZXN0aW9uIGhlcmUgLi4uPC9wPgo8cCBpZD0iYW5zd2VyIiBzdHlsZT0iYmFja2dyb3VuZC1jb2xvcjogbGlnaHRncmF5OyI+PGJyLz48L3A+"; 
   return atob(b64);
}


tinymce.init({
   selector: 'textarea#mcqText',
   plugins: [
      'code, preview, image, link, searchreplace, dividnimcq'
   ],
   toolbar: 'code | bold italic | link | image | searchreplace | dividni_mcq',
   init_instance_callback: function (editor) {
      editor.setContent(getSampleMcqText());
   },
   height: "640",
});

tinymce.PluginManager.add('dividnimcq', function (editor, url) {
   let openDialogCorrectAnswerOption = function () {
      return editor.windowManager.open({
         title: 'Dividni Correct Answer Option',
         body: {
            type: 'panel',
            items: [
               {
                  type: 'textarea',
                  name: 'answerOptionCorrect',
                  label: 'Correct Answer Option',
               }
            ]
         },
         buttons: [
            {
               type: 'cancel',
               text: 'Close'
            },
            {
               type: 'submit',
               text: 'Save',
               primary: true
            }
         ],
         onSubmit: function (api) {
            let data = api.getData();
            let expressions = editor.dom.get("correct_ans");
            while (!expressions) {
               const root = editor.dom.getRoot();
               expressions = editor.dom.add(root, 'p', { id: 'correct_ans', style: 'background-color: lightgray;' });
            }
            editor.dom.add(expressions, 'span', { class: 'dividni_correct_ans', style: 'color: green;' }, `@CorrectMCQ|${data.answerOptionCorrect}`);
            editor.dom.add(expressions, 'br');
            api.close();
         }
      });
   };
   let openDialogIncorrectAnswerOption = function () {
      return editor.windowManager.open({
         title: 'Dividni Incorrect Answer Option',
         body: {
            type: 'panel',
            items: [
               {
                  type: 'textarea',
                  name: 'answerOptionIncorrect',
                  label: 'Incorrect Answer Option',
               }
            ]
         },
         buttons: [
            {
               type: 'cancel',
               text: 'Close'
            },
            {
               type: 'submit',
               text: 'Save',
               primary: true
            }
         ],
         onSubmit: function (api) {
            let data = api.getData();
            let expressions = editor.dom.get("incorrect_ans");
            while (!expressions) {
               const root = editor.dom.getRoot();
               expressions = editor.dom.add(root, 'p', { id: 'incorrect_ans', style: 'background-color: lightgray;' });
            }
            editor.dom.add(expressions, 'span', { class: 'dividni_incorrect_ans', style: 'color: red;' }, `@IncorrectMCQ|${data.answerOptionIncorrect}`);
            editor.dom.add(expressions, 'br');
            api.close();
         }
      });
   };
   editor.ui.registry.addIcon('dividni', '<svg width="24" height="24" viewBox="0 0 160 160"><defs> <clipPath id="dee-cut"> <polyline points="70 60 70 105 80 105 80 60 90 60 90 16 118 16 118 120 100 140 75 148 50 140 33 120 33 80 70 60" fill="none" stroke-width="0.1" stroke="black" /> </clipPath> </defs> <g id="dee" clip-path="url(#dee-cut)" stroke="#000000" stroke-width="20" > <line x1="105" y1="105" x2="105" y2="20" /> <circle cx="75" cy="105" r="30" fill="none" /> </g>   <circle id="dot" cx="75" cy="40" r="10" fill="#000000" /> </svg>');
   editor.ui.registry.addMenuButton('dividni_mcq', {
      text: '',
      icon: 'dividni',
      fetch: function (callback) {
         var items = [
            {
               type: 'menuitem',
               text: 'Correct Option',
               onAction: function () {
                  openDialogCorrectAnswerOption();
               }
            },
            {
               type: 'menuitem',
               text: 'Incorrect Option',
               onAction: function () {
                  openDialogIncorrectAnswerOption();
               }
            },
         ];
         callback(items);
      }
   });
   return {
      getMetadata: function () {
         return {
            name: 'Dividni',
            url: 'https://dividni.com'
         };
      }
   };
});

const getSampleMcqText = () => {
   const b64 = "PHA+UXVlc3Rpb24gaGVyZSAuLi48L3A+CjxwIGlkPSJjb3JyZWN0X2FucyIgc3R5bGU9ImJhY2tncm91bmQtY29sb3I6IGxpZ2h0Z3JlZW47Ij48YnIgLz48L3A+CjxwIGlkPSJpbmNvcnJlY3RfYW5zIiBzdHlsZT0iYmFja2dyb3VuZC1jb2xvcjogcGluazsiPjxici8+PC9wPg==";
   return atob(b64);
}
