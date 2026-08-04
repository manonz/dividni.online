document.addEventListener("DOMContentLoaded", () => {
  displayAdvancedContent();

  document
    .getElementById("preview")
    .addEventListener("click", previewResultsAdvanced);

  document
    .getElementById("dividni-form")
    .addEventListener("submit", downloadQuestionBankAdvanced);

  showVersion();
});

function changeQuestionType() {
  const questionType = getSanitisedValue(
    document.getElementById("questionType")
  );
  setSelectedQuestionType(questionType);

  displayAdvancedContent();
}

function displayAdvancedContent() {
  let codeString = "";
  switch (questionType) {
    case "Numerical":
      codeString = `using System;
using System.Text;

namespace Utilities.Courses
{
    public partial class QHelper : IQHelper
    {
    public static QuestionBase QuadraticAnswerQ(Random random, bool isProof)
    {
        var q = new NumericalQuestion(random, isProof);
        q.Id = "QuadraticAnswerQ"; // The Id is used in error-reporting. Please let it be meaningful and unique.
        q.Marks = 2;
        int a = random.Next(2, 5);
        int b = random.Next(6, 10);
        int x = random.Next(2, 10);
        int c = a*x*x + b*x;
        q.Stem = $"What is the positive x value that satisfies the equation {a}x<sup>2</sup> + {b}x - {c}? <br/>Note: when \\\\(a \\\\ne 0\\\\), there are two solutions to \\\\(ax^2 + bx + c = 0\\\\) and they are $$x = \\\\frac{{-b \\\\pm \\\\sqrt{{b^2-4ac}}}}{{2a}}$$.";
        q.AnsGTE = q.AnsLTE = x.ToString();
        return q;
    } // QuadraticAnswerQ
    } // class
} // namespace`;

      break;
    case "ShortText":
      codeString = `using System;

namespace Utilities.Courses
{
    public partial class QHelper : IQHelper
    {
    public static QuestionBase BondsFirstName(Random random, bool isProof)
    {
        var q = new ShortTextQuestion(random, isProof);
        q.Id = "BondsFirstName"; // The Id is used in error-reporting. Please let it be meaningful and unique.
        q.Marks = 2;
        // Do make use of "random" to create variations.
        q.Stem = string.Format("What is Bond's first name?");
        q.Answers.Add("James");
        q.Answers.Add("Jim");
        q.Answers.Add("Jimmie");
        q.Answers.Add("Jimmy");
        return q;
    } // BondsFirstName
    } // class
} // namespace`;
      break;
    case "MCQ":
      codeString = `using System;
using System.Text;

namespace Utilities.Courses
{
public partial class QHelper : IQHelper
{
    public static QuestionBase ApplesAndOrangesQWithEyeCandy(Random random, bool isProof)
    {
        var q = new TruthQuestion(random, isProof);
        q.Id = "ApplesAndOrangesQWithEyeCandy"; // The Id is used in error-reporting. Please let it be meaningful and unique.
        q.Marks = 2;
        int appleCnt1 = 1, orangeCnt1 = 1,  appleCnt2 = 1, orangeCnt2 = 1;
        while (appleCnt1*orangeCnt2 == appleCnt2*orangeCnt1)
        {
            appleCnt1 = random.Next(2, 6);
            orangeCnt1 = random.Next(6, 10);
            appleCnt2 = random.Next(10, 15);
            orangeCnt2 = random.Next(15, 20);
        }
        int applePrice = 2 * random.Next(4, 9);
        int orangePrice = 2 * random.Next(11, 19);
        int totalPrice1 = appleCnt1 * applePrice + orangeCnt1 * orangePrice;
        int totalPrice2 = appleCnt2 * applePrice + orangeCnt2 * orangePrice;

        q.Stem = $"At Prancing Pony, you can buy {appleCnt1} apples and {orangeCnt1} oranges for {totalPrice1} Castars; you can also buy {appleCnt2} apples and {orangeCnt2} oranges for {totalPrice2} Castars. What is the price of a single apple, expressed in Castars? <img style=\\\"float: right; margin: 10;\\\" width=\\\"150\\\" alt=\\\"\\\" src=\\\"https://dividni.com/images/PrancingPony.svg\\\" />";
        q.AddCorrects(
            applePrice.ToString()
        );
        q.AddIncorrects(
            orangePrice.ToString(),
            (orangePrice + 1).ToString(),
            (orangePrice - 1).ToString(),
            (orangePrice + 2).ToString(),
            (orangePrice - 2).ToString(),
            (applePrice + 1).ToString(),
            (applePrice - 1).ToString(),
            (applePrice + 2).ToString(),
            (applePrice - 2).ToString()
        );
        return q;
    } // ApplesAndOrangesQWithEyeCandy
} // class
} // namespace`;
      break;
    case "MCQMulti":
      codeString = `using System;

namespace Utilities.Courses
{
    public partial class QHelper : IQHelper
    {
    public static QuestionBase NationalCapitalsMCQ(Random random, bool isProof)
    {
        var q = new XyzQuestion(random, isProof); // Change XyzQuestion to TruthQuestion for single-response
        q.Id = "NationalCapitalsMCQ"; // The Id is used in error-reporting. Please let it be meaningful and unique.
        q.Marks = 2;
        q.Stem = "Which of the following cities are national capitals?";
        q.AddCorrects(
            "Zagreb",
            "Amsterdam",
            "Skopje",
            "Ljubljana",
            "Brussels",
            "Podgorica"
        );
        q.AddIncorrects(
            "Istanbul",
            "Auckland",
            "Sydney",
            "Mumbai (Bombay)",
            "Toronto", 
            "Lublin",
            "Geneva",
            "Rio de Janeiro",
            "Johannesburg",
            "New York"            
        );
        return q;
    } // NationalCapitalsMCQ
    } // class
} // namespace`;
      break;
  }

  document.getElementById("advanced-editor").value = codeString;
}

