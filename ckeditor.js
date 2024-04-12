function activateEditors() {
  // Config
  function getFeedItems(queryText) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const varsToDisplay = variables
          // Filter out the full list of all items to only those matching the query text.
          .filter(isItemMatching);

        resolve(varsToDisplay);
      }, 100);
    });

    function isItemMatching(item) {
      // Make the search case-insensitive.
      const searchString = queryText.toLowerCase();

      // Include an item in the search results if the name or username includes the current user input.
      return (
        // item.name.toLowerCase().includes(searchString) ||
        item.id.toLowerCase().includes(searchString)
      );
    }
  }

  const htmlEmbedConfig = {
    showPreviews: true,
    sanitizeHtml: (inputHtml) => {
      // Strip unsafe elements and attributes, e.g.:
      // the `<script>` elements and `on*` attributes.
      const outputHtml = sanitize(inputHtml);

      return {
        html: outputHtml,
        // true or false depending on whether the sanitizer stripped anything.
        hasChanged: true,
      };
    },
  };

  const toolbarItems = [
    "undo",
    "redo",
    "|",
    "subscript",
    "superscript",
    "code",
    "|",
    "outdent",
    "indent",
  ];
  const pluginsToRemove = [
    "Autoformat",
    // These two are commercial, but you can try them out without registering to a trial.
    "ExportPdf",
    "ExportWord",
    "AIAssistant",
    "CKBox",
    "CKFinder",
    "EasyImage",
    // This sample uses the Base64UploadAdapter to handle image uploads as it requires no configuration.
    // https://ckeditor.com/docs/ckeditor5/latest/features/images/image-upload/base64-upload-adapter.html
    // Storing images as Base64 is usually a very bad idea.
    // Replace it on production website with other solutions:
    // https://ckeditor.com/docs/ckeditor5/latest/features/images/image-upload/image-upload.html
    "Base64UploadAdapter",
    "RealTimeCollaborativeComments",
    "RealTimeCollaborativeTrackChanges",
    "RealTimeCollaborativeRevisionHistory",
    "PresenceList",
    "Comments",
    "TrackChanges",
    "TrackChangesData",
    "RevisionHistory",
    "Pagination",
    "WProofreader",
    // Careful, with the Mathtype plugin CKEditor will not load when loading this sample
    // from a local file system (file://) - load this site via HTTP server if you enable MathType.
    "MathType",
    // The following features are part of the Productivity Pack and require additional license.
    "SlashCommand",
    "Template",
    "DocumentOutline",
    "FormatPainter",
    "TableOfContents",
    "PasteFromOfficeEnhanced",
  ];

  const questionConfig = {
    // https://ckeditor.com/docs/ckeditor5/latest/features/toolbar/toolbar.html#extended-toolbar-configuration-format
    toolbar: {
      // TO DO: Ask Mano what customisation options should be allowed here, if any?
      items: toolbarItems,
      shouldNotGroupWhenFull: false,
    },
    // Changing the language of the interface requires loading the language file using the <script> tag.
    // language: 'es',
    list: {
      properties: {
        styles: true,
        startIndex: true,
        reversed: true,
      },
    },
    placeholder: "e.g. What is 2 + 2?",
    // Be careful with enabling previews
    // https://ckeditor.com/docs/ckeditor5/latest/features/html-embed.html#content-previews
    htmlEmbed: htmlEmbedConfig,
    // https://ckeditor.com/docs/ckeditor5/latest/features/link.html#custom-link-attributes-decorators
    link: {
      decorators: {
        addTargetToExternalLinks: true,
        defaultProtocol: "https://",
        toggleDownloadable: {
          mode: "manual",
          label: "Downloadable",
          attributes: {
            download: "file",
          },
        },
      },
    },

    // https://ckeditor.com/docs/ckeditor5/latest/features/mentions.html#configuration
    ...(questionType.toLowerCase() !== "shorttext"
      ? {
          mention: {
            feeds: [
              {
                marker: "@",
                feed: getFeedItems,
                minimumCharacters: 0,
              },
            ],
          },
        }
      : {}),
    // The "super-build" contains more premium features that require additional configuration, disable them below.
    // Do not turn them on unless you read the documentation and know how to configure them and setup the editor.
    removePlugins: pluginsToRemove,
  };

  // This sample still does not showcase all CKEditor&nbsp;5 features (!)
  // Visit https://ckeditor.com/docs/ckeditor5/latest/features/index.html to browse all the features.
  CKEDITOR.ClassicEditor.create(
    document.getElementById("question"),
    questionConfig
  )
    .then((res) => (questionEditor = res))
    .catch((err) => console.error(err));

  CKEDITOR.ClassicEditor.create(document.getElementById("answer"), {
    // https://ckeditor.com/docs/ckeditor5/latest/features/toolbar/toolbar.html#extended-toolbar-configuration-format
    toolbar: {
      items: toolbarItems,
      shouldNotGroupWhenFull: false,
    },
    // Changing the language of the interface requires loading the language file using the <script> tag.
    // language: 'es',
    list: {
      properties: {
        styles: true,
        startIndex: true,
        reversed: true,
      },
    },
    placeholder: "e.g. 4",
    // Be careful with enabling previews
    // https://ckeditor.com/docs/ckeditor5/latest/features/html-embed.html#content-previews
    htmlEmbed: htmlEmbedConfig,
    // https://ckeditor.com/docs/ckeditor5/latest/features/link.html#custom-link-attributes-decorators
    link: {
      decorators: {
        addTargetToExternalLinks: true,
        defaultProtocol: "https://",
        toggleDownloadable: {
          mode: "manual",
          label: "Downloadable",
          attributes: {
            download: "file",
          },
        },
      },
    },
    // https://ckeditor.com/docs/ckeditor5/latest/features/mentions.html#configuration
    mention: {
      feeds: [
        {
          marker: "@",
          feed: getFeedItems,
          minimumCharacters: 0,
        },
      ],
    },
    // The "super-build" contains more premium features that require additional configuration, disable them below.
    // Do not turn them on unless you read the documentation and know how to configure them and setup the editor.
    removePlugins: pluginsToRemove,
  })
    .then((res) => (answerEditor = res))
    .catch((err) => console.error(err));

  CKEDITOR.BalloonEditor.create(document.getElementById("expression-editor"), {
    // This feature is available in the superbuild only.
    // See the "Installation" section.
    // plugins: [Mention /* ... */],
    toolbar: {
      items: toolbarItems,
    },
    mention: {
      feeds: [
        {
          marker: "@",
          feed: getFeedItems,
        },
      ],
    },
    // The "super-build" contains more premium features that require additional configuration, disable them below.
    // Do not turn them on unless you read the documentation and know how to configure them and setup the editor.
    removePlugins: pluginsToRemove,
  })
    .then((res) => {
      // Make the div "input" focusable so modal doesn't keep sending focus to the undo button
      const dialog = document.getElementById("dialog4");

      dialog
        .querySelector("div[contenteditable='true']")
        .setAttribute("tab-index", "0");
      expressionEditor = res;
    })
    .catch((err) => {
      console.error(err);
    });

  CKEDITOR.ClassicEditor.create(document.getElementById("shortTextAnswers"), {
    toolbar: {
      items: toolbarItems,
    },
    mention: {
      feeds: [
        {
          marker: "@",
          feed: getFeedItems,
        },
      ],
    },
    // The "super-build" contains more premium features that require additional configuration, disable them below.
    // Do not turn them on unless you read the documentation and know how to configure them and setup the editor.
    removePlugins: pluginsToRemove,
  })
    .then((res) => (shortTextAnswersEditor = res))
    .catch((err) => {
      console.error(err);
    });

  CKEDITOR.ClassicEditor.create(document.getElementById("correct-mcq"), {
    toolbar: {
      items: toolbarItems,
    },
    mention: {
      feeds: [
        {
          marker: "@",
          feed: getFeedItems,
        },
      ],
    },
    // The "super-build" contains more premium features that require additional configuration, disable them below.
    // Do not turn them on unless you read the documentation and know how to configure them and setup the editor.
    removePlugins: pluginsToRemove,
  })
    .then((res) => (correctsMCQEditor = res))
    .catch((err) => {
      console.error(err);
    });

  CKEDITOR.ClassicEditor.create(document.getElementById("incorrect-mcq"), {
    toolbar: {
      items: toolbarItems,
    },
    mention: {
      feeds: [
        {
          marker: "@",
          feed: getFeedItems,
        },
      ],
    },
    // The "super-build" contains more premium features that require additional configuration, disable them below.
    // Do not turn them on unless you read the documentation and know how to configure them and setup the editor.
    removePlugins: pluginsToRemove,
  })
    .then((res) => (incorrectsMCQEditor = res))
    .catch((err) => {
      console.error(err);
    });
}