function previewResultsAdvanced(e) {
  e.preventDefault();

  completeFormValid = 1;
  clearStatus();

  previewBase(processAdvancedFormData(), "Preview");
}

function downloadQuestionBankAdvanced(e) {
  e.preventDefault();

  completeFormValid = 1;
  clearStatus();

  downloadBase(processAdvancedForDownload(), "DownloadQuestionBank");
}

function renderErrors() {
  const nameField = document.getElementById("questionName");
  const variantField = document.getElementById("variantCountSelector");
  const targetPlatformField = document.getElementById("targetPlatformSelector");

  [
    nameField.id,
    variantField.id,
    targetPlatformField.id,
    "advanced-editor",
  ].forEach((id) => {
    document.getElementById(id + "Error").innerText = "";
  });

  [variantField, targetPlatformField].forEach((field) => {
    const val = getSanitisedValue(field);

    if (!val || !val?.length) {
      applyError(field.id, "This field is required.");
    }
  });
}

function processAdvancedFormData() {
  renderErrors();

  const value = document.getElementById("advanced-editor").value;

  const csFile = value; //DOMPurify.sanitize(value, { FORBID_TAGS: ["script", "link", "iframe"], });

  if (!csFile || csFile?.length === 0) {
    applyError("advanced-editor", "This field should not be blank.");
  }

  return csFile;
}

function processAdvancedForDownload() {
  const nameField = document.getElementById("questionName");
  const variantField = document.getElementById("variantCountSelector");
  const targetPlatformField = document.getElementById("targetPlatformSelector");
  const name = getSanitisedValue(nameField);
  const variantCount = getSanitisedValue(variantField);
  const targetPlatform = getSanitisedValue(targetPlatformField);
  const code = processAdvancedFormData();

  return {
    HtmlCode: code,
    questionName: name && name?.length ? name : "AutoGeneratedQ",
    variantCount,
    targetPlatform,
    variables: [],
    answer: "",
  };
}
